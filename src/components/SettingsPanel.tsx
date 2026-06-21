"use client";

import { useState } from "react";
import { useAppState } from "@/context/AppState";
import ScreenTimeCard from "./ScreenTimeCard";
import SleepControlCard from "./SleepControlCard";
import { ThemeName } from "@/lib/types";

const themes: Array<{ key: ThemeName; label: string }> = [
  { key: "cream", label: "奶油白" },
  { key: "sage", label: "鼠尾草" },
  { key: "mist", label: "雾霾蓝" },
  { key: "rose", label: "灰粉" }
];

export default function SettingsPanel() {
  const {
    data,
    updateTheme,
    requestNotifications,
    exportData,
    clearData,
    setNotice
  } = useAppState();
  const [exported, setExported] = useState("");

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <h2 className="text-lg font-black">视觉主题</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.key}
              className={`btn ${
                data.settings.theme === theme.key ? "btn-primary" : "btn-soft"
              }`}
              onClick={() => updateTheme(theme.key)}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </section>

      <SleepControlCard editable />
      <ScreenTimeCard editable />

      <section className="card p-5">
        <h2 className="text-lg font-black">通知与数据</h2>
        <div className="mt-4 grid gap-2">
          <button
            className="btn btn-primary w-full"
            onClick={() =>
              requestNotifications().then(() =>
                setNotice({
                  title: "通知权限已处理",
                  body: "如果浏览器允许，提醒会在网页或 PWA 可用状态下出现。",
                  devilState: "devil-stable"
                })
              )
            }
          >
            申请通知权限
          </button>
          <button className="btn btn-soft w-full" onClick={() => setExported(exportData())}>
            导出 JSON
          </button>
          <button
            className="btn btn-soft w-full"
            onClick={() => {
              if (confirm("确定清空本地数据并恢复示例数据吗？")) clearData();
            }}
          >
            清空本地数据
          </button>
        </div>
        {exported ? <textarea className="input mt-4 min-h-44 font-mono text-xs" readOnly value={exported} /> : null}
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-black">关于熵减</h2>
        <p className="mt-2 text-sm leading-6 muted">
          熵减不是普通待办清单，它是个人秩序系统。目标不是变成完美机器，而是在混乱扩张前，先夺回一点控制权。
        </p>
      </section>
    </div>
  );
}
