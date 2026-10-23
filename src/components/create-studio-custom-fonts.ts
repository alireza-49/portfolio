import { FONT_STACKS, type FontId } from "./create-studio-config";

/**
 * Fonts uploaded by the visitor.
 *
 * The binary cannot live in localStorage, so it is kept in IndexedDB and
 * re-registered with the CSS Font Loading API on every visit. The list is
 * exposed through `useSyncExternalStore`: the server snapshot is empty (the
 * page is prerendered) and IndexedDB is only read after hydration, so the
 * markup never mismatches.
 *
 * IndexedDB is touched from `subscribeCustomFonts` and the mutation helpers,
 * never while rendering.
 */
export const CUSTOM_FONT_LIMIT = 8;
export const CUSTOM_FONT_MAX_BYTES = 5 * 1024 * 1024;
export const CUSTOM_FONT_ACCEPT = ".woff2,.woff,.ttf,.otf";

export type CustomFont = {
  id: string;
  name: string;
  /** Unique CSS family, e.g. `cc-font-4f1c…`. */
  family: string;
  fileName: string;
  size: number;
  createdAt: number;
};

type StoredFont = CustomFont & { data: ArrayBuffer };

const DB_NAME = "cc-studio-fonts";
const DB_VERSION = 1;
const STORE_NAME = "fonts";
const FONT_FILE_PATTERN = /\.(woff2?|ttf|otf)$/i;
const FALLBACK_STACK = FONT_STACKS.vazirmatn;
const EMPTY_FONTS: CustomFont[] = [];

let currentFonts: CustomFont[] = EMPTY_FONTS;
let loadPromise: Promise<void> | null = null;
const faces = new Map<string, FontFace>();
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB unavailable"));
  });
}

function readStoredFonts(): Promise<StoredFont[]> {
  return openDb().then(
    (db) =>
      new Promise<StoredFont[]>((resolve, reject) => {
        const request = db
          .transaction(STORE_NAME, "readonly")
          .objectStore(STORE_NAME)
          .getAll();
        request.onsuccess = () => resolve(request.result as StoredFont[]);
        request.onerror = () => reject(request.error);
      }),
  );
}

function writeStoredFont(record: StoredFont): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).put(record);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      }),
  );
}

function deleteStoredFont(id: string): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      }),
  );
}

function toCustomFont(record: StoredFont): CustomFont | null {
  if (!record || typeof record.id !== "string") return null;
  if (typeof record.family !== "string" || !record.family) return null;
  if (typeof record.name !== "string" || !record.name.trim()) return null;
  return {
    id: record.id,
    name: record.name.slice(0, 28),
    family: record.family,
    fileName: typeof record.fileName === "string" ? record.fileName : "",
    size: typeof record.size === "number" ? record.size : 0,
    createdAt: typeof record.createdAt === "number" ? record.createdAt : 0,
  };
}

async function registerFace(
  font: CustomFont,
  data: ArrayBuffer,
): Promise<void> {
  if (faces.has(font.id)) return;
  const face = new FontFace(font.family, data, { display: "swap" });
  await face.load();
  document.fonts.add(face);
  faces.set(font.id, face);
}

function ensureLoaded(): Promise<void> {
  if (!canUseStorage()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const stored = await readStoredFonts();
      const fonts: CustomFont[] = [];
      for (const record of [...stored].sort(
        (a, b) => b.createdAt - a.createdAt,
      )) {
        const font = toCustomFont(record);
        if (!font) continue;
        try {
          await registerFace(font, record.data);
          fonts.push(font);
        } catch {
          // A face the browser rejects must not block the library.
        }
      }
      currentFonts = fonts;
      notify();
    } catch {
      // IndexedDB blocked: the studio simply starts without saved fonts.
    }
  })();

  return loadPromise;
}
export function subscribeCustomFonts(listener: () => void): () => void {
  listeners.add(listener);
  void ensureLoaded();
  return () => {
    listeners.delete(listener);
  };
}

export function getCustomFontsSnapshot(): CustomFont[] {
  return currentFonts;
}

export function getCustomFontsServerSnapshot(): CustomFont[] {
  return EMPTY_FONTS;
}

function createFontId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `font-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function addCustomFont(input: {
  name: string;
  file: File;
}): Promise<CustomFont> {
  const { file } = input;
  const name = (input.name.trim() || file.name.replace(/\.[^.]+$/, ""))
    .replace(/\s+/g, " ")
    .slice(0, 28);

  if (!name) throw new Error("برای فونت یک نام وارد کنید.");
  if (!FONT_FILE_PATTERN.test(file.name)) {
    throw new Error("فقط فایل‌های woff2، woff، ttf و otf پشتیبانی می‌شوند.");
  }
  if (file.size === 0) throw new Error("فایل انتخاب‌شده خالی است.");
  if (file.size > CUSTOM_FONT_MAX_BYTES) {
    throw new Error("حجم فونت باید کمتر از ۵ مگابایت باشد.");
  }
  if (
    currentFonts.some((font) => font.name.toLowerCase() === name.toLowerCase())
  ) {
    throw new Error("فونتی با همین نام قبلاً اضافه شده است.");
  }
  if (currentFonts.length >= CUSTOM_FONT_LIMIT) {
    throw new Error("ظرفیت فونت‌های سفارشی پر است؛ ابتدا یکی را حذف کنید.");
  }
  if (typeof document === "undefined" || typeof FontFace === "undefined") {
    throw new Error("این مرورگر از بارگذاری فونت پشتیبانی نمی‌کند.");
  }

  const id = createFontId();
  const family = `cc-font-${id}`;
  const data = await file.arrayBuffer();
  const face = new FontFace(family, data, { display: "swap" });
  await face.load(); // Rejects for a corrupt or unsupported file.
  document.fonts.add(face);
  faces.set(id, face);

  const font: CustomFont = {
    id,
    name,
    family,
    fileName: file.name,
    size: file.size,
    createdAt: Date.now(),
  };
  currentFonts = [font, ...currentFonts];
  notify();

  try {
    await writeStoredFont({ ...font, data });
  } catch {
    // Storage full or blocked: the font still works for this session.
  }

  return font;
}

export async function removeCustomFont(id: string): Promise<void> {
  const face = faces.get(id);
  if (face && typeof document !== "undefined") {
    document.fonts.delete(face);
  }
  faces.delete(id);
  currentFonts = currentFonts.filter((font) => font.id !== id);
  notify();

  try {
    await deleteStoredFont(id);
  } catch {
    // Nothing to clean up when storage was unavailable.
  }
}

/** Built-in id → FONT_STACKS entry, uploaded id → its registered family. */
export function resolveFontStack(
  fontId: string,
  customFonts: CustomFont[],
): string {
  const builtin = FONT_STACKS[fontId as FontId];
  if (builtin) return builtin;
  const custom = customFonts.find((font) => font.id === fontId);
  if (!custom) return FALLBACK_STACK;
  return `"${custom.family}", 'Vazir', 'Vazirmatn', sans-serif`;
}

