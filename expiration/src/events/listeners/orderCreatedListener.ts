import { Listener, OrderCreatedEvent, Subjects } from "@ticket-site/common";
import { Message } from "node-nats-streaming";
import expirationQueue from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject =  Subjects.OrderCreated;
    queueGroupName = "expiration-srv";

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add({orderId: data.id}, {
            delay
        });
        msg.ack()
    }
}