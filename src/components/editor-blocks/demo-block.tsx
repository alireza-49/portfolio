"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, Square, Terminal, Trash2 } from "lucide-react";
import { cn } from "cn";
import type { DemoPayload } from "@/lib/richtext";

/**
 * A sandboxed live preview. The demo is an opaque-origin iframe: it can run
 * scripts, but it cannot read the parent document, cookies or storage.
 */

const BRIDGE = `
(function () {
  var send = function (type, data) {
    try { parent.postMessage(Object.assign({ __cc: true, type: type }, data || {}), "*"); } catch (_) {}
  };
  window.addEventListener("error", function (event) {
    send("error", { message: String(event.message || "خطای ناشناخته") });
  });
  window.addEventListener("unhandledrejection", function (event) {
    send("error", { message: String(event.reason || "خطای ناشناخته") });
  });
  ["log", "info", "warn", "error"].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      var args = Array.prototype.slice.call(arguments);
      var text = args.map(function (value) {
        if (typeof value === "string") return value;
        try { return JSON.stringify(value); } catch (_) { return String(value); }
      }).join(" ");
      send("log", { level: level, text: text });
      original.apply(console, args);
    };
  });
  send("ready");
  if (window.ResizeObserver) {
    var last = 0;
    var observer = new ResizeObserver(function () {
      var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      if (Math.abs(height - last) > 4) { last = height; send("height", { height: height }); }
    });
    observer.observe(document.documentElement);
  }
})();
`;

function safeJs(js: string): string {
  return js.replace(/<\/script/gi, "<\\/script");
}

export function buildDemoDoc(payload: DemoPayload): string {
  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob: https:; media-src data: blob: https:; style-src 'unsafe-inline' https:; script-src 'unsafe-inline' https:; font-src data: https:; connect-src https:;" />
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { min-height: 80px; padding: 18px; font-family: var(--font-sans, system-ui, sans-serif); color: #264653; background: #fffdf5; }
  ${payload.css}
</style>
</head>
<body>
${payload.html}
<script>${BRIDGE}</script>
<script>${safeJs(payload.js)}</script>
</body>
</html>`;
}

type LogLine = { level: string; text: string };

export function DemoBlock({
  payload,
  autoRun = false,
  onEdit,
}: {
  payload: DemoPayload;
  autoRun?: boolean;
  onEdit?: () => void;
}) {
  const [running, setRunning] = useState(autoRun);
  const [nonce, setNonce] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);
  const [height, setHeight] = useState(280);
  const frame = useRef<HTMLIFrameElement>(null);
  const doc = useMemo(() => buildDemoDoc(payload), [payload]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data as {
        __cc?: boolean;
        type?: string;
        level?: string;
        text?: string;
        message?: string;
        height?: number;
      };
      if (!data || data.__cc !== true) return;

      if (data.type === "log" && typeof data.text === "string") {
        setLogs((current) => [
          ...current.slice(-49),
          { level: data.level ?? "log", text: data.text ?? "" },
        ]);
      }
      if (data.type === "error" && typeof data.message === "string") {
        setError(data.message);
        setShowConsole(true);
      }
      if (data.type === "height" && typeof data.height === "number") {
        setHeight(Math.max(160, Math.min(900, Math.ceil(data.height))));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const run = () => {
    setLogs([]);
    setError(null);
    setRunning(true);
    setNonce((value) => value + 1);
  };

  return (
    <div className='cc-demo' contentEditable={false}>
      <div className='cc-demo-head'>
        <span className='cc-demo-title'>
          <Terminal className='size-4' />
          {payload.title || "دموی تعاملی"}
        </span>
        <div className='flex flex-wrap items-center gap-1.5'>
          {onEdit ? (
            <button type='button' className='cc-demo-btn' onClick={onEdit}>
              ویرایش
            </button>
          ) : null}
          {running ? (
            <button
              type='button'
              className='cc-demo-btn'
              onClick={() => setRunning(false)}
            >
              <Square className='size-3.5' /> توقف
            </button>
          ) : (
            <button type='button' className='cc-demo-btn cc-demo-btn-primary' onClick={run}>
              <Play className='size-3.5' /> اجرا
            </button>
          )}
          <button
            type='button'
            className='cc-demo-btn'
            onClick={() => {
              setLogs([]);
              setError(null);
              if (running) setNonce((value) => value + 1);
              else run();
            }}
            aria-label='اجرای دوباره'
          >
            <RotateCcw className='size-3.5' />
          </button>
        </div>
      </div>

      {running ? (
        <iframe
          key={nonce}
          ref={frame}
          title={payload.title || "پیش‌نمایش دمو"}
          srcDoc={doc}
          sandbox='allow-scripts allow-forms'
          referrerPolicy='no-referrer'
          style={{ height }}
          className='cc-demo-frame'
        />
      ) : (
        <div className='cc-demo-idle'>
          پیش‌نمایش متوقف است. «اجرا» را بزنید تا کد در یک محیط ایزوله اجرا شود.
        </div>
      )}

      {error ? <p className='cc-demo-error'>{error}</p> : null}

      <div className='cc-demo-foot'>
        <button
          type='button'
          className='cc-demo-btn'
          onClick={() => setShowConsole((value) => !value)}
          aria-expanded={showConsole}
        >
          <Terminal className='size-3.5' /> کنسول
          {logs.length ? <span className='cc-demo-badge'>{logs.length}</span> : null}
        </button>
        {showConsole ? (
          <button
            type='button'
            className='cc-demo-btn'
            onClick={() => setLogs([])}
            aria-label='پاک‌کردن کنسول'
          >
            <Trash2 className='size-3.5' />
          </button>
        ) : null}
      </div>

      {showConsole ? (
        <div
          className={cn("cc-demo-console", logs.length === 0 && "text-indigo-light/60")}
          dir='ltr'
        >
          {logs.length === 0
            ? "console.log خروجی‌ای نداشته است."
            : logs.map((line, index) => (
                <p key={`${index}-${line.text}`} data-level={line.level}>
                  <span>{line.level}</span> {line.text}
                </p>
              ))}
        </div>
      ) : null}
    </div>
  );
}
