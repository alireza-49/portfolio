"use client";

import { Panel, PanelHeading } from "@/components/admin/ui";
import type { ProjectInput } from "@/lib/types";
import { ProjectBasics } from "./project-basics";
import { ProjectSettings } from "./project-settings";
import { ProjectStepsEditor } from "./project-steps-editor";
import { ProjectUpdatesEditor } from "./project-updates-editor";

export function ProjectEditorPanels({
  draft,
  patch,
}: {
  draft: ProjectInput;
  patch: (values: Partial<ProjectInput>) => void;
}) {
  return (
    <>
      <Panel>
        <PanelHeading
          eyebrow='01 / IDENTITY'
          title='مشخصات پروژه و کارفرما'
          description='شناسهٔ پروژه کد رهگیری عمومی است؛ تغییر آن لینک قبلی کارفرما را از کار می‌اندازد.'
        />
        <ProjectBasics draft={draft} patch={patch} idPrefix='edit' />
      </Panel>

      <Panel>
        <PanelHeading
          eyebrow='02 / ROADMAP'
          title='ویرایشگر گام‌های اجرایی و تایم‌لاین'
          description='وضعیت هر گام، درصد پیشرفت و موعد آن همان چیزی است که کارفرما در صفحهٔ رهگیری می‌بیند.'
        />
        <ProjectStepsEditor
          steps={draft.steps}
          onChange={(steps) => patch({ steps })}
          onApplyAverage={(progress) => patch({ progress })}
        />
      </Panel>

      <Panel>
        <PanelHeading
          eyebrow='03 / LEDGER'
          title='صورت‌حساب، اقساط و لینک‌ها'
          description='نمایش مالی برای کارفرما اختیاری است و پیش‌فرض آن خاموش است.'
        />
        <ProjectSettings draft={draft} patch={patch} />
      </Panel>

      <Panel>
        <PanelHeading
          eyebrow='04 / UPDATES'
          title='لاگ مهندسی کارگاه'
          description='به‌روزرسانی‌ها در صفحهٔ عمومی زیر «لاگ مهندسی» مرتب نمایش داده می‌شوند.'
        />
        <ProjectUpdatesEditor
          updates={draft.updates}
          onChange={(updates) => patch({ updates })}
        />
      </Panel>
    </>
  );
}
