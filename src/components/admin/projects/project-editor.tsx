"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  LoaderCircle,
  Save,
} from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  PageHeader,
  StatusPill,
} from "@/components/admin/ui";
import { faDate, faNumber } from "@/lib/fa";
import {
  PROJECT_STATUS_META,
  type Project,
  type ProjectInput,
  type ProjectTask,
} from "@/lib/types";
import { updateProjectAction } from "@/app/admin/(console)/projects/actions";
import { projectToDraft } from "./draft";
import { ProjectEditorPanels } from "./project-editor-panels";

export function ProjectEditor({
  project,
  tasks,
  now,
}: {
  project: Project;
  tasks: ProjectTask[];
  now: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProjectInput>(() =>
    projectToDraft(project),
  );
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const patch = (values: Partial<ProjectInput>) => {
    setDraft((current) => ({ ...current, ...values }));
    setDirty(true);
    setNotice(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await updateProjectAction(project.id, draft);
      setNotice({ ok: result.ok, message: result.message });
      if (result.ok) {
        setDirty(false);
        router.refresh();
      }
    });
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const statusMeta = PROJECT_STATUS_META[draft.status];

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow={`EDIT PROGRESS // ${project.code}`}
        title={project.title}
        description={
          draft.summary ||
          "پروژه بدون خلاصه؛ متن معرفی را در بخش مشخصات وارد کنید."
        }
        actions={
          <>
            <Link href='/admin/projects' className={BTN_SECONDARY}>
              <ArrowRight className='size-3.5' />
              <span>فهرست پروژه‌ها</span>
            </Link>
            {project.published ? (
              <Link
                href={`/track/${project.code}`}
                target='_blank'
                rel='noopener noreferrer'
                className={BTN_SECONDARY}
              >
                <ExternalLink className='size-3.5' />
                <span>صفحهٔ رهگیری</span>
              </Link>
            ) : null}
            <button
              type='button'
              onClick={save}
              disabled={pending || !dirty}
              className={BTN_PRIMARY}
            >
              {pending ? (
                <LoaderCircle className='size-3.5 animate-spin' />
              ) : (
                <Save className='size-3.5' />
              )}
              <span>
                {pending
                  ? "در حال ذخیره…"
                  : dirty
                    ? "ذخیرهٔ تغییرات"
                    : "ذخیره‌شده"}
              </span>
            </button>
          </>
        }
      />

      <div className='flex flex-wrap items-center gap-2 rounded-sm border-[2px] border-indigo-ink bg-paper-dim px-3 py-2'>
        <span className='rounded-sm border border-indigo-ink/30 bg-paper px-2 py-0.5 font-mono text-[11px] font-black text-indigo-ink'>
          {draft.code}
        </span>
        <StatusPill tone={statusMeta.tone}>{statusMeta.label}</StatusPill>
        <span className='font-mono text-[11px] font-bold text-indigo-light'>
          پیشرفت {faNumber(draft.progress)}٪
        </span>
        <span className='text-[11px] font-bold text-indigo-light'>
          شروع: {faDate(draft.startDate)} • موعد: {faDate(draft.dueDate)}
        </span>
        <span className='ms-auto text-[11px] font-bold text-indigo-light'>
          {draft.published ? "منتشرشده در صفحهٔ عمومی" : "پیش‌نویس / منتشرنشده"}
        </span>
      </div>

      {notice ? (
        <p
          role='status'
          aria-live='polite'
          className={
            notice.ok
              ? "rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2 text-xs font-bold text-teal-craft"
              : "rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark"
          }
        >
          {notice.message}
        </p>
      ) : null}

      <ProjectEditorPanels
        draft={draft}
        patch={patch}
        projectId={project.id}
        tasks={tasks}
        now={now}
      />

      <div className='sticky bottom-2 z-10 flex flex-wrap items-center justify-between gap-2 rounded-md border-[2px] border-indigo-ink bg-paper-light px-3 py-2 shadow-craft'>
        <span className='text-[11px] font-bold text-indigo-light'>
          {dirty
            ? "تغییرات ذخیره‌نشده دارید؛ پیش از خروج ذخیره کنید."
            : `آخرین ذخیره: ${faDate(project.updatedAt)}`}
        </span>
        <button
          type='button'
          onClick={save}
          disabled={pending || !dirty}
          className={BTN_PRIMARY}
        >
          <Save className='size-3.5' />
          <span>{pending ? "در حال ذخیره…" : "ذخیرهٔ تغییرات"}</span>
        </button>
      </div>
    </div>
  );
}
