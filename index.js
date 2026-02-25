import cron from 'node-cron';
import { logger } from './config/index.js';
import { wrapError } from './utils.js';
import { config } from 'dotenv';
import { CRON_OPTIONS, CRON_EXPRESSIONS } from './constants.js';
import { goldPkScrapeGoldPriceJob } from './services/jobs.js';

config();

try {
    CRON_EXPRESSIONS.forEach((exp) => {
        cron.schedule(exp, goldPkScrapeGoldPriceJob.run, CRON_OPTIONS);
    });

    logger.info("SUCCESS SCHEDULING JOBS!");
} catch (err) {
    logger.error(wrapError("ERROR SCHEDULING JOBS:", err));
}
