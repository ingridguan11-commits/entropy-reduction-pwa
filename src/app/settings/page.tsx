"use client";

import PageHeader from "@/components/PageHeader";
import SettingsPanel from "@/components/SettingsPanel";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="我的秩序系统" description="主题、通知、作息和数据都在这里。你不是废了，你只是系统缓存太多。" />
      <SettingsPanel />
    </div>
  );
}
