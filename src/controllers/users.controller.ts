import { Request, Response } from "express"
import { JwtPayload } from "jsonwebtoken"
import { Api } from "../common/base/Api"
import { Auth } from "../common/base/Auth"
import { NOT_FOUND, OK } from "../common/const/codes"
import { USERS_URL } from "../common/const/urls"
import { User } from "../models/User"
import { UserPublic } from "../models/UserPublic"

//Get all users
const getUsers = async (req: Request, res: Response) => {
    const users: User[] = await Api.get(USERS_URL)
    const usersPublic: UserPublic[] = users.map(user => {
        const { email, ...userPublic } = user;
        return userPublic;
    })
    res.status(OK).json(usersPublic)
}

//Get current user
const getCurrentUser = async (req: Request, res: Response) => {
    const token: string = req.cookies.token;
    const decodedToken = Auth.decodeToken(token) as JwtPayload
    const user = await Api.get(USERS_URL, { id: decodedToken.id })

    if (!user) {
        return res.status(NOT_FOUND).json({ error: 'User not found' })
    }

    res.status(OK).json(user)
}

export const UserController = {
    getUsers,
    getCurrentUser
}