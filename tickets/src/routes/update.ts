import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@ticket-site/common"
import { body } from "express-validator"
import express, { Request, Response } from "express"
import { Ticket } from "../model/tickets"
import { natsWrapper } from "../nats-wrapper"
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher"

const router = express.Router()

router.put('/api/tickets/:id', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isInt({ gt: 0 }).withMessage('Price cannot be negative')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFoundError();
    }
    if (ticket.orderId) {
        throw new BadRequestError("Ticket you are trying to update is reserved");
    }
    const userId = req.currentUser!.id
    if (userId !== ticket.userId) {
        throw new NotAuthorizedError();
    }
    ticket.set({ title, price })
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    res.status(200).send(ticket)

})

export { router as updateTicketRouter }