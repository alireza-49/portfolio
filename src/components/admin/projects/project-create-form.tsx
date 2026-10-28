"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Plus, Save } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  PageHeader,
  Panel,
  PanelHeading,
} from "@/components/admin/ui";
import type { ProjectInput } from "@/lib/types";
import { createProjectAction } from "@/app/admin/(console)/projects/actions";
import { EMPTY_PROJECT } from "./draft";
import { ProjectBasics } from "./project-basics";
import { ProjectStepsEditor } from "./project-steps-editor";
import { ProjectUpdatesEditor } from "./project-updates-editor";
import { ProjectSettings } from "./project-settings";

export function ProjectCreateForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<ProjectInput>(EMPTY_PROJECT);
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const patch = (values: Partial<ProjectInput>) =>
    setDraft((current) => ({ ...current, ...values }));

  const submit = () => {
    setNotice(null);
    startTransition(async () => {
      const result = await createProjectAction(draft);
      if (result.ok && result.id) {
        router.push(`/admin/projects/${result.id}`);
        return;
      }
      setNotice({ ok: result.ok, message: result.message });
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='NEW WORKSHOP ORDER'
        title='ثبت پروژهٔ تازه'
        description='شناسهٔ پروژه همان کد رهگیری عمومی است؛ کارفرما با آن وارد صفحهٔ پیشرفت می‌شود.'
        actions={
          <>
            <Link href='/admin/projects' className={BTN_SECONDARY}>
              <ArrowRight className='size-3.5' />
              <span>بازگشت به فهرست</span>
            </Link>
            <button
              type='button'
              onClick={submit}
              disabled={pending}
              className={BTN_PRIMARY}
            >
              {pending ? (
                <LoaderCircle className='size-3.5 animate-spin' />
              ) : (
                <Save className='size-3.5' />
              )}
              <span>{pending ? "در حال ثبت…" : "ثبت پروژه"}</span>
            </button>
          </>
        }
      />

      {notice ? (
        <p
          role='alert'
          className={
            notice.ok
              ? "rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2 text-xs font-bold text-teal-craft"
              : "rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark"
          }
        >
          {notice.message}
        </p>
      ) : null}

      <Panel>
        <PanelHeading
          eyebrow='01 / IDENTITY'
          title='مشخصات پروژه و کارفرما'
          description='عنوان و شناسهٔ پروژه در فهرست کنسول و صفحهٔ رهگیری نمایش داده می‌شوند.'
        />
        <ProjectBasics draft={draft} patch={patch} idPrefix='create' />
      </Panel>

      <Panel>
        <PanelHeading
          eyebrow='02 / ROADMAP'
          title='گام‌های اجرایی'
          description='اختیاری؛ می‌توانید بعد از ثبت پروژه هم تایم‌لاین را کامل کنید.'
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
          title='حسابداری و لینک‌های پروژه'
          description='مبالغ به‌صورت ریال/تومان ذخیره می‌شوند و فقط با کلید نمایش عمومی به کارفرما نشان داده می‌شوند.'
        />
        <ProjectSettings draft={draft} patch={patch} />
      </Panel>

      <Panel>
        <PanelHeading
          eyebrow='04 / UPDATES'
          title='لاگ مهندسی کارگاه'
          description='اختیاری؛ هر ردیف در صفحهٔ رهگیری عمومی زیر لاگ مهندسی دیده می‌شود.'
        />
        <ProjectUpdatesEditor
          updates={draft.updates}
          onChange={(updates) => patch({ updates })}
        />
      </Panel>

      <div className='sticky bottom-2 z-10 flex flex-wrap items-center justify-between gap-2 rounded-md border-[2px] border-indigo-ink bg-paper-light px-3 py-2 shadow-craft'>
        <span className='text-[0.6875rem] font-bold text-indigo-light'>
          همهٔ بخش‌ها در یک درخواست ذخیره می‌شوند.
        </span>
        <button
          type='button'
          onClick={submit}
          disabled={pending}
          className={BTN_PRIMARY}
        >
          <Plus className='size-3.5' />
          <span>{pending ? "در حال ثبت…" : "ثبت پروژه"}</span>
        </button>
      </div>
    </div>
  );
}
