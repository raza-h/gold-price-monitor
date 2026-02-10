import { config } from "dotenv";

config();

export const THRESHOLD = process.env.THRESHOLD || 5000;
export const CRON_OPTIONS = { timezone: "Asia/Karachi" };
export const FROM_NUMBER = `whatsapp:${process.env.TWILIO_FROM_NUMBER}`;
export const CRON_EXPRESSIONS = [
    "*/5 18-21 * * 1-5",
    "*/15 13-17,22-23,0-3 * * 1-5",
    "0 4-12 * * 1-5",
    "*/15 0-3 * * 6",
];
