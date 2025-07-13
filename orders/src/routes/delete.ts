import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@ticket-site/common"
import express, { Request, Response } from "express"
import { Order } from "../model/order"
import { OrderCancelledPublisher } from "../events/publishers/OrderCancelledPublisher"
import { natsWrapper } from "../nats-wrapper"
const router = express.Router()

router.get('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    order.status = OrderStatus.Cancelled;
    await order.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        },
        version: order.version
    })
    res.status(204).send(order)
})

export { router as indexRouter }