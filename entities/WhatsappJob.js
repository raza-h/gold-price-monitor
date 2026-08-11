import { twilioClient, logger } from '../config/index.js';
import { FROM_NUMBER } from '../constants.js';
import { getUniqueStrings, wrapError } from '../utils.js';

class WhatsappJob {
    async run(data) {
        try {
            const { rate, weight, message } = data ?? {};

            const notification = message || `Gold rate is Rs. ${rate?.toLocaleString()} per ${weight}`;
            const messages = await twilioClient.messages.list({ to: FROM_NUMBER });
            const recipients = getUniqueStrings(messages.map((message) => message?.from));

            const promises = [];

            recipients.forEach((to_number) => {
                promises.push(twilioClient.messages.create({
                    from: FROM_NUMBER,
                    to: to_number,
                    body: notification,
                }));
            });

            await Promise.all(promises);
            logger.info('SUCCESS COMPLETING JOB, NOTIFICATIONS SENT!');
        } catch (err) {
            logger.error(wrapError('ERROR SENDING NOTIFICATION:', err));
        }
    }
}

export default WhatsappJob;
