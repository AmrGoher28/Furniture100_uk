import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  AlertTriangle,
  BarChart3,
  FileWarning,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface AuditResult {
  id: string;
  product_handle: string;
  product_title: string;
  product_image: string | null;
  original_description: string | null;
  suggested_description: string | null;
  image_match_score: number | null;
  image_match_notes: string | null;
  inferred_specs: Record<string, string> | null;
  flags: string[] | null;
  status: string;
  audit_batch_id: string | null;
  created_at: string;
}

type FilterType = "all" | "flagged" | "pending" | "approved" | "dismissed";

const scoreColor = (score: number) => {
  if (score > 80) return "text-green-600 bg-green-50";
  if (score >= 50) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
};

const flagLabels: Record<string, string> = {
  description_mismatch: "Mismatch",
  missing_dimensions: "No Dimensions",
  missing_material: "No Material",
  missing_color: "No Color",
  vague_description: "Vague",
  no_image: "No Image",
};

const ProductAuditPage = () => {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [filter, setFilter] = useState<FilterType>("all");
  const [reviewItem, setReviewItem] = useState<AuditResult | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAudits = useCallback(async () => {
    const { data, error } = await supabase
      .from("product_audits")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setAudits((data as unknown as AuditResult[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const runAudit = async () => {
    setRunning(true);
    setProgress({ current: 0, total: 0 });

    let offset = 0;
    const batchSize = 5;
    let batchId: string | null = null;
    let done = false;

    try {
      while (!done) {
        const { data, error } = await supabase.functions.invoke(
          "audit-products",
          {
            body: { batchSize, offset, batchId },
          }
        );

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        const total = data.total || 0;
        batchId = data.batchId;
        done = data.done;
        offset += batchSize;

        setProgress({ current: Math.min(offset, total), total });
        await fetchAudits();
      }

      toast.success("Audit complete!");
    } catch (err) {
      console.error(err);
      toast.error("Audit failed — check console for details.");
    } finally {
      setRunning(false);
    }
  };

  const handleStatus = async (id: string, status: "approved" | "dismissed") => {
    setActionLoading(id);
    const { error } = await supabase
      .from("product_audits")
      .update({ status } as any)
      .eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(status === "approved" ? "Approved" : "Dismissed");
      fetchAudits();
      if (reviewItem?.id === id) setReviewItem(null);
    }
    setActionLoading(null);
  };

  const filtered = audits.filter((a) => {
    if (filter === "all") return true;
    if (filter === "flagged") return (a.flags?.length || 0) > 0;
    return a.status === filter;
  });

  const totalScanned = audits.length;
  const flaggedCount = audits.filter((a) => (a.flags?.length || 0) > 0).length;
  const avgScore =
    totalScanned > 0
      ? Math.round(
          audits.reduce((sum, a) => sum + (a.image_match_score || 0), 0) /
            totalScanned
        )
      : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-serif mb-1">Product Audit</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered image & description analysis
              </p>
            </div>
            <Button
              onClick={runAudit}
              disabled={running}
              className="gap-2"
            >
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {running ? "Scanning…" : "Run Audit"}
            </Button>
          </div>

          {/* Progress bar */}
          {running && progress.total > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Scanning products…</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <Progress
                value={(progress.current / progress.total) * 100}
                className="h-2"
              />
            </div>
          )}

          {/* Summary cards */}
          {totalScanned > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Total Scanned
                </div>
                <p className="text-2xl font-semibold">{totalScanned}</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <FileWarning className="h-3.5 w-3.5" />
                  Flagged
                </div>
                <p className="text-2xl font-semibold">{flaggedCount}</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Avg Match Score
                </div>
                <p className="text-2xl font-semibold">{avgScore}%</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approved
                </div>
                <p className="text-2xl font-semibold">
                  {audits.filter((a) => a.status === "approved").length}
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          {totalScanned > 0 && (
            <div className="flex gap-2 mb-6">
              {(["all", "flagged", "pending", "approved", "dismissed"] as FilterType[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                      filter === f
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {f}
                  </button>
                )
              )}
            </div>
          )}

          {/* Results table */}
          {filtered.length === 0 && !running ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">
                {totalScanned === 0
                  ? "No audit results yet"
                  : "No results match this filter"}
              </p>
              {totalScanned === 0 && (
                <p className="text-sm mt-2">
                  Click "Run Audit" to scan all products
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((audit) => (
                <div
                  key={audit.id}
                  className="border border-border rounded-lg p-4 bg-card flex flex-col md:flex-row gap-4"
                >
                  {audit.product_image && (
                    <img
                      src={audit.product_image}
                      alt={audit.product_title}
                      className="w-16 h-16 object-cover rounded-md shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {audit.product_title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {audit.image_match_score !== null && (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreColor(
                              audit.image_match_score
                            )}`}
                          >
                            {audit.image_match_score}%
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            audit.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : audit.status === "dismissed"
                              ? "bg-muted text-muted-foreground"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {audit.status}
                        </span>
                      </div>
                    </div>
                    {/* Flags */}
                    {audit.flags && audit.flags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {audit.flags.map((flag) => (
                          <Badge
                            key={flag}
                            variant="outline"
                            className="text-[10px] py-0 px-1.5"
                          >
                            <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                            {flagLabels[flag] || flag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => setReviewItem(audit)}
                      >
                        <Eye className="h-3 w-3" />
                        Review
                      </Button>
                      {audit.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs gap-1 text-green-600 hover:text-green-700"
                            disabled={actionLoading === audit.id}
                            onClick={() => handleStatus(audit.id, "approved")}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs gap-1 text-muted-foreground"
                            disabled={actionLoading === audit.id}
                            onClick={() => handleStatus(audit.id, "dismissed")}
                          >
                            <XCircle className="h-3 w-3" />
                            Dismiss
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review modal */}
          {reviewItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative">
                <button
                  onClick={() => setReviewItem(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex gap-4 mb-6">
                  {reviewItem.product_image && (
                    <img
                      src={reviewItem.product_image}
                      alt={reviewItem.product_title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-serif font-medium">
                      {reviewItem.product_title}
                    </h2>
                    {reviewItem.image_match_score !== null && (
                      <span
                        className={`inline-block text-sm font-semibold px-2.5 py-0.5 rounded-full mt-1 ${scoreColor(
                          reviewItem.image_match_score
                        )}`}
                      >
                        Match Score: {reviewItem.image_match_score}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Match notes */}
                {reviewItem.image_match_notes && (
                  <div className="mb-5">
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      AI Analysis
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {reviewItem.image_match_notes}
                    </p>
                  </div>
                )}

                {/* Description comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Original Description
                    </h3>
                    <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3 leading-relaxed">
                      {reviewItem.original_description || "—"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Suggested Description
                    </h3>
                    <p className="text-sm text-foreground bg-green-50/50 rounded-lg p-3 leading-relaxed">
                      {reviewItem.suggested_description || "No changes suggested"}
                    </p>
                  </div>
                </div>

                {/* Inferred specs */}
                {reviewItem.inferred_specs &&
                  Object.keys(reviewItem.inferred_specs).length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Inferred Specifications
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(reviewItem.inferred_specs).map(
                          ([key, value]) =>
                            value ? (
                              <div
                                key={key}
                                className="bg-muted/30 rounded-lg p-2.5"
                              >
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                  {key.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm font-medium">{value}</p>
                              </div>
                            ) : null
                        )}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                {reviewItem.status === "pending" && (
                  <div className="flex gap-3 pt-3 border-t border-border">
                    <Button
                      onClick={() => handleStatus(reviewItem.id, "approved")}
                      disabled={actionLoading === reviewItem.id}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatus(reviewItem.id, "dismissed")}
                      disabled={actionLoading === reviewItem.id}
                      className="gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ProductAuditPage;
