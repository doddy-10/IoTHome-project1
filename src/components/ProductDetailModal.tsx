import { Check, MessageCircle, Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '../data/products.ts';
import type { Product } from '../types.ts';
import { HardwareIllustration } from './HardwareIllustration.tsx';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (productId: string, variantId: string, quantity: number) => void;
  onBuyNow: (productId: string, variantId: string, quantity: number) => void;
  onAskWhatsApp: (product: Product, variantLabel: string) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onAskWhatsApp,
}: ProductDetailModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const unitPrice = product.price + selectedVariant.priceDelta;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 overflow-hidden shadow-xl my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-[#0284C7]">{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.storyboardScene}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail produk"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Stage: Hardware Visual + Specs */}
          <div className="md:col-span-5 bg-slate-100 p-6 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-slate-200">
            <div className="aspect-[4/3] flex items-center justify-center">
              <HardwareIllustration type={product.visualType} className="w-4/5 h-4/5" />
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-[#0F2942]">Spesifikasi Teknis</p>
              <dl className="space-y-1.5 text-xs">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{spec.label}</dt>
                    <dd className="text-slate-800 font-medium text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right Stage: Contiguous Purchase Module */}
          <div className="md:col-span-7 p-6 space-y-6">
            <div className="space-y-2">
              <h2 id="pdp-title" className="text-2xl font-bold text-[#0F2942] tracking-tight">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500">
                {product.subType} · {product.warranty}
              </p>
              <p className="text-2xl font-bold font-mono-tabular text-[#0F2942] pt-1">
                {formatRupiah(unitPrice)}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

            {/* Variant Selection */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">Pilih Varian / Paket</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((variant) => {
                  const active = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        active
                          ? 'border-[#0F2942] bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[#0F2942]">
                          {variant.label}
                        </span>
                        {active && <Check className="w-4 h-4 text-[#0284C7] shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-mono-tabular">
                        {formatRupiah(product.price + variant.priceDelta)} · Stok {variant.stock}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Purchase CTA */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Jumlah Unit</span>
                <div className="inline-flex items-center border border-slate-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi jumlah"
                    className="p-2.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-mono-tabular font-semibold text-[#0F2942]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                    aria-label="Tambah jumlah"
                    className="p-2.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product.id, selectedVariant.id, quantity);
                    onClose();
                  }}
                  className="px-4 py-3 text-sm font-semibold text-[#0F2942] border border-[#0F2942] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Tambah ke Keranjang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onBuyNow(product.id, selectedVariant.id, quantity);
                    onClose();
                  }}
                  className="px-4 py-3 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Beli Langsung ({formatRupiah(unitPrice * quantity)})
                </button>
              </div>

              <button
                type="button"
                onClick={() => onAskWhatsApp(product, selectedVariant.label)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanya Kecocokan & Pemasangan via WhatsApp</span>
              </button>

              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>Gratis ongkir untuk total belanja di atas Rp 500.000 · Bisa lacak resi hingga tiba.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
