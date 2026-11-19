import { X } from 'lucide-react';
import { useState } from 'react';
import type { User } from '../types.ts';
import { IoTHomeLogo } from './IoTHomeLogo.tsx';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
  reasonMessage?: string;
}

export function AuthModal({ open, onClose, onSuccess, reasonMessage }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const fillDemoRian = () => {
    setMode('login');
    setEmail('rian@iothome.id');
    setPassword('iothome123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'login'
          ? { email, password }
          : { name, email, phone, address, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan saat memproses akun.');
        return;
      }
      onSuccess(data.user, data.token);
      onClose();
    } catch {
      setError('Gagal terhubung ke server IoTHome.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <IoTHomeLogo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela akun"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <h2 id="auth-modal-title" className="text-xl font-bold text-[#0F2942]">
              {mode === 'login' ? 'Masuk ke Akun IoTHome' : 'Daftar Akun Pelanggan Baru'}
            </h2>
            <p className="text-sm text-slate-600">
              {reasonMessage ||
                'Simpan keranjang, buat pesanan perangkat smart home, dan lacak pengiriman hingga paket tiba.'}
            </p>
          </div>

          {/* Segmented Mode Switch */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'login' ? 'bg-white text-[#0F2942] shadow-sm' : 'text-slate-600'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'register' ? 'bg-white text-[#0F2942] shadow-sm' : 'text-slate-600'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="auth-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      id="auth-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                  <div>
                    <label htmlFor="auth-address" className="block text-xs font-semibold text-slate-700 mb-1">
                      Kota / Alamat Singkat
                    </label>
                    <input
                      id="auth-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Jakarta Selatan"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? 'Memproses...'
                : mode === 'login'
                  ? 'Masuk ke Akun'
                  : 'Buat Akun & Masuk'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">
                Ingin langsung coba? Akun tokoh storyboard:
              </span>
              <button
                type="button"
                onClick={fillDemoRian}
                className="font-semibold text-[#0284C7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Isi Akun Rian
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
