import { Plus, Search, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatRupiah, PRODUCTS } from '../data/products.ts';
import type { Product, ProductCategory } from '../types.ts';
import { HardwareIllustration } from './HardwareIllustration.tsx';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const CATEGORIES: Array<{ id: ProductCategory; label: string }> = [
  { id: 'all', label: 'Semua Perangkat' },
  { id: 'cctv', label: 'CCTV & Keamanan' },
  { id: 'lighting', label: 'Lampu & Saklar' },
  { id: 'climate', label: 'Kontrol AC & Daya' },
  { id: 'access', label: 'Kunci & Hub' },
];

export function ProductCatalog({ onSelectProduct, onQuickAdd }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((product) => {
      const matchCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.subType.toLowerCase().includes(query) ||
        product.shortDesc.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="katalog" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-semibold text-[#0284C7]">Katalog Perangkat Resmi</p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0F2942] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Perangkat Smart Home & Berbagai Jenis CCTV
            </h2>
            <p className="text-base text-slate-600">
              Pilih kamera keamanan indoor pan-tilt, bullet outdoor anti-hujan, dome 4K PoE, kamera panel surya, hingga kontrol lampu dan AC otomatis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari CCTV, lampu, AC..."
                aria-label="Cari perangkat smart home"
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
              aria-label="Urutkan produk"
              className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="featured">Urutan: Rekomendasi</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto"
          role="tablist"
          aria-label="Kategori perangkat"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#0F2942] shadow-sm'
                    : 'text-slate-600 hover:text-[#0F2942]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
            <p className="text-base font-semibold text-[#0F2942]">
              Perangkat tidak ditemukan
            </p>
            <p className="text-sm text-slate-500">
              Coba kata kunci lain atau tampilkan semua kategori perangkat IoTHome.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#0F2942] rounded-lg cursor-pointer"
            >
              Tampilkan Semua Perangkat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Studio Visual Stage (~65% height feel) */}
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="bg-slate-100 px-6 py-8 aspect-[4/3] w-full flex items-center justify-center relative cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0284C7]"
                  aria-label={`Lihat detail ${product.name}`}
                >
                  <HardwareIllustration
                    type={product.visualType}
                    className="w-4/5 h-4/5 transition-transform duration-200 group-hover:scale-105"
                  />
                </button>

                {/* Card Content — Clean Unboxed Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-[#0284C7]">{product.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{product.storyboardScene}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-left block w-full cursor-pointer"
                    >
                      <h3 className="text-base font-semibold text-[#0F2942] group-hover:text-[#0284C7] transition-colors">
                        {product.name}
                      </h3>
                    </button>

                    <p className="text-xs text-slate-500">{product.subType}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{product.shortDesc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-bold font-mono-tabular text-[#0F2942]">
                        {formatRupiah(product.price)}
                      </p>
                      <p className="text-xs text-slate-500 inline-flex items-center gap-1 mt-0.5 font-mono-tabular">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.soldCount} terjual</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#0F2942] border border-slate-200 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickAdd(product)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Keranjang</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
