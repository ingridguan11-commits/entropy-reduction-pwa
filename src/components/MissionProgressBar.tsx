type MissionProgressBarProps = {
  value: number;
  compact?: boolean;
};

export default function MissionProgressBar({ value, compact }: MissionProgressBarProps) {
  return (
    <div className={compact ? "mt-3" : "mt-4"}>
      <div className="h-3 overflow-hidden rounded-full bg-[#ece5da]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--sage),var(--mist))] transition-all duration-300"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      {!compact ? <p className="mt-2 text-xs font-bold muted">主线推进 {value}%</p> : null}
    </div>
  );
}
