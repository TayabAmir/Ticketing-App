import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/orderCreatedListener';
import { OrderCancelledListener } from './events/listeners/orderCancelledListener';

if (process.platform === 'win32') {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.on('SIGINT', () => {
        process.emit('SIGINT' as any);
    });
}

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined!");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined!");
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined!");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined!");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined!");
    }

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log("Nats connection closed");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());
        
        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000 (version 3)");
    });
};

start();
