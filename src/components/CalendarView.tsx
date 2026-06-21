"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/context/AppState";
import { formatDate, todayKey } from "@/lib/dates";
import DailyReportCard from "./DailyReportCard";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function dotClass(score: number) {
  if (score >= 90) return "bg-[var(--sage-dark)]";
  if (score >= 75) return "bg-[var(--sage)]";
  if (score >= 60) return "bg-[var(--mist)]";
  if (score >= 40) return "bg-[var(--rose)]";
  if (score >= 20) return "bg-[#b88d96]";
  return "bg-[#6f607d]";
}

export default function CalendarView() {
  const { reportFor } = useAppState();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(todayKey());

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const firstWeekday = (first.getDay() + 6) % 7;
    const result: Array<string | null> = Array.from({ length: firstWeekday }, () => null);
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= count; day += 1) {
      result.push(formatDate(new Date(cursor.getFullYear(), cursor.getMonth(), day)));
    }
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [cursor]);

  const selectedReport = reportFor(selected);

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <button
            className="btn btn-soft h-11 w-11 p-0"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="上个月"
          >
            ‹
          </button>
          <h2 className="text-lg font-black">
            {cursor.getFullYear()} 年 {cursor.getMonth() + 1} 月
          </h2>
          <button
            className="btn btn-soft h-11 w-11 p-0"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="下个月"
          >
            ›
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-black muted">
          {WEEKDAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="aspect-square" />;
            const report = reportFor(day);
            const active = day === selected;
            return (
              <button
                key={day}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm font-black transition ${
                  active ? "bg-[#3f493d] text-white" : "bg-white/45 text-[var(--ink)]"
                }`}
                onClick={() => setSelected(day)}
              >
                {Number(day.slice(8))}
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${dotClass(report.entropyScore)}`} />
                {report.devilTriggered ? <span className="absolute right-1 top-0 text-[10px]">😈</span> : null}
              </button>
            );
          })}
        </div>
      </section>

      <DailyReportCard report={selectedReport} />
    </div>
  );
}
