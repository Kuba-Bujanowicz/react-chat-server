import { Request, Response } from "express"
import { Api } from "../common/base/Api"
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

//Get specific user
const getUser = async (req: Request, res: Response) => {
    const email = req.params.email;
    const id = req.params.id;
    const name = req.params.name;

    const data = email && 'email' || id && 'id' || name && 'name' || 'id';

    const user = await Api.get(USERS_URL, {
        [data]: req.params[data]
    })

    if (!user) {
        return res.status(NOT_FOUND).json({ error: 'User not found' })
    }

    res.status(OK).json(user)
}

export const UserController = {
    getUsers,
    getUser
}