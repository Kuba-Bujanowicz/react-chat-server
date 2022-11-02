import { Request, Response } from "express"
import { Api } from "../common/base/Api";
import { BAD_REQUEST, CONFLICT } from "../common/const/codes";
import { USERS_URL } from "../common/const/urls";
import { User } from "../models/User";
import { Validator } from "../common/base/Validator";
import { v4 as uuidv4 } from 'uuid'
import { Auth } from "../common/base/Auth";

// Sign Up
const signup = async (req: Request, res: Response) => {
    const user: User = req.body;
    const errors = Validator.validateUser(user)

    // Check if there any errors
    if (Object.values(errors).filter(err => err).length) {
        return res.status(BAD_REQUEST).json(errors)
    }

    //Check if user already exist in database
    const userResponse = await Api.get(USERS_URL, { email: user.email })
    if (userResponse) {
        return res.status(CONFLICT).json({ email: 'This email already exists' })
    }
    user.id = uuidv4()
    user.isActive = true;
    await Api.post(USERS_URL, user);

    //Generate jwt token
    const token = Auth.generateToken(user.id)

    return res.json(token)
}
// Sign In
const signin = (req: Request, res: Response) => {
    res.json("Signed In")
}
// Logout
const logout = (req: Request, res: Response) => {
    res.json("Logout")
}

export const UserController = {
    signup,
    signin,
    logout
}