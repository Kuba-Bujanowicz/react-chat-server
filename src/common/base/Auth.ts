import jwt from 'jsonwebtoken';

export class Auth {
  static generateToken(payload: string, expiresIn: number = 60) {
    return jwt.sign({ data: payload }, process.env.TOKEN_SECRET as string, { expiresIn: expiresIn * 60 });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET as string);
  }

  static decodeToken(token: string) {
    return jwt.decode(token);
  }
}
