"use client";

import { Play, RotateCcw, Terminal } from "lucide-react";
import { cn } from "cn";
import type { NotebookPayload } from "@/lib/richtext";
import { useNotebookSession } from "./use-notebook-session";
import { renderSafeMarkdown, sanitizeDisplayHtml } from "./safe-markdown";

const STATUS_LABEL: Record<string, string> = {
  idle: "آماده",
  booting: "در حال آماده‌سازی پایتون…",
  ready: "آماده",
  running: "در حال اجرا…",
  error: "خطا در راه‌اندازی",
};

export function CellOutput({ output }: { output: { status: "ok" | "error"; text: string; html: string; stdout: string; stderr: string; message?: string } }) {
  return (
    <div className={cn("cc-nb-output", output.status === "error" && "cc-nb-output-error")} dir='ltr'>
      {output.stdout ? <pre className='cc-nb-stdout'>{output.stdout}</pre> : null}
      {output.stderr ? <pre className='cc-nb-stderr'>{output.stderr}</pre> : null}
      {output.html ? (
        <div className='cc-nb-rich' dangerouslySetInnerHTML={{ __html: sanitizeDisplayHtml(output.html) }} />
      ) : output.text && output.text !== "…" ? (
        <pre className='cc-nb-result'>{output.text}</pre>
      ) : null}
      {output.message ? <p className='cc-nb-error'>{output.message}</p> : null}
    </div>
  );
}

export function NotebookBlock({ payload }: { payload: NotebookPayload }) {
  const { status, outputs, runningId, runCell, runAll, restart } = useNotebookSession(payload);
  const codeCells = payload.cells.filter((cell) => cell.kind === "code");

  return (
    <div className='cc-notebook' dir='rtl'>
      <div className='cc-nb-head'>
        <span className='cc-nb-title'>
          <Terminal className='size-4' />
          دفترچهٔ پایتون
        </span>
        <span className='cc-nb-status' data-status={status}>{STATUS_LABEL[status] ?? status}</span>
        <div className='cc-nb-actions'>
          <button type='button' onClick={runAll} disabled={status === "booting" || status === "running" || !codeCells.length} className='cc-node-btn'>
            <Play className='size-3.5' />
            اجرای همه
          </button>
          <button type='button' onClick={restart} className='cc-node-btn' title='بازنشانی محیط'>
            <RotateCcw className='size-3.5' />
          </button>
        </div>
      </div>

      {payload.packages.length ? (
        <p className='cc-nb-packages' dir='ltr'>{payload.packages.join(" · ")}</p>
      ) : null}

      <div className='cc-nb-cells'>
        {payload.cells.map((cell) =>
          cell.kind === "markdown" ? (
            <div key={cell.id} className='cc-nb-markdown' dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(cell.source) }} />
          ) : (
            <div key={cell.id} className='cc-nb-cell'>
              <div className='cc-nb-cell-head'>
                <span>پایتون</span>
                <button type='button' onClick={() => runCell(cell)} disabled={runningId === cell.id || status === "booting"} className='cc-node-btn' aria-label='اجرای سلول'>
                  <Play className='size-3' />
                  اجرا
                </button>
              </div>
              <pre className='cc-nb-source' dir='ltr'><code>{cell.source}</code></pre>
              {outputs[cell.id] ? <CellOutput output={outputs[cell.id]} /> : null}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
