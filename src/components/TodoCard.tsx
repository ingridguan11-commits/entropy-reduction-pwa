"use client";

import { Todo } from "@/lib/types";
import { useAppState } from "@/context/AppState";

type TodoCardProps = {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
  showMission?: boolean;
};

export default function TodoCard({ todo, onEdit, showMission = true }: TodoCardProps) {
  const { data, toggleTodo, deleteTodo } = useAppState();
  const mission = data.missions.find((item) => item.id === todo.linkedMissionId);
  const overdue = !todo.completed && todo.dueDate < new Date().toISOString().slice(0, 10);

  return (
    <article className={`soft-card p-4 transition ${todo.completed ? "fade-done" : ""}`}>
      <div className="flex items-start gap-3">
        <button
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-black ${
            todo.completed
              ? "border-[var(--sage)] bg-[var(--sage)] text-white"
              : "border-[var(--line)] bg-white/60 text-[var(--muted)]"
          }`}
          onClick={() => toggleTodo(todo.id)}
          aria-label={todo.completed ? "标记未完成" : "完成待办"}
        >
          {todo.completed ? "✓" : ""}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-black">{todo.title}</h3>
            {todo.priority === "high" ? (
              <span className="rounded-full bg-[rgba(216,194,197,0.55)] px-2 py-0.5 text-[10px] font-black text-[var(--rose-dark)]">
                高优先
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-bold muted">
            {todo.category} · {todo.dueDate} {todo.dueTime}
            {overdue ? " · 已逾期" : ""}
          </p>
          {showMission && mission ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <p className="rounded-full bg-white/50 px-3 py-1 text-xs font-bold text-[var(--mist-dark)]">
                关联主线：{mission.title}
              </p>
              <p className="rounded-full bg-[rgba(183,197,173,0.38)] px-3 py-1 text-xs font-bold text-[var(--sage-dark)]">
                影响值 +{todo.missionImpact}
              </p>
            </div>
          ) : null}
          {todo.note ? <p className="mt-2 text-sm leading-5 muted">{todo.note}</p> : null}
        </div>
      </div>
      <div className="mt-3 flex gap-2 pl-11">
        {onEdit ? (
          <button className="btn btn-soft flex-1 text-sm" onClick={() => onEdit(todo)}>
            编辑
          </button>
        ) : null}
        <button className="btn btn-soft flex-1 text-sm" onClick={() => deleteTodo(todo.id)}>
          删除
        </button>
      </div>
    </article>
  );
}
