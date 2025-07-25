import { Listener, NotFoundError, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@ticket-site/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../model/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data
        const ticket = await Ticket.findasEvent({ id, version });
        if (!ticket) throw new Error('Ticket not found');

        ticket.set({ title, price });
        await ticket.save();
        msg.ack()
    }
};