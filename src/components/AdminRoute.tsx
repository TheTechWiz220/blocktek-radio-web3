import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as api from '@/lib/api';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await api.getMe();
        if (!mounted) return;
        const profile = me.profile;
        setIsAdmin(profile?.role === 'admin');
      } catch (e) {
        // not authenticated or error
        setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="min-h-screen p-8">Checking permissions...</div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
