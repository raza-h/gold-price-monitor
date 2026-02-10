import { randomUUID } from "crypto";
import { logger, producer } from "../config/index.js";

class Event {
    constructor(type, payload) {
        this.id = randomUUID();
        this.type = type;
        this.payload = payload;
    }

    async generate() {
        try {
            await producer.connect();
            await producer.send({
                topic: `${this.type}-events`,
                messages: [
                    {
                        key: this.id,
                        event_type: `${this.type}.created`,
                        value: JSON.stringify(this.payload),
                    },
                ],
            })
            await producer.disconnect();
            logger.info(`EVENT GENERATED: ${this.type}`);
            return this.id;
        } catch (error) {
            logger.error('ERROR GENERATING EVENT:', error);
            return null;
        }
    }
}

export default Event;
