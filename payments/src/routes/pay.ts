import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticket-site/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Order } from '../model/order'
import { stripe } from '../stripe'
import { Payment } from '../model/payment'
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher'
import { natsWrapper } from '../nats-wrapper'
const router = express.Router()

router.post('/api/payments', requireAuth, [body('token').not().isEmpty().withMessage("Token for stripe must be provided"), body('orderId').not().isEmpty().withMessage("örder id should be provided")], validateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order)
        throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Order already cancelled")
    }

    const charge = await stripe.charges.create({
        currency: "pkr",
        amount: order.price,
        source: token
    })

    const payment = Payment.build({ orderId, paymentId: charge.id })
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.paymentId
    })

    res.status(201).send(payment)

})

export { router as newPaymentRouter }