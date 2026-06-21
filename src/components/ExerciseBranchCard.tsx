"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAppState } from "@/context/AppState";

export default function ExerciseBranchCard() {
  const { data, addExerciseForm, addExerciseLog } = useAppState();
  const [form, setForm] = useState(data.exercise.forms[0] ?? "散步");
  const [customForm, setCustomForm] = useState("");
  const [duration, setDuration] = useState(20);
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayMinutes = useMemo(
    () =>
      data.exercise.logs
        .filter((log) => log.createdAt.slice(0, 10) === todayKey)
        .reduce((sum, log) => sum + log.durationMinutes, 0),
    [data.exercise.logs, todayKey]
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const finalForm = customForm.trim() || form;
    if (!finalForm || duration <= 0) return;
    if (customForm.trim()) {
      addExerciseForm(customForm.trim());
      setForm(customForm.trim());
      setCustomForm("");
    }
    addExerciseLog({ form: finalForm, durationMinutes: duration });
  };

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">运动支线</h2>
          <p className="mt-1 text-sm muted">身体一上线，系统缓存就少一点。</p>
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black text-[var(--sage-dark)]">
          今日 {todayMinutes} 分钟
        </span>
      </div>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">运动形式</label>
            <select className="input" value={form} onChange={(event) => setForm(event.target.value)}>
              {data.exercise.forms.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">运动时长</label>
            <input
              className="input"
              type="number"
              min={1}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </div>
        </div>
        <div>
          <label className="label">自定义运动形式</label>
          <input
            className="input"
            value={customForm}
            onChange={(event) => setCustomForm(event.target.value)}
            placeholder="例如：爬楼、跳舞、普拉提"
          />
        </div>
        <button className="btn btn-primary w-full" type="submit">
          记录运动支线
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {data.exercise.logs.slice(0, 4).map((log) => (
          <div key={log.id} className="flex items-center justify-between rounded-2xl bg-white/50 px-3 py-2 text-sm font-bold">
            <span>{log.form}</span>
            <span className="muted">{log.durationMinutes} 分钟</span>
          </div>
        ))}
        {!data.exercise.logs.length ? (
          <p className="text-sm muted">运动支线暂无记录。混乱势力还没见过你下楼的样子。</p>
        ) : null}
      </div>
    </section>
  );
}
