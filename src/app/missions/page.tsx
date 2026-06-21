"use client";

import { FormEvent, useState } from "react";
import ExerciseBranchCard from "@/components/ExerciseBranchCard";
import MissionCard from "@/components/MissionCard";
import PageHeader from "@/components/PageHeader";
import { useAppState } from "@/context/AppState";
import { addDays, todayKey, uid } from "@/lib/dates";
import { Mission } from "@/lib/types";

function newMission(): Mission {
  const today = todayKey();
  return {
    id: uid("draft"),
    title: "",
    description: "",
    startDate: today,
    endDate: addDays(today, 60),
    progress: 0,
    monthlyGoals: [""],
    weeklyGoals: [""],
    linkedTodoIds: [],
    createdAt: new Date().toISOString()
  };
}

export default function MissionsPage() {
  const { data, addMission, updateMission, setNotice } = useAppState();
  const [draft, setDraft] = useState<Mission>(() => newMission());
  const [editing, setEditing] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const payload = {
      ...draft,
      title: draft.title.trim(),
      monthlyGoals: draft.monthlyGoals.filter(Boolean),
      weeklyGoals: draft.weeklyGoals.filter(Boolean)
    };
    if (editing) {
      updateMission(payload);
    } else {
      const { id, createdAt, progress, linkedTodoIds, ...mission } = payload;
      const ok = addMission(mission);
      if (!ok) {
        setNotice({
          title: "主线已满",
          body: "最多只能同时创建 3 个主线任务。先打穿一个再开新副本。",
          devilState: "devil-smile"
        });
        return;
      }
    }
    setDraft(newMission());
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="主线任务" description="最多 3 条主线。人生不是多开窗口，别把自己开到卡死。" />

      <form className="card space-y-3 p-5" onSubmit={submit}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{editing ? "编辑主线" : "创建主线"}</h2>
          <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black">{data.missions.length}/3</span>
        </div>
        <div>
          <label className="label">主线标题</label>
          <input
            className="input"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="例如：找到理想实习"
          />
        </div>
        <div>
          <label className="label">描述</label>
          <textarea
            className="input min-h-20"
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">开始日期</label>
            <input
              className="input"
              type="date"
              value={draft.startDate}
              onChange={(event) => setDraft({ ...draft, startDate: event.target.value })}
            />
          </div>
          <div>
            <label className="label">结束日期</label>
            <input
              className="input"
              type="date"
              value={draft.endDate}
              onChange={(event) => setDraft({ ...draft, endDate: event.target.value })}
            />
          </div>
        </div>
        <GoalEditor
          title="月度目标"
          values={draft.monthlyGoals}
          onChange={(monthlyGoals) => setDraft({ ...draft, monthlyGoals })}
        />
        <GoalEditor
          title="周度目标"
          values={draft.weeklyGoals}
          onChange={(weeklyGoals) => setDraft({ ...draft, weeklyGoals })}
        />
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" type="submit">
            {editing ? "保存主线" : "创建主线"}
          </button>
          {editing ? (
            <button
              className="btn btn-soft"
              type="button"
              onClick={() => {
                setDraft(newMission());
                setEditing(false);
              }}
            >
              取消
            </button>
          ) : null}
        </div>
      </form>

      <ExerciseBranchCard />

      <section className="space-y-4">
        {data.missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
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

function GoalEditor({
  title,
  values,
  onChange
}: {
  title: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="label mb-0">{title}</label>
        <button className="text-xs font-black text-[var(--sage-dark)]" type="button" onClick={() => onChange([...values, ""])}>
          添加
        </button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <input
            key={index}
            className="input"
            value={value}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}
