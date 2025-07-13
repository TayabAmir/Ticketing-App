import express, { Request, Response } from "express"
import { body } from "express-validator"
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@ticket-site/common";
import { Password } from "../services/password";
import { sign } from "jsonwebtoken";

const router = express.Router()

router.post('/api/users/signin', [
    body("email")
        .isEmail()
        .withMessage("Email must be valid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty")
],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError("Wrong Email or Password");
    }
    const isSame = await Password.compare(user.password, password);
    if(!isSame){
        throw new BadRequestError("Wrong Email or Password");
    }
    const userJWT = sign({id: user._id, email: user.email}, process.env.JWT_KEY!)
    req.session = {
        jwt : userJWT
    }
    res.status(200).send(user)
})

export { router as signinRouter };