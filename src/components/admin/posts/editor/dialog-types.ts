import type { MediaKind } from "@/lib/types";
import type { DemoPayload, EmbedProvider, NotebookPayload } from "@/lib/richtext";

export type EditorDialog =
  | { kind: "media"; mediaKind: MediaKind | "all"; pos?: number }
  | { kind: "demo"; payload?: DemoPayload; pos?: number }
  | { kind: "notebook"; payload?: NotebookPayload; pos?: number }
  | { kind: "mermaid"; code?: string; pos?: number }
  | { kind: "embed"; provider?: EmbedProvider; src?: string; pos?: number }
  | { kind: "math"; latex?: string; display?: boolean; pos?: number }
  | { kind: "footnote"; note?: string; pos?: number }
  | { kind: "code"; pos?: number }
  | { kind: "link" }
  | { kind: "find" }
  | null;
