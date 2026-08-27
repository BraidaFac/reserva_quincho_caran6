/**
 * Genera un archivo SQL con INSERTs de bookings a partir del JSON de MongoDB.
 *
 * Ejecución:
 *   npx tsx scripts/generate-bookings-sql.ts > bkp/bookings.sql
 *
 * El script usa el username del usuario como pivot para resolver el userId
 * en MySQL (subquery). No requiere conexión a la base de datos.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MongoUser {
  _id: string | { $oid: string };
  username: string;
}

interface MongoBooking {
  _id: string | { $oid: string };
  shift: "MORNING" | "EVENING";
  booking_date: { $date: string } | string;
  booking_created_at: { $date: string } | string;
  user_id: string | { $oid: string };
  shared: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readNdJson(filePath: string): unknown[] {
  const content = readFileSync(filePath, "utf-8").trim();
  if (content.startsWith("[")) return JSON.parse(content) as unknown[];
  return content
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

function resolveId(value: string | { $oid: string }): string {
  return typeof value === "object" && "$oid" in value ? value.$oid : value;
}

function resolveDate(value: { $date: string } | string): string {
  const raw = typeof value === "object" && "$date" in value ? value.$date : value;
  // Formato MySQL: YYYY-MM-DD HH:MM:SS
  return new Date(raw).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

function escapeStr(val: string): string {
  return val.replace(/'/g, "''");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ROOT = resolve(process.cwd());

const usersData = readNdJson(
  resolve(ROOT, "bkp/users_ultimo_bkp.json"),
) as MongoUser[];

const bookingsData = readNdJson(
  resolve(ROOT, "bkp/bookings_ultimo_bkp.json"),
) as MongoBooking[];

// mongoId → username
const userMap = new Map<string, string>();
for (const u of usersData) {
  userMap.set(resolveId(u._id), u.username);
}

const lines: string[] = [
  "-- Bookings generadas desde bkp/bookings_ultimo_bkp.json",
  `-- ${new Date().toISOString()}`,
  "",
  "INSERT INTO bookings (userId, shift, bookingDate, createdAt, shared)",
  "VALUES",
];

const rows: string[] = [];
let skipped = 0;

for (const b of bookingsData) {
  const mongoUserId = resolveId(b.user_id);
  const username = userMap.get(mongoUserId);

  if (!username) {
    process.stderr.write(
      `WARN: user_id no encontrado en users JSON: ${mongoUserId}\n`,
    );
    skipped++;
    continue;
  }

  const shift = escapeStr(b.shift);
  const bookingDate = resolveDate(b.booking_date).slice(0, 10); // solo fecha
  const createdAt = resolveDate(b.booking_created_at);
  const shared = b.shared ? 1 : 0;

  rows.push(
    `  ((SELECT id FROM users WHERE username = '${escapeStr(username)}'), '${shift}', '${bookingDate}', '${createdAt}', ${shared})`,
  );
}

lines.push(rows.join(",\n") + ";");
lines.push("");
lines.push(`-- Total: ${rows.length} reservas  |  Salteadas: ${skipped}`);

const output = lines.join("\n");

// Si se pasa --file como argumento, escribe a disco; si no, stdout
const fileArg = process.argv.includes("--file");
if (fileArg) {
  const outPath = resolve(ROOT, "bkp/bookings.sql");
  writeFileSync(outPath, output, "utf-8");
  process.stderr.write(`✓ Archivo generado: ${outPath}\n`);
} else {
  process.stdout.write(output + "\n");
}
