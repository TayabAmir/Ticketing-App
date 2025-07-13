import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from "cookie-session"
import { currentUser, errorHandler, requireAuth } from '@ticket-site/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set("trust proxy", true)
app.use(json())
app.use(cookieSession({
    signed: false,
    // secure: true
}))
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexRouter)
app.use(updateTicketRouter)
app.use(errorHandler);

export { app }