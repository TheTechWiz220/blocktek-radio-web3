import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import * as api from "@/lib/api";

// Simple client-side credential store (not secure; for demo only)
const USERS_KEY = "bt_users";
const CURRENT_KEY = "bt_current_user";

async function hashPassword(password: string) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getUsers(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function setUsers(users: Record<string, any>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function setUserProfile(email: string, profile: Record<string, any>) {
  const users = getUsers();
  if (!users[email]) return false;
  users[email].profile = { ...(users[email].profile || {}), ...profile };
  users[email].updatedAt = Date.now();
  setUsers(users);
  return true;
}

function setCurrentUser(email: string) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ email, at: Date.now() }));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
  } catch (e) {
    return null;
  }
}

// Export helper to link a wallet address to a user record (client-side only)
export function linkWalletToUser(email: string, walletAddress: string, verified = false) {
  const users = getUsers();
  if (!users[email]) return false;
  users[email].linkedWallet = {
    address: walletAddress,
    verified: !!verified,
    linkedAt: Date.now(),
  };
  setUsers(users);
  return true;
}

export function unlinkWalletFromUser(email: string) {
  const users = getUsers();
  if (!users[email]) return false;
  delete users[email].linkedWallet;
  setUsers(users);
  return true;
}

export function getUser(email: string) {
  const users = getUsers();
  return users[email] || null;
}

export default function CredentialsAuth({ onLogin }: { onLogin?: (email: string) => void }) {
  const [open, setOpen] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword) {
      toast({ title: "Missing fields", description: "Please provide email and password" });
      return;
    }
    try {
      await api.register(registerEmail, registerPassword);
      toast({ title: "Registered", description: "Account created and logged in" });
      setOpen(false);
      onLogin?.(registerEmail);
    } catch (e: any) {
      // fallback to client-side store if server unavailable
      const users = getUsers();
      if (users[registerEmail]) {
        toast({ title: "Already registered", description: "Account with this email already exists" });
        return;
      }
      const hash = await hashPassword(registerPassword);
      const displayName = registerEmail.split("@")[0];
      users[registerEmail] = {
        passwordHash: hash,
        createdAt: Date.now(),
        profile: {
          displayName,
          avatarUrl: "",
          bio: "",
          preferences: { theme: "system", autoplay: false, volume: 0.8 },
          role: "listener",
        },
      };
      setUsers(users);
      setCurrentUser(registerEmail);
      toast({ title: "Registered (local)", description: "Account created locally" });
      setOpen(false);
      onLogin?.(registerEmail);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Missing fields", description: "Please provide email and password" });
      return;
    }
    try {
      await api.login(loginEmail, loginPassword);
      toast({ title: "Logged in", description: "Welcome back" });
      setOpen(false);
      onLogin?.(loginEmail);
      return;
    } catch (e: any) {
      // fallback to local
    }

    const users = getUsers();
    const existing = users[loginEmail];
    if (!existing) {
      toast({ title: "Not found", description: "No account for this email" });
      return;
    }
    const hash = await hashPassword(loginPassword);
    if (hash !== existing.passwordHash) {
      toast({ title: "Incorrect", description: "Password does not match" });
      return;
    }
    setCurrentUser(loginEmail);
    toast({ title: "Logged in (local)", description: "Welcome back" });
    setOpen(false);
    onLogin?.(loginEmail);
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
                <Button onClick={handleLogin}>Login</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <div className="grid gap-2">
              <Input placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
              <div className="flex justify-end mt-2">
                <Button onClick={handleRegister}>Register</Button>
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
