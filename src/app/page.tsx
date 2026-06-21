"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EntropyScoreCard from "@/components/EntropyScoreCard";
import MissionProgressBar from "@/components/MissionProgressBar";
import PageHeader from "@/components/PageHeader";
import ScreenTimeCard from "@/components/ScreenTimeCard";
import SleepControlCard from "@/components/SleepControlCard";
import TodayTaskList from "@/components/TodayTaskList";
import { useAppState } from "@/context/AppState";
import { missionProgress } from "@/lib/entropy";
import LowEntropyImp from "@/components/LowEntropyImp";

export default function DashboardPage() {
  const { data, entropy } = useAppState();
  const [afterNine, setAfterNine] = useState(false);
  const exerciseMinutes = data.exercise.logs.reduce((sum, log) => sum + log.durationMinutes, 0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setAfterNine(now.getHours() >= 21);
    };
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title="今日低熵进度"
        description="今日秩序尚未崩盘，还有救。先看局面，再开始镇压。"
      />
      <EntropyScoreCard />
      {afterNine ? <SleepControlCard /> : null}
      <TodayTaskList />

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">主线进度</h2>
            <p className="mt-1 text-sm muted">我们必须耕种我们自己的花园🌱</p>
          </div>
          <Link href="/missions" className="btn btn-soft text-sm">
            查看
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {data.missions.map((mission) => (
            <div key={mission.id} className="soft-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 break-words text-sm font-black">{mission.title}</p>
                <span className="text-xs font-black muted">{missionProgress(mission, data.todos)}%</span>
              </div>
              <MissionProgressBar value={missionProgress(mission, data.todos)} compact />
            </div>
          ))}
          <div className="soft-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-black">运动支线</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[var(--sage-dark)]">
                  提高体能和武力值也是作战的必要前提哦～
                </p>
              </div>
              <span className="shrink-0 text-xs font-black muted">累计 {exerciseMinutes} 分钟</span>
            </div>
            <MissionProgressBar value={Math.min(100, Math.round((exerciseMinutes / 180) * 100))} compact />
          </div>
        </div>
      </section>

      <ScreenTimeCard />
      {!afterNine ? <SleepControlCard /> : null}

      <section className="card p-5">
        <div className="flex items-center gap-4">
          <LowEntropyImp state={entropy.devilTriggered ? "devil-takeover" : "devil-stable"} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black">低熵小魔头状态</h2>
            <p className="mt-2 text-sm leading-6 muted">
              {entropy.devilTriggered
                ? "魔头已经出现。事情变得有趣起来了。"
                : "小魔头正在巡逻秩序防线。很好，今天至少没有让混乱完全接管。"}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link className="btn btn-soft text-center text-sm" href="/routines">
            周期任务
          </Link>
          <Link className="btn btn-soft text-center text-sm" href="/control">
            作息管控
          </Link>
        </div>
      </section>
    </div>
  );
}
