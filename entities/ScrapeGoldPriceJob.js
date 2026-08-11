import RecordedPrice from './RecordedPrice.js';
import WhatsappJob from './WhatsappJob.js';
import { logger } from '../config/index.js';
import { THRESHOLD } from '../constants.js';
import { wrapError, calculatePriceAnalytics, formatGoldAlertMessage } from '../utils.js';
import Event from './Event.js';

class ScrapeGoldPriceJob {
    constructor(scraper = async () => { }, recordedPrice = new RecordedPrice(), whatsappJob = new WhatsappJob()) {
        this.scraper = scraper;
        this.recordedPrice = recordedPrice;
        this.whatsappJob = whatsappJob;
        this.run = this.run.bind(this);
    }

    async run() {
        try {
            logger.info("STARTING GOLD RATE JOB");

            const previousGoldRate = await this.recordedPrice.getGoldRate();

            const { rate = null, weight = null } = await this.scraper() ?? {};

            if (!rate) {
                return;
            }

            const priceDifference = Math.abs(previousGoldRate - rate);

            if (!previousGoldRate || priceDifference >= THRESHOLD) {
                const event = new Event('price', {
                    rate,
                    weight,
                });

                const eventId = await event.generate();

                if (!eventId) {
                    return;
                }

                await this.recordedPrice.setGoldRate(rate, eventId);

                let notificationPayload = { rate, weight };

                // Analytics only when a real threshold move occurs (previous price exists).
                if (previousGoldRate) {
                    const recentPrices = await this.recordedPrice.getRecentGoldRates(5);
                    const analytics = calculatePriceAnalytics(rate, previousGoldRate, recentPrices);
                    const message = formatGoldAlertMessage(analytics);

                    notificationPayload = {
                        rate,
                        weight,
                        ...analytics,
                        message,
                    };

                    await event.updatePayload(notificationPayload);
                }

                await this.whatsappJob.run(notificationPayload);

                logger.info('SUCCESS COMPLETING JOB, EVENT GENERATED!');
            } else {   
                logger.info("SUCCESS COMPLETING JOB, NO EVENT GENERATED!");
            }
        } catch (err) {
            logger.error(wrapError('ERROR RUNNING GOLD RATE JOB:', err));
        }

    }
}

export default ScrapeGoldPriceJob;
