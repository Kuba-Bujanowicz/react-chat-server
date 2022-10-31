import { User } from "../models/User";
import { UserErrors } from "../models/UserErrors";

class Validator {
    private static initErrors<T>() {
        return {} as T;
    } 
    static validateUser(user: User): UserErrors {
        const errors = this.initErrors<UserErrors>()
        const emailRegEx = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
        if (!user.email.match(emailRegEx)) {
            errors.email = 'Invalid email'
        }

        if (user.email.trim() === '') {
            errors.email = 'Email is required'
        }

        if (user.name.trim() === '') {
            errors.name = 'Name is required'
        }

        return errors
    }
}