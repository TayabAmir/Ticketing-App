import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@ticket-site/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: { id: string; orderId: string; stripeId: string; }, msg: Message){
        const order = await Order.findById(data.orderId);
        if(!order)
            throw new Error("Order Not Found");
        
        order.set({status: OrderStatus.Complete})
        await order.save();

        msg.ack()
    }
}