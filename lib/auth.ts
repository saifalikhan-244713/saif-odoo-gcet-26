import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-use-env';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const signToken = (payload: TokenPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
    });
};

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed);
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
