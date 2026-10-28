"use client";

import { Calculator, Plus } from "lucide-react";
import { BTN_SECONDARY } from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import type { ProjectStep } from "@/lib/types";
import { ProjectStepCard } from "./project-step-card";

function newStep(index: number): ProjectStep {
  return {
    id: `step-${Date.now().toString(36)}-${index}`,
    title: `گام ${index + 1}`,
    description: "",
    status: "queued",
    progress: 0,
    dueDate: null,
  };
}

export function ProjectStepsEditor({
  steps,
  onChange,
  onApplyAverage,
}: {
  steps: ProjectStep[];
  onChange: (steps: ProjectStep[]) => void;
  onApplyAverage: (average: number) => void;
}) {
  const average =
    steps.length > 0
      ? Math.round(
          steps.reduce((total, step) => total + step.progress, 0) / steps.length,
        )
      : 0;

  const update = (index: number, values: Partial<ProjectStep>) => {
    onChange(
      steps.map((step, position) =>
        position === index ? { ...step, ...values } : step,
      ),
    );
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className='flex flex-col gap-3 p-4 sm:p-5'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold text-indigo-light'>
          <span className='rounded-sm border border-indigo-ink/25 bg-paper-dim px-2 py-0.5 font-mono'>
            {faNumber(steps.length)} گام
          </span>
          <span className='rounded-sm border border-indigo-ink/25 bg-paper-dim px-2 py-0.5'>
            میانگین پیشرفت:{" "}
            <strong className='font-mono text-indigo-ink'>
              {faNumber(average)}٪
            </strong>
          </span>
        </div>
        <div className='flex flex-wrap gap-1.5'>
          <button
            type='button'
            onClick={() => onApplyAverage(average)}
            disabled={steps.length === 0}
            className={BTN_SECONDARY}
          >
            <Calculator className='size-3.5' />
            اعمال میانگین روی پیشرفت کلی
          </button>
          <button
            type='button'
            onClick={() => onChange([...steps, newStep(steps.length)])}
            className={BTN_SECONDARY}
          >
            <Plus className='size-3.5' />
            افزودن گام
          </button>
        </div>
      </div>

      {steps.length === 0 ? (
        <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/25 bg-paper px-3 py-6 text-center text-xs font-bold text-indigo-light'>
          هنوز گامی تعریف نشده است؛ با «افزودن گام» تایم‌لاین پروژه را بسازید.
        </p>
      ) : null}

      <div className='flex flex-col gap-2.5'>
        {steps.map((step, index) => (
          <ProjectStepCard
            key={step.id}
            step={step}
            index={index}
            total={steps.length}
            onUpdate={(values) => update(index, values)}
            onMove={(direction) => move(index, direction)}
            onRemove={() =>
              onChange(steps.filter((_, position) => position !== index))
            }
          />
        ))}
      </div>
    </div>
  );
}
