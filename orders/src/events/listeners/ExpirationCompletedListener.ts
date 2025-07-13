import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@ticket-site/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: { orderId: string; }, msg: Message) {
        const order = await Order.findById(data.orderId).populate("ticket");
        if (!order)
            throw new Error("Order Not Found")
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({
            status: OrderStatus.Cancelled
        })
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: { id: order.ticket.id }
        })
        msg.ack()
    }
}