import { SignInUser } from '../../models/SignInUser';
import { SignUpUser } from '../../models/SignUpUser';
import { UserErrors } from '../../models/UserErrors';

export class Validator {
  private static initErrors<T>() {
    return {} as T;
  }

  static isEmail(email: string) {
    const emailRegEx = new RegExp(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    );

    if (!email || email.trim() === '') {
      return 'Email is required';
    }

    if (email && !email.match(emailRegEx)) {
      return 'Invalid email';
    }
  }

  static isEmpty(text: string, fieldName?: string) {
    if (!text || text.trim() === '') {
      return `${fieldName || 'Field'} is required`;
    }
  }

  static isSamePasswords(password: string, passwordConfirm: string) {
    if (password !== passwordConfirm) {
      return 'Passwords must match';
    }
  }

  static validateSignUpUser(user: SignUpUser): UserErrors {
    const errors = this.initErrors<UserErrors>();

    errors.email = this.isEmail(user.email);
    errors.password = this.isEmpty(user.password);
    errors.passwordConfirm = this.isSamePasswords(user.password, user.passwordConfirm);
    errors.name = this.isEmpty(user.name, 'Name');

    return errors;
  }

  static validateSignInUser(user: SignInUser): UserErrors {
    const errors = this.initErrors<UserErrors>();

    errors.email = this.isEmail(user.email);
    errors.password = this.isEmpty(user.password);

    return errors;
  }
}
