"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import MissionImpactSelector from "@/components/MissionImpactSelector";
import MissionProgressBar from "@/components/MissionProgressBar";
import PageHeader from "@/components/PageHeader";
import TodoCard from "@/components/TodoCard";
import { blankTodo, useAppState } from "@/context/AppState";
import { missionProgress } from "@/lib/entropy";
import { Todo, TodoCategory } from "@/lib/types";

const categories: TodoCategory[] = ["学习", "求职", "自媒体", "生活", "人际", "其他"];

export default function MissionDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, addTodo, updateTodo } = useAppState();
  const mission = data.missions.find((item) => item.id === params.id);
  const [draft, setDraft] = useState<Todo>(() =>
    blankTodo({ linkedMissionId: params.id, missionImpact: 3 })
  );
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const linkedTodos = useMemo(
    () => data.todos.filter((todo) => todo.linkedMissionId === params.id),
    [data.todos, params.id]
  );

  if (!mission) {
    return (
      <div className="space-y-4">
        <PageHeader title="主线失联" description="这条主线可能已经被删除。混乱势力没有拿到更多情报。" />
        <Link className="btn btn-primary block text-center" href="/missions">
          返回主线列表
        </Link>
      </div>
    );
  }

  const progress = missionProgress(mission, data.todos);
  const completedImpact = linkedTodos
    .filter((todo) => todo.completed)
    .reduce((sum, todo) => sum + todo.missionImpact, 0);
  const totalImpact = linkedTodos.reduce((sum, todo) => sum + todo.missionImpact, 0);

  const resetDraft = () => {
    setDraft(blankTodo({ linkedMissionId: mission.id, missionImpact: 3 }));
    setEditingTodoId(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;

    const normalized = {
      ...draft,
      title,
      category: String(formData.get("category") ?? draft.category) as TodoCategory,
      dueDate: String(formData.get("dueDate") ?? draft.dueDate),
      dueTime: String(formData.get("dueTime") ?? draft.dueTime),
      priority: String(formData.get("priority") ?? draft.priority) as Todo["priority"],
      note: String(formData.get("note") ?? ""),
      linkedMissionId: mission.id,
      missionImpact: Number(formData.get("missionImpact")) || 3
    };

    if (editingTodoId) {
      updateTodo(normalized);
    } else {
      const { id, createdAt, completed, completedAt, ...payload } = normalized;
      addTodo(payload);
    }

    resetDraft();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="主线详情"
        title={mission.title}
        description="这里新增的子任务，本质上仍然是待办，只是默认加入当前主线阵营。"
      />

      <section className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-black">{mission.title}</h2>
            <p className="mt-2 text-sm leading-6 muted">{mission.description}</p>
          </div>
          <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black text-[var(--sage-dark)]">
            {progress}%
          </span>
        </div>
        <MissionProgressBar value={progress} />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="soft-card p-3">
            <p className="text-xl font-black">{linkedTodos.filter((todo) => !todo.completed).length}</p>
            <p className="text-xs font-bold muted">剩余子任务</p>
          </div>
          <div className="soft-card p-3">
            <p className="text-xl font-black">
              {completedImpact}/{totalImpact || 0}
            </p>
            <p className="text-xs font-bold muted">已收复影响值</p>
          </div>
        </div>
      </section>

      <form className="card space-y-3 p-5" onSubmit={submit}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">{editingTodoId ? "编辑子任务" : "新增子任务"}</h2>
            <p className="mt-1 text-sm muted">默认关联：{mission.title}</p>
          </div>
          <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black">主线锁定</span>
        </div>

        <div>
          <label className="label">任务标题</label>
          <input
            className="input"
            name="title"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="例如：补一版作品集案例"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">分类</label>
            <select
              className="input"
              name="category"
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value as TodoCategory })}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">优先级</label>
            <select
              className="input"
              name="priority"
              value={draft.priority}
              onChange={(event) => setDraft({ ...draft, priority: event.target.value as Todo["priority"] })}
            >
              <option value="normal">普通</option>
              <option value="high">高优先</option>
            </select>
          </div>
          <div>
            <label className="label">日期</label>
            <input
              className="input"
              name="dueDate"
              type="date"
              value={draft.dueDate}
              onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
            />
          </div>
          <div>
            <label className="label">时间</label>
            <input
              className="input"
              name="dueTime"
              type="time"
              value={draft.dueTime}
              onChange={(event) => setDraft({ ...draft, dueTime: event.target.value })}
            />
          </div>
        </div>

        <MissionImpactSelector
          value={draft.missionImpact}
          onChange={(missionImpact) => setDraft({ ...draft, missionImpact })}
        />

        <div>
          <label className="label">备注</label>
          <textarea
            className="input min-h-20"
            name="note"
            value={draft.note}
            onChange={(event) => setDraft({ ...draft, note: event.target.value })}
            placeholder="给这个任务副本留一点战术情报。"
          />
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" type="submit">
            {editingTodoId ? "保存子任务" : "加入当前主线"}
          </button>
          {editingTodoId ? (
            <button className="btn btn-soft" type="button" onClick={resetDraft}>
              取消
            </button>
          ) : null}
        </div>
      </form>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-black">关联待办</h2>
          <span className="text-sm font-bold muted">{linkedTodos.length} 个任务副本</span>
        </div>
        {linkedTodos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onEdit={(item) => {
              setDraft({ ...item, linkedMissionId: mission.id });
              setEditingTodoId(item.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ))}
        {!linkedTodos.length ? (
          <EmptyState
            state="devil-peek"
            title="当前主线还没有子任务"
            body="秩序防线空着，混乱势力正在观察。先布置一个小任务副本。"
          />
        ) : null}
      </section>

      <Link className="btn btn-soft block text-center" href="/missions">
        返回主线列表
      </Link>
    </div>
  );
}
