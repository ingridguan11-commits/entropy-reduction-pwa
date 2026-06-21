"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "@/context/AppState";
import LowEntropyImp from "./LowEntropyImp";

export default function DevilAlertModal() {
  const { entropy, setNotice, snoozeDevil, data, markNightMode } = useAppState();
  const pathname = usePathname();
  const router = useRouter();
  const shouldShow = entropy.devilTriggered;

  if (!shouldShow) return null;

  const scrollToTodayTodos = () => {
    window.setTimeout(() => document.getElementById("today-todos")?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  const handleTodoStrike = () => {
    snoozeDevil();
    setNotice({
      title: "反攻入口已打开",
      body: "先处理今日区里的一个小任务。别和混乱讲道理，直接动手。",
      devilState: "devil-peek"
    });
    if (pathname === "/todos") {
      scrollToTodayTodos();
      return;
    }
    router.push("/todos#today-todos");
  };

  const handleLowEntropyMode = () => {
    snoozeDevil();
    markNightMode();
    setNotice({
      title: "低熵模式已启动",
      body: data.sleep.nightModeDoneDate ? "你已经启动过了，局面开始可控。" : "夜间秩序防线已升起。接下来去关掉一个入口，别让混乱续杯。",
      devilState: "devil-stable"
    });
    if (pathname !== "/control") {
      router.push("/control");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid items-end justify-items-center bg-[#2f2b25]/35 px-4 pb-5 backdrop-blur-sm">
      <div className="card w-full max-w-[480px] p-5 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[rgba(216,194,197,0.45)]">
          <LowEntropyImp state="devil-takeover" size="lg" label="低熵小魔头接管提醒" />
        </div>
        <h2 className="mt-4 text-2xl font-black">今日秩序防线失守。</h2>
        <p className="mt-2 text-sm leading-6 muted">现在，轮到我登场。你今天还没有处理任何任务，混乱正在获得优势。</p>
        <div className="mt-5 grid gap-2">
          <button className="btn btn-primary w-full" onClick={handleTodoStrike}>
            立刻处理一个
          </button>
          <button
            className="btn btn-soft w-full"
            onClick={() => {
              snoozeDevil();
              setNotice({
                title: "魔头暂时退场",
                body: "只给 5 分钟。别让混乱趁机扩大地盘。",
                devilState: "devil-peek"
              });
            }}
          >
            让我再堕落 5 分钟
          </button>
          <button
            className="btn btn-soft w-full"
            onClick={handleLowEntropyMode}
          >
            进入低熵模式
          </button>
        </div>
      </div>
    </div>
  );
}
