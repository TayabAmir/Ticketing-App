import Queue, { Job } from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/ExpirationCreatedPublisher";
import { natsWrapper } from "../nats-wrapper";

interface JobPayload {
    orderId: string
}

const expirationQueue = new Queue<JobPayload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    new ExpirationCompletedPublisher(natsWrapper.client).publish({ orderId: job.data.orderId })
})

export default expirationQueue;