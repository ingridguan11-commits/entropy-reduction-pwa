"use client";

import CalendarView from "@/components/CalendarView";
import PageHeader from "@/components/PageHeader";

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="日历报告" description="每一天都有状态点。看见混乱的走势，才方便反向操作。" />
      <CalendarView />
    </div>
  );
}
