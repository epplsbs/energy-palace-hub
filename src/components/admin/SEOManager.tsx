import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, RefreshCw, AlertTriangle, CheckCircle2, Globe, Activity, Bot, Edit, Save, X } from 'lucide-react';

interface SEORow {
  id: string;
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  canonical_url: string | null;
  robots_directives: string | null;
  schema_markup: any;
  is_active: boolean;
  auto_generated: boolean;
  last_auto_generated_at: string | null;
}

interface AuditRow {
  id: string;
  page_path: string;
  issue_type: string;
  severity: string;
  details: any;
  created_at: string;
}

const SEOManager = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<SEORow[]>([]);
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [generatingPath, setGeneratingPath] = useState<string | null>(null);
  const [editing, setEditing] = useState<SEORow | null>(null);

  const load = async () => {
    const [s, a] = await Promise.all([
      supabase.from('seo_settings').select('*').order('page_path'),
      supabase.from('seo_audit_log').select('*').eq('resolved', false).order('created_at', { ascending: false }).limit(200),
    ]);
    setRows((s.data as any) || []);
    setAudits((a.data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const runFullScan = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-cron', { body: {} });
      if (error) throw error;
      toast({ title: 'SEO scan complete', description: `Processed: ${data?.results?.processed ?? 0}, Skipped: ${data?.results?.skipped ?? 0}, Audits: ${data?.results?.audits ?? 0}` });
      load();
    } catch (e: any) {
      toast({ title: 'Scan failed', description: e.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const generateOne = async (page_path: string, title?: string, content?: string) => {
    setGeneratingPath(page_path);
    try {
      const { data, error } = await supabase.functions.invoke('seo-generate', {
        body: { page: { page_path, title, content, type: 'page' }, force: true },
      });
      if (error) throw error;
      toast({ title: 'Generated', description: page_path });
      load();
    } catch (e: any) {
      toast({ title: 'Generation failed', description: e.message, variant: 'destructive' });
    } finally {
      setGeneratingPath(null);
    }
  };

  const pingGoogle = async () => {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap?ping=1`;
      const r = await fetch(url);
      const j = await r.json();
      toast({ title: 'Sitemap ping', description: `Google responded: ${j.status ?? 'ok'}` });
    } catch (e: any) {
      toast({ title: 'Ping failed', description: e.message, variant: 'destructive' });
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase.from('seo_settings').update({
      meta_title: editing.meta_title, meta_description: editing.meta_description,
      meta_keywords: editing.meta_keywords, og_title: editing.og_title,
      og_description: editing.og_description, og_image: editing.og_image,
      twitter_title: editing.twitter_title, twitter_description: editing.twitter_description,
      canonical_url: editing.canonical_url, robots_directives: editing.robots_directives,
      auto_generated: false,
    }).eq('id', editing.id);
    if (error) { toast({ title: 'Save failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Saved (manual override)' });
    setEditing(null); load();
  };

  const totalPages = rows.length;
  const autoCount = rows.filter(r => r.auto_generated).length;
  const missingMeta = rows.filter(r => !r.meta_title || !r.meta_description).length;
  const missingSchema = rows.filter(r => !r.schema_markup).length;
  const sitemapUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap`;

  if (loading) return <div className="p-6 text-slate-600">Loading SEO engine…</div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Bot className="h-6 w-6 text-emerald-600" /> SEO Automation Engine</h2>
          <p className="text-sm text-slate-500">Self-maintaining SEO. AI generates and refreshes everything daily — manual overrides optional.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runFullScan} disabled={running} className="bg-emerald-600 hover:bg-emerald-700">
            {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Run Full SEO Scan
          </Button>
          <Button variant="outline" onClick={pingGoogle}><Globe className="h-4 w-4 mr-2" /> Ping Google</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-3xl font-bold">{totalPages}</div><div className="text-xs text-slate-500">Pages tracked</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-3xl font-bold text-emerald-600">{autoCount}</div><div className="text-xs text-slate-500">Auto-generated</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-3xl font-bold text-amber-600">{missingMeta}</div><div className="text-xs text-slate-500">Missing meta</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-3xl font-bold text-red-600">{audits.length}</div><div className="text-xs text-slate-500">Open issues</div></CardContent></Card>
      </div>

      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="health">Health ({audits.length})</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap & Robots</TabsTrigger>
          <TabsTrigger value="schedule">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="pt-6 space-y-3">
          {rows.length === 0 && (
            <Card><CardContent className="pt-6 text-center text-slate-500">No SEO records yet. Click <strong>Run Full SEO Scan</strong> to auto-generate metadata for every page.</CardContent></Card>
          )}
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-sm font-mono text-emerald-700">{r.page_path}</code>
                      {r.auto_generated ? <Badge variant="secondary" className="gap-1"><Sparkles className="h-3 w-3" /> AI</Badge> : <Badge variant="outline">Manual</Badge>}
                      {!r.meta_title && <Badge variant="destructive">No title</Badge>}
                      {!r.meta_description && <Badge variant="destructive">No description</Badge>}
                      {!r.schema_markup && <Badge variant="outline">No schema</Badge>}
                    </div>
                    <p className="font-semibold mt-1 truncate">{r.meta_title || '—'}</p>
                    <p className="text-sm text-slate-500 line-clamp-2">{r.meta_description || '—'}</p>
                    {r.last_auto_generated_at && (
                      <p className="text-xs text-slate-400 mt-1">Updated {new Date(r.last_auto_generated_at).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => generateOne(r.page_path, r.meta_title || undefined, r.meta_description || undefined)} disabled={generatingPath === r.page_path}>
                      {generatingPath === r.page_path ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(r)}><Edit className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="health" className="pt-6 space-y-2">
          {audits.length === 0 && (
            <Card><CardContent className="pt-6 text-center text-emerald-700"><CheckCircle2 className="h-6 w-6 mx-auto mb-2" /> No SEO issues detected.</CardContent></Card>
          )}
          {audits.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-4 flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${a.severity === 'error' ? 'text-red-500' : 'text-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><Badge variant={a.severity === 'error' ? 'destructive' : 'secondary'}>{a.issue_type}</Badge> <code className="text-xs">{a.page_path}</code></div>
                  <p className="text-xs text-slate-500 truncate">{JSON.stringify(a.details)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sitemap" className="pt-6 space-y-3">
          <Card><CardHeader><CardTitle>Sitemap.xml</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">Dynamically generated from your DB content. Auto-refreshed daily.</p>
              <code className="block bg-slate-100 p-2 rounded text-xs break-all">/sitemap.xml</code>
              <code className="block bg-slate-100 p-2 rounded text-xs break-all">{sitemapUrl}</code>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild><a href={sitemapUrl} target="_blank" rel="noopener">View Sitemap</a></Button>
                <Button size="sm" onClick={pingGoogle}>Ping Google Now</Button>
              </div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Robots.txt</CardTitle></CardHeader>
            <CardContent>
              <code className="block bg-slate-100 p-2 rounded text-xs break-all">/robots.txt</code>
              <Button size="sm" variant="outline" className="mt-2" asChild><a href={`${sitemapUrl}?type=robots`} target="_blank" rel="noopener">View Robots</a></Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="pt-6 space-y-3">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Daily Automation</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span>SEO auto-fill scan</span><Badge>03:00 UTC daily</Badge></div>
              <div className="flex justify-between"><span>Sitemap regeneration</span><Badge>On every request (cached 1h)</Badge></div>
              <div className="flex justify-between"><span>Google sitemap ping</span><Badge>03:30 UTC daily</Badge></div>
              <div className="flex justify-between"><span>Image alt-text generation</span><Badge>On upload</Badge></div>
              <div className="flex justify-between"><span>Content-change detection</span><Badge>SHA-256 hash skip</Badge></div>
              <p className="text-xs text-slate-500 pt-2">All automation runs server-side via Supabase pg_cron. No manual intervention required.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader><CardTitle className="flex items-center justify-between">Manual Override: {editing.page_path} <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Meta Title</Label><Input value={editing.meta_title || ''} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} /></div>
              <div><Label>Meta Description</Label><Textarea rows={3} value={editing.meta_description || ''} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} /></div>
              <div><Label>Keywords</Label><Input value={editing.meta_keywords || ''} onChange={(e) => setEditing({ ...editing, meta_keywords: e.target.value })} /></div>
              <div><Label>OG Title</Label><Input value={editing.og_title || ''} onChange={(e) => setEditing({ ...editing, og_title: e.target.value })} /></div>
              <div><Label>OG Description</Label><Textarea rows={2} value={editing.og_description || ''} onChange={(e) => setEditing({ ...editing, og_description: e.target.value })} /></div>
              <div><Label>OG Image URL</Label><Input value={editing.og_image || ''} onChange={(e) => setEditing({ ...editing, og_image: e.target.value })} /></div>
              <div><Label>Twitter Title</Label><Input value={editing.twitter_title || ''} onChange={(e) => setEditing({ ...editing, twitter_title: e.target.value })} /></div>
              <div><Label>Twitter Description</Label><Textarea rows={2} value={editing.twitter_description || ''} onChange={(e) => setEditing({ ...editing, twitter_description: e.target.value })} /></div>
              <div><Label>Canonical URL</Label><Input value={editing.canonical_url || ''} onChange={(e) => setEditing({ ...editing, canonical_url: e.target.value })} /></div>
              <div className="flex gap-2"><Button onClick={saveEdit}><Save className="h-4 w-4 mr-2" /> Save Override</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SEOManager;