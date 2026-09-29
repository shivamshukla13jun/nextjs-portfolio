import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { memoryStore } from './memory-fallback.ts';
import type { FileRecord } from '../../types/portfolio.ts';
import { connectToDatabase, isDatabaseConnected } from './mongodb.ts';
import { FileRecordModel } from '../../server/models/all-models.ts';

let bucket: GridFSBucket | null = null;
let bucketDb: unknown = null;

export async function getGridFSBucket(): Promise<GridFSBucket | null> {
  await connectToDatabase();
  if (!isDatabaseConnected() || !mongoose.connection.db) {
    return null;
  }
  if (!bucket || bucketDb !== mongoose.connection.db) {
    bucketDb = mongoose.connection.db;
    bucket = new GridFSBucket(mongoose.connection.db as any, {
      bucketName: 'portfolio_files',
    });
  }
  return bucket;
}

export async function uploadToGridFS(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  category: FileRecord['category'] = 'other',
  ownerId?: string,
  relatedEntity?: string,
  relatedEntityId?: string
): Promise<FileRecord> {
  const gfs = await getGridFSBucket();
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const meta: FileRecord = {
    id: fileId,
    filename,
    originalName: filename,
    mimeType,
    size: fileBuffer.length,
    category,
    ownerId,
    relatedEntity,
    relatedEntityId,
    uploadedAt: new Date().toISOString(),
    url: `/api/files/${fileId}`,
  };

  if (gfs) {
    try {
      const uploadStream = gfs.openUploadStream(filename, {
        metadata: {
          mimeType,
          category,
          ownerId,
          relatedEntity,
          relatedEntityId,
          customFileId: fileId,
        },
      });

      // Wait for the write to finish — serverless functions may be frozen right after responding
      await new Promise<void>((resolve, reject) => {
        uploadStream.once('finish', () => resolve());
        uploadStream.once('error', reject);
        Readable.from([fileBuffer]).pipe(uploadStream);
      });

      await FileRecordModel.create({
        fileId,
        filename,
        originalName: filename,
        mimeType,
        size: fileBuffer.length,
        category,
        ownerId,
        relatedEntity,
        relatedEntityId,
        gridFSFileId: uploadStream.id,
      });
      return meta;
    } catch (err) {
      console.warn('GridFS upload failed, keeping file in memory:', err);
    }
  }

  memoryStore.files.set(fileId, {
    id: fileId,
    meta,
    buffer: fileBuffer,
  });

  return meta;
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk as Buffer));
  return Buffer.concat(chunks);
}

export async function downloadFromGridFS(
  fileId: string
): Promise<{ buffer?: Buffer; stream?: any; meta: FileRecord } | null> {
  const mem = memoryStore.files.get(fileId);
  if (mem) {
    return {
      buffer: mem.buffer,
      meta: mem.meta,
    };
  }

  const gfs = await getGridFSBucket();
  if (!gfs) return null;

  try {
    const record: any = await FileRecordModel.findOne({ fileId }).lean();
    let gridId: ObjectId | null = record?.gridFSFileId ?? null;
    if (!gridId) {
      // Files uploaded before metadata records existed: find them via GridFS metadata or raw ObjectId
      const [file] = await gfs
        .find(ObjectId.isValid(fileId) ? { _id: new ObjectId(fileId) } : { 'metadata.customFileId': fileId })
        .limit(1)
        .toArray();
      if (!file) return null;
      gridId = file._id;
      if (!record) {
        return {
          buffer: await streamToBuffer(gfs.openDownloadStream(gridId)),
          meta: {
            id: fileId,
            filename: file.filename,
            originalName: file.filename,
            mimeType: (file.metadata as any)?.mimeType || 'application/octet-stream',
            size: file.length,
            category: (file.metadata as any)?.category || 'other',
            uploadedAt: file.uploadDate.toISOString(),
            url: `/api/files/${fileId}`,
          },
        };
      }
    }

    return {
      buffer: await streamToBuffer(gfs.openDownloadStream(gridId)),
      meta: {
        id: fileId,
        filename: record.filename,
        originalName: record.originalName,
        mimeType: record.mimeType,
        size: record.size,
        category: record.category,
        uploadedAt: new Date(record.createdAt).toISOString(),
        url: `/api/files/${fileId}`,
      },
    };
  } catch (e) {
    console.warn('GridFS download failed:', e);
    return null;
  }
}

export async function deleteFromGridFS(fileId: string): Promise<boolean> {
  let deleted = false;
  if (memoryStore.files.has(fileId)) {
    memoryStore.files.delete(fileId);
    deleted = true;
  }

  const gfs = await getGridFSBucket();
  if (gfs) {
    try {
      const record: any = await FileRecordModel.findOneAndDelete({ fileId }).lean();
      const gridId = record?.gridFSFileId ?? (ObjectId.isValid(fileId) ? new ObjectId(fileId) : null);
      if (gridId) {
        await gfs.delete(gridId);
        deleted = true;
      }
    } catch (e) {
      // ignore
    }
  }

  return deleted;
}
