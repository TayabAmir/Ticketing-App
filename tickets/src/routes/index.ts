import express, { Request, Response } from "express"
import { Ticket } from "../model/tickets"

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = Ticket.find({orderId: undefined})
    res.status(200).send(tickets)
})

export { router as indexRouter }