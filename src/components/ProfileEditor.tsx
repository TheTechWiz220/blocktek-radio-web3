// src/components/ProfileEditor.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import * as api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  onUpdated?: () => void;
}

export default function ProfileEditor({ onUpdated }: Props) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<{
    displayName: string;
    avatarUrl: string;
    bio: string;
  }>({
    displayName: "",
    avatarUrl: "",
    bio: "",
  });

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      try {
        const data = await api.getMe();
        if (!mounted) return;
        const p = data.profile || {};
        setProfile({
          displayName: p.displayName || "",
          avatarUrl: p.avatarUrl || "",
          bio: p.bio || "",
        });
      } catch (e) {
        console.warn("Failed to load profile", e);
      }
    })();
    return () => { mounted = false; };
  }, [open]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please use an image smaller than 5 MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.uploadAvatar(file);
      if (res?.url) {
        setProfile((p) => ({ ...p, avatarUrl: res.url }));
        toast({ title: "Avatar uploaded", description: "Image saved!" });
      }
    } catch (e: any) {
      toast({
        title: "Upload failed",
        description: e?.message || "Could not upload avatar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updateMe({
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
      });
      toast({ title: "Saved", description: "Profile updated successfully" });
      setOpen(false);
      onUpdated?.();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Update your display name, avatar and bio.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl} alt="avatar" />
              <AvatarFallback>
                {profile.displayName[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <Input
                placeholder="Display name"
                value={profile.displayName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, displayName: e.target.value }))
                }
              />
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Change Avatar
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Bio"
            rows={4}
            value={profile.bio}
            onChange={(e) =>
              setProfile((p) => ({ ...p, bio: e.target.value }))
            }
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
