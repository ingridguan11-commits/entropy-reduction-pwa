"use client";

import PageHeader from "@/components/PageHeader";
import ScreenTimeCard from "@/components/ScreenTimeCard";
import SleepControlCard from "@/components/SleepControlCard";

export default function ControlPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="作息与时长管控" description="不要和短视频谈判。夜间低熵模式启动后，明天少一点系统崩溃。" />
      <SleepControlCard editable />
      <ScreenTimeCard editable />
    </div>
  );
}
