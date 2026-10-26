"use client";

import { useEffect, useState } from "react";

export const PYODIDE_DEFAULT_INDEX =
  process.env.NEXT_PUBLIC_PYODIDE_INDEX_URL || "https://cdn.jsdelivr.net/pyodide/v0.29.5/full/";

export type PythonStatus = "idle" | "booting" | "ready" | "running" | "error";

export type PythonRunResult =
  | { ok: true; text: string; html: string; stdout: string; stderr: string }
  | { ok: false; message: string; traceback?: string };

type PendingRun = {
  resolve: (result: PythonRunResult) => void;
  stdout: string;
  stderr: string;
  timer: number;
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `run-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

class PythonRuntime {
  private frame: HTMLIFrameElement | null = null;
  private readyPromise: Promise<void> | null = null;
  private rejectReady: ((error: Error) => void) | null = null;
  private readyResolve: (() => void) | null = null;
  private runs = new Map<string, PendingRun>();
  private activeRun: string | null = null;
  private listeners = new Set<(status: PythonStatus) => void>();
  private _status: PythonStatus = "idle";
  private indexUrl: string;
  private frameId: string;

  constructor(indexUrl: string) {
    this.indexUrl = indexUrl;
    this.frameId = newId();
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.onMessage);
    }
  }

  get status(): PythonStatus {
    return this._status;
  }

  subscribe(listener: (status: PythonStatus) => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private setStatus(status: PythonStatus) {
    this._status = status;
    for (const listener of this.listeners) listener(status);
  }

  private onMessage = (event: MessageEvent) => {
    const data = event.data as {
      __cc?: boolean;
      frameId?: string;
      type?: string;
      id?: string;
      text?: string;
      html?: string;
      message?: string;
      traceback?: string;
    };
    if (!data || data.__cc !== true || data.frameId !== this.frameId) return;

    if (data.type === "boot") {
      this.setStatus("booting");
      return;
    }
    if (data.type === "ready") {
      this.readyResolve?.();
      this.readyResolve = null;
      this.rejectReady = null;
      this.setStatus("ready");
      return;
    }
    if (data.type === "fatal") {
      this.rejectReady?.(new Error(data.message || "Pyodide failed to load"));
      this.readyResolve = null;
      this.rejectReady = null;
      this.setStatus("error");
      return;
    }
    if (data.type === "stdout" && this.activeRun) {
      const run = this.runs.get(this.activeRun);
      if (run) run.stdout += data.text ?? "";
      return;
    }
    if (data.type === "stderr" && this.activeRun) {
      const run = this.runs.get(this.activeRun);
      if (run) run.stderr += data.text ?? "";
      return;
    }
    if (data.type === "running") {
      this.setStatus("running");
      return;
    }
    if (data.type === "result" && data.id) {
      const run = this.runs.get(data.id);
      if (!run) return;
      window.clearTimeout(run.timer);
      this.runs.delete(data.id);
      this.activeRun = null;
      this.setStatus("ready");
      run.resolve({
        ok: true,
        text: data.text ?? "",
        html: data.html ?? "",
        stdout: run.stdout,
        stderr: run.stderr,
      });
      return;
    }
    if (data.type === "error" && data.id) {
      const run = this.runs.get(data.id);
      if (!run) return;
      window.clearTimeout(run.timer);
      this.runs.delete(data.id);
      this.activeRun = null;
      this.setStatus("ready");
      run.resolve({
        ok: false,
        message: data.message || "خطای اجرا",
        traceback: data.traceback,
      });
    }
  };

  private createFrame() {
    const frame = document.createElement("iframe");
    frame.title = "محیط اجرای پایتون";
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.cssText = "position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;";
    frame.src = `/embeds/pyodide-runtime.html?index=${encodeURIComponent(this.indexUrl)}&frame=${encodeURIComponent(this.frameId)}`;
    document.body.appendChild(frame);
    this.frame = frame;
  }

  private ensure(): Promise<void> {
    if (typeof window === "undefined") return Promise.reject(new Error("Python only runs in the browser."));
    if (this._status === "ready" || this._status === "running") return Promise.resolve();
    if (this.readyPromise) return this.readyPromise;

    this.createFrame();
    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.readyResolve = resolve;
      this.rejectReady = reject;
      window.setTimeout(() => {
        if (this.readyResolve) {
          this.readyResolve = null;
          this.rejectReady = null;
          this.setStatus("error");
          reject(new Error("زمان راه‌اندازی Pyodide به پایان رسید."));
        }
      }, 120_000);
    });
    this.readyPromise.catch(() => {
      this.readyPromise = null;
    });
    return this.readyPromise;
  }

  async install(packages: string[]): Promise<void> {
    if (!packages.length) return;
    await this.ensure();
    await new Promise<void>((resolve, reject) => {
      const id = newId();
      const timer = window.setTimeout(() => {
        reject(new Error("نصب بستهٔ پایتون زمان‌بر شد."));
      }, 120_000);
      const listener = (event: MessageEvent) => {
        const data = event.data as { __cc?: boolean; frameId?: string; type?: string; id?: string; message?: string };
        if (!data || data.__cc !== true || data.frameId !== this.frameId || data.id !== id) return;
        if (data.type === "installed") {
          window.clearTimeout(timer);
          window.removeEventListener("message", listener);
          resolve();
        }
        if (data.type === "install-error") {
          window.clearTimeout(timer);
          window.removeEventListener("message", listener);
          reject(new Error(data.message || "نصب بسته ناموفق بود."));
        }
      };
      window.addEventListener("message", listener);
      this.frame?.contentWindow?.postMessage({ __cc: true, type: "install", id, packages }, "*");
    });
  }

  async run(code: string): Promise<PythonRunResult> {
    try {
      await this.ensure();
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "راه‌اندازی پایتون ناموفق بود." };
    }
    return new Promise<PythonRunResult>((resolve) => {
      const id = newId();
      this.activeRun = id;
      const timer = window.setTimeout(() => {
        const run = this.runs.get(id);
        if (!run) return;
        this.runs.delete(id);
        this.restart();
        resolve({ ok: false, message: "اجرا بیش از ۹۰ ثانیه طول کشید و متوقف شد." });
      }, 90_000);
      this.runs.set(id, { resolve, stdout: "", stderr: "", timer });
      this.setStatus("running");
      this.frame?.contentWindow?.postMessage({ __cc: true, type: "run", id, code }, "*");
    });
  }

  restart() {
    for (const run of this.runs.values()) {
      window.clearTimeout(run.timer);
      run.resolve({ ok: false, message: "محیط پایتون بازنشانی شد." });
    }
    this.runs.clear();
    this.activeRun = null;
    this.frame?.remove();
    this.frame = null;
    this.readyPromise = null;
    this.readyResolve = null;
    this.rejectReady = null;
    this.setStatus("idle");
  }

  dispose() {
    this.restart();
    this.listeners.clear();
    if (typeof window !== "undefined") window.removeEventListener("message", this.onMessage);
  }
}

let singleton: PythonRuntime | null = null;

export function getPythonRuntime(indexUrl = PYODIDE_DEFAULT_INDEX): PythonRuntime {
  if (!singleton) singleton = new PythonRuntime(indexUrl);
  return singleton;
}

export function usePythonRuntime() {
  const runtime = getPythonRuntime();
  const [status, setStatus] = useState<PythonStatus>(runtime.status);
  useEffect(() => runtime.subscribe(setStatus), [runtime]);
  return { runtime, status };
}
