import { db } from '../config/index.js';

class RecordedPrice {
    async getGoldRate() {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT PRICE
               FROM gold_prices
               ORDER BY CREATED_AT DESC
               LIMIT 1`,
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);
                    resolve(row?.price);
                }
            );
        });
    }

    async setGoldRate(rate, eventId) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO gold_prices (PRICE, EVENT_ID, CREATED_AT)
               VALUES (?, ?, datetime('now'))`,
                [rate, eventId],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    };
};

export default RecordedPrice;
