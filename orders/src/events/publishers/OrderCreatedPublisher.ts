import { OrderCreatedEvent, Publisher, Subjects } from "@ticket-site/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
};