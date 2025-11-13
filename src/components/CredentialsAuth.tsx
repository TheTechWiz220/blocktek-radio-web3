import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import * as api from "@/lib/api";

async function hashPassword(password: string) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function CredentialsAuth(props: { onLogin?: (profile: any) => void; triggerLabel?: string; variant?: 'default' | 'admin' }) {
  const { onLogin, triggerLabel } = props;
  const variant = props.variant ?? 'default';
  const isAdmin = String(variant) === 'admin';
  const [open, setOpen] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminHelp, setShowAdminHelp] = useState(false);
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword) {
      toast({ title: "Missing fields", description: "Please provide email and password" });
      return;
    }
    console.log('Attempting register', registerEmail);
    setIsSubmitting(true);
    try {
      await api.register(registerEmail, registerPassword);
      // fetch profile from server
      let profile = null;
      try {
        const me = await api.getMe();
        profile = me.profile || null;
      } catch (e) {
        // ignore
      }
      toast({ title: "Registered", description: "Account created and logged in" });
      setOpen(false);
      onLogin?.(profile);
    } catch (e: any) {
      console.error('Register error', e);
      const msg = e?.error || e?.message || 'Could not register';
      toast({ title: 'Registration failed', description: msg });
      try { alert('Registration failed: ' + msg); } catch {}
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Missing fields", description: "Please provide email and password" });
      return;
    }
    console.log('Attempting login', loginEmail);
    setIsSubmitting(true);
    try {
      await api.login(loginEmail, loginPassword);
      // fetch profile
      let profile = null;
      try {
        const me = await api.getMe();
        profile = me.profile || null;
      } catch (e) {
        // ignore
      }
      toast({ title: "Logged in", description: "Welcome back" });
      setOpen(false);
      onLogin?.(profile);
      return;
    } catch (e: any) {
      console.error('Login error', e);
      const msg = e?.error || e?.message || 'Invalid credentials';
      toast({ title: 'Login failed', description: msg });
      try { alert('Login failed: ' + msg); } catch {}
    } finally {
      setIsSubmitting(false);
    }
  };

  // build mailto link safely for admin help
  const adminMailto = (() => {
    try {
      const recipient = (import.meta as any).env?.VITE_ADMIN_EMAIL || 'owner@example.com';
      const subject = encodeURIComponent('Admin Access Request - BlockTek Radio');
      const bodyText = `Hello,%0A%0AI would like to request admin access for BlockTek Radio.%0A%0AMy email: ${loginEmail || registerEmail || '[your email]'}%0A%0AThanks.`;
      const body = encodeURIComponent(bodyText);
      return `mailto:${recipient}?subject=${subject}&body=${body}`;
    } catch (e) {
      return 'mailto:owner@example.com';
    }
  })();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button variant="outline">{triggerLabel || 'Sign in with credentials'}</Button>
        </DialogTrigger>
  <DialogContent className={isAdmin ? 'bg-slate-900 text-white border border-slate-800' : ''}>
        <DialogHeader>
          <DialogTitle>Sign in or Register</DialogTitle>
          <DialogDescription>{isAdmin ? 'Admin sign-in. Contact owner to create an admin or use the seeded admin account.' : 'Use an email and password to sign in (client-side demo).'}</DialogDescription>
          {isAdmin && (
            <div className="mt-2 text-sm">
              <button type="button" className="underline text-sm text-primary" onClick={() => setShowAdminHelp((s) => !s)}>
                Need admin access?
              </button>
              {showAdminHelp && (
                <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                  <p>If you need admin access, contact the project owner. Use the template below to request access:</p>
                  <pre className="mt-2 whitespace-pre-wrap bg-transparent p-0 text-xs">Hello,{"\n"}{"\n"}I would like to request admin access for BlockTek Radio. My email: {loginEmail || registerEmail || '[your email]'}{"\n"}{"\n"}Thank you.</pre>
                  <div className="mt-2">
                    <a className="text-sm text-primary underline" href={adminMailto}>Send email to owner</a>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-4">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            {!isAdmin && <TabsTrigger value="register">Register</TabsTrigger>}
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <div className="grid gap-2">
              <Input placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <div className="flex justify-end mt-2">
                <Button onClick={handleLogin} disabled={isSubmitting} className={isAdmin ? 'bg-purple-600 hover:bg-purple-700 text-white rounded-lg' : ''}>{isSubmitting ? 'Working...' : 'Login'}</Button>
              </div>
            </div>
          </TabsContent>
          {!isAdmin && (
            <TabsContent value="register" className="mt-4">
              <div className="grid gap-2">
                <Input placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                <Input placeholder="Password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleRegister} disabled={isSubmitting} className={isAdmin ? 'bg-purple-600 hover:bg-purple-700 text-white rounded-lg' : ''}>{isSubmitting ? 'Working...' : 'Register'}</Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
