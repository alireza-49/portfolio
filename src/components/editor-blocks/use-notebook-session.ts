"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NotebookCell, NotebookPayload } from "@/lib/richtext";
import { usePythonRuntime } from "@/components/editor-blocks/python-runtime";

export type CellOutput = {
  status: "ok" | "error";
  text: string;
  html: string;
  stdout: string;
  stderr: string;
  message?: string;
};

export function useNotebookSession(payload: NotebookPayload) {
  const { runtime, status } = usePythonRuntime();
  const [outputs, setOutputs] = useState<Record<string, CellOutput>>({});
  const [runningId, setRunningId] = useState<string | null>(null);
  const installed = useRef("");

  useEffect(() => {
    if (status === "idle") installed.current = "";
  }, [status]);

  const ensurePackages = useCallback(async () => {
    const signature = payload.packages.join("|");
    if (!signature || installed.current === signature) return;
    await runtime.install(payload.packages);
    installed.current = signature;
  }, [payload.packages, runtime]);

  const runCell = useCallback(
    async (cell: NotebookCell) => {
      if (cell.kind !== "code" || runningId) return;
      setRunningId(cell.id);
      setOutputs((current) => ({
        ...current,
        [cell.id]: { status: "ok", text: "…", html: "", stdout: "", stderr: "" },
      }));
      try {
        await ensurePackages();
        const result = await runtime.run(cell.source);
        setOutputs((current) => ({
          ...current,
          [cell.id]: result.ok
            ? { status: "ok", text: result.text, html: result.html, stdout: result.stdout, stderr: result.stderr }
            : {
                status: "error",
                text: "",
                html: "",
                stdout: "",
                stderr: result.traceback ?? "",
                message: result.message,
              },
        }));
      } catch (error) {
        setOutputs((current) => ({
          ...current,
          [cell.id]: {
            status: "error",
            text: "",
            html: "",
            stdout: "",
            stderr: "",
            message: error instanceof Error ? error.message : "اجرای سلول ناموفق بود.",
          },
        }));
      } finally {
        setRunningId(null);
      }
    },
    [ensurePackages, runningId, runtime],
  );

  const runAll = useCallback(async () => {
    for (const cell of payload.cells) {
      if (cell.kind === "code") await runCell(cell);
    }
  }, [payload.cells, runCell]);

  const restart = useCallback(() => {
    runtime.restart();
    installed.current = "";
    setOutputs({});
  }, [runtime]);

  return { runtime, status, outputs, runningId, runCell, runAll, restart };
}
