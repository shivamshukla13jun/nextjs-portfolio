import { memoryStore } from '../../lib/db/memory-fallback.ts';
import { UserModel } from '../models/all-models.ts';
import { isDatabaseConnected } from '../../lib/db/mongodb.ts';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'devfolio_super_secure_jwt_secret_change_in_production_key_32chars'
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shivamshukla13jun@gmail.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Shivam Shukla (Admin)';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

export const AuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: any } | null> {
    // Check Mongoose if connected
    if (isDatabaseConnected()) {
      try {
        let userDoc: any = await UserModel.findOne({ email }).lean();
        if (!userDoc && email === ADMIN_EMAIL) {
          // First login against an empty DB — bootstrap the admin from env credentials
          userDoc = await UserModel.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
            role: 'ADMIN',
          });
        }
        if (userDoc && (userDoc as any).passwordHash) {
          const match = await bcrypt.compare(password, (userDoc as any).passwordHash);
          if (match) {
            const token = await new SignJWT({
              userId: (userDoc as any)._id.toString(),
              email: (userDoc as any).email,
              name: (userDoc as any).name,
              role: (userDoc as any).role || 'ADMIN',
            })
              .setProtectedHeader({ alg: 'HS256' })
              .setExpirationTime('7d')
              .sign(JWT_SECRET);

            return {
              token,
              user: {
                id: (userDoc as any)._id.toString(),
                email: (userDoc as any).email,
                name: (userDoc as any).name,
                role: (userDoc as any).role,
              },
            };
          }
        }
      } catch (e) {
        console.warn('Mongoose user auth error, fallback to memory', e);
      }
    }

    // In-memory fallback
    if (email === memoryStore.adminUser.email) {
      const isValid = await bcrypt.compare(password, memoryStore.adminUser.passwordHash);

      if (isValid) {
        const token = await new SignJWT({
          userId: memoryStore.adminUser.id,
          email: memoryStore.adminUser.email,
          name: memoryStore.adminUser.name,
          role: memoryStore.adminUser.role,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('7d')
          .sign(JWT_SECRET);

        return {
          token,
          user: {
            id: memoryStore.adminUser.id,
            email: memoryStore.adminUser.email,
            name: memoryStore.adminUser.name,
            role: memoryStore.adminUser.role,
          },
        };
      }
    }

    return null;
  },

  async changePassword(userId: string, currentPass: string, newPass: string): Promise<boolean> {
    let currentHash = memoryStore.adminUser.passwordHash;

    if (isDatabaseConnected()) {
      try {
        const userDoc: any =
          (await UserModel.findById(userId).lean()) ||
          (await UserModel.findOne({ email: memoryStore.adminUser.email }).lean());
        if (userDoc?.passwordHash) currentHash = userDoc.passwordHash;
      } catch (err) {
        // Fall back to memory store hash
      }
    }

    const match = await bcrypt.compare(currentPass, currentHash);
    if (!match) return false;

    const newHash = await bcrypt.hash(newPass, 10);
    memoryStore.adminUser.passwordHash = newHash;

    if (isDatabaseConnected()) {
      try {
        await UserModel.findOneAndUpdate(
          { email: memoryStore.adminUser.email },
          { $set: { passwordHash: newHash } },
          { upsert: true }
        );
      } catch (err) {
        // Fallback OK
      }
    }
    return true;
  },

  async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload;
    } catch {
      return null;
    }
  },
};
