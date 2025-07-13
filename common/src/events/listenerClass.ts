import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject']
    abstract queueGroupName: string
    abstract onMessage(data : T['data'], msg: Message) : void;
    protected client: Stan;
    protected ackWait = 5 * 1000;
    
    constructor(client: Stan) {
        this.client = client
    }

    subsciptionOptions() {
        return this.client.subscriptionOptions().setManualAckMode(true).setAckWait(this.ackWait).setDeliverAllAvailable().setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subsciptionOptions())
        subscription.on('message', (msg: Message) => {
            console.log(`Message Received: ${this.subject}`)

            const data = this.parseMessage(msg);
            this.onMessage(data, msg)
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData()

        return typeof data == 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
    }
}
