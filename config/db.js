import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import logger from "./logger.js";

const dbFolder = "/data"; // ../data for local development

if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });

const dbPath = path.join(dbFolder, "db.sqlite");
logger.info(`DB PATH: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) logger.error("ERROR CONNECTING TO DB:", err);
  else logger.info("CONNECTED TO DB!");
});

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS gold_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        price REAL NOT NULL,
        created_at DATETIME NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE NO ACTION
      );
    `, (err) => {
      if (err) logger.error("Failed to create table:", err);
      else logger.info("Table is ready");
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY ,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT (datetime('now'))
      );
    `, (err) => {
      if (err) logger.error("Failed to create table:", err);
      else logger.info("Table is ready");
    });

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_gold_prices_created_at
      ON gold_prices (created_at);
    `, (err) => {
      if (err) logger.error("Failed to create index:", err);
      else logger.info("Index is ready");
    });
  
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_events_type
      ON events (type);
    `, (err) => {
      if (err) logger.error("Failed to create index:", err);
      else logger.info("Index is ready");
    });
});

export default db;
