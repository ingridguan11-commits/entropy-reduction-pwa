"use client";

import { useAppState } from "@/context/AppState";
import { niceDate } from "@/lib/dates";
import LowEntropyImp, { devilStateForScore, devilStateMeta } from "./LowEntropyImp";

export default function EntropyScoreCard() {
  const { entropy } = useAppState();
  const devilState = devilStateForScore(entropy.score);
  const hue =
    entropy.score >= 75
      ? "from-[var(--sage)] to-[var(--mist)]"
      : entropy.score >= 40
        ? "from-[var(--rose)] to-[var(--mist)]"
        : "from-[#c8a3aa] to-[#a9a0b6]";

  return (
    <section className="card overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold muted">{niceDate(new Date().toISOString().slice(0, 10))}</p>
          <h2 className="mt-1 text-xl font-black">今日秩序尚未崩盘</h2>
        </div>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-black text-[var(--sage-dark)]">
          {entropy.level}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-[68px] font-black leading-none tracking-normal">{entropy.score}</p>
          <p className="mt-1 text-xs font-black muted">今日熵减值 / 100</p>
        </div>
        <div className="mb-2 grid h-24 w-24 place-items-center rounded-full bg-white/55">
          <LowEntropyImp state={devilState} size="lg" />
        </div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#ece5da]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${hue} transition-all duration-500`}
          style={{ width: `${entropy.score}%` }}
        />
      </div>
      <p className="mt-4 rounded-3xl bg-white/50 p-4 text-sm font-bold leading-6">{entropy.copy}</p>
      <p className="mt-3 rounded-3xl bg-white/45 p-4 text-sm font-bold leading-6 text-[var(--sage-dark)]">
        {devilStateMeta[devilState].copy}
      </p>
    </section>
  );
}
