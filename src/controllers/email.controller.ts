import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Auth } from '../common/base/Auth';
import { Email } from '../common/base/Email';
import UserModel from '../models/User';
import { User } from '../types/User';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, OK } from '../common/const/codes';

// Sent verification link
const sentLink = async (req: Request, res: Response) => {
  const { token } = req.params;
  const decodedToken = Auth.decodeToken(token) as JwtPayload;
  const user = (await UserModel.findById(decodedToken.data)) as User;

  const emailToken = Auth.generateToken(user.email);
  const html = `<p>Click the link below to verify your email</br>\n<a href="http://localhost:4000/verifyEmail/${user._id}/${emailToken}">Click here</a></p>`;
  try {
    await Email.send(user.email, 'Verify your email', html);
  } catch (error) {
    console.log(error);

    return res.status(INTERNAL_SERVER_ERROR).send('Email not sent');
  }
};

// Verify email link with token
const verifyEmail = async (req: Request, res: Response) => {
  const { id, token } = req.params;

  const user = await UserModel.findById(id);

  if (!user) {
    return res.status(BAD_REQUEST).send('Invalid link');
  }

  if (!token) {
    return res.status(BAD_REQUEST).send('Invalid link');
  }

  try {
    Auth.verifyToken(token);
    await UserModel.findByIdAndUpdate(id, { isVerified: true });
    return res.status(OK).redirect('http://localhost:3000/');
  } catch (error) {
    return res.status(FORBIDDEN).send('Invalid authorization token');
  }
};

export const EmailController = {
  sentLink,
  verifyEmail,
};
