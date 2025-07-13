import { Subjects } from "./subjects"

export interface PaymentCreatedEvent {
    subject : Subjects.ExpirationComplete
    data : {
        id: string;
        orderId: string;
        stripeId: string;
    }
}