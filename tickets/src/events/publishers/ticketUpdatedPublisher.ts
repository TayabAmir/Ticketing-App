import { Publisher, Subjects, TicketUpdatedEvent} from "@ticket-site/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated 

};