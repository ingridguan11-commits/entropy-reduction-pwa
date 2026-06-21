"use client";

import DevilAlertModal from "@/components/DevilAlertModal";
import { useAppState } from "@/context/AppState";
import LowEntropyImp from "./LowEntropyImp";

export default function AppOverlays() {
  const { notice, setNotice } = useAppState();

  return (
    <>
      <DevilAlertModal />
      {notice ? (
        <div className="fixed inset-x-0 top-5 z-50 mx-auto w-[min(calc(100%-24px),480px)]">
          <div className="card p-4">
            <div className="flex gap-3">
              <LowEntropyImp state={notice.devilState ?? "devil-peek"} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black">{notice.title}</p>
                <p className="mt-1 text-sm muted">{notice.body}</p>
              </div>
            </div>
            <button className="btn btn-primary mt-3 w-full" onClick={() => setNotice(undefined)}>
              收到，开始镇压
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
