import { db } from '../config/index.js';

class RecordedPrice {
    async getGoldRate() {
        const result = await db.getAsync(`SELECT PRICE FROM gold_prices ORDER BY CREATED_AT DESC LIMIT 1`);
        return result?.price;
    }

    async getRecentGoldRates(limit = 5) {
        const rows = await db.allAsync(
            `SELECT price FROM gold_prices ORDER BY created_at DESC LIMIT ?`,
            [limit]
        );
        return rows.map((row) => row.price);
    }

    async setGoldRate(rate, eventId) {
        const result = await db.runAsync(`INSERT INTO gold_prices (PRICE, EVENT_ID, CREATED_AT) VALUES (?, ?, datetime('now'))`, [rate, eventId]);
        return result?.lastID;
    };
};

export default RecordedPrice;
