import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "smartmart-super-secret-key-123456";

interface TokenPayload {
  id: string;
  userId: string;
  email: string;
  role: "customer" | "admin";
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
