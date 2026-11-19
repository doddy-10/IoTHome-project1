import {
  CheckCircle2,
  ChevronRight,
  LogIn,
  LogOut,
  MessageCircle,
  PackageCheck,
  Star,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '../data/products.ts';
import type { Order, OrderStatus, User } from '../types.ts';

interface OrderTrackingSectionProps {
  user: User | null;
  orders: Order[];
  loadingOrders: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onAdvanceOrder: (orderId: string) => Promise<void>;
  onConfirmDelivery: (orderId: string, rating: number, note: string) => Promise<void>;
  onAskWhatsAppOrder: (order: Order) => void;
}

const ALL_STATUSES: OrderStatus[] = [
  'Pesanan Dibuat',
  'Dikemas di Gudang',
  'Diserahkan ke Kurir',
  'Sedang Diantar Kurir',
  'Paket Telah Tiba',
];

function formatDateId(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function OrderTrackingSection({
  user,
  orders,
  loadingOrders,
  onOpenAuth,
  onLogout,
  onAdvanceOrder,
  onConfirmDelivery,
  onAskWhatsAppOrder,
}: OrderTrackingSectionProps) {
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [deliveryNote, setDeliveryNote] = useState('Paket diterima dalam kondisi lengkap dan berfungsi baik.');

  const handleAdvance = async (orderId: string) => {
    setBusyOrderId(orderId);
    try {
      await onAdvanceOrder(orderId);
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleConfirm = async (orderId: string) => {
    setBusyOrderId(orderId);
    try {
      await onConfirmDelivery(orderId, rating, deliveryNote);
      setConfirmingOrderId(null);
    } finally {
      setBusyOrderId(null);
    }
  };

  return (
    <section id="lacak-pesanan" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-semibold text-[#0284C7]">Pelacakan Pengiriman Real-Time</p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0F2942] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Pantau Pesanan Hingga Paket Telah Tiba
            </h2>
            <p className="text-base text-slate-600">
              Ikuti setiap tahap pengiriman perangkat IoTHome dari gudang hingga tiba di rumah Anda, lalu konfirmasi penerimaan paket.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shrink-0">
              <div className="text-sm">
                <p className="font-semibold text-[#0F2942]">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {!user ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl font-bold text-[#0F2942]">
                Masuk untuk Melihat & Melacak Pesanan Anda
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gunakan akun Anda (atau coba langsung dengan akun demo <strong>Rian Pratama</strong>) untuk melihat status pengiriman aktif, mencoba simulasi progres kurir, hingga mengonfirmasi paket telah tiba.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk / Daftar Akun</span>
            </button>
          </div>
        ) : loadingOrders ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
            Memuat riwayat pesanan Anda...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <Truck className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-lg font-semibold text-[#0F2942]">Belum Ada Pesanan</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Tambahkan CCTV, lampu pintar, atau kontrol AC ke keranjang dan selesaikan checkout untuk melacak paket Anda di sini.
            </p>
            <a
              href="#katalog"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#0F2942] rounded-lg"
            >
              Pilih Perangkat Smart Home
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentIdx = ALL_STATUSES.indexOf(order.status);
              const isArrived = order.status === 'Paket Telah Tiba';
              const isBusy = busyOrderId === order.id;

              return (
                <article
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                >
                  {/* Order Top Summary Bar */}
                  <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="font-mono-tabular font-bold text-[#0F2942]">
                        {order.id}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-xs font-mono-tabular text-slate-600">
                        Resi: {order.trackingNumber}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-500">{order.courier}</span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-500">{formatDateId(order.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {isArrived ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700">
                          <PackageCheck className="w-4 h-4" />
                          <span>
                            {order.deliveryConfirmed
                              ? 'Selesai · Paket Telah Tiba'
                              : 'Paket Telah Tiba (Perlu Konfirmasi)'}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[#0284C7]">
                          <Truck className="w-4 h-4" />
                          <span>{order.status}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 5-Stage Horizontal Progress Bar */}
                  <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {ALL_STATUSES.map((stageName, idx) => {
                        const completed = idx <= currentIdx;
                        const active = idx === currentIdx;
                        return (
                          <div
                            key={stageName}
                            className={`rounded-lg p-3 border text-left transition-colors ${
                              active
                                ? isArrived
                                  ? 'border-emerald-300 bg-emerald-50/60'
                                  : 'border-sky-300 bg-sky-50/60'
                                : completed
                                  ? 'border-slate-200 bg-slate-50'
                                  : 'border-slate-100 bg-white opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-mono-tabular mb-1">
                              <span className={completed ? 'font-bold text-[#0F2942]' : 'text-slate-400'}>
                                0{idx + 1}
                              </span>
                              {completed && (
                                <CheckCircle2
                                  className={`w-4 h-4 ${
                                    isArrived && idx === 4 ? 'text-emerald-600' : 'text-[#0284C7]'
                                  }`}
                                />
                              )}
                            </div>
                            <p className="text-xs font-semibold text-[#0F2942]">{stageName}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items + Timeline Details */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Items & Address */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="space-y-2.5">
                        <p className="text-xs font-semibold text-slate-500">
                          Daftar Perangkat ({order.items.length} jenis)
                        </p>
                        <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/40">
                          {order.items.map((item) => (
                            <li
                              key={`${item.productId}-${item.variantLabel}`}
                              className="p-3 flex items-center justify-between gap-3 text-sm"
                            >
                              <div className="min-w-0">
                                <p className="font-medium text-[#0F2942] truncate">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {item.variantLabel} · {item.quantity} unit
                                </p>
                              </div>
                              <span className="font-mono-tabular font-semibold text-[#0F2942] shrink-0">
                                {formatRupiah(item.unitPrice * item.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-xs space-y-1 text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="font-semibold text-[#0F2942]">
                          Penerima: {order.customerName} ({order.customerPhone})
                        </p>
                        <p>{order.shippingAddress}</p>
                        <p className="pt-1 font-mono-tabular text-sm font-bold text-[#0F2942]">
                          Total Dibayar: {formatRupiah(order.total)} ({order.paymentMethod})
                        </p>
                      </div>
                    </div>

                    {/* Right: Live Courier Log + Action Controls */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-5">
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-slate-500">Riwayat Perjalanan Paket</p>
                        <ol className="space-y-3">
                          {[...order.timeline].reverse().map((entry) => (
                            <li
                              key={`${entry.status}-${entry.timestamp}`}
                              className="flex items-start gap-3 text-sm pb-3 border-b border-slate-100 last:border-b-0 last:pb-0"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-semibold text-[#0F2942]">{entry.title}</p>
                                  <span className="text-xs font-mono-tabular text-slate-400">
                                    {formatDateId(entry.timestamp)}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5">{entry.detail}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{entry.location}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Confirmation Form when Arrived or Ready to Confirm */}
                      {confirmingOrderId === order.id ? (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                          <p className="text-sm font-semibold text-[#0F2942]">
                            Konfirmasi Paket Telah Tiba di Tujuan
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-600 mr-2">Penilaian Pengiriman:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                aria-label={`Beri nilai ${star} bintang`}
                                className="p-1 cursor-pointer"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= rating
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={deliveryNote}
                            onChange={(e) => setDeliveryNote(e.target.value)}
                            placeholder="Catatan penerimaan paket..."
                            className="w-full px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleConfirm(order.id)}
                              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer disabled:opacity-50"
                            >
                              {isBusy ? 'Menyimpan...' : 'Simpan Konfirmasi Paket Tiba'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingOrderId(null)}
                              className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white rounded-lg cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : order.deliveryConfirmed ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-emerald-800">
                              Paket Telah Diterima & Dikonfirmasi ({order.rating ?? 5}/5 Bintang)
                            </p>
                            <p className="text-xs text-emerald-700">“{order.deliveryNote}”</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onAskWhatsAppOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-100 rounded-lg cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Bantuan Instalasi WA</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            {!isArrived && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleAdvance(order.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <span>
                                  {isBusy
                                    ? 'Memperbarui...'
                                    : 'Simulasikan Tahap Pengiriman Berikutnya'}
                                </span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}

                            {(order.status === 'Sedang Diantar Kurir' || isArrived) && (
                              <button
                                type="button"
                                onClick={() => setConfirmingOrderId(order.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                              >
                                <PackageCheck className="w-4 h-4" />
                                <span>Konfirmasi Paket Telah Tiba</span>
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onAskWhatsAppOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat WhatsApp Pesanan</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
