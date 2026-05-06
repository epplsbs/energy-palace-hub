import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Zap, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface ChargerStatusData {
  id: number;
  charger_id: string;
  connector_id: number;
  is_available: boolean;
  updated_at: string;
  error_code?: string | null;
}

const ChargerStatus = () => {
  const [statuses, setStatuses] = useState<ChargerStatusData[]>([]);
  const [overallAvailable, setOverallAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Charger Status - Energy Palace";

    const loadInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from("charger_status")
          .select("*")
          .order("charger_id")
          .order("connector_id");

        if (error) {
          console.error("Error loading charger status:", error);
          setLoading(false);
          return;
        }

        if (data) {
          setStatuses(data as ChargerStatusData[]);
          setLastUpdate(new Date().toLocaleString());
        }
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };

    loadInitialData();

    const channel = supabase
      .channel("charger_status_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "charger_status" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setStatuses((prev) => [...prev, payload.new as ChargerStatusData]);
          } else if (payload.eventType === "UPDATE") {
            setStatuses((prev) =>
              prev.map((item) =>
                item.id === (payload.new as ChargerStatusData).id
                  ? (payload.new as ChargerStatusData)
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setStatuses((prev) =>
              prev.filter((item) => item.id !== (payload.old as ChargerStatusData).id)
            );
          }
          setLastUpdate(new Date().toLocaleString());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setOverallAvailable(statuses.some((item) => item.is_available));
  }, [statuses]);

  const getStatusBadge = (status: ChargerStatusData) => {
    if (status.is_available) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Available
        </span>
      );
    } else if (status.error_code && status.error_code !== "NoError") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
          <AlertCircle className="h-3.5 w-3.5" />
          Error: {status.error_code}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 ring-1 ring-red-500/30">
        <XCircle className="h-3.5 w-3.5" />
        In Use
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-semibold">EV Charger Status</h1>
              <p className="text-xs text-slate-400">Live availability monitoring</p>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {lastUpdate ? `Updated: ${lastUpdate}` : "Loading..."}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <p className="text-sm text-slate-400">Loading charger status...</p>
          </div>
        ) : (
          <>
            {/* Overall Status Card */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 shadow-2xl mb-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Overall Status</h2>
                  <p className="text-sm text-slate-400">
                    {statuses.length} total connectors
                  </p>
                </div>
                <span
                  className={[
                    "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xl font-extrabold tracking-wide ring-1 shadow-lg",
                    overallAvailable
                      ? "bg-emerald-500 text-white ring-emerald-400/40 shadow-emerald-500/30"
                      : "bg-red-500 text-white ring-red-400/40 shadow-red-500/30",
                  ].join(" ")}
                >
                  {overallAvailable ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                  {overallAvailable ? "OPEN" : "FULL"}
                </span>
              </div>
            </div>

            {/* Connector Details */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Connector Details
              </h3>

              {statuses.length === 0 ? (
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-8 text-center">
                  <p className="text-sm text-slate-400">No charger data available</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {statuses.map((status) => (
                    <div
                      key={status.id}
                      className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="text-base font-semibold">
                            {status.charger_id}
                          </div>
                          <div className="text-xs text-slate-400">
                            Connector {status.connector_id}
                          </div>
                        </div>
                        {getStatusBadge(status)}
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Status:</span>
                          <span className={status.is_available ? "text-emerald-400" : "text-red-400"}>
                            {status.is_available ? "Available" : "Occupied"}
                          </span>
                        </div>
                        {status.error_code && status.error_code !== "NoError" && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Error:</span>
                            <span className="text-amber-400">{status.error_code}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last Update:</span>
                          <span className="text-slate-300">
                            {new Date(status.updated_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
              <h3 className="text-sm font-semibold mb-2">How it works</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• Status updates are sent from the Star Charge station via OCPP 1.6J</li>
                <li>• Updates are processed through Pipedream and stored in Supabase</li>
                <li>• This page refreshes in real-time as charger status changes</li>
                <li>• Green = Available for charging | Red = Currently in use</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ChargerStatus;
