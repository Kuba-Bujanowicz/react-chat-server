import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { BAD_REQUEST, CONFLICT, FORBIDDEN, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from '../common/const/codes';
import { User } from '../types/User';
import { Validator } from '../common/base/Validator';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '../common/base/Auth';
import { JwtPayload } from 'jsonwebtoken';
import { UserSignUp } from '../types/UserSignUp';
import { UserSignIn } from '../types/UserSignIn';
import UserModel from '../models/User';

// Sign Up
const signup = async (req: Request, res: Response) => {
  const user: UserSignUp = req.body;
  const errors = Validator.validateUserSignUp(user);

  // Check if there any errors
  if (Object.values(errors).filter((err) => err).length) {
    return res.status(BAD_REQUEST).json(errors);
  }

  //Check if user already exist in database
  const userEmailResponse = await UserModel.findOne({ email: user.email });
  const userNameResponse = await UserModel.findOne({ name: user.name });

  if (userEmailResponse) {
    return res.status(CONFLICT).json({ email: 'This email already exists' });
  }

  if (userNameResponse) {
    return res.status(CONFLICT).json({ name: 'This name already exists' });
  }

  // Creating user in database
  const newUser = new UserModel<User>({
    _id: uuidv4(),
    email: user.email,
    name: String(user.name),
    isVerified: false,
    passwordHash: await bcrypt.hash(String(user.password), 10),
  });

  const createdUser = await newUser.save();

  if (newUser !== createdUser) {
    return res.status(INTERNAL_SERVER_ERROR).send('Cannot create user');
  }

  return res.status(OK).send('User signed up');
};
// Sign In
const signin = async (req: Request, res: Response) => {
  const user: UserSignIn = req.body;
  const errors = Validator.validateUserSignIn(user);

  // Check if there any errors
  if (Object.values(errors).filter((err) => err).length) {
    return res.status(BAD_REQUEST).json(errors);
  }

  //Check if user already exist in database and verify password
  const userResponse: User | null = await UserModel.findOne({ email: user.email });
  const match = await bcrypt.compare(String(user.password), userResponse?.passwordHash || '');

  if (!userResponse || !match) {
    return res.status(BAD_REQUEST).send('Wrong email or password');
  }

  //Generate jwt token
  const token = Auth.generateToken(userResponse._id);

  res.clearCookie('token');
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 3_600_000,
    sameSite: 'strict',
  });

  res.status(OK).json('User signed in');
};

// Logout
const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');

  return res.status(OK).send('User logout');
};

// Delete account
const deleteAccount = async (req: Request, res: Response) => {
  const token: string = req.cookies.token;
  const decodedToken = Auth.decodeToken(token) as JwtPayload;

  //Delete a user
  try {
    await UserModel.deleteOne({ _id: decodedToken.data });
    res.clearCookie('token');
  } catch {
    return res.status(BAD_REQUEST).send('Cannot delete user');
  }

  return res.status(OK).send('User deleted successfully');
};

export const AuthController = {
  signup,
  signin,
  logout,
  deleteAccount,
};
