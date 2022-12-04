import bcrypt from 'bcrypt';

export class Password {
  static hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
