import mongoose from "mongoose";
import { OrderStatus } from "@ticket-site/common"
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderAttributes {
    userId: string,
    status: string,
    expiresAt: Date;
    ticket: TicketDoc
}
interface OrderDoc extends mongoose.Document {
    userId: string,
    status: OrderStatus,
    expiresAt: Date;
    ticket: TicketDoc
    version: number
}
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(order: OrderAttributes): OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created

    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})
orderSchema.set("versionKey", "version")
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (order: OrderAttributes) => {
    return new Order(order);
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);