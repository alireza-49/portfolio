"use client";

import { useEffect, useId, useState } from "react";

let mermaidPromise: Promise<typeof import("mermaid")> | null = null;

async function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((module) => {
      module.default.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        fontFamily: "Vazirmatn, sans-serif",
      });
      return module;
    });
  }
  return mermaidPromise;
}

export function MermaidBlock({ code }: { code: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setSvg("");
      setError(null);
      if (!code.trim()) return;
      try {
        const { default: mermaid } = await loadMermaid();
        const result = await mermaid.render(`mermaid-${id}`, code);
        if (!cancelled) setSvg(result.svg);
      } catch (reason: unknown) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "نمودار نامعتبر است.");
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [code, id]);

  if (error) {
    return <p className='cc-mermaid-error' dir='ltr'>{error}</p>;
  }
  if (!svg) {
    return <pre className='cc-mermaid-code' dir='ltr'>{code || "کدی وارد نشده است."}</pre>;
  }
  return (
    <div
      className='cc-mermaid-svg'
      dir='ltr'
      // mermaid with securityLevel:"strict" sanitizes labels and disables scripts.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
