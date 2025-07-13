import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticket-site/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject =  Subjects.ExpirationComplete;
}