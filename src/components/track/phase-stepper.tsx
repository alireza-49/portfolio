import { CheckCircle2, CircleDashed, Clock3, PauseCircle, RefreshCw } from "lucide-react";
import { cn } from "cn";
import { faDate, faNumber } from "@/lib/fa";
import { PHASE_STATUS_META, type ProjectStep } from "@/lib/types";

const TONE = {
  teal: { border: "border-teal-craft", bar: "bg-teal-craft", text: "text-teal-craft" },
  coral: { border: "border-coral", bar: "bg-coral", text: "text-coral" },
  mustard: { border: "border-mustard-deep", bar: "bg-mustard-deep", text: "text-mustard-deep" },
  muted: { border: "border-indigo-ink/20", bar: "bg-indigo-ink/30", text: "text-indigo-light" },
  ink: { border: "border-indigo-ink", bar: "bg-indigo-ink", text: "text-indigo-ink" },
} as const;

function StepIcon({ status }: { status: ProjectStep["status"] }) {
  if (status === "done") return <CheckCircle2 className='size-5 text-teal-craft' />;
  if (status === "active") return <RefreshCw className='size-5 animate-spin text-coral' />;
  if (status === "review") return <Clock3 className='size-5 text-mustard-deep' />;
  if (status === "paused") return <PauseCircle className='size-5 text-indigo-light' />;
  return <CircleDashed className='size-5 text-indigo-light' />;
}

/** The five-stage roadmap from the tracking design, driven by real step data. */
export function PhaseStepper({ steps }: { steps: ProjectStep[] }) {
  if (steps.length === 0) {
    return (
      <div className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper-light px-4 py-8 text-center text-xs font-bold text-indigo-light'>
        تایم‌لاین این پروژه هنوز منتشر نشده است.
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
      {steps.map((step, index) => {
        const meta = PHASE_STATUS_META[step.status];
        const tone = TONE[meta.tone];
        const active = step.status === "active";
        return (
          <div
            key={step.id}
            className={cn(
              "relative flex flex-col justify-between gap-3 overflow-hidden rounded-md border-[2px] bg-paper-light p-3.5",
              active
                ? "border-coral shadow-craft"
                : "border-indigo-ink/20",
              step.status === "queued" ? "opacity-80" : "",
            )}
          >
            <span
              aria-hidden
              className={cn("absolute inset-x-0 top-0 h-1", tone.bar)}
            />
            <div className='flex flex-col gap-2 pt-1'>
              <div className='flex items-center justify-between gap-2'>
                <span className={cn("font-mono text-[0.625rem] font-black", tone.text)}>
                  گام {faNumber(index + 1)}
                </span>
                <StepIcon status={step.status} />
              </div>
              <h3 className='text-[0.8125rem] leading-snug font-black text-indigo-ink'>
                {step.title}
              </h3>
              {step.description ? (
                <p className='text-[0.6875rem] leading-relaxed font-medium text-indigo-light'>
                  {step.description}
                </p>
              ) : null}
            </div>
            <div className='flex flex-col gap-1.5 border-t border-indigo-ink/10 pt-2'>
              <div className='flex items-center justify-between text-[0.625rem] font-bold'>
                <span className={tone.text}>{meta.label}</span>
                <span className='font-mono text-indigo-light'>
                  {faNumber(step.progress)}٪
                </span>
              </div>
              <div className='h-1.5 overflow-hidden rounded-full bg-paper-shade'>
                <div
                  className={cn("h-full rounded-full", tone.bar)}
                  style={{ width: `${Math.max(0, Math.min(100, step.progress))}%` }}
                />
              </div>
              <span className='font-mono text-[0.5625rem] font-bold text-indigo-light'>
                موعد: {faDate(step.dueDate)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
