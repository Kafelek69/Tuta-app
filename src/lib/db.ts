import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";

let database: sqlite3.Database | null = null;

function openDatabase(): sqlite3.Database {
  if (database) {
    return database;
  }

  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, "superapp.db");
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    const seededAt = new Date().toISOString();
    const demoPasswordHash = "$2a$10$7EqJtq98hPqEX7fNZaFWoOHi8fA7Yw6VfW4rWuIwoMvVJE9idhra2";
    db.run(
      "INSERT OR IGNORE INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
      ["AniaDemo", demoPasswordHash, seededAt],
    );
    db.run(
      "INSERT OR IGNORE INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
      ["MarekDemo", demoPasswordHash, seededAt],
    );
    db.run(`
      CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        friend_user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, friend_user_id)
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_user_id INTEGER NOT NULL,
        receiver_user_id INTEGER NOT NULL,
        encrypted_text TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS feed_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS reels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_user_id INTEGER NOT NULL,
        caption TEXT NOT NULL,
        color_class TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  });

  database = db;
  return db;
}

export function run(sql: string, params: unknown[] = []): Promise<void> {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

export function all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}
