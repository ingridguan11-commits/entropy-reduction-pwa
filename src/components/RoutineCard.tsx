"use client";

import { useAppState } from "@/context/AppState";
import { diffDays, todayKey } from "@/lib/dates";
import { Routine } from "@/lib/types";

type RoutineCardProps = {
  routine: Routine;
  onEdit?: (routine: Routine) => void;
};

export default function RoutineCard({ routine, onEdit }: RoutineCardProps) {
  const { completeRoutine, deleteRoutine } = useAppState();
  const overdueDays = Math.max(0, diffDays(todayKey(), routine.nextDueAt));

  return (
    <article className={`soft-card p-4 transition ${routine.completedToday ? "fade-done" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-black">{routine.title}</h3>
            {routine.priority === "high" ? (
              <span className="rounded-full bg-[rgba(216,194,197,0.55)] px-2 py-0.5 text-[10px] font-black text-[var(--rose-dark)]">
                高优先
              </span>
            ) : null}
            {routine.linkedBranch === "exercise" ? (
              <span className="rounded-full bg-[rgba(170,188,166,0.35)] px-2 py-0.5 text-[10px] font-black text-[var(--sage-dark)]">
                关联运动支线
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-bold muted">
            每 {routine.intervalDays} 天 · {routine.reminderTime} 提醒 · 下次 {routine.nextDueAt}
          </p>
          {overdueDays > 0 && !routine.completedToday ? (
            <p className="mt-2 rounded-full bg-[rgba(216,194,197,0.45)] px-3 py-1 text-xs font-black text-[var(--rose-dark)]">
              逾期 {overdueDays} 天，混乱正在扩张
            </p>
          ) : null}
          <p className="mt-2 text-sm leading-5 muted">{routine.note || "这是一个小任务，但它正在影响系统稳定性。"}</p>
        </div>
        <button
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-black ${
            routine.completedToday ? "bg-[var(--sage)] text-white" : "bg-white/65 text-[var(--muted)]"
          }`}
          onClick={() => completeRoutine(routine.id)}
          disabled={routine.completedToday}
          aria-label="完成周期任务"
        >
          ✓
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        {onEdit ? (
          <button className="btn btn-soft flex-1 text-sm" onClick={() => onEdit(routine)}>
            编辑
          </button>
        ) : null}
        <button className="btn btn-soft flex-1 text-sm" onClick={() => deleteRoutine(routine.id)}>
          删除
        </button>
      </div>
    </article>
  );
}
