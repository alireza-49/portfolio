"use client";

import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import type { Extension } from "@codemirror/state";
import { cn } from "cn";

export const CODE_LANGUAGES = [
  { id: "plaintext", label: "متن ساده" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "jsx", label: "JSX / React" },
  { id: "python", label: "Python" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "bash", label: "Bash" },
  { id: "sql", label: "SQL" },
  { id: "markdown", label: "Markdown" },
] as const;

export type CodeLanguage = (typeof CODE_LANGUAGES)[number]["id"];

function languageExtension(language: string): Extension[] {
  switch (language) {
    case "html":
      return [html({ autoCloseTags: true })];
    case "css":
      return [css()];
    case "javascript":
      return [javascript()];
    case "typescript":
      return [javascript({ typescript: true })];
    case "jsx":
      return [javascript({ jsx: true, typescript: true })];
    case "python":
      return [python()];
    case "markdown":
      return [markdown()];
    default:
      return [];
  }
}

export function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  height = "45vh",
  readOnly = false,
  className,
  ariaLabel,
}: {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={cn("cc-code-editor", className)} dir='ltr' aria-label={ariaLabel}>
      <CodeMirror
        value={value}
        height={height}
        theme='light'
        editable={!readOnly}
        onChange={onChange}
        extensions={languageExtension(language)}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}

export function codeLanguageLabel(language: string): string {
  return CODE_LANGUAGES.find((item) => item.id === language)?.label ?? language;
}
