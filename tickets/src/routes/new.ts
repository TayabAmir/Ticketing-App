import { requireAuth, validateRequest } from "@ticket-site/common"
import { body } from "express-validator"
import express, { Request, Response } from "express"
import { Ticket } from "../model/tickets"
import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isInt({ gt: 0 }).withMessage('Price cannot be negative')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body
    const userId = req.currentUser!.id

    const ticket = Ticket.build({ title, price, userId })
    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.status(201).send(ticket)
})

export { router as createTicketRouter }