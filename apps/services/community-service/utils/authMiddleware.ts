import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Extend Express Request with user field
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email?: string | undefined;
    };
}

/**
 * Authentication Middleware
 * - Reads JWT token from cookie `session`
 * - Verifies the token using `JWT_SECRET`
 * - Attaches decoded user info to `req.user`
 */
export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.cookies?.session;

        if (!token) {
            console.warn("Auth middleware: missing JWT cookie.");
            res.status(401).json({ error: "Authentication token missing" });
            return;
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
            userId: string;
            email?: string;
        };

        // Attach decoded data to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (err: any) {
        console.error("JWT verification error:", err.message);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
