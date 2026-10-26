"use client";

import { createContext, useContext } from "react";
import type { MediaKind } from "@/lib/types";
import type {
  DemoPayload,
  EmbedProvider,
  NotebookPayload,
} from "@/lib/richtext";

export type EditorActions = {
  openMedia: (kind?: MediaKind | "all", pos?: number) => void;
  openDemo: (payload?: DemoPayload, pos?: number) => void;
  openNotebook: (payload?: NotebookPayload, pos?: number) => void;
  openMermaid: (code?: string, pos?: number) => void;
  openEmbed: (
    provider?: EmbedProvider,
    src?: string,
    pos?: number,
  ) => void;
  openMath: (latex?: string, display?: boolean, pos?: number) => void;
  openFootnote: (note?: string, pos?: number) => void;
  openCallout: (pos?: number) => void;
  openCode: (pos?: number) => void;
  openLink: () => void;
  openFind: () => void;
};

const NOOP: EditorActions = {
  openMedia: () => {},
  openDemo: () => {},
  openNotebook: () => {},
  openMermaid: () => {},
  openEmbed: () => {},
  openMath: () => {},
  openFootnote: () => {},
  openCallout: () => {},
  openCode: () => {},
  openLink: () => {},
  openFind: () => {},
};

export const EditorActionsContext = createContext<EditorActions>(NOOP);

export function useEditorActions(): EditorActions {
  return useContext(EditorActionsContext);
}
