import { NextFunction, Request, Response } from "express";
import { Auth } from "../common/base/Auth";
import { FORBIDDEN, UNAUTHORIZED } from "../common/const/codes";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.token;

    if (!token) return res.status(UNAUTHORIZED).json('Missing authorization token');

    try {
        Auth.verifyToken(token);
        next()
    } catch (error) {
        return res.status(FORBIDDEN).json('Invalid authorization token')
    }
}

export const AuthMiddleware = {
    authenticateToken
}