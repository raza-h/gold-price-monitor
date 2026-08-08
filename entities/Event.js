import { randomUUID } from "crypto";
import { db, logger } from "../config/index.js";
import { wrapError } from "../utils.js";

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
            logger.info(`EVENT GENERATED: ${this.type}`);

            return this.id;
        } catch (error) {
            logger.error(wrapError('ERROR GENERATING EVENT:', error));
            return null;
        }
    }
}

export default Event;
