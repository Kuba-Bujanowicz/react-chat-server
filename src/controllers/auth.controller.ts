import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Api } from '../common/base/Api';
import { BAD_REQUEST, CONFLICT, FORBIDDEN, OK, UNAUTHORIZED } from '../common/const/codes';
import { USERS_URL } from '../common/const/urls';
import { User } from '../models/User';
import { Validator } from '../common/base/Validator';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '../common/base/Auth';
import { JwtPayload } from 'jsonwebtoken';
import { UserSignUp } from '../models/UserSignUp';
import { UserSignIn } from '../models/UserSignIn';

// Sign Up
const signup = async (req: Request, res: Response) => {
  const user: UserSignUp = req.body;
  const errors = Validator.validateUserSignUp(user);

  // Check if there any errors
  if (Object.values(errors).filter((err) => err).length) {
    return res.status(BAD_REQUEST).json(errors);
  }

  //Check if user already exist in database
  const userEmailResponse: User | undefined = await Api.get(USERS_URL, { email: user.email });
  const userNameResponse: User | undefined = await Api.get(USERS_URL, { name: user.name });

  if (userEmailResponse) {
    return res.status(CONFLICT).json({ email: 'This email already exists' });
  }

  if (userNameResponse) {
    return res.status(CONFLICT).json({ name: 'This name already exists' });
  }

  // Create new user
  const newUser: User = {
    id: uuidv4(),
    email: user.email,
    name: String(user.name),
    passwordHash: await bcrypt.hash(String(user.password), 10),
  };

  await Api.post(USERS_URL, newUser);

  //Generate jwt token
  const token = Auth.generateToken(newUser.id);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 3_600_000,
    sameSite: 'strict',
    secure: true,
  });

  res.status(OK).send('User signed up');
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
  const userResponse: User | undefined = await Api.get(USERS_URL, { email: user.email });
  const match = await bcrypt.compare(String(user.password), userResponse?.passwordHash || '');

  if (!userResponse || !match) {
    return res.status(BAD_REQUEST).json({ errorMessage: 'Wrong email or password' });
  }

  //Generate jwt token
  const token = Auth.generateToken(userResponse.id);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 3_600_000,
    sameSite: 'strict',
    secure: true,
  });

  res.status(OK).send('User signed in');
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
    await Api.delete(USERS_URL, decodedToken.data);
    res.clearCookie('token');
  } catch {
    return res.status(BAD_REQUEST).json('Cannot delete user');
  }

  return res.status(OK).json('User deleted successfully');
};

// Authenticate token
const authenticateToken = async (req: Request, res: Response) => {
  const token: string = req.cookies.token;

  if (!token) return res.status(UNAUTHORIZED).json('Missing authorization token');

  try {
    Auth.verifyToken(token);
    return res.status(OK).json('Token authenticated');
  } catch (error) {
    return res.status(FORBIDDEN).json('Invalid authorization token');
  }
};

export const AuthController = {
  signup,
  signin,
  logout,
  deleteAccount,
  authenticateToken,
};
