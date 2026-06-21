"use client";

import { FormEvent, useState } from "react";
import PageHeader from "@/components/PageHeader";
import RoutineCard from "@/components/RoutineCard";
import { blankRoutine, useAppState } from "@/context/AppState";
import { Routine } from "@/lib/types";

export default function RoutinesPage() {
  const { data, addRoutine, updateRoutine } = useAppState();
  const [draft, setDraft] = useState<Routine>(() => blankRoutine());
  const [editing, setEditing] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    if (editing) {
      updateRoutine({ ...draft, title: draft.title.trim() });
    } else {
      const { id, completedToday, ...payload } = draft;
      addRoutine({ ...payload, title: draft.title.trim() });
    }
    setDraft(blankRoutine());
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="周期任务" description="那些不会自己消失的小事，最好在它们变成副本前处理掉。" />

      <form className="card space-y-3 p-5" onSubmit={submit}>
        <h2 className="text-lg font-black">{editing ? "编辑周期任务" : "新增周期任务"}</h2>
        <div>
          <label className="label">任务标题</label>
          <input
            className="input"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="例如：整理书桌"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">分类</label>
            <input
              className="input"
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value })}
            />
          </div>
          <div>
            <label className="label">每隔几天</label>
            <input
              className="input"
              min={1}
              type="number"
              value={draft.intervalDays}
              onChange={(event) => setDraft({ ...draft, intervalDays: Number(event.target.value) })}
            />
          </div>
          <div>
            <label className="label">提醒时间</label>
            <input
              className="input"
              type="time"
              value={draft.reminderTime}
              onChange={(event) => setDraft({ ...draft, reminderTime: event.target.value })}
            />
          </div>
          <div>
            <label className="label">下次到期</label>
            <input
              className="input"
              type="date"
              value={draft.nextDueAt}
              onChange={(event) => setDraft({ ...draft, nextDueAt: event.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">优先级</label>
          <select
            className="input"
            value={draft.priority}
            onChange={(event) => setDraft({ ...draft, priority: event.target.value as Routine["priority"] })}
          >
            <option value="normal">普通</option>
            <option value="high">高优先</option>
          </select>
        </div>
        <div>
          <label className="label">提醒文案</label>
          <textarea
            className="input min-h-20"
            value={draft.note}
            onChange={(event) => setDraft({ ...draft, note: event.target.value })}
            placeholder="这是一个小任务，但它正在影响你的系统稳定性。"
          />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" type="submit">
            {editing ? "保存修改" : "新增周期任务"}
          </button>
          {editing ? (
            <button
              className="btn btn-soft"
              type="button"
              onClick={() => {
                setDraft(blankRoutine());
                setEditing(false);
              }}
            >
              取消
            </button>
          ) : null}
        </div>
      </form>

      <section className="space-y-3">
        {data.routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onEdit={(item) => {
              setDraft(item);
              setEditing(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ))}
      </section>
    </div>
  );
}
