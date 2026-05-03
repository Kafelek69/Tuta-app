import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";

let database: sqlite3.Database | null = null;

function openDatabase(): sqlite3.Database {
  if (database) return database;

  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, "superapp.db");
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      bio TEXT DEFAULT '',
      created_at TEXT NOT NULL
    )`);

    const seededAt = new Date().toISOString();
    const demoPasswordHash = "$2b$10$igNfLSM6SjcHppEwlHqBQuQDJVTQuH8u/oAOJCovNhSjLvKQsfSdi"; // "demodemo"
    db.run("INSERT OR IGNORE INTO users (username, password_hash, bio, created_at) VALUES (?, ?, ?, ?)",
      ["AniaDemo", demoPasswordHash, "Kocham technologię i kawę ☕", seededAt]);
    db.run("INSERT OR IGNORE INTO users (username, password_hash, bio, created_at) VALUES (?, ?, ?, ?)",
      ["MarekDemo", demoPasswordHash, "Developer & gamer 🎮", seededAt]);

    db.run(`CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, friend_user_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_user_id INTEGER NOT NULL,
      receiver_user_id INTEGER NOT NULL,
      encrypted_text TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS feed_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS reels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_user_id INTEGER NOT NULL,
      caption TEXT NOT NULL,
      color_class TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS post_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, post_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS post_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS wallet_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`);

    // Seed demo data
    db.run("INSERT OR IGNORE INTO feed_posts (id, author_user_id, content, created_at) VALUES (1, 1, 'Witam w Tuta Super App! 🚀 To jest mój pierwszy post na tablicy. Jak Wam się podoba nowa aplikacja?', ?)", [seededAt]);
    db.run("INSERT OR IGNORE INTO feed_posts (id, author_user_id, content, created_at) VALUES (2, 2, 'Dzisiaj przetestowałem nowe rolki — super funkcja! 🎬 Kto chce nagrać coś razem?', ?)", [seededAt]);
    db.run("INSERT OR IGNORE INTO feed_posts (id, author_user_id, content, created_at) VALUES (3, 1, 'Poranna kawa i kodowanie ☕💻 Nic lepszego nie ma.', ?)", [seededAt]);

    db.run("INSERT OR IGNORE INTO wallet_transactions (id, user_id, amount, type, description, created_at) VALUES (1, 1, 14250.00, 'deposit', 'Saldo początkowe', ?)", [seededAt]);
    db.run("INSERT OR IGNORE INTO wallet_transactions (id, user_id, amount, type, description, created_at) VALUES (2, 2, 8500.00, 'deposit', 'Saldo początkowe', ?)", [seededAt]);

    db.run("INSERT OR IGNORE INTO notifications (id, user_id, type, title, body, created_at) VALUES (1, 1, 'welcome', 'Witaj w Tuta!', 'Twoje konto zostało utworzone. Poznaj wszystkie funkcje!', ?)", [seededAt]);
    db.run("INSERT OR IGNORE INTO notifications (id, user_id, type, title, body, created_at) VALUES (2, 1, 'social', 'MarekDemo dodał post', 'Sprawdź nowy post na tablicy.', ?)", [seededAt]);

    db.run("INSERT OR IGNORE INTO reels (id, author_user_id, caption, color_class, created_at) VALUES (1, 1, 'Moja pierwsza rolka! Sprawdźcie nowy feed 🔥', 'from-orange-500/40 to-red-500/10', ?)", [seededAt]);
    db.run("INSERT OR IGNORE INTO reels (id, author_user_id, caption, color_class, created_at) VALUES (2, 2, 'Gaming setup tour — nowy sprzęt przyjechał! 🎮', 'from-purple-500/40 to-blue-500/10', ?)", [seededAt]);
    db.run("INSERT OR IGNORE INTO reels (id, author_user_id, caption, color_class, created_at) VALUES (3, 1, 'Zachód słońca nad Wisłą 🌅 Polska jest piękna!', 'from-yellow-500/40 to-pink-500/10', ?)", [seededAt]);
  });

  database = db;
  return db;
}

export function run(sql: string, params: unknown[] = []): Promise<void> {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => { if (err) reject(err); else resolve(); });
  });
}

export function get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => { if (err) reject(err); else resolve(row as T | undefined); });
  });
}

export function all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows as T[]); });
  });
}
