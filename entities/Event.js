import { randomUUID } from "crypto";
import { db, logger, producer } from "../config/index.js";

class Event {
    constructor(type, payload) {
        this.id = randomUUID();
        this.type = type;
        this.payload = payload;
    }

    async generate() {
        try {
            await db.runAsync('INSERT INTO events (id, type, payload) VALUES (?, ?, ?)', [this.id, this.type, JSON.stringify(this.payload)]);
            logger.info(`EVENT INSERTED INTO DB: ${this.type}`);

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
            try {
                await db.runAsync('DELETE FROM events WHERE id = ?', [this.id]);
                logger.info(`EVENT DELETED FROM DB: ${this.type}`);
            } catch (err) {
                logger.error(`ERROR DELETING EVENT FROM DB: ${err?.message}`);
            }

            logger.error(`ERROR GENERATING EVENT: ${error?.message}`);
            return null;
        }
    }
}

export default Event;
