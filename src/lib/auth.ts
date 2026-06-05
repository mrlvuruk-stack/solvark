import * as jose from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'solvark-super-secret-jwt-key-change-in-prod';
const key = new TextEncoder().encode(JWT_SECRET);

export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signJWT(payload: { id: string; email: string; role: string }) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}
