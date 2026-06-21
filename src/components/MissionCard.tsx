"use client";

import Link from "next/link";
import { useAppState } from "@/context/AppState";
import { todayKey } from "@/lib/dates";
import { missionProgress } from "@/lib/entropy";
import { Mission, Todo } from "@/lib/types";
import MissionProgressBar from "./MissionProgressBar";

type MissionCardProps = {
  mission: Mission;
  onEdit?: (mission: Mission) => void;
};

export default function MissionCard({ mission, onEdit }: MissionCardProps) {
  const { data, deleteMission } = useAppState();
  const linked = data.todos.filter((todo) => todo.linkedMissionId === mission.id);
  const progress = missionProgress(mission, data.todos);
  const today = todayKey();
  const todayTodos = linked.filter((todo) => !todo.completed && todo.dueDate === today);
  const weekTodos = linked.filter((todo) => !todo.completed && isThisWeek(todo.dueDate));
  const completedTodos = linked.filter((todo) => todo.completed);
  const completedImpact = completedTodos.reduce((sum, todo) => sum + todo.missionImpact, 0);
  const totalImpact = linked.reduce((sum, todo) => sum + todo.missionImpact, 0);

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-black">{mission.title}</h3>
          <p className="mt-2 text-sm leading-6 muted">{mission.description}</p>
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black text-[var(--sage-dark)]">
          {progress}%
        </span>
      </div>
      <MissionProgressBar value={progress} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="soft-card p-3">
          <p className="text-xl font-black">
            {completedImpact}/{totalImpact}
          </p>
          <p className="text-xs font-bold muted">已完成贡献值</p>
        </div>
        <div className="soft-card p-3">
          <p className="text-xl font-black">{linked.length}</p>
          <p className="text-xs font-bold muted">关联待办</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <MissionTodoPreview title="今日关联待办" todos={todayTodos} empty="今日主线没有任务副本，局面暂时安静。" />
        <MissionTodoPreview title="本周关联待办" todos={weekTodos} empty="本周主线压力不大，混乱势力正在观望。" />
        <MissionTodoPreview title="已完成关联待办" todos={completedTodos} empty="还没有完成记录，先收复一个小节点。" />
      </div>
      <div className="mt-4 flex gap-2">
        <Link className="btn btn-primary flex-1 text-center text-sm" href={`/missions/${mission.id}`}>
          详情
        </Link>
        {onEdit ? (
          <button className="btn btn-soft flex-1 text-sm" onClick={() => onEdit(mission)}>
            编辑
          </button>
        ) : null}
        <button className="btn btn-soft flex-1 text-sm" onClick={() => deleteMission(mission.id)}>
          删除
        </button>
      </div>
    </article>
  );
}

function isThisWeek(dateKey: string): boolean {
  const date = new Date(`${dateKey}T12:00:00`);
  const now = new Date();
  const day = (now.getDay() + 6) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function MissionTodoPreview({ title, todos, empty }: { title: string; todos: Todo[]; empty: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-black">{title}</p>
        <span className="text-xs font-bold muted">{todos.length}</span>
      </div>
      <div className="space-y-2">
        {todos.slice(0, 3).map((todo) => (
          <p key={todo.id} className="rounded-2xl bg-white/50 px-3 py-2 text-sm font-bold">
            {todo.title}
            <span className="ml-2 text-xs text-[var(--sage-dark)]">+{todo.missionImpact}</span>
          </p>
        ))}
        {!todos.length ? <p className="text-sm muted">{empty}</p> : null}
      </div>
    </div>
  );
}
