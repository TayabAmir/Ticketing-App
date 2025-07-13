import { Listener, OrderCancelledEvent, OrderCreatedEvent, OrderStatus, Subjects } from "@ticket-site/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: { id: string; version: number; ticket: { id: string; }; }, msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!order)
            throw new Error("Order not found of this id");

        order.set({ status: OrderStatus.Cancelled })
        await order.save()

        msg.ack()
    }
}