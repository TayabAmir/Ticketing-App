import { OrderCancelledEvent, Publisher, Subjects } from "@ticket-site/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
};