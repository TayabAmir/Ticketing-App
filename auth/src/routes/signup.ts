import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator";
import { RequestValidationError, validateRequest, BadRequestError } from "@ticket-site/common";
import { User } from "../models/user";
import { sign } from "jsonwebtoken";

const router = express.Router()
router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be b/w 4 and 20 chars")
],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const exist = await User.findOne({ email })

    if (exist) {
        throw new BadRequestError('Email already in use!');
    }

    const user = User.build({ email, password })
    await user.save()
    const userJWT = sign({ id: user._id, email: user.email }, process.env.JWT_KEY!);
    req.session = {
        jwt: userJWT
    };
    res.status(201).send(user)
})

export { router as signupRouter };