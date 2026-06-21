"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "今日", icon: "◷" },
  { href: "/missions", label: "主线", icon: "◆" },
  { href: "/todos", label: "待办", icon: "✓" },
  { href: "/calendar", label: "日历", icon: "◌" },
  { href: "/settings", label: "我的", icon: "◎" }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[520px] px-3">
      <div className="mb-3 grid grid-cols-5 gap-1 rounded-[28px] border border-[var(--line)] bg-[rgba(255,250,242,0.84)] p-2 shadow-[0_16px_36px_rgba(73,62,50,0.16)] backdrop-blur-xl">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-12 flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition ${
                active
                  ? "bg-[#3f493d] text-[#fffaf2] shadow-[0_8px_18px_rgba(63,73,61,0.24)]"
                  : "text-[var(--muted)]"
              }`}
            >
              <span className="text-base leading-5">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
