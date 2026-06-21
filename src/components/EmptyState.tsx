import LowEntropyImp, { DevilState } from "./LowEntropyImp";

type EmptyStateProps = {
  title: string;
  body: string;
  state?: DevilState;
};

export default function EmptyState({ title, body, state = "devil-stable" }: EmptyStateProps) {
  return (
    <div className="soft-card flex items-center gap-3 p-4">
      <LowEntropyImp state={state} size="sm" />
      <div className="min-w-0">
        <p className="text-sm font-black">{title}</p>
        <p className="mt-1 text-sm leading-5 muted">{body}</p>
      </div>
    </div>
  );
}
