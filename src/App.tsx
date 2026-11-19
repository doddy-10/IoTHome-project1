import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { Header } from './components/Header.tsx';
import { HeroSmartSimulator } from './components/HeroSmartSimulator.tsx';
import { IoTHomeLogo } from './components/IoTHomeLogo.tsx';
import { OrderTrackingSection } from './components/OrderTrackingSection.tsx';
import { ProductCatalog } from './components/ProductCatalog.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { StoryboardShowcase } from './components/StoryboardShowcase.tsx';
import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';
import { PRODUCTS, RIAN_BUNDLE_IDS } from './data/products.ts';
import type { CartItem, Order, Product, User } from './types.ts';

const TOKEN_STORAGE_KEY = 'iothome_session_token';
const CART_STORAGE_KEY = 'iothome_cart_items';

export default function App() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [waPresetMessage, setWaPresetMessage] = useState(
    'Halo IoTHome, saya ingin konsultasi mengenai perangkat smart home & CCTV.'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  const fetchOrders = useCallback(async (activeToken: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      }
    } catch {
      // Ignore transient network errors
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setOrders([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (!cancelled) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setToken(null);
            setUser(null);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled && data.user) {
          setUser(data.user);
          await fetchOrders(token);
        }
      } catch {
        // Ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, fetchOrders]);

  const handleAuthSuccess = (loggedUser: User, newToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(loggedUser);
    setAuthReason(undefined);
    fetchOrders(newToken);
    showToast(`Selamat datang, ${loggedUser.name}.`);
  };

  const handleLogout = async () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setOrders([]);
    showToast('Anda telah keluar dari akun IoTHome.');
  };

  const addToCart = (productId: string, variantId: string, quantity = 1) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { productId, variantId, quantity }];
    });
    if (product) {
      showToast(`${product.name} ditambahkan ke keranjang.`);
    }
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product.id, product.variants[0].id, 1);
  };

  const handleBuyNow = (productId: string, variantId: string, quantity: number) => {
    addToCart(productId, variantId, quantity);
    setCheckoutOpen(true);
  };

  const handleAddRianBundle = () => {
    setCart((prev) => {
      const next = [...prev];
      for (const bundleItem of RIAN_BUNDLE_IDS) {
        const idx = next.findIndex(
          (i) => i.productId === bundleItem.productId && i.variantId === bundleItem.variantId
        );
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + bundleItem.quantity };
        } else {
          next.push({ ...bundleItem });
        }
      }
      return next;
    });
    setCartOpen(true);
    showToast('Paket Lengkap Rumah Pintar Rian (4 perangkat) masuk ke keranjang.');
  };

  const handleUpdateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    showToast(`Pesanan ${newOrder.id} berhasil dibuat. Pantau pengiriman hingga paket tiba.`);
    const el = document.getElementById('lacak-pesanan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdvanceOrder = async (orderId: string) => {
    if (!token) return;
    const res = await fetch(`/api/orders/${orderId}/advance`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      showToast(`Status ${orderId}: ${data.order.status}`);
    }
  };

  const handleConfirmDelivery = async (orderId: string, rating: number, note: string) => {
    if (!token) return;
    const res = await fetch(`/api/orders/${orderId}/confirm-delivery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, note }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      showToast(`Terima kasih! Pesanan ${orderId} telah dikonfirmasi tiba.`);
    }
  };

  const handleSelectProductById = (productId: string) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) setSelectedProduct(found);
  };

  const openWhatsAppWithMessage = (msg: string) => {
    setWaPresetMessage(msg);
    setWaOpen(true);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        cartCount={cartCount}
        user={user}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => {
          setAuthReason(undefined);
          setAuthOpen(true);
        }}
        onOpenAccountOrders={() => {
          const el = document.getElementById('lacak-pesanan');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        <HeroSmartSimulator
          onOpenWhatsApp={(topic) =>
            openWhatsAppWithMessage(
              `Halo IoTHome, saya ingin berkonsultasi mengenai ${topic || 'perangkat smart home'}.`
            )
          }
          onSelectProductById={handleSelectProductById}
        />

        <ProductCatalog
          onSelectProduct={(product) => setSelectedProduct(product)}
          onQuickAdd={handleQuickAdd}
        />

        <StoryboardShowcase onAddBundle={handleAddRianBundle} />

        <OrderTrackingSection
          user={user}
          orders={orders}
          loadingOrders={loadingOrders}
          onOpenAuth={() => {
            setAuthReason('Masuk untuk memantau status resi dan mengonfirmasi paket tiba.');
            setAuthOpen(true);
          }}
          onLogout={handleLogout}
          onAdvanceOrder={handleAdvanceOrder}
          onConfirmDelivery={handleConfirmDelivery}
          onAskWhatsAppOrder={(order) =>
            openWhatsAppWithMessage(
              `Halo CS IoTHome, saya ingin menanyakan pesanan ${order.id} (Resi: ${order.trackingNumber}, Status: ${order.status}).`
            )
          }
        />
      </main>

      {/* Clean 3-Column Footer */}
      <footer className="bg-[#0F2942] text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-3">
            <IoTHomeLogo inverted />
            <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
              Your Smart Living Partner — Rumah pintar untuk hidup yang lebih hemat energi, aman, nyaman, dan praktis.
            </p>
          </div>

          <div className="space-y-2.5 text-sm">
            <p className="font-semibold text-white">Navigasi Toko</p>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <a href="#simulasi" className="hover:text-white transition-colors">
                  Simulasi Rumah Pintar
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Katalog CCTV & Perangkat
                </a>
              </li>
              <li>
                <a href="#storyboard" className="hover:text-white transition-colors">
                  Video Promosi IoTHome
                </a>
              </li>
              <li>
                <a href="#lacak-pesanan" className="hover:text-white transition-colors">
                  Lacak Pengiriman Paket
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold text-white">Konsultasi & Dukungan</p>
            <p className="text-slate-300">
              Bingung memilih jenis CCTV atau butuh panduan pemasangan? Hubungi tim IoTHome langsung melalui WhatsApp.
            </p>
            <button
              type="button"
              onClick={() =>
                openWhatsAppWithMessage(
                  'Halo IoTHome, saya butuh bantuan memilih alat smart home yang cocok untuk rumah saya.'
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp Resmi</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 IoTHome Indonesia. Seluruh hak cipta dilindungi.</p>
          <p>Garansi Resmi 2–3 Tahun · Pengiriman Seluruh Indonesia</p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
          onAskWhatsApp={(product, variantLabel) => {
            setSelectedProduct(null);
            openWhatsAppWithMessage(
              `Halo IoTHome, saya tertarik dengan ${product.name} (${variantLabel}). Apakah stok tersedia dan cocok untuk rumah saya?`
            );
          }}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        reasonMessage={authReason}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        user={user}
        token={token}
        items={cart}
        onClose={() => setCheckoutOpen(false)}
        onRequireAuth={() => {
          setCheckoutOpen(false);
          setAuthReason('Masuk atau daftar akun terlebih dahulu untuk menyelesaikan pesanan Anda.');
          setAuthOpen(true);
        }}
        onOrderCreated={handleOrderCreated}
      />

      {/* WhatsApp Chat Widget */}
      <WhatsAppWidget
        open={waOpen}
        onToggle={setWaOpen}
        presetMessage={waPresetMessage}
        user={user}
        latestOrder={orders[0] ?? null}
      />

      {/* Action Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 left-5 z-50 max-w-sm bg-[#0F2942] text-white px-4 py-3 rounded-xl shadow-lg border border-white/15 flex items-center gap-3 text-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Tutup notifikasi"
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
