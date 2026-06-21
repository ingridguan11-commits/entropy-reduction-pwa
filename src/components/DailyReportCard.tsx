"use client";

import { DailyReport } from "@/lib/types";
import { minutesToText, niceDate } from "@/lib/dates";
import LowEntropyImp, { devilStateForScore, devilStateMeta } from "./LowEntropyImp";

type DailyReportCardProps = {
  report: DailyReport;
};

export default function DailyReportCard({ report }: DailyReportCardProps) {
  const devilState = report.devilTriggered ? "devil-takeover" : devilStateForScore(report.entropyScore);

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--sage-dark)]">
            {niceDate(report.date)}
          </p>
          <h2 className="mt-2 text-xl font-black">每日熵减报告</h2>
        </div>
        <div className="text-right">
          <div className="mb-2 flex justify-end">
            <LowEntropyImp state={devilState} size="md" />
          </div>
          <p className="text-3xl font-black">{report.entropyScore}</p>
          <p className="text-xs font-bold muted">{report.entropyLevel}</p>
        </div>
      </div>

      <p className="mt-4 rounded-3xl bg-white/50 p-4 text-sm font-bold leading-6">{report.summaryText}</p>
      <p className="mt-3 rounded-3xl bg-white/45 p-4 text-sm font-bold leading-6 text-[var(--sage-dark)]">
        {devilStateMeta[devilState].copy}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="完成待办" value={`${report.completedTodosCount}`} />
        <Stat label="未完成待办" value={`${report.unfinishedTodosCount}`} />
        <Stat label="逾期任务" value={`${report.overdueTasksCount}`} />
        <Stat label="周期完成" value={`${report.completedRoutinesCount}`} />
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm font-black">主线变化</p>
        {report.missionProgressChanges.map((item) => (
          <p key={item} className="rounded-2xl bg-white/50 px-3 py-2 text-sm font-bold muted">
            {item}
          </p>
        ))}
      </div>

      <div className="mt-4 rounded-3xl bg-white/50 p-4 text-sm leading-6 muted">
        <p>作息：{report.sleepStatus}</p>
        <p>手机：{minutesToText(report.totalPhoneUsedMinutes)}</p>
        <p>娱乐：{minutesToText(report.entertainmentUsedMinutes)}</p>
        <p>{report.devilTriggered ? "魔头出现过，局面确实有点刺激。" : "魔头暂未接管，继续守住人类阵营。"}</p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="soft-card p-3">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold muted">{label}</p>
    </div>
  );
}
