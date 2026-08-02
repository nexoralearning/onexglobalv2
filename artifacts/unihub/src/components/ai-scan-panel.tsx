/**
 * Reusable AI content scanner — paste text or upload a file (image/PDF/txt).
 * Calls POST /api/ai/scan-content and returns a ScanResult via onResult.
 */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles, Upload, FileText, Image, Loader2, X,
  BarChart2, Clock, BookOpen, Lightbulb, Key, CheckSquare,
} from "lucide-react";

export interface ScanResult {
  summary: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  topics: string[];
  approach: string;
  estimatedHours: number | null;
  keyPoints: string[];
  contentType: string;
  scannedAt: string;
}

interface Props {
  context?: string;         // e.g. assignment title / subject hint
  onResult?: (r: ScanResult) => void;
  compact?: boolean;        // if true, no outer card border / padding
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:      "text-green-400 bg-green-400/10 border-green-400/20",
  Medium:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Hard:      "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Very Hard": "text-red-400 bg-red-400/10 border-red-400/20",
};

const ACCEPTED = ".txt,.md,.csv,.pdf,.png,.jpg,.jpeg,.webp,.gif";

async function callScanContent(payload: object): Promise<ScanResult> {
  const res = await fetch("/api/ai/scan-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Scan failed");
  }
  return res.json() as Promise<ScanResult>;
}

function readFileAsBase64(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:<mimeType>;base64,<data>"
      const [header, data] = result.split(",");
      const mimeType = header.replace("data:", "").replace(";base64", "");
      resolve({ data, mimeType });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function ScanResultPanel({ result }: { result: ScanResult }) {
  const diffClass = DIFFICULTY_COLOR[result.difficulty] ?? DIFFICULTY_COLOR["Medium"];
  return (
    <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        AI Scan — {result.contentType}
      </div>

      <p className="text-sm text-foreground/90 leading-relaxed">{result.summary}</p>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${diffClass}`}>
          <BarChart2 className="w-3 h-3" />
          {result.difficulty}
        </span>
        {result.estimatedHours != null && (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border text-muted-foreground bg-sidebar border-border">
            <Clock className="w-3 h-3" />
            ~{result.estimatedHours}h
          </span>
        )}
        {result.topics.map(t => (
          <span key={t} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border text-muted-foreground bg-sidebar border-border">
            <BookOpen className="w-3 h-3" />
            {t}
          </span>
        ))}
      </div>

      {result.keyPoints.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            <Key className="w-3 h-3" /> Key Points
          </div>
          <ul className="space-y-1">
            {result.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                {kp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.approach && (
        <div className="flex gap-2 text-sm text-muted-foreground">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400" />
          <p className="leading-relaxed">{result.approach}</p>
        </div>
      )}
    </div>
  );
}

export function AiScanPanel({ context, onResult, compact }: Props) {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canScan = mode === "text" ? text.trim().length > 20 : !!file;

  const handleScan = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      let payload: Record<string, string | undefined>;
      if (mode === "file" && file) {
        const isText = file.type.startsWith("text/") || /\.(txt|md|csv)$/i.test(file.name);
        if (isText) {
          const content = await readFileAsText(file);
          payload = { text: content, context };
        } else {
          const { data, mimeType } = await readFileAsBase64(file);
          payload = { fileData: data, mimeType, context };
        }
      } else {
        payload = { text, context };
      }
      const r = await callScanContent(payload);
      setResult(r);
      onResult?.(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => { setFile(null); if (fileRef.current) fileRef.current.value = ""; };

  return (
    <div className={compact ? "" : "rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 space-y-3"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Content Scanner
        </div>
        {result && (
          <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground gap-1"
            onClick={() => { setResult(null); setError(""); }}
          >
            <X className="w-3 h-3" /> Clear
          </Button>
        )}
      </div>

      {!result && (
        <>
          <Tabs value={mode} onValueChange={v => setMode(v as "text" | "file")} className="w-full">
            <TabsList className="h-8 bg-background/50 w-full">
              <TabsTrigger value="text" className="flex-1 h-6 text-xs gap-1.5">
                <FileText className="w-3 h-3" /> Paste Text
              </TabsTrigger>
              <TabsTrigger value="file" className="flex-1 h-6 text-xs gap-1.5">
                <Upload className="w-3 h-3" /> Upload File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-2">
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your assignment brief, lecture notes, past paper, or any text you want to analyse…"
                className="min-h-[100px] text-sm bg-background/50"
              />
              <p className="text-xs text-muted-foreground mt-1">{text.length} characters</p>
            </TabsContent>

            <TabsContent value="file" className="mt-2">
              <div
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/40 hover:bg-background/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {file ? (
                  <>
                    {file.type.startsWith("image/")
                      ? <Image className="w-8 h-8 text-primary" />
                      : <FileText className="w-8 h-8 text-primary" />}
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 mt-1"
                      onClick={e => { e.stopPropagation(); clearFile(); }}
                    >
                      <X className="w-3 h-3" /> Remove
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground/60">Images, PDF, TXT, MD — max 10 MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }}
              />
            </TabsContent>
          </Tabs>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button
            className="w-full gap-2"
            size="sm"
            onClick={handleScan}
            disabled={loading || !canScan}
          >
            {loading
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning…</>
              : <><Sparkles className="w-3.5 h-3.5" /> Scan with AI</>}
          </Button>
        </>
      )}

      {result && <ScanResultPanel result={result} />}

      {result && (
        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" onClick={() => { setResult(null); setError(""); }}>
          <Sparkles className="w-3 h-3" /> Scan Again
        </Button>
      )}
    </div>
  );
}
