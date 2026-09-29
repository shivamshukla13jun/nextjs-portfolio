import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { memoryStore } from './memory-fallback.ts';
import type { FileRecord } from '../../types/portfolio.ts';
import { isDatabaseConnected } from './mongodb.ts';

let bucket: GridFSBucket | null = null;

export function getGridFSBucket(): GridFSBucket | null {
  if (!isDatabaseConnected() || !mongoose.connection.db) {
    return null;
  }
  if (!bucket) {
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
  const gfs = getGridFSBucket();
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

  // Always keep in memory store for immediate zero-latency access
  memoryStore.files.set(fileId, {
    id: fileId,
    meta,
    buffer: fileBuffer,
  });

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

      const readable = new Readable();
      readable.push(fileBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    } catch (err) {
      console.warn('GridFS stream upload warning:', err);
    }
  }

  return meta;
}

export async function downloadFromGridFS(
  fileId: string
): Promise<{ buffer?: Buffer; stream?: any; meta: FileRecord } | null> {
  // Check memory store first
  const mem = memoryStore.files.get(fileId);
  if (mem) {
    return {
      buffer: mem.buffer,
      meta: mem.meta,
    };
  }

  const gfs = getGridFSBucket();
  if (gfs && ObjectId.isValid(fileId)) {
    try {
      const stream = gfs.openDownloadStream(new ObjectId(fileId));
      return {
        stream,
        meta: {
          id: fileId,
          filename: 'download',
          originalName: 'download',
          mimeType: 'application/octet-stream',
          size: 0,
          category: 'other',
          uploadedAt: new Date().toISOString(),
          url: `/api/files/${fileId}`,
        },
      };
    } catch (e) {
      return null;
    }
  }

  return null;
}

export async function deleteFromGridFS(fileId: string): Promise<boolean> {
  let deleted = false;
  if (memoryStore.files.has(fileId)) {
    memoryStore.files.delete(fileId);
    deleted = true;
  }

  const gfs = getGridFSBucket();
  if (gfs && ObjectId.isValid(fileId)) {
    try {
      await gfs.delete(new ObjectId(fileId));
      deleted = true;
    } catch (e) {
      // ignore
    }
  }

  return deleted;
}
