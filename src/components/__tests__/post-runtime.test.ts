// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, createElement, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { PostRuntime } from "@/components/blog/post-runtime";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const HTML =
  '<figure data-file data-kind="file"><a href="/files/report.pdf">report.pdf</a></figure>';
const UNMOUNT_WARNING = /Attempted to synchronously unmount a root/;
const SECOND_ROOT_WARNING = /already been passed to createRoot\(\) before/;

const mounted: { root?: Root; container: HTMLElement }[] = [];

afterEach(async () => {
  for (const { root, container } of mounted.splice(0)) {
    await act(async () => {
      root?.unmount();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    container.remove();
  }
  vi.restoreAllMocks();
});

function setup(errors: string[]) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  mounted.push({ root, container });
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  });
  return { container, root };
}

describe("PostRuntime islands", () => {
  it("survives the StrictMode remount without a commit-time unmount", async () => {
    const errors: string[] = [];
    const { container, root } = setup(errors);

    await act(async () => {
      root.render(createElement(StrictMode, null, createElement(PostRuntime, { html: HTML })));
    });

    const figure = container.querySelector("figure")!;
    expect(figure.querySelector("a[download]")?.getAttribute("href")).toBe("/files/report.pdf");
    // The simulated unmount tears nothing down, so the second mount reuses its root.
    expect(errors.filter((e) => UNMOUNT_WARNING.test(e) || SECOND_ROOT_WARNING.test(e))).toEqual([]);
  });

  it("unmounts its islands after the commit, leaving no root behind", async () => {
    const errors: string[] = [];
    const { container, root } = setup(errors);

    await act(async () => {
      root.render(createElement(PostRuntime, { html: HTML }));
    });
    const figure = container.querySelector("figure")!;
    expect(figure.textContent).toContain("report.pdf");

    await act(async () => {
      root.unmount();
    });

    expect(figure.innerHTML).toBe("");
    expect(figure.hasAttribute("data-hydrated")).toBe(false);
    expect(errors.filter((e) => UNMOUNT_WARNING.test(e))).toEqual([]);
  });
});
