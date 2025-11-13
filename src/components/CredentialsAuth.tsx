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

export default function CredentialsAuth({ onLogin }: { onLogin?: (email: string) => void }) {
  const [open, setOpen] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      toast({ title: "Registered", description: "Account created and logged in" });
      setOpen(false);
      onLogin?.(registerEmail);
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
      toast({ title: "Logged in", description: "Welcome back" });
      setOpen(false);
      onLogin?.(loginEmail);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign in with credentials</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in or Register</DialogTitle>
          <DialogDescription>Use an email and password to sign in (client-side demo).</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-4">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <div className="grid gap-2">
              <Input placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <div className="flex justify-end mt-2">
                <Button onClick={handleLogin} disabled={isSubmitting}>{isSubmitting ? 'Working...' : 'Login'}</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <div className="grid gap-2">
              <Input placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
              <div className="flex justify-end mt-2">
                <Button onClick={handleRegister} disabled={isSubmitting}>{isSubmitting ? 'Working...' : 'Register'}</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
