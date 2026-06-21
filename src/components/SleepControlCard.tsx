"use client";

import { useState } from "react";
import { useAppState } from "@/context/AppState";
import RotatingLine from "./RotatingLine";

const sleepSlogans = [
  "我申请加入睡个好教💤",
  "天下第一大补就是睡觉😴",
  "今天开始饲养睡眠～",
  "冷知识：只要大睡特睡就可以降低皮质醇、修复前额叶"
];

type SleepControlCardProps = {
  editable?: boolean;
};

export default function SleepControlCard({ editable = false }: SleepControlCardProps) {
  const { data, updateSleep, markNightMode } = useAppState();
  const [draft, setDraft] = useState(data.sleep);
  const done = data.sleep.nightModeDoneDate === new Date().toISOString().slice(0, 10);

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">夜间低熵模式</h2>
          <RotatingLine lines={sleepSlogans} className="mt-1 text-sm muted" />
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black">{done ? "已启动" : "待启动"}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <TimeChip label="停止刷手机" value={data.sleep.stopPhoneTime} />
        <TimeChip label="洗漱" value={data.sleep.washUpTime} />
        <TimeChip label="上床" value={data.sleep.bedTime} />
        <TimeChip label="最晚睡觉" value={data.sleep.latestSleepTime} />
      </div>

      {editable ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            ["stopPhoneTime", "停止刷手机"],
            ["washUpTime", "洗漱"],
            ["bedTime", "上床"],
            ["latestSleepTime", "最晚睡觉"],
            ["wakeUpTime", "起床"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                className="input"
                type="time"
                value={draft[key as keyof typeof draft] as string}
                onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
              />
            </div>
          ))}
          <button className="btn btn-primary col-span-2" onClick={() => updateSleep(draft)}>
            保存作息约束
          </button>
        </div>
      ) : (
        <button className="btn btn-primary mt-5 w-full" onClick={markNightMode}>
          进入低熵模式
        </button>
      )}
    </section>
  );
}

function TimeChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="soft-card p-3">
      <p className="text-xs font-bold muted">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
