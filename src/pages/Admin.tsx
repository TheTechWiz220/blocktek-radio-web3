import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function AdminPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [jumpTo, setJumpTo] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const me = await api.getMe();
        setProfile(me.profile || null);
        if (me.profile?.role !== 'admin') {
          setLoading(false);
          return;
        }
        const resp = await api.getDjRequests({ page, pageSize, q: query, status: filter });
        setRequests(resp.requests || []);
        setTotal(resp.total || 0);
      } catch (e: any) {
        toast({ title: 'Error', description: 'Failed to load admin data' });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filter, query]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    toast({ title: 'Logged out', description: 'You have been signed out' });
    navigate('/dashboard');
  };

  const exportCsv = () => {
    const rows = requests.map((r) => ({
      id: r.id,
      email: r.email,
      displayName: r.displayName,
      status: r.status,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : '',
      processedAt: r.processedAt ? new Date(r.processedAt).toISOString() : '',
      adminId: r.adminId || '',
    }));
    const header = Object.keys(rows[0] || {}).join(',') + '\n';
    const csv = header + rows.map((row) => Object.values(row).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dj_requests_page_${page}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: 'Copied to clipboard' });
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to copy' });
    }
  };

  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string) || '';

  const handleApprove = async (id: number) => {
    try {
      const resp = await api.approveDjRequest(id);
      const updated = resp.request;
      toast({ title: 'Approved', description: 'DJ request approved' });
      // refresh current page
      try {
        setLoading(true);
        const list = await api.getDjRequests({ page, pageSize, q: query, status: filter });
        setRequests(list.requests || []);
        setTotal(list.total || 0);
      } finally {
        setLoading(false);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to approve' });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const resp = await api.rejectDjRequest(id);
      const updated = resp.request;
      toast({ title: 'Rejected', description: 'DJ request rejected' });
      // refresh current page
      try {
        setLoading(true);
        const list = await api.getDjRequests({ page, pageSize, q: query, status: filter });
        setRequests(list.requests || []);
        setTotal(list.total || 0);
      } finally {
        setLoading(false);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to reject' });
    }
  };

  const filtered = requests.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (r.email && r.email.toLowerCase().includes(q)) || (r.displayName && r.displayName.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const pageWindowStart = Math.max(1, page - 3);
  const pageWindowEnd = Math.min(totalPages, page + 3);
  const pageNumbers = [] as number[];
  for (let i = pageWindowStart; i <= pageWindowEnd; i++) pageNumbers.push(i);

  if (loading) return <div className="min-h-screen p-8">Loading...</div>;
  if (!profile || profile.role !== 'admin') return <div className="min-h-screen p-8">You are not authorized to view this page.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold mb-4">Admin — DJ Requests</h1>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input type="text" placeholder="Search by email or name" className="input input-bordered" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
          <select value={filter} onChange={(e) => { setFilter(e.target.value as any); setPage(1); }} className="select select-bordered">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={String(pageSize)} onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }} className="select select-bordered">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <Button variant="ghost" onClick={async () => { setLoading(true); try { const resp = await api.getDjRequests({ page, pageSize, q: query, status: filter }); setRequests(resp.requests || []); setTotal(resp.total || 0); } catch {} finally { setLoading(false); } }}>Refresh</Button>
          <Button variant="secondary" onClick={exportCsv}>Export CSV</Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && <Card className="p-4">No requests</Card>}
          {filtered.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-medium">{r.displayName || r.email}</div>
                  <div className="text-sm text-muted-foreground">Email: {r.email}</div>
                  <div className="text-sm text-muted-foreground">Requested: {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'unknown'}</div>
                  <div className="text-sm">Status: <strong>{r.status}</strong> {r.processedAt ? <span className="ml-2 text-sm text-muted-foreground">(processed: {new Date(r.processedAt).toLocaleString()})</span> : null}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={async () => {
                    // lazy-load details: fetch first, then open modal to avoid flicker if fetch fails
                    setSelected(null);
                    setModalLoading(true);
                    try {
                      const resp = await api.getDjRequest(r.id);
                      setSelected(resp.request || null);
                      setOpen(true);
                    } catch (err: any) {
                      console.error('Failed to load request details', err);
                      const msg = err?.error || err?.message || (typeof err === 'string' ? err : JSON.stringify(err));
                      toast({ title: 'Error', description: msg || 'Failed to load details' });
                    } finally {
                      setModalLoading(false);
                    }
                  }}>View</Button>
                  {r.status === 'pending' ? (
                    <>
                      <Button onClick={() => handleApprove(r.id)}>Approve</Button>
                      <Button variant="destructive" onClick={() => handleReject(r.id)}>Reject</Button>
                    </>
                  ) : (
                    <span className="text-sm text-green-600">Processed by {r.adminId || '—'}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Total: {total}</div>
            <div className="flex items-center gap-2">
              <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <div className="hidden sm:flex items-center gap-1">
                {page > 4 && (
                  <Button variant="ghost" onClick={() => setPage(1)}>1</Button>
                )}
                {page > 5 && <span className="px-2">…</span>}
                {pageNumbers.map((pn) => (
                  <Button key={pn} variant={pn === page ? undefined : 'ghost'} onClick={() => setPage(pn)} className={pn === page ? 'bg-primary text-primary-foreground' : ''}>{pn}</Button>
                ))}
                {page < totalPages - 4 && <span className="px-2">…</span>}
                {page <= totalPages && totalPages > 1 && (
                  <Button variant="ghost" onClick={() => setPage(totalPages)}>{totalPages}</Button>
                )}
              </div>
              <div className="text-sm">Page {page} of {totalPages}</div>
              <Button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              <div className="flex items-center gap-2 ml-2">
                <input type="number" min={1} max={totalPages} value={jumpTo} onChange={(e) => setJumpTo(e.target.value)} className="input input-sm w-20" placeholder="#" />
                <Button onClick={() => { const v = Math.min(totalPages, Math.max(1, Number(jumpTo || 1))); if (!Number.isNaN(v)) { setPage(v); setJumpTo(''); } }}>Go</Button>
              </div>
            </div>
          </div>

          {/* details dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Details</DialogTitle>
                <DialogDescription>Details for the DJ request</DialogDescription>
              </DialogHeader>
              {modalLoading ? (
                <div>Loading details...</div>
              ) : selected ? (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-4">
                    {selected.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selected.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted" />
                    )}
                    <div>
                      <div><strong>Name:</strong> {selected.displayName || '—'}</div>
                      <div className="text-sm text-muted-foreground">Email: {selected.email}</div>
                    </div>
                  </div>
                  <div><strong>Status:</strong> {selected.status}</div>
                  <div><strong>Requested:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</div>
                  <div><strong>Processed At:</strong> {selected.processedAt ? new Date(selected.processedAt).toLocaleString() : '—'}</div>
                  <div><strong>Processed By:</strong> {selected.adminId || '—'}</div>
                  <div><strong>Bio:</strong> {selected.bio || '—'}</div>
                </div>
              ) : <div>No request selected</div>}
              <DialogFooter className="mt-4">
                {selected && (
                  <div className="flex items-center gap-2 mr-auto">
                    <Button variant="ghost" onClick={() => copyToClipboard(selected.email)}>Copy email</Button>
                    <Button variant="ghost" onClick={() => { window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent('Your DJ request')}&body=${encodeURIComponent('Hello,\n\nWe\'re reviewing your DJ request. Contact: ' + adminEmail)}`; }}>Send email</Button>
                  </div>
                )}
                {selected && selected.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button onClick={async () => {
                      try {
                        await api.approveDjRequest(selected.id);
                        toast({ title: 'Approved', description: 'DJ request approved' });
                        // update request in list and selected
                        setRequests((r) => r.map((it) => it.id === selected.id ? { ...it, status: 'approved', processedAt: Date.now(), adminId: profile?.id || it.adminId } : it));
                        setSelected((s: any) => s ? { ...s, status: 'approved', processedAt: Date.now(), adminId: profile?.id || s.adminId } : s);
                      } catch (err: any) {
                        toast({ title: 'Error', description: err?.message || 'Failed to approve' });
                      }
                    }}>Approve</Button>
                    <Button variant="destructive" onClick={async () => {
                      try {
                        await api.rejectDjRequest(selected.id);
                        toast({ title: 'Rejected', description: 'DJ request rejected' });
                        setRequests((r) => r.map((it) => it.id === selected.id ? { ...it, status: 'rejected', processedAt: Date.now(), adminId: profile?.id || it.adminId } : it));
                        setSelected((s: any) => s ? { ...s, status: 'rejected', processedAt: Date.now(), adminId: profile?.id || s.adminId } : s);
                      } catch (err: any) {
                        toast({ title: 'Error', description: err?.message || 'Failed to reject' });
                      }
                    }}>Reject</Button>
                  </div>
                )}
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
