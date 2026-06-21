"use client";

export const missionImpactOptions = [
  {
    value: 1,
    label: "🍃 微小推进 +1",
    description: "适合查资料、看一个岗位、整理一个灵感、发一条消息、做一个准备动作。",
    copy: "小幅移动棋子，但局面还没大变。"
  },
  {
    value: 3,
    label: "🌿 普通推进 +3",
    description: "适合修改一段内容、完成一个小任务、整理一份材料、写一个初稿。",
    copy: "局面开始松动，主线向前挪了一格。"
  },
  {
    value: 5,
    label: "🌱 重要推进 +5",
    description: "适合投递多个岗位、完成一次正式输出、完成一条内容发布、完成一次面试准备。",
    copy: "这不是心理安慰，这是有效推进。"
  },
  {
    value: 10,
    label: "🌳 关键推进 +10",
    description: "适合完成作品集、完成重要面试、发布重要内容、完成阶段性成果、确定一个重大选择。",
    copy: "关键节点已突破，混乱势力受到重创。"
  }
];

type MissionImpactSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function MissionImpactSelector({ value, onChange }: MissionImpactSelectorProps) {
  return (
    <div>
      <label className="label">对主线的推进力度</label>
      <div className="grid gap-2">
        {missionImpactOptions.map((option) => {
          const active = value === option.value;
          return (
            <label
              key={option.value}
              className={`block cursor-pointer rounded-3xl border p-3 transition ${
                active
                  ? "border-[rgba(124,139,115,0.55)] bg-[rgba(183,197,173,0.32)]"
                  : "border-[var(--line)] bg-white/45"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="missionImpact"
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
              />
              <span className="text-sm font-black">{option.label}</span>
              <span className="mt-1 block text-xs leading-5 muted">{option.description}</span>
              <span className="mt-2 block rounded-2xl bg-white/50 px-3 py-2 text-xs font-bold text-[var(--sage-dark)]">
                {option.copy}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
