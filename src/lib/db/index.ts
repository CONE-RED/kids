import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_URL?.replace("file:", "") ?? "./data/storyforge.db";
const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

// Ensure directory exists
const dbDir = path.dirname(absolutePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(absolutePath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
