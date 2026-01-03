import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// "Normal function" to verify token using Web Crypto API (Edge compatible)
async function verifyToken(token: string) {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.');
        if (!headerB64 || !payloadB64 || !signatureB64) return null;

        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        const data = encoder.encode(`${headerB64}.${payloadB64}`);
        const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

        const isValid = await crypto.subtle.verify(
            'HMAC',
            key,
            signature,
            data
        );

        if (!isValid) return null;

        return JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    } catch (e) {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    // Middleware disabled for Auth as we are using LocalStorage
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/signin',
        '/signup',
        '/admin/:path*',
        '/employee/:path*',
    ],
};
