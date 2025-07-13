import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@ticket-site/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { Ticket, TicketDoc } from "../model/ticket"
import { Order } from "../model/order"
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher"
import { natsWrapper } from "../nats-wrapper"
const router = express.Router()

router.post('/api/orders', requireAuth, [
    body('ticketId').not().isEmpty().withMessage("TicketId must be provided")
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId)
    if (!ticket) throw new NotFoundError();

    const isRes = await ticket.isReserved();
    if (isRes) {
        throw new BadRequestError("Ticket already reserved.");
    }

    const expireDate = new Date();
    expireDate.setSeconds(expireDate.getSeconds() + (10 * 60))

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expireDate,
        ticket
    })
    await order.save()

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        version: order.version
    })

    res.status(201).send(order)
})

export { router as newRouter }