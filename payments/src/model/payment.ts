import mongoose from "mongoose";

interface PaymentAttrs {
    orderId: string,
    paymentId: string,
}
interface PaymentDoc extends mongoose.Document {
    orderId: string,
    paymentId: string,
}
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema({
    orderID: {
        required: true,
        type: String
    },
    stripeID: {
        required: true,
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema)

export { Payment }