import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Auth } from '../common/base/Auth';
import UserModel from '../models/User';
import { NOT_FOUND, FORBIDDEN, UNAUTHORIZED } from '../common/const/codes';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.token;

  if (!token) return res.status(UNAUTHORIZED).send('Missing authorization token');

  try {
    Auth.verifyToken(token);
    next();
  } catch (error) {
    return res.status(FORBIDDEN).send('Invalid authorization token');
  }
};

const authenticateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.token;
  const decodedToken = Auth.decodeToken(token) as JwtPayload;
  const user = await UserModel.findById(decodedToken.data);

  if (!user) {
    return res.status(NOT_FOUND).send('User not found');
  }

  if (!user.isVerified) {
    return res.status(FORBIDDEN).send('Email not verified');
  }

  next();
};

export const AuthMiddleware = {
  authenticateToken,
  authenticateEmail,
};
