import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from "cookie-session"
import { currentUser, errorHandler, requireAuth } from '@ticket-site/common';
import { newPaymentRouter } from './routes/pay';

const app = express();
app.set("trust proxy", true)
app.use(json())
app.use(cookieSession({
    signed: false,
    // secure: true
}))
app.use(currentUser)
app.use(newPaymentRouter)
app.use(errorHandler);

export { app }