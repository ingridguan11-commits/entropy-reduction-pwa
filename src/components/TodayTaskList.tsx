"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/context/AppState";
import EmptyState from "./EmptyState";
import RotatingLine from "./RotatingLine";
import TodoCard from "./TodoCard";
import RoutineCard from "./RoutineCard";

const taskSlogans = [
  "先开始，先犯错",
  "留在港口的小船最安全，但亲爱的，这不是造船的目的",
  "先做五分钟",
  "我觉得我能去任何地方，做任何事，成为任何人"
];

export default function TodayTaskList() {
  const { entropy, reorderTodos } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const sortedTodos = useMemo(
    () =>
      [...entropy.todayTodos].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return `${a.dueDate} ${a.dueTime}`.localeCompare(`${b.dueDate} ${b.dueTime}`);
      }),
    [entropy.todayTodos]
  );
  const visibleTodos = expanded ? sortedTodos : sortedTodos.slice(0, 3);
  const hiddenCount = Math.max(0, sortedTodos.length - 3);
  const hasTodos = sortedTodos.length > 0;
  const hasRoutines = entropy.dueRoutines.length > 0;

  const moveTodo = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const from = sortedTodos.findIndex((todo) => todo.id === draggedId);
    const to = sortedTodos.findIndex((todo) => todo.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...sortedTodos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    reorderTodos(next.map((todo) => todo.id));
  };

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">今日任务</h2>
          <RotatingLine lines={taskSlogans} className="mt-1 text-sm muted" />
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black">{sortedTodos.length}</span>
      </div>
      <div className="mt-4 space-y-3">
        {visibleTodos.map((todo) => (
          <div
            key={todo.id}
            draggable
            onDragStart={() => setDraggedId(todo.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => moveTodo(todo.id)}
            onDragEnd={() => setDraggedId(null)}
            className={`rounded-[22px] transition ${draggedId === todo.id ? "opacity-50" : ""}`}
          >
            <div className="mb-2 flex items-center gap-2 px-1 text-xs font-bold muted">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/55">↕</span>
              <span>拖拽调整今日处理顺序</span>
            </div>
            <TodoCard todo={todo} showMission={false} />
          </div>
        ))}
        {hiddenCount > 0 ? (
          <button className="btn btn-soft w-full text-sm" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "收起任务副本" : `展开剩余 ${hiddenCount} 个任务副本`}
          </button>
        ) : null}
        {hasRoutines ? (
          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-base font-black">周期性任务</h3>
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black">{entropy.dueRoutines.length}</span>
            </div>
            <div className="space-y-3">
              {entropy.dueRoutines.slice(0, 2).map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          </div>
        ) : null}
        {!hasTodos && !hasRoutines ? (
          <EmptyState
            state="devil-calm"
            title="今日没有必须处理的任务"
            body="很好，混乱没有拿到剧本。局面可控，本魔头今天没有出手机会。"
          />
        ) : null}
      </div>
    </section>
  );
}
