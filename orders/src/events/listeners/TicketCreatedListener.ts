import { Listener, Subjects, TicketCreatedEvent } from "@ticket-site/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../model/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: { id: string; title: string; price: number; userId: string; }, msg: Message) {
        const { id, title, price } = data
        const ticket = Ticket.build({
            id, title, price
        })
        await ticket.save();
        msg.ack()
    }
};