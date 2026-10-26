"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { DemoBlock } from "@/components/editor-blocks/demo-block";
import { NotebookBlock } from "@/components/editor-blocks/notebook-block";
import { MermaidBlock } from "@/components/editor-blocks/mermaid-block";
import { FileCard } from "@/components/editor-blocks/file-card";
import { EmbedFrame } from "@/components/editor-blocks/embed-frame";
import {
  decodePayload,
  validateDemoPayload,
  validateNotebookPayload,
  type EmbedProvider,
} from "@/lib/richtext";
import { mimeFromExtension } from "@/lib/media-url";
import type { MediaKind } from "@/lib/types";

function cleanText(value: string | null, fallback = ""): string {
  return (value ?? fallback).trim();
}

export function PostRuntime({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;
    const roots: Root[] = [];
    const hosts: HTMLElement[] = [];

    const mount = (element: Element, node: ReactNode) => {
      if (!(element instanceof HTMLElement) || element.dataset.hydrated === "true") return;
      element.dataset.hydrated = "true";
      const root = createRoot(element);
      root.render(node);
      roots.push(root);
      hosts.push(element);
    };

    for (const element of container.querySelectorAll("[data-demo]")) {
      const raw = element.getAttribute("data-demo");
      const payload = raw ? validateDemoPayload(decodePayload(raw)) : null;
      if (payload) {
        mount(element, <DemoBlock payload={payload} autoRun={element.getAttribute("data-live") !== "false"} />);
      }
    }

    for (const element of container.querySelectorAll("[data-notebook]")) {
      const raw = element.getAttribute("data-notebook");
      const payload = raw ? validateNotebookPayload(decodePayload(raw)) : null;
      if (payload) mount(element, <NotebookBlock payload={payload} />);
    }

    for (const element of container.querySelectorAll("[data-mermaid]")) {
      const rawCode = element.getAttribute("data-mermaid");
      const code = rawCode ? decodePayload<string>(rawCode) : null;
      if (typeof code === "string" && code.trim()) mount(element, <MermaidBlock code={code} />);
    }

    for (const element of container.querySelectorAll("[data-embed]")) {
      const src = element.getAttribute("data-src");
      const provider = element.getAttribute("data-embed") as EmbedProvider | null;
      if (src && (provider === "youtube" || provider === "vimeo")) {
        mount(element, <EmbedFrame provider={provider} src={src} />);
      }
    }

    for (const element of container.querySelectorAll("figure[data-file]")) {
      const anchor = element.querySelector("a");
      const href = anchor?.getAttribute("href") ?? element.getAttribute("data-href") ?? "";
      if (!href) continue;
      const name =
        cleanText(anchor?.getAttribute("download") ?? null) ||
        cleanText(anchor?.textContent ?? null).replace(/\s*—\s*دانلود$/, "") ||
        element.getAttribute("data-name") ||
        "فایل";
      const mediaKind = (element.getAttribute("data-kind") ?? "file") as MediaKind;
      if (!(element instanceof HTMLElement)) continue;
      if (element.dataset.hydrated === "true") continue;
      element.dataset.hydrated = "true";
      element.setAttribute("data-href", href);
      element.setAttribute("data-name", name);
      element.innerHTML = "";
      const root = createRoot(element);
      root.render(
        <FileCard
          name={name}
          href={href}
          mime={mimeFromExtension(name)}
          assetId={element.getAttribute("data-asset-id") ?? undefined}
          kind={mediaKind}
        />,
      );
      roots.push(root);
      hosts.push(element);
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLButtonElement>("[data-code-copy]");
      if (!button) return;
      const code = button.closest(".post-code")?.querySelector("code")?.textContent ?? "";
      if (!code) return;
      void navigator.clipboard.writeText(code).then(() => {
        const original = button.textContent;
        button.textContent = "کپی شد";
        window.setTimeout(() => { button.textContent = original ?? "کپی"; }, 1500);
      }).catch(() => {});
    };
    container.addEventListener("click", onClick);

    return () => {
      container.removeEventListener("click", onClick);
      for (const root of roots) root.unmount();
      for (const host of hosts) host.removeAttribute("data-hydrated");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
