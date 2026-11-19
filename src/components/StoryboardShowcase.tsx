import { ArrowRight } from 'lucide-react';
import { PRODUCTS, RIAN_BUNDLE_IDS, formatRupiah } from '../data/products.ts';

interface StoryboardShowcaseProps {
  onAddBundle: () => void;
}

export function StoryboardShowcase({ onAddBundle }: StoryboardShowcaseProps) {
  const bundleTotal = RIAN_BUNDLE_IDS.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    if (!product || !variant) return sum;
    return sum + (product.price + variant.priceDelta) * item.quantity;
  }, 0);

  return (
    <section id="storyboard" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-semibold text-[#0284C7]">
              Video Promosi Resmi IoTHome
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0F2942] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Lihat IoTHome Beraksi di Rumah Pintar Modern
            </h2>
            <p className="text-base text-slate-600">
              Tonton bagaimana IoTHome mengendalikan lampu, suhu AC 24°C, pemantauan CCTV real-time, hingga rutinitas otomatis Mode Tidur dari mana saja.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddBundle}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Pesan Paket Lengkap Rian ({formatRupiah(bundleTotal)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Single-Focus Promotional Video Player */}
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
            <video
              src="/assets/aistudio/video_promosi_c5a515f6.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-slate-950"
            >
              Browser Anda tidak mendukung pemutaran video HTML5.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
