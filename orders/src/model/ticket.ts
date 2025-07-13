import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@ticket-site/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number
    isReserved(): Promise<Boolean>
}
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findasEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.build = (ticket: TicketAttrs) => {
    return new Ticket({
        _id: ticket.id,
        title: ticket.title,
        price: ticket.price
    })
}
ticketSchema.statics.findasEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
}
ticketSchema.methods.isReserved = async function () {
    const existedOrder = await Order.find({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.Complete,
                OrderStatus.AwaitingPayment,
            ]
        }
    })
    return existedOrder != null;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)
export { Ticket }