// src/lib/api.ts
const API = {
  base: (import.meta as any).env?.VITE_API_BASE || "/api",

  async post(path: string, body: any) {
    const res = await fetch(`${this.base}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  },

  async get(path: string) {
    const res = await fetch(`${this.base}${path}`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  },

  async upload(path: string, formData: FormData) {
    const res = await fetch(`${this.base}${path}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  },

  async patch(path: string, body: any) {
    const res = await fetch(`${this.base}${path}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  },
};

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */
export async function register(email: string, password: string) {
  return API.post("/auth/register", { email, password });
}
export async function login(email: string, password: string) {
  return API.post("/auth/login", { email, password });
}
export async function logout() {
  return API.post("/auth/logout", {});
}

/* ------------------------------------------------------------------ */
/* Profile                                                            */
/* ------------------------------------------------------------------ */
export async function getMe() {
  return API.get("/me");
}

export async function updateMe(payload: {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}) {
  return API.patch("/me", payload);
}

/* FINAL FIX – Avatar URL is now correctly proxied */
export async function uploadAvatar(file: File) {
  const fd = new FormData();
  fd.append("avatar", file);
  const res = await API.upload("/upload/avatar", fd);

  if (res?.url) {
    // Strip backend origin so Vite proxy works → /uploads/...
    return { url: res.url.replace("http://localhost:4001", "") };
  }
  return res;
}

/* ------------------------------------------------------------------ */
/* Wallet linking                                                     */
/* ------------------------------------------------------------------ */
export async function createWalletNonce() {
  return API.post("/wallet/nonce", {});
}
export async function linkWallet(signature: string, nonce: string) {
  return API.post("/wallet/link", { signature, nonce });
}
export async function unlinkWallet(address: string) {
  return API.post("/wallet/unlink", { address });
}

/* ------------------------------------------------------------------ */
/* Admin / DJ requests                                                */
/* ------------------------------------------------------------------ */
export async function requestDj() {
  return API.post("/admin/request-dj", {});
}
export async function getDjRequests(params?: {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
}) {
  const qs =
    params
      ? "?" +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join("&")
      : "";
  return API.get(`/admin/requests${qs}`);
}
export async function approveDjRequest(requestId: number) {
  return API.post("/admin/approve", { requestId });
}
export async function rejectDjRequest(requestId: number) {
  return API.post("/admin/reject", { requestId });
}
export async function getDjRequest(requestId: number) {
  return API.get(`/admin/requests/${encodeURIComponent(String(requestId))}`);
}

export default API;
