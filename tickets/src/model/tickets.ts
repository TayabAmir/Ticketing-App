import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string
}
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    orderId?: string;
    version: number
}
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderID: {
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v;
        }
    }
})
ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (ticket: TicketAttrs) => {
    return new Ticket(ticket)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)
export { Ticket }