import { config } from "dotenv";

config();

export const THRESHOLD = process.env.THRESHOLD || 5000;
export const CRON_OPTIONS = { timezone: "Asia/Karachi" };
export const FROM_NUMBER = `whatsapp:${process.env.TWILIO_FROM_NUMBER}`;
export const CRON_EXPRESSIONS = [
    "*/5 18-21 * * 1-6",
    "*/15 13-17,22-23,0-3 * * 1-6",
    "0 4-12 * * 1-6",
];
