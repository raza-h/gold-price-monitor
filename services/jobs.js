import { ScrapeGoldPriceJob } from '../entities/index.js';
import { goldPkScrapeGoldRate } from './scrapers.js';
import { goldPkRecordedPrice } from './trackers.js';

export const goldPkScrapeGoldPriceJob = new ScrapeGoldPriceJob(goldPkScrapeGoldRate, goldPkRecordedPrice);
