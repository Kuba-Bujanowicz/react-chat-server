import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Api } from '../common/base/Api';
import { Auth } from '../common/base/Auth';
import { NOT_FOUND, OK } from '../common/const/codes';
import { USERS_URL } from '../common/const/urls';
import { User } from '../types/User';
import { MyUser, UserPublic } from '../types/UserPublic';
import UserModel from '../models/User';

//Get all users
const getUsers = async (req: Request, res: Response) => {
  const users: User[] = await UserModel.find({});
  const usersPublic: UserPublic[] = users.map((user) => {
    return {
      name: user.name,
      email: user.email,
    };
  });
  res.status(OK).json(usersPublic);
};

//Get current user
const getCurrentUser = async (req: Request, res: Response) => {
  const token: string = req.cookies.token;
  const decodedToken = Auth.decodeToken(token) as JwtPayload;
  const user: User | null = await UserModel.findById(decodedToken.data);

  if (!user) {
    return res.status(NOT_FOUND).send('User not found');
  }

  const myUser: MyUser = {
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  };

  res.status(OK).json(myUser);
};

export const UserController = {
  getUsers,
  getCurrentUser,
};
