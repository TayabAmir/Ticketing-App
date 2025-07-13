import { PaymentCreatedEvent, Publisher, Subjects } from "@ticket-site/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.ExpirationComplete;
}