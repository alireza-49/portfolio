"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeftRight,
  Bold,
  Braces,
  Code,
  Eraser,
  Frame,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Megaphone,
  Minus,
  NotebookPen,
  Palette,
  Play,
  Plus,
  Quote,
  Redo2,
  Search,
  Sigma,
  Strikethrough,
  Superscript,
  Table2,
  Underline,
  Undo2,
  Workflow,
} from "lucide-react";
import { cn } from "cn";
import { selectToolbarState, type ToolbarState } from "../editor-toolbar-state";
import { useEditorActions } from "./editor-context";
import {
  CELL_COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  HIGHLIGHTS,
  LINE_HEIGHTS,
  TABLE_STYLES,
  TEXT_COLORS,
} from "./palettes";
import { MenuItem, MenuLabel, ToolButton, ToolDivider, ToolMenu } from "./toolbar-ui";

const BLOCKS = [
  { value: "p", label: "پاراگراف" },
  { value: "1", label: "H1" },
  { value: "2", label: "H2" },
  { value: "3", label: "H3" },
  { value: "4", label: "H4" },
];

function dirType(editor: Editor): string {
  if (editor.isActive("tableCell")) return "tableCell";
  if (editor.isActive("tableHeader")) return "tableHeader";
  if (editor.isActive("heading")) return "heading";
  if (editor.isActive("blockquote")) return "blockquote";
  if (editor.isActive("listItem")) return "listItem";
  return "paragraph";
}

function SizeControl({ editor, value }: { editor: Editor; value: string | null }) {
  const [custom, setCustom] = useState("");
  const current = value ?? "";
  const options = current && !FONT_SIZES.includes(current) ? [current, ...FONT_SIZES] : FONT_SIZES;
  const apply = (size: string) => {
    if (!size) editor.chain().focus().unsetFontSize().run();
    else editor.chain().focus().setFontSize(size).run();
  };
  return (
    <span className='inline-flex items-center gap-1 rounded-sm border border-indigo-ink/20 bg-paper px-1 py-0.5'>
      <select
        value={current}
        onChange={(event) => apply(event.target.value)}
        aria-label='اندازهٔ قلم'
        title='اندازهٔ قلم'
        className='h-6 rounded-sm bg-transparent px-0.5 text-[0.625rem] font-bold text-indigo-ink outline-none'
      >
        {options.map((size) => (
          <option key={size || "default"} value={size}>
            {size ? size.replace("px", "") : "پیش‌فرض"}
          </option>
        ))}
      </select>
      <input
        type='number'
        min={8}
        max={96}
        value={custom}
        onChange={(event) => setCustom(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          const size = Number(custom);
          if (Number.isFinite(size) && size >= 8 && size <= 96) apply(`${Math.round(size)}px`);
        }}
        placeholder='px'
        aria-label='اندازهٔ سفارشی قلم'
        title='اندازهٔ سفارشی (Enter)'
        className='h-6 w-11 rounded-sm border border-indigo-ink/15 bg-paper px-1 text-center text-[0.625rem] font-bold text-indigo-ink outline-none'
      />
    </span>
  );
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  const actions = useEditorActions();
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => selectToolbarState(instance),
  }) as ToolbarState;

  const chain = () => editor.chain().focus();
  const blockValue = state.h1 ? "1" : state.h2 ? "2" : state.h3 ? "3" : state.h4 ? "4" : "p";

  return (
    <div className='editor-toolbar flex flex-wrap items-center gap-1.5 rounded-md border-[2px] border-indigo-ink bg-paper-dim p-1.5 shadow-craft-sm'>
      <ToolButton label='واگرد' disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 className='size-3.5' />
      </ToolButton>
      <ToolButton label='ازنو' disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 className='size-3.5' />
      </ToolButton>
      <ToolDivider />

      <select
        value={blockValue}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "p") chain().setParagraph().run();
          else chain().setHeading({ level: Number(value) as 1 | 2 | 3 | 4 }).run();
        }}
        aria-label='سطح تیتر'
        title='سطح تیتر'
        className='h-7 rounded-sm border border-indigo-ink/20 bg-paper px-1.5 text-[0.625rem] font-bold text-indigo-ink'
      >
        {BLOCKS.map((block) => (
          <option key={block.value} value={block.value}>
            {block.label}
          </option>
        ))}
      </select>

      <ToolButton label='درشت' active={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold className='size-3.5' />
      </ToolButton>
      <ToolButton label='کج' active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic className='size-3.5' />
      </ToolButton>
      <ToolButton label='زیرخط' active={state.underline} onClick={() => chain().toggleUnderline().run()}>
        <Underline className='size-3.5' />
      </ToolButton>
      <ToolButton label='خط‌خورده' active={state.strike} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough className='size-3.5' />
      </ToolButton>
      <ToolButton label='کد درون‌خطی' active={state.code} onClick={() => chain().toggleCode().run()}>
        <Code className='size-3.5' />
      </ToolButton>
      <ToolDivider />

      <ToolMenu label='رنگ و قلم' icon={<Palette className='size-3.5' />}>
        <MenuLabel>رنگ متن</MenuLabel>
        <div className='flex flex-wrap gap-1 px-2 pb-1.5'>
          {TEXT_COLORS.map((swatch) => (
            <button
              key={swatch.value}
              type='button'
              title={swatch.label}
              aria-label={`رنگ متن ${swatch.label}`}
              onClick={() => chain().setColor(swatch.value).run()}
              className={cn(
                "size-4 rounded-full border border-indigo-ink/30",
                state.color === swatch.value && "ring-2 ring-coral ring-offset-1",
              )}
              style={{ backgroundColor: swatch.value }}
            />
          ))}
          <button
            type='button'
            onClick={() => chain().unsetColor().run()}
            className='rounded-sm px-1 text-[0.5625rem] font-bold text-indigo-light hover:text-coral'
          >
            پاک
          </button>
        </div>
        <MenuLabel>هایلایت</MenuLabel>
        <div className='flex flex-wrap gap-1 px-2 pb-1.5'>
          {HIGHLIGHTS.map((swatch) => (
            <button
              key={swatch.value}
              type='button'
              title={swatch.label}
              aria-label={`هایلایت ${swatch.label}`}
              onClick={() => chain().toggleHighlight({ color: swatch.value }).run()}
              className={cn(
                "size-4 rounded-full border border-indigo-ink/30",
                state.highlight === swatch.value && "ring-2 ring-coral ring-offset-1",
              )}
              style={{ backgroundColor: swatch.value }}
            />
          ))}
          <button
            type='button'
            onClick={() => chain().unsetHighlight().run()}
            className='rounded-sm px-1 text-[0.5625rem] font-bold text-indigo-light hover:text-coral'
          >
            پاک
          </button>
        </div>
        <MenuLabel>خانوادهٔ قلم</MenuLabel>
        <select
          value={state.fontFamily ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            if (value) chain().setFontFamily(value).run();
            else chain().unsetFontFamily().run();
          }}
          aria-label='خانوادهٔ قلم'
          className='mx-2 mb-1.5 w-[calc(100%-1rem)] rounded-sm border border-indigo-ink/20 bg-paper px-1.5 py-1 text-[0.625rem] font-bold text-indigo-ink'
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value || "default"} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <MenuLabel>ارتفاع خط</MenuLabel>
        <select
          value={state.lineHeight ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            if (value) chain().setLineHeight(value).run();
            else chain().unsetLineHeight().run();
          }}
          aria-label='ارتفاع خط'
          className='mx-2 mb-1.5 w-[calc(100%-1rem)] rounded-sm border border-indigo-ink/20 bg-paper px-1.5 py-1 text-[0.625rem] font-bold text-indigo-ink'
        >
          {LINE_HEIGHTS.map((height) => (
            <option key={height || "default"} value={height}>
              {height || "پیش‌فرض"}
            </option>
          ))}
        </select>
        <MenuItem onClick={() => chain().unsetAllMarks().run()}>پاک کردن رنگ‌ها</MenuItem>
      </ToolMenu>

      <SizeControl editor={editor} value={state.fontSize} />

      <ToolButton
        label='پاک کردن قالب‌بندی'
        onClick={() => chain().unsetAllMarks().clearNodes().run()}
      >
        <Eraser className='size-3.5' />
      </ToolButton>
      <ToolDivider />

      <ToolButton label='راست‌چین' active={state.alignRight} onClick={() => chain().setTextAlign("right").run()}>
        <AlignRight className='size-3.5' />
      </ToolButton>
      <ToolButton label='وسط‌چین' active={state.alignCenter} onClick={() => chain().setTextAlign("center").run()}>
        <AlignCenter className='size-3.5' />
      </ToolButton>
      <ToolButton label='چپ‌چین' active={state.alignLeft} onClick={() => chain().setTextAlign("left").run()}>
        <AlignLeft className='size-3.5' />
      </ToolButton>
      <ToolButton label='هم‌تراز' active={state.alignJustify} onClick={() => chain().setTextAlign("justify").run()}>
        <AlignJustify className='size-3.5' />
      </ToolButton>

      <ToolMenu label='جهت متن' icon={<ArrowLeftRight className='size-3.5' />}>
        <MenuItem active={state.dir === "rtl"} onClick={() => chain().updateAttributes(dirType(editor), { dir: "rtl" }).run()}>
          راست به چپ
        </MenuItem>
        <MenuItem active={state.dir === "ltr"} onClick={() => chain().updateAttributes(dirType(editor), { dir: "ltr" }).run()}>
          چپ به راست
        </MenuItem>
        <MenuItem active={!state.dir} onClick={() => chain().updateAttributes(dirType(editor), { dir: null }).run()}>
          پیش‌فرض
        </MenuItem>
      </ToolMenu>
      <ToolDivider />

      <ToolButton label='فهرست نقطه‌ای' active={state.bullet} onClick={() => chain().toggleBulletList().run()}>
        <List className='size-3.5' />
      </ToolButton>
      <ToolButton label='فهرست شماره‌دار' active={state.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered className='size-3.5' />
      </ToolButton>
      <ToolButton label='چک‌لیست' active={state.task} onClick={() => chain().toggleTaskList().run()}>
        <ListChecks className='size-3.5' />
      </ToolButton>
      <ToolButton label='نقل‌قول' active={state.quote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote className='size-3.5' />
      </ToolButton>
      <ToolButton label='بلوک کد' active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>
        <Code className='size-3.5' />
      </ToolButton>
      <ToolButton label='ویرایشگر کد' onClick={() => actions.openCode()}>
        <Braces className='size-3.5' />
      </ToolButton>
      <ToolButton label='خط جداکننده' onClick={() => chain().setHorizontalRule().run()}>
        <Minus className='size-3.5' />
      </ToolButton>
      <ToolButton label='پیوند' active={state.link} onClick={() => actions.openLink()}>
        <Link2 className='size-3.5' />
      </ToolButton>

      <ToolMenu label='جدول' icon={<Table2 className='size-3.5' />}>
        <MenuItem onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <Plus className='size-3.5' /> درج جدول ۳×۳
        </MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().addRowAfter().run()}>افزودن ردیف</MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().addColumnAfter().run()}>افزودن ستون</MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().deleteRow().run()}>حذف ردیف</MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().deleteColumn().run()}>حذف ستون</MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().mergeCells().run()}>ادغام سلول‌ها</MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().splitCell().run()}>تقسیم سلول</MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().toggleHeaderRow().run()}>ردیف سرستون</MenuItem>
        <MenuItem disabled={!state.table} onClick={() => chain().deleteTable().run()}>حذف جدول</MenuItem>
        <MenuLabel>رنگ سلول</MenuLabel>
        <div className='flex flex-wrap gap-1 px-2 pb-1.5'>
          {CELL_COLORS.map((color) => (
            <button
              key={color.value || "none"}
              type='button'
              title={color.label}
              aria-label={`رنگ سلول ${color.label}`}
              disabled={!state.table}
              onClick={() => {
                const type = editor.isActive("tableHeader") ? "tableHeader" : "tableCell";
                chain().updateAttributes(type, { backgroundColor: color.value || null }).run();
              }}
              className={cn(
                "size-4 rounded-full border border-indigo-ink/30 disabled:opacity-40",
                !color.value && "bg-paper",
              )}
              style={color.value ? { backgroundColor: color.value } : undefined}
            />
          ))}
        </div>
        <MenuLabel>سبک جدول</MenuLabel>
        {TABLE_STYLES.map((style) => (
          <MenuItem
            key={style.value || "default"}
            disabled={!state.table}
            onClick={() => chain().updateAttributes("table", { tableStyle: style.value || null }).run()}
          >
            {style.label}
          </MenuItem>
        ))}
      </ToolMenu>

      <ToolMenu label='درج بلوک' icon={<Plus className='size-3.5' />} align='end'>
        <MenuLabel>رسانه</MenuLabel>
        <MenuItem label='تصویر' onClick={() => actions.openMedia("image")}>
          <ImagePlus className='size-3.5' /> تصویر
        </MenuItem>
        <MenuItem label='ویدیو' onClick={() => actions.openMedia("video")}>
          <Play className='size-3.5' /> ویدیو
        </MenuItem>
        <MenuItem label='صدا' onClick={() => actions.openMedia("audio")}>
          <Play className='size-3.5' /> صدا
        </MenuItem>
        <MenuItem label='فایل' onClick={() => actions.openMedia("file")}>
          <Plus className='size-3.5' /> فایل
        </MenuItem>
        <MenuItem label='جاسازی یوتیوب/ویمئو' onClick={() => actions.openEmbed()}>
          <Frame className='size-3.5' /> جاسازی یوتیوب/ویمئو
        </MenuItem>
        <MenuLabel>تعاملی</MenuLabel>
        <MenuItem label='دموی HTML/CSS/JS' onClick={() => actions.openDemo()}>
          <Play className='size-3.5' /> دموی HTML/CSS/JS
        </MenuItem>
        <MenuItem label='نوت‌بوک پایتون' onClick={() => actions.openNotebook()}>
          <NotebookPen className='size-3.5' /> نوت‌بوک پایتون
        </MenuItem>
        <MenuItem label='نمودار Mermaid' onClick={() => actions.openMermaid()}>
          <Workflow className='size-3.5' /> نمودار Mermaid
        </MenuItem>
        <MenuLabel>محتوایی</MenuLabel>
        <MenuItem label='کالاوت' onClick={() => actions.openCallout()}>
          <Megaphone className='size-3.5' /> کالاوت
        </MenuItem>
        <MenuItem label='پانویس' onClick={() => actions.openFootnote()}>
          <Superscript className='size-3.5' /> پانویس
        </MenuItem>
        <MenuItem onClick={() => actions.openMath(undefined, false)}>
          <Sigma className='size-3.5' /> فرمول درون‌خطی
        </MenuItem>
        <MenuItem onClick={() => actions.openMath(undefined, true)}>
          <Sigma className='size-3.5' /> فرمول نمایشی
        </MenuItem>
      </ToolMenu>

      <ToolButton label='جستجو و جایگزینی' onClick={() => actions.openFind()}>
        <Search className='size-3.5' />
      </ToolButton>
    </div>
  );
}
