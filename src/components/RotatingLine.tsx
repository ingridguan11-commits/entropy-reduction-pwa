"use client";

import { useEffect, useState } from "react";

type RotatingLineProps = {
  lines: string[];
  className?: string;
};

export default function RotatingLine({ lines, className }: RotatingLineProps) {
  const [line, setLine] = useState(lines[0] ?? "");

  useEffect(() => {
    if (!lines.length) return;
    setLine(lines[Math.floor(Math.random() * lines.length)]);
  }, [lines]);

  return <p className={className}>{line}</p>;
}
