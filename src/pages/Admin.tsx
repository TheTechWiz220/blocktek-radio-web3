import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function AdminPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const me = await api.getMe();
        setProfile(me.profile || null);
        if (me.profile?.role !== 'admin') {
          setLoading(false);
          return;
        }
        const resp = await api.getDjRequests();
        setRequests(resp.requests || []);
      } catch (e: any) {
        toast({ title: 'Error', description: 'Failed to load admin data' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.approveDjRequest(id);
      toast({ title: 'Approved', description: 'DJ request approved' });
      setRequests((r) => r.map((it) => (it.id === id ? { ...it, status: 'approved' } : it)));
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to approve' });
    }
  };

  if (loading) return <div className="min-h-screen p-8">Loading...</div>;
  if (!profile || profile.role !== 'admin') return <div className="min-h-screen p-8">You are not authorized to view this page.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold mb-4">Admin — DJ Requests</h1>
        <div className="space-y-4">
          {requests.length === 0 && <Card className="p-4">No requests</Card>}
          {requests.map((r) => (
            <Card key={r.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{r.displayName || r.email}</div>
                <div className="text-sm text-muted-foreground">Requested: {new Date(r.createdAt).toLocaleString()}</div>
                <div className="text-sm">Status: {r.status}</div>
              </div>
              <div>
                {r.status === 'pending' ? (
                  <Button onClick={() => handleApprove(r.id)}>Approve</Button>
                ) : (
                  <span className="text-sm text-green-600">Processed</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
