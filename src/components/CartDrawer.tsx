import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatRupiah, PRODUCTS } from '../data/products.ts';
import type { CartItem } from '../types.ts';
import { HardwareIllustration } from './HardwareIllustration.tsx';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
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
  const freeShippingThreshold = 500000;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col border-l border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#0F2942]" />
            <h2 className="text-lg font-bold text-[#0F2942]">Keranjang Belanja</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Notice */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
          {subtotal === 0 ? (
            <span>Gratis ongkir seluruh Indonesia untuk belanja di atas Rp 500.000.</span>
          ) : remainingForFree === 0 ? (
            <span className="font-semibold text-emerald-700">
              Pesanan Anda memenuhi syarat Gratis Ongkir IoTHome Express.
            </span>
          ) : (
            <span>
              Tambah{' '}
              <strong className="font-mono-tabular text-[#0F2942]">
                {formatRupiah(remainingForFree)}
              </strong>{' '}
              lagi untuk mendapatkan Gratis Ongkir.
            </span>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {resolvedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
              <p className="text-base font-semibold text-[#0F2942]">Keranjang masih kosong</p>
              <p className="text-sm text-slate-500 max-w-xs">
                Pilih CCTV, lampu pintar, atau kontrol AC untuk mulai melengkapi rumah pintar Anda.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#0F2942] rounded-lg cursor-pointer"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {resolvedItems.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="py-4 flex items-start gap-4"
                >
                  <div className="w-20 h-16 bg-slate-100 rounded-lg p-1.5 shrink-0 flex items-center justify-center border border-slate-200">
                    <HardwareIllustration type={item.product.visualType} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#0F2942] leading-snug">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-slate-500">{item.variant.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.productId, item.variantId)}
                        aria-label={`Hapus ${item.product.name}`}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center border border-slate-200 rounded-md">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          aria-label="Kurangi jumlah"
                          className="p-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono-tabular font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          aria-label="Tambah jumlah"
                          className="p-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold font-mono-tabular text-[#0F2942]">
                        {formatRupiah(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Checkout Action */}
        {resolvedItems.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal Perangkat</span>
              <span className="text-lg font-bold font-mono-tabular text-[#0F2942]">
                {formatRupiah(subtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors cursor-pointer"
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
