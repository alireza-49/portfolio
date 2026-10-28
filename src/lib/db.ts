import { readFileSync } from "node:fs";
import path from "node:path";
import { Pool, type QueryResultRow } from "pg";

/**
 * Postgres access for the studio console.
 *
 * The pool is created lazily on the first query and cached on `globalThis`, so
 * `next build` never needs a live database and Vercel's fluid compute instances
 * reuse one pool across requests. Everything here is server-only: never import
 * this module from a client component.
 */

type StudioGlobal = typeof globalThis & {
  __studioPool?: Pool;
  __studioSchema?: Promise<void>;
};

const globalDb = globalThis as StudioGlobal;

export type SqlValue = string | number | boolean | null | Date;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "اتصال پایگاه داده برقرار نیست: متغیر محیطی DATABASE_URL تنظیم نشده است.",
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

export function hasDatabaseConfig(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * `pg` (via pg-connection-string) already treats `sslmode=prefer|require|verify-ca`
 * as `verify-full`, but warns on every process start that v3 will switch those
 * modes to libpq semantics. Pin today's meaning here: the warning disappears and
 * a future `pg` upgrade cannot silently drop certificate verification.
 * `uselibpqcompat=true` is an explicit opt-out and is left untouched.
 */
function explicitSslMode(connectionString: string): string {
  if (/\buselibpqcompat=true\b/.test(connectionString)) return connectionString;
  return connectionString.replace(
    /([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/,
    "$1verify-full",
  );
}

/**
 * Managed Postgres (Neon, Supabase, RDS) presents a certificate chain that
 * Node's default store does not ship. Local sockets keep TLS off.
 */
function sslFor(connectionString: string) {
  try {
    const url = new URL(connectionString);
    if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
      return undefined;
    }
  } catch {
    // A malformed URL fails loudly on connect; keep TLS on meanwhile.
  }
  return { rejectUnauthorized: false };
}

export function getPool(): Pool {
  const rawConnectionString = process.env.DATABASE_URL?.trim();
  if (!rawConnectionString) throw new DatabaseNotConfiguredError();
  const connectionString = explicitSslMode(rawConnectionString);

  if (!globalDb.__studioPool) {
    const pool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      allowExitOnIdle: true,
      ssl: sslFor(connectionString),
    });
    pool.on("error", (error) => {
      console.error("[db] idle client error:", error.message);
    });
    globalDb.__studioPool = pool;
  }

  return globalDb.__studioPool;
}

function readSchemaSql(): string {
  return readFileSync(
    path.join(process.cwd(), "src", "lib", "schema.sql"),
    "utf8",
  );
}

/**
 * Applies the idempotent schema once per process. A missing file (an unusual
 * serverless bundle) is reported as a build/setup problem instead of a crash
 * inside every query.
 */
export function ensureSchema(): Promise<void> {
  if (!globalDb.__studioSchema) {
    globalDb.__studioSchema = getPool()
      .query(readSchemaSql())
      .then(() => undefined)
      .catch((error: unknown) => {
        globalDb.__studioSchema = undefined;
        throw error;
      });
  }
  return globalDb.__studioSchema;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: SqlValue[] = [],
): Promise<T[]> {
  await ensureSchema();
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow>(
  text: string,
  params: SqlValue[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
