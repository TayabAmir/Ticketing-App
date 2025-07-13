import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from "cookie-session"
import { currentUser, errorHandler, requireAuth } from '@ticket-site/common';
import { newRouter } from './routes/new';
import { showRouter } from './routes/show';
import { deleteRouter } from './routes/delete';
import { indexRouter } from './routes';

const app = express();
app.set("trust proxy", true)
app.use(json())
app.use(cookieSession({
    signed: false,
    // secure: true
}))
app.use(currentUser)
app.use(newRouter)
app.use(showRouter)
app.use(deleteRouter)
app.use(indexRouter)

app.use(errorHandler);

export { app }