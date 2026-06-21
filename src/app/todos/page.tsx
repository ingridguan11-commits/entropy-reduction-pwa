"use client";

import { FormEvent, useMemo, useState } from "react";
import EmptyState from "@/components/EmptyState";
import MissionImpactSelector from "@/components/MissionImpactSelector";
import PageHeader from "@/components/PageHeader";
import TodoCard from "@/components/TodoCard";
import { blankTodo, useAppState } from "@/context/AppState";
import { Todo, TodoCategory } from "@/lib/types";

const categories: TodoCategory[] = ["学习", "求职", "自媒体", "生活", "人际", "其他"];

export default function TodosPage() {
  const { data, addTodo, updateTodo } = useAppState();
  const [draft, setDraft] = useState<Todo>(() => blankTodo());
  const [editing, setEditing] = useState(false);

  const groups = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      今日: data.todos.filter((todo) => !todo.completed && todo.dueDate === today),
      逾期: data.todos.filter((todo) => !todo.completed && todo.dueDate < today),
      未来: data.todos.filter((todo) => !todo.completed && todo.dueDate > today),
      已完成: data.todos.filter((todo) => todo.completed)
    };
  }, [data.todos]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;
    const linkedMissionId = String(formData.get("linkedMissionId") ?? "") || null;
    const normalized = {
      ...draft,
      title,
      category: String(formData.get("category") ?? draft.category) as TodoCategory,
      dueDate: String(formData.get("dueDate") ?? draft.dueDate),
      dueTime: String(formData.get("dueTime") ?? draft.dueTime),
      priority: String(formData.get("priority") ?? draft.priority) as Todo["priority"],
      note: String(formData.get("note") ?? ""),
      linkedMissionId,
      missionImpact: linkedMissionId ? Number(formData.get("missionImpact")) || 3 : 3
    };
    if (editing) {
      updateTodo(normalized);
    } else {
      const { id, createdAt, completed, completedAt, ...payload } = normalized;
      addTodo(payload);
    }
    setDraft(blankTodo());
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="待办" description="别让任务在角落里繁殖。处理一个，局面就可控一点。" />

      <form className="card space-y-3 p-5" onSubmit={submit}>
        <h2 className="text-lg font-black">{editing ? "编辑待办" : "新增待办"}</h2>
        <div>
          <label className="label">任务标题</label>
          <input
            className="input"
            name="title"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="例如：修改简历项目经历"
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
        <div>
          <label className="label">关联主线</label>
          <select
            className="input"
            name="linkedMissionId"
            value={draft.linkedMissionId ?? ""}
            onChange={(event) => setDraft({ ...draft, linkedMissionId: event.target.value || null })}
          >
            <option value="">不关联</option>
            {data.missions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                {mission.title}
              </option>
            ))}
          </select>
        </div>
        {draft.linkedMissionId ? (
          <MissionImpactSelector
            value={draft.missionImpact}
            onChange={(missionImpact) => setDraft({ ...draft, missionImpact })}
          />
        ) : null}
        <div>
          <label className="label">备注</label>
          <textarea
            className="input min-h-20"
            name="note"
            value={draft.note}
            onChange={(event) => setDraft({ ...draft, note: event.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" type="submit">
            {editing ? "保存修改" : "新增待办"}
          </button>
          {editing ? (
            <button
              className="btn btn-soft"
              type="button"
              onClick={() => {
                setDraft(blankTodo());
                setEditing(false);
              }}
            >
              取消
            </button>
          ) : null}
        </div>
      </form>

      {Object.entries(groups).map(([label, todos]) => (
        <section key={label} id={label === "今日" ? "today-todos" : undefined} className="scroll-mt-6 space-y-3">
          <h2 className="px-1 text-lg font-black">
            {label} <span className="text-sm muted">{todos.length}</span>
          </h2>
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={(item) => {
                setDraft(item);
                setEditing(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ))}
          {!todos.length ? (
            <EmptyState
              state={label === "已完成" ? "devil-peek" : "devil-stable"}
              title={`${label}区域空着`}
              body="这里暂时没有任务。混乱还没占领这个区。"
            />
          ) : null}
        </section>
      ))}
    </div>
  );
}
