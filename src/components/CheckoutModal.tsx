import { ShieldCheck, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatRupiah, PRODUCTS } from '../data/products.ts';
import type { CartItem, Order, User } from '../types.ts';

interface CheckoutModalProps {
  open: boolean;
  user: User | null;
  token: string | null;
  items: CartItem[];
  onClose: () => void;
  onRequireAuth: () => void;
  onOrderCreated: (order: Order) => void;
}

const COURIER_OPTIONS = [
  { id: 'IoTHome Express', label: 'IoTHome Express (1–2 Hari)', baseFee: 22000, freeEligible: true },
  { id: 'JNE Reguler', label: 'JNE Reguler (2–3 Hari)', baseFee: 22000, freeEligible: true },
  {
    id: 'IoTHome Instant + Panduan Instalasi',
    label: 'IoTHome Instant Same-Day + Panduan Setup',
    baseFee: 35000,
    freeEligible: false,
  },
];

const PAYMENT_OPTIONS = [
  'QRIS Instan',
  'Transfer Virtual Account (BCA / Mandiri / BNI)',
  'COD (Bayar di Tempat saat Paket Tiba)',
];

export function CheckoutModal({
  open,
  user,
  token,
  items,
  onClose,
  onRequireAuth,
  onOrderCreated,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [courier, setCourier] = useState(COURIER_OPTIONS[0].id);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.name);
      setCustomerPhone((prev) => prev || user.phone);
      setShippingAddress((prev) => prev || user.address);
    }
  }, [user]);

  if (!open) return null;

  const resolvedItems = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      const variant =
        product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
      return {
        ...item,
        product,
        variant,
        unitPrice: product.price + variant.priceDelta,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const chosenCourierObj =
    COURIER_OPTIONS.find((c) => c.id === courier) ?? COURIER_OPTIONS[0];
  const shippingFee =
    chosenCourierObj.freeEligible && subtotal >= 500000 ? 0 : chosenCourierObj.baseFee;
  const total = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      onRequireAuth();
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          customerName,
          customerPhone,
          shippingAddress,
          courier,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal membuat pesanan.');
        return;
      }
      onOrderCreated(data.order);
      onClose();
    } catch {
      setError('Gagal terhubung ke server untuk membuat pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 id="checkout-title" className="text-lg font-bold text-[#0F2942]">
            Selesaikan Pesanan IoTHome
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup checkout"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user ? (
          <div className="p-8 text-center space-y-4">
            <p className="text-base font-semibold text-[#0F2942]">
              Silakan masuk akun terlebih dahulu untuk membuat pesanan
            </p>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Dengan masuk akun, nomor resi dan progres pengiriman hingga paket tiba akan tersimpan otomatis di halaman Lacak Pesanan.
            </p>
            <button
              type="button"
              onClick={onRequireAuth}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg cursor-pointer"
            >
              Masuk / Daftar Sekarang
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12">
            {/* Form Details */}
            <div className="md:col-span-7 p-6 space-y-4 border-b md:border-b-0 md:border-r border-slate-200">
              {error && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="co-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penerima
                  </label>
                  <input
                    id="co-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="co-address" className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Pengiriman & Kode Pos
                </label>
                <textarea
                  id="co-address"
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, kecamatan, kota, kode pos"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <p className="block text-xs font-semibold text-slate-700 mb-1.5">Kurir Pengiriman</p>
                <div className="space-y-2">
                  {COURIER_OPTIONS.map((opt) => {
                    const fee = opt.freeEligible && subtotal >= 500000 ? 0 : opt.baseFee;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3 rounded-lg border text-sm cursor-pointer ${
                          courier === opt.id
                            ? 'border-[#0F2942] bg-slate-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="courier"
                            value={opt.id}
                            checked={courier === opt.id}
                            onChange={() => setCourier(opt.id)}
                          />
                          <span className="font-medium text-[#0F2942]">{opt.label}</span>
                        </span>
                        <span className="font-mono-tabular text-xs font-semibold text-slate-700">
                          {fee === 0 ? 'Gratis' : formatRupiah(fee)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="co-payment" className="block text-xs font-semibold text-slate-700 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  id="co-payment"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0284C7]"
                >
                  {PAYMENT_OPTIONS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary Column */}
            <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#0F2942]">Ringkasan Pesanan</p>
                <ul className="space-y-2.5 text-xs">
                  {resolvedItems.map((item) => (
                    <li
                      key={`${item.productId}-${item.variantId}`}
                      className="flex justify-between gap-2"
                    >
                      <span className="text-slate-600">
                        {item.product.name} ({item.quantity}×)
                      </span>
                      <span className="font-mono-tabular font-semibold text-[#0F2942] shrink-0">
                        {formatRupiah(item.unitPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono-tabular">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-mono-tabular">
                      {shippingFee === 0 ? 'Gratis' : formatRupiah(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-base text-[#0F2942]">
                    <span>Total Pembayaran</span>
                    <span className="font-mono-tabular">{formatRupiah(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={submitting || resolvedItems.length === 0}
                  className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Membuat Pesanan...' : 'Buat Pesanan Sekarang'}
                </button>

                <div className="text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Resi otomatis aktif setelah pesanan dibuat.</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mendukung COD & Garansi Pengiriman Aman.</span>
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
