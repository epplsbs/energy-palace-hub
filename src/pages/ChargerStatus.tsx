import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Zap, CheckCircle2, XCircle } from "lucide-react";

const ChargerStatus = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const applyRow = (row: { is_available: boolean; updated_at: string }) => {
    setIsAvailable(row.is_available);
    setUpdatedAt(row.updated_at);
  };

  useEffect(() => {
    document.title = "Charger Status";

    supabase
      .from("charger_status")
      .select("is_available, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) applyRow(data);
      });

    const channel = supabase
      .channel("charger_status_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "charger_status" },
        (payload) => {
          const row = (payload.new ?? payload.old) as
            | { is_available: boolean; updated_at: string }
            | undefined;
          if (row) applyRow(row);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const open = isAvailable === true;
  const loading = isAvailable === null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* App shell header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="mx-auto max-w-md px-5 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-semibold">Charger Status</h1>
            <p className="text-xs text-slate-400">Live availability</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-md px-5 py-8 flex flex-col items-center justify-center">
        <div className="w-full rounded-3xl bg-slate-900/70 border border-slate-800 p-8 shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-slate-300 animate-spin" />
              <p className="text-sm text-slate-400">Checking status…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-6">
              <span
                className={[
                  "inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-3xl font-extrabold tracking-wide",
                  "shadow-lg ring-1 transition-all",
                  open
                    ? "bg-emerald-500 text-white ring-emerald-400/40 shadow-emerald-500/30"
                    : "bg-red-500 text-white ring-red-400/40 shadow-red-500/30",
                ].join(" ")}
              >
                {open ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <XCircle className="h-8 w-8" />
                )}
                {open ? "OPEN" : "IN USE"}
              </span>

              <p className="text-slate-300 text-sm">
                {open
                  ? "A charger is available right now."
                  : "All chargers are currently in use."}
              </p>

              {updatedAt && (
                <p className="text-xs text-slate-500">
                  Updated {new Date(updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          This page updates automatically.
        </p>
      </main>
    </div>
  );
};

export default ChargerStatus;