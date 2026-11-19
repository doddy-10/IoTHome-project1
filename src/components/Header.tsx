import { Menu, ShoppingBag, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';
import type { User } from '../types.ts';
import { IoTHomeLogo } from './IoTHomeLogo.tsx';

interface HeaderProps {
  cartCount: number;
  user: User | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenAccountOrders: () => void;
}

export function Header({
  cartCount,
  user,
  onOpenCart,
  onOpenAuth,
  onOpenAccountOrders,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a href="#beranda" className="focus-visible:outline-2 focus-visible:outline-sky-600 rounded-md">
          <IoTHomeLogo />
        </a>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Navigasi utama">
          <a href="#simulasi" className="hover:text-[#0F2942] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
            Simulasi
          </a>
          <a href="#katalog" className="hover:text-[#0F2942] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
            Katalog
          </a>
          <a href="#lacak-pesanan" className="hover:text-[#0F2942] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
            Lacak Pesanan
          </a>
          <a href="#storyboard" className="hover:text-[#0F2942] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
            Video Promosi
          </a>
        </nav>

        {/* Zone 3: Primary Action Cluster (Account + Bag) */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={onOpenAccountOrders}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#0F2942] rounded-lg border border-slate-200 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0"
            >
              <UserIcon className="w-4 h-4 text-[#0284C7]" />
              <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-[#0F2942] rounded-lg border border-slate-200 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0"
            >
              <UserIcon className="w-4 h-4" />
              <span>Masuk</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Keranjang</span>
            <span className="font-mono-tabular text-xs bg-sky-500/25 text-sky-100 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a href="#simulasi" onClick={() => setMobileMenuOpen(false)} className="py-2 px-2 rounded-lg hover:bg-slate-50">
              Simulasi Rumah
            </a>
            <a href="#katalog" onClick={() => setMobileMenuOpen(false)} className="py-2 px-2 rounded-lg hover:bg-slate-50">
              Katalog Perangkat
            </a>
            <a href="#lacak-pesanan" onClick={() => setMobileMenuOpen(false)} className="py-2 px-2 rounded-lg hover:bg-slate-50">
              Lacak Pesanan
            </a>
            <a href="#storyboard" onClick={() => setMobileMenuOpen(false)} className="py-2 px-2 rounded-lg hover:bg-slate-50">
              Video Promosi IoTHome
            </a>
          </div>
          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccountOrders();
                }}
                className="w-full py-2.5 px-4 text-sm font-medium text-[#0F2942] bg-slate-100 rounded-lg text-left"
              >
                Akun: {user.name}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 text-sm font-semibold text-[#0F2942] border border-slate-300 rounded-lg"
              >
                Masuk / Daftar Akun
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
