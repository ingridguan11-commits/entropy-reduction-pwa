"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAppState } from "@/context/AppState";
import { minutesToText } from "@/lib/dates";

function ratioColor(ratio: number) {
  if (ratio < 0.75) return "bg-[var(--sage)]";
  if (ratio < 1) return "bg-[var(--mist)]";
  return "bg-[var(--rose)]";
}

type ScreenTimeCardProps = {
  editable?: boolean;
};

export default function ScreenTimeCard({ editable = false }: ScreenTimeCardProps) {
  const { data, updateScreenTime, updateEntertainmentApps, setNotice } = useAppState();
  const [limits, setLimits] = useState({
    totalPhoneLimitMinutes: data.screenTime.totalPhoneLimitMinutes,
    entertainmentLimitMinutes: data.screenTime.entertainmentLimitMinutes
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>(data.settings.entertainmentApps);
  const totalRatio = data.screenTime.totalPhoneUsedMinutes / data.screenTime.totalPhoneLimitMinutes;
  const entertainmentRatio = data.screenTime.entertainmentUsedMinutes / data.screenTime.entertainmentLimitMinutes;
  const topApps = useMemo(
    () => [...data.screenTime.appUsages].sort((a, b) => b.usedMinutes - a.usedMinutes).slice(0, 5),
    [data.screenTime.appUsages]
  );

  const saveLimits = () =>
    updateScreenTime({
      ...data.screenTime,
      totalPhoneLimitMinutes: limits.totalPhoneLimitMinutes,
      entertainmentLimitMinutes: limits.entertainmentLimitMinutes
    });

  const saveEntertainmentApps = () => {
    updateEntertainmentApps(selectedApps);
    setPickerOpen(false);
  };

  const syncLocalData = () => {
    const totalPhoneUsedMinutes = data.screenTime.appUsages.reduce((sum, app) => sum + app.usedMinutes, 0);
    const entertainmentUsedMinutes = data.screenTime.appUsages
      .filter((app) => data.settings.entertainmentApps.includes(app.appName))
      .reduce((sum, app) => sum + app.usedMinutes, 0);

    updateScreenTime({
      ...data.screenTime,
      totalPhoneUsedMinutes,
      entertainmentUsedMinutes,
      lastUpdatedAt: new Date().toISOString()
    });
    setNotice({
      title: "本地数据已同步",
      body: "已根据当前 App 使用记录刷新总使用时长和娱乐时长。注意力账本暂时对齐。",
      devilState: "devil-stable"
    });
  };

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black">使用时长管控</h2>
            <button
              className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[var(--sage-dark)]"
              onClick={syncLocalData}
            >
              同步
            </button>
          </div>
          <p className="mt-1 text-sm muted">退出赛博洞穴，收复注意力。</p>
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black">
          {totalRatio >= 1 ? "超标" : "可控"}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <Meter
          label="总使用时长"
          value={data.screenTime.totalPhoneUsedMinutes}
          limit={data.screenTime.totalPhoneLimitMinutes}
          ratio={totalRatio}
        />
        <Meter
          label="娱乐时长"
          value={data.screenTime.entertainmentUsedMinutes}
          limit={data.screenTime.entertainmentLimitMinutes}
          ratio={entertainmentRatio}
          action={editable ? (
            <button className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[var(--sage-dark)]" onClick={() => setPickerOpen(true)}>
              修改
            </button>
          ) : undefined}
        />
      </div>

      {editable ? <div className="mt-5 rounded-3xl bg-white/45 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black">前五使用时长</p>
          </div>
          <span className="rounded-full bg-[rgba(183,197,173,0.35)] px-3 py-1 text-xs font-black text-[var(--sage-dark)]">
            自动可视化
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {topApps.map((app) => {
            const max = Math.max(1, topApps[0]?.usedMinutes ?? 1);
            const selected = data.settings.entertainmentApps.includes(app.appName);
            return (
              <div key={app.appName}>
                <div className="mb-1 flex items-center justify-between text-xs font-bold">
                  <span>
                    {app.appName}
                    {selected ? <span className="ml-2 text-[var(--rose-dark)]">娱乐</span> : null}
                  </span>
                  <span className="muted">{minutesToText(app.usedMinutes)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#ece5da]">
                  <div className="h-full rounded-full bg-[var(--mist)]" style={{ width: `${(app.usedMinutes / max) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div> : null}

      {editable ? (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="总时长可用"
              value={limits.totalPhoneLimitMinutes}
              onChange={(value) => setLimits({ ...limits, totalPhoneLimitMinutes: value })}
            />
            <Field
              label="娱乐时长可用"
              value={limits.entertainmentLimitMinutes}
              onChange={(value) => setLimits({ ...limits, entertainmentLimitMinutes: value })}
            />
          </div>
          <button className="btn btn-primary w-full" onClick={saveLimits}>
            保存可用额度
          </button>
        </div>
      ) : null}

      {pickerOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-[#2f2b25]/35 px-4 pb-5 backdrop-blur-sm">
          <div className="card w-full max-w-[480px] p-5">
            <h3 className="text-lg font-black">选择计入娱乐的软件</h3>
            <div className="mt-4 space-y-2">
              {data.screenTime.appUsages.map((app) => {
                const checked = selectedApps.includes(app.appName);
                return (
                  <label key={app.appName} className="flex min-h-12 items-center justify-between rounded-2xl bg-white/50 px-3 py-2">
                    <span className="text-sm font-bold">{app.appName}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        setSelectedApps((current) =>
                          event.target.checked
                            ? [...current, app.appName]
                            : current.filter((item) => item !== app.appName)
                        )
                      }
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="btn btn-soft" onClick={() => setPickerOpen(false)}>
                取消
              </button>
              <button className="btn btn-primary" onClick={saveEntertainmentApps}>
                保存选择
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Meter({
  label,
  value,
  limit,
  ratio,
  action
}: {
  label: string;
  value: number;
  limit: number;
  ratio: number;
  action?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span className="flex items-center gap-2">
          {label}
          {action}
        </span>
        <span className="muted">{minutesToText(value)} / {minutesToText(limit)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#ece5da]">
        <div
          className={`h-full rounded-full ${ratioColor(ratio)} transition-all`}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
