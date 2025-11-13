const API = {
  // allow overriding API base during development via VITE_API_BASE
  base: (import.meta as any).env?.VITE_API_BASE || '/api',
  async post(path: string, body: any) {
    const res = await fetch(`${this.base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  },
  async get(path: string) {
    const res = await fetch(`${this.base}${path}`, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  },
  async upload(path: string, formData: FormData) {
    const res = await fetch(`${this.base}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  },
};

export async function register(email: string, password: string) {
  return API.post('/auth/register', { email, password });
}

export async function login(email: string, password: string) {
  return API.post('/auth/login', { email, password });
}

export async function logout() {
  return API.post('/auth/logout', {});
}

export async function getMe() {
  return API.get('/me');
}

export async function updateMe(payload: { displayName?: string; bio?: string; avatarUrl?: string }) {
  return fetch(`${API.base}/me`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  });
}

export async function uploadAvatar(file: File) {
  const fd = new FormData();
  fd.append('avatar', file);
  return API.upload('/upload/avatar', fd);
}

export async function createWalletNonce() {
  return API.post('/wallet/nonce', {});
}

export async function linkWallet(signature: string, nonce: string) {
  return API.post('/wallet/link', { signature, nonce });
}

export async function unlinkWallet(address: string) {
  return API.post('/wallet/unlink', { address });
}

export async function requestDj() {
  return API.post('/admin/request-dj', {});
}

export async function getDjRequests() {
  return API.get('/admin/requests');
}

export async function approveDjRequest(requestId: number) {
  return API.post('/admin/approve', { requestId });
}

export default API;
