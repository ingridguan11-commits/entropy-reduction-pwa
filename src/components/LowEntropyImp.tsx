export type DevilState =
  | "devil-calm"
  | "devil-stable"
  | "devil-peek"
  | "devil-smile"
  | "devil-chaos"
  | "devil-takeover";

type LowEntropyImpProps = {
  state?: DevilState;
  size?: "sm" | "md" | "lg";
  label?: string;
  showCopy?: boolean;
};

const sizes = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24"
};

export const devilStateMeta: Record<DevilState, { label: string; copy: string }> = {
  "devil-calm": {
    label: "高度低熵",
    copy: "局面可控，本魔头今天没有出手机会。"
  },
  "devil-stable": {
    label: "稳定有序",
    copy: "不错，混乱还没资格登场。"
  },
  "devil-peek": {
    label: "轻微混乱",
    copy: "有点乱，但还没到我接管的时候。"
  },
  "devil-smile": {
    label: "熵增警告",
    copy: "事情开始变得有趣起来了。"
  },
  "devil-chaos": {
    label: "严重熵增",
    copy: "任务已经开始繁殖，我只是来围观的。"
  },
  "devil-takeover": {
    label: "魔头接管",
    copy: "今日秩序防线失守。现在，轮到我登场。"
  }
};

export function devilStateForScore(score: number): DevilState {
  if (score >= 90) return "devil-calm";
  if (score >= 75) return "devil-stable";
  if (score >= 60) return "devil-peek";
  if (score >= 40) return "devil-smile";
  if (score >= 20) return "devil-chaos";
  return "devil-takeover";
}

export default function LowEntropyImp({
  state = "devil-stable",
  size = "md",
  label,
  showCopy = false
}: LowEntropyImpProps) {
  const meta = devilStateMeta[state];
  const palette = {
    "devil-calm": { body: "#B7C5AD", wing: "#9EB3C4", horn: "#D8C2C5", cheek: "#E8CBC8" },
    "devil-stable": { body: "#AFC0A7", wing: "#9EB3C4", horn: "#D8C2C5", cheek: "#E8CBC8" },
    "devil-peek": { body: "#BBC3B1", wing: "#AEBECD", horn: "#D8C2C5", cheek: "#E5C8C5" },
    "devil-smile": { body: "#C8BBC4", wing: "#AEBECD", horn: "#D6B5C0", cheek: "#E4BFC4" },
    "devil-chaos": { body: "#BFA8B6", wing: "#9EB3C4", horn: "#C995A0", cheek: "#E5B8C1" },
    "devil-takeover": { body: "#B39AAD", wing: "#96AFC2", horn: "#C58D9A", cheek: "#E4B2BF" }
  }[state];

  const mouth =
    state === "devil-smile" || state === "devil-chaos" || state === "devil-takeover"
      ? "M36 55C42 64 55 64 61 55"
      : state === "devil-peek"
        ? "M39 56C44 53 52 53 57 56"
        : "M36 54C43 60 53 60 60 54";

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <svg
        className={sizes[size]}
        viewBox="0 0 112 112"
        fill="none"
        role="img"
        aria-label={label ?? `低熵小魔头：${meta.label}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {state === "devil-chaos" ? <TaskPile /> : null}
        <path d="M25 54C14 49 9 40 9 31C22 32 32 41 36 52" fill={palette.wing} opacity="0.72" />
        <path d="M87 54C98 49 103 40 103 31C90 32 80 41 76 52" fill={palette.wing} opacity="0.72" />
        <path d="M39 33L31 14L52 28" fill={palette.horn} />
        <path d="M73 33L81 14L60 28" fill={palette.horn} />
        <circle cx="56" cy="56" r="34" fill={palette.body} />
        {state === "devil-calm" ? <Sunglasses /> : <Eyes state={state} />}
        <circle cx="36" cy="69" r="5" fill={palette.cheek} opacity="0.68" />
        <circle cx="76" cy="69" r="5" fill={palette.cheek} opacity="0.68" />
        <path d={mouth} stroke="#354033" strokeWidth="4" strokeLinecap="round" />
        {state === "devil-calm" ? <CoffeeCup /> : null}
        {state === "devil-stable" ? <Checklist /> : null}
        {state === "devil-peek" ? <PeekPanel /> : null}
        {state === "devil-takeover" ? <Flag /> : null}
      </svg>
      {showCopy ? <p className="max-w-44 text-center text-xs font-bold leading-5 muted">{meta.copy}</p> : null}
    </div>
  );
}

function Eyes({ state }: { state: DevilState }) {
  const wide = state === "devil-peek";
  return (
    <>
      <circle cx="43" cy="57" r={wide ? 4.5 : 4} fill="#354033" />
      <circle cx="69" cy="57" r={wide ? 4.5 : 4} fill="#354033" />
      <circle cx="41.5" cy="55.5" r="1.3" fill="white" />
      <circle cx="67.5" cy="55.5" r="1.3" fill="white" />
      {state === "devil-smile" || state === "devil-chaos" || state === "devil-takeover" ? (
        <>
          <path d="M36 47L48 50" stroke="#354033" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
          <path d="M76 47L64 50" stroke="#354033" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        </>
      ) : null}
    </>
  );
}

function Sunglasses() {
  return (
    <>
      <rect x="34" y="51" width="18" height="10" rx="4" fill="#354033" />
      <rect x="60" y="51" width="18" height="10" rx="4" fill="#354033" />
      <path d="M52 56H60" stroke="#354033" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 51L31 49" stroke="#354033" strokeWidth="3" strokeLinecap="round" />
      <path d="M76 51L81 49" stroke="#354033" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function CoffeeCup() {
  return (
    <>
      <path d="M72 75H91V85C91 91 86 95 80 95C75 95 72 91 72 85V75Z" fill="#FFF8EF" opacity="0.9" />
      <path d="M90 78H96C98 78 100 80 100 83C100 86 98 88 95 88H91" stroke="#9A8B7A" strokeWidth="3" />
      <path d="M76 70C75 67 77 65 76 62" stroke="#9A8B7A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M83 70C82 67 84 65 83 62" stroke="#9A8B7A" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function Checklist() {
  return (
    <g transform="translate(68 70)">
      <rect width="27" height="24" rx="6" fill="#FFF8EF" opacity="0.94" />
      <path d="M7 8L10 11L15 6" stroke="#7C8B73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 17H20" stroke="#9EB3C4" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function PeekPanel() {
  return <path d="M16 82C25 76 35 75 45 80V99H16V82Z" fill="#FFF8EF" opacity="0.78" />;
}

function TaskPile() {
  return (
    <>
      <rect x="17" y="80" width="34" height="12" rx="4" fill="#FFF8EF" opacity="0.85" />
      <rect x="58" y="83" width="37" height="12" rx="4" fill="#E6D9D0" opacity="0.85" />
      <rect x="31" y="93" width="49" height="12" rx="4" fill="#FFF8EF" opacity="0.9" />
    </>
  );
}

function Flag() {
  return (
    <>
      <path d="M81 35V83" stroke="#354033" strokeWidth="4" strokeLinecap="round" />
      <path d="M83 38C91 36 97 39 102 43C96 46 91 49 83 47V38Z" fill="#C58D9A" />
      <path d="M78 83H91" stroke="#354033" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}
