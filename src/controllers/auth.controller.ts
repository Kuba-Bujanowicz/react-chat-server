import { Request, Response } from 'express';
import { Api } from '../common/base/Api';
import { BAD_REQUEST, CONFLICT, FORBIDDEN, NOT_FOUND, OK, PERMANENT_REDIRECT, UNAUTHORIZED } from '../common/const/codes';
import { USERS_URL } from '../common/const/urls';
import { User } from '../models/User';
import { Validator } from '../common/base/Validator';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '../common/base/Auth';
import { JwtPayload } from 'jsonwebtoken';
import { SignUpUser } from '../models/SignUpUser';
import { Password } from '../common/base/Password';

// Sign Up
const signup = async (req: Request, res: Response) => {
  // Get user from request
  const user: SignUpUser = req.body;

  // Validate user's credentials
  const errors = Validator.validateSignUpUser(user);

  // Check if there any errors
  if (Object.values(errors).filter((err) => err).length) {
    return res.status(BAD_REQUEST).json(errors);
  }

  //Check if user already exist in database
  const userEmailResponse = await Api.get(USERS_URL, { email: user.email });
  const userNameResponse = await Api.get(USERS_URL, { name: user.name });

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
    name: user.name,
    password: await Password.hashPassword(user.password),
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
  const email: string = req.body.email;
  const errors = { email: Validator.validateEmail(email) };

  // Check if there any errors
  if (Object.values(errors).filter((err) => err).length) {
    return res.status(BAD_REQUEST).json(errors);
  }

  //Check if user already exist in database
  const user: User = await Api.get(USERS_URL, { email });
  if (!user) {
    return res.status(NOT_FOUND).json({ email: 'User not found' });
  }

  user.isActive = true;
  await Api.put(USERS_URL, user, user.id);

  //Generate jwt token
  const token = Auth.generateToken(user.id);

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
  const token: string = req.cookies.token;
  const decodedToken = Auth.decodeToken(token) as JwtPayload;

  //Change user isActive to false
  try {
    const user: User = await Api.get(USERS_URL, { id: decodedToken.data });
    user.isActive = false;
    await Api.put(USERS_URL, user, user.id);
    res.clearCookie('token');
  } catch {
    return res.status(BAD_REQUEST).json('Cannot logout');
  }

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
