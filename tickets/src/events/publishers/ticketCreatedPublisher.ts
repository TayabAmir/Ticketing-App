import { Publisher, Subjects, TicketCreatedEvent} from "@ticket-site/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated 

};