import { Request, Response } from "express"

// Sign Up
const signup = (req: Request, res: Response) => {
    res.json("Signed Up")
}
// Sign In
const signin = (req: Request, res: Response) => {
    res.json("Signed In")
}
// Logout
const logout = (req: Request, res: Response) => {
    res.json("Logout")
}

const User = {
    signup,
    signin,
    logout
}

export default User;