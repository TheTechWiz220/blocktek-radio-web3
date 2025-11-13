import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import CredentialsAuth, { getCurrentUser, getUser, setUserProfile } from "@/components/CredentialsAuth";
import * as api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function ProfileEditor({ onUpdated }: { onUpdated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({ displayName: "", avatarUrl: "", bio: "", preferences: {} });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const cur = getCurrentUser();
    setEmail(cur?.email || null);
    // prefer server profile
    (async () => {
      try {
        const data = await api.getMe();
        if (!mounted) return;
        setProfile(data.profile || {});
      } catch (e) {
        // fallback to local
        if (cur?.email) {
          const u = getUser(cur.email);
          setProfile(u?.profile || {});
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open]);

  const handleSave = () => {
    if (!email) {
      toast({ title: "Not signed in", description: "Sign in to edit profile" });
      return;
    }
    (async () => {
      try {
        await api.updateMe({ displayName: profile.displayName, bio: profile.bio, avatarUrl: profile.avatarUrl });
        toast({ title: "Saved", description: "Profile updated" });
        setOpen(false);
        onUpdated?.();
      } catch (e) {
        // fallback to local
        setUserProfile(email, profile);
        toast({ title: "Saved (local)", description: "Profile updated locally" });
        setOpen(false);
        onUpdated?.();
      }
    })();
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast({ title: "File too large", description: "Please use an image under 1MB" });
      return;
    }
    (async () => {
      try {
        const res = await api.uploadAvatar(file);
        if (res?.url) {
          setProfile((p: any) => ({ ...p, avatarUrl: res.url }));
          return;
        }
      } catch (e) {
        // fallback to data URL
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((p: any) => ({ ...p, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    })();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your profile</DialogTitle>
            <DialogDescription>Update your display name, avatar and bio.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 mt-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <img src={profile?.avatarUrl || "/avatar-placeholder.png"} alt="avatar" />
              </Avatar>
              <div className="flex flex-col gap-2">
                <Input placeholder="Display name" value={profile?.displayName || ""} onChange={(e) => setProfile((p: any) => ({ ...p, displayName: e.target.value }))} />
                <Input type="file" onChange={(e: any) => handleFile(e.target.files?.[0])} />
              </div>
            </div>

            <Textarea placeholder="Bio" value={profile?.bio || ""} onChange={(e) => setProfile((p: any) => ({ ...p, bio: e.target.value }))} />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>

          <DialogFooter />
        </DialogContent>
      </Dialog>
    </>
  );
}
