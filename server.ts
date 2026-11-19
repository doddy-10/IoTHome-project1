import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import { PRODUCTS } from './src/data/products.ts';
import type { Order, OrderItem, OrderStatus, OrderTimelineEntry, User } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StoredUser extends User {
  passwordHash: string;
}

interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
}

interface StoreData {
  users: StoredUser[];
  sessions: StoredSession[];
  orders: Order[];
}

const DATA_DIR = path.join(__dirname, '.data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const ORDER_STAGES: Array<{
  status: OrderStatus;
  title: string;
  detail: string;
  location: string;
}> = [
  {
    status: 'Pesanan Dibuat',
    title: 'Pesanan diterima sistem IoTHome',
    detail: 'Pembayaran & detail alamat terverifikasi, menunggu penyiapan unit di gudang.',
    location: 'Sistem IoTHome Indonesia',
  },
  {
    status: 'Dikemas di Gudang',
    title: 'Perangkat lolos QC & sedang dikemas',
    detail: 'Tim gudang menguji konektivitas Wi-Fi/Zigbee serta menyegel kartu garansi resmi.',
    location: 'Gudang Utama IoTHome, Jakarta Barat',
  },
  {
    status: 'Diserahkan ke Kurir',
    title: 'Paket diserahkan ke mitra ekspedisi',
    detail: 'Paket telah dipindai di gerbang sortir dan berangkat menuju kota tujuan.',
    location: 'Hub Sortir Jakarta Pusat',
  },
  {
    status: 'Sedang Diantar Kurir',
    title: 'Kurir sedang menuju alamat penerima',
    detail: 'Kurir lapangan (Budi Santoso) membawa paket ke alamat Anda. Siapkan penerima.',
    location: 'Dalam Pengantaran · Area Tujuan',
  },
  {
    status: 'Paket Telah Tiba',
    title: 'Paket telah tiba di alamat tujuan',
    detail: 'Paket berhasil diserahkan kepada penerima di lokasi pengiriman.',
    location: 'Alamat Penerima',
  },
];

function hashPassword(password: string, existingSalt?: string): string {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, originalHex] = parts;
  const derivedHex = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(originalHex, 'hex');
  const b = Buffer.from(derivedHex, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function createInitialStore(): StoreData {
  const now = Date.now();
  const rianId = 'usr-rian-01';
  const rianUser: StoredUser = {
    id: rianId,
    name: 'Rian Pratama',
    email: 'rian@iothome.id',
    phone: '081298765432',
    address: 'Jl. Kemang Raya No. 48, Kebayoran Baru, Jakarta Selatan 12730',
    passwordHash: hashPassword('iothome123'),
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString(),
  };

  const sampleOrder: Order = {
    id: 'IOT-2026-1041',
    userId: rianId,
    customerName: rianUser.name,
    customerPhone: rianUser.phone,
    shippingAddress: rianUser.address,
    courier: 'IoTHome Instant + Panduan Instalasi',
    paymentMethod: 'QRIS Instan',
    trackingNumber: 'RESI-IOT-884129',
    items: [
      {
        productId: 'cctv-outdoor-bullet',
        productName: 'IoTHome GuardPro Outdoor Bullet IP67',
        variantLabel: 'Versi Wi-Fi + Antena Ganda',
        unitPrice: 799000,
        quantity: 1,
        visualType: 'cctv-outdoor-bullet',
      },
      {
        productId: 'smart-ac-climasync',
        productName: 'IoTHome ClimaSync Smart AC IR Hub',
        variantLabel: 'ClimaSync Pro + Layar LED Suhu',
        unitPrice: 389000,
        quantity: 1,
        visualType: 'smart-ac-hub',
      },
    ],
    subtotal: 1188000,
    shippingFee: 0,
    total: 1188000,
    status: 'Sedang Diantar Kurir',
    timeline: ORDER_STAGES.slice(0, 4).map((stage, idx) => ({
      ...stage,
      timestamp: new Date(now - (4 - idx) * 1000 * 60 * 55).toISOString(),
      completed: true,
    })),
    deliveryConfirmed: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
  };

  return {
    users: [rianUser],
    sessions: [],
    orders: [sampleOrder],
  };
}

function readStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial = createInitialStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as StoreData;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    const fallback = createInitialStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function writeStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeUser(user: StoredUser): User {
  const { passwordHash: _ignored, ...safe } = user;
  return safe;
}

function extractToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

function getAuthenticatedUser(req: express.Request, store: StoreData): StoredUser | null {
  const token = extractToken(req);
  if (!token) return null;
  const session = store.sessions.find((s) => s.token === token);
  if (!session) return null;
  return store.users.find((u) => u.id === session.userId) ?? null;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'iothome-api' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, address, password } = req.body ?? {};
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      password.length < 6
    ) {
      res.status(400).json({ error: 'Nama, email valid, dan kata sandi minimal 6 karakter wajib diisi.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const store = readStore();
    if (store.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      res.status(409).json({ error: 'Email sudah terdaftar. Silakan masuk dengan akun Anda.' });
      return;
    }

    const newUser: StoredUser = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: typeof phone === 'string' && phone.trim() ? phone.trim() : '081200000000',
      address: typeof address === 'string' ? address.trim() : '',
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    const token = crypto.randomBytes(24).toString('hex');
    store.users.push(newUser);
    store.sessions.push({
      token,
      userId: newUser.id,
      createdAt: new Date().toISOString(),
    });
    writeStore(store);

    res.status(201).json({ token, user: sanitizeUser(newUser) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const store = readStore();
    const user = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Email atau kata sandi tidak sesuai.' });
      return;
    }

    const token = crypto.randomBytes(24).toString('hex');
    store.sessions.push({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });
    writeStore(store);

    res.json({ token, user: sanitizeUser(user) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = extractToken(req);
    if (token) {
      const store = readStore();
      store.sessions = store.sessions.filter((s) => s.token !== token);
      writeStore(store);
    }
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const store = readStore();
    const user = getAuthenticatedUser(req, store);
    if (!user) {
      res.status(401).json({ error: 'Sesi tidak ditemukan atau telah berakhir.' });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  });

  app.get('/api/orders', (req, res) => {
    const store = readStore();
    const user = getAuthenticatedUser(req, store);
    if (!user) {
      res.status(401).json({ error: 'Silakan masuk untuk melihat daftar pesanan.' });
      return;
    }
    const orders = store.orders
      .filter((o) => o.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ orders });
  });

  app.post('/api/orders', (req, res) => {
    const store = readStore();
    const user = getAuthenticatedUser(req, store);
    if (!user) {
      res.status(401).json({ error: 'Silakan masuk terlebih dahulu untuk membuat pesanan.' });
      return;
    }

    const { items, customerName, customerPhone, shippingAddress, courier, paymentMethod } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Keranjang belanja masih kosong.' });
      return;
    }
    if (
      typeof customerName !== 'string' ||
      !customerName.trim() ||
      typeof customerPhone !== 'string' ||
      !customerPhone.trim() ||
      typeof shippingAddress !== 'string' ||
      !shippingAddress.trim()
    ) {
      res.status(400).json({ error: 'Nama penerima, nomor WhatsApp, dan alamat lengkap wajib diisi.' });
      return;
    }

    const orderItems: OrderItem[] = [];
    for (const rawItem of items) {
      const product = PRODUCTS.find((p) => p.id === rawItem?.productId);
      if (!product) {
        res.status(400).json({ error: 'Produk tidak valid dalam keranjang.' });
        return;
      }
      const variant = product.variants.find((v) => v.id === rawItem?.variantId) ?? product.variants[0];
      const quantity = Math.max(1, Math.min(20, Math.floor(Number(rawItem?.quantity) || 1)));
      orderItems.push({
        productId: product.id,
        productName: product.name,
        variantLabel: variant.label,
        unitPrice: product.price + variant.priceDelta,
        quantity,
        visualType: product.visualType,
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const chosenCourier = typeof courier === 'string' && courier.trim() ? courier.trim() : 'IoTHome Express';
    const shippingFee =
      subtotal >= 500000 && !chosenCourier.includes('Instant')
        ? 0
        : chosenCourier.includes('Instant')
          ? 35000
          : 22000;
    const total = subtotal + shippingFee;

    const orderNumber = 1042 + store.orders.length;
    const orderId = `IOT-2026-${orderNumber}`;
    const trackingNumber = `RESI-IOT-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const firstStage = ORDER_STAGES[0];
    const timeline: OrderTimelineEntry[] = [
      {
        ...firstStage,
        timestamp: nowIso,
        completed: true,
      },
    ];

    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      courier: chosenCourier,
      paymentMethod:
        typeof paymentMethod === 'string' && paymentMethod.trim() ? paymentMethod.trim() : 'QRIS Instan',
      trackingNumber,
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      status: firstStage.status,
      timeline,
      deliveryConfirmed: false,
      createdAt: nowIso,
    };

    // Keep user contact details up to date
    const userIndex = store.users.findIndex((u) => u.id === user.id);
    if (userIndex >= 0) {
      store.users[userIndex].phone = customerPhone.trim();
      store.users[userIndex].address = shippingAddress.trim();
    }

    store.orders.unshift(newOrder);
    writeStore(store);

    res.status(201).json({ order: newOrder });
  });

  app.post('/api/orders/:id/advance', (req, res) => {
    const store = readStore();
    const user = getAuthenticatedUser(req, store);
    if (!user) {
      res.status(401).json({ error: 'Silakan masuk terlebih dahulu.' });
      return;
    }

    const orderIndex = store.orders.findIndex((o) => o.id === req.params.id && o.userId === user.id);
    if (orderIndex < 0) {
      res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
      return;
    }

    const order = store.orders[orderIndex];
    const currentStageIdx = ORDER_STAGES.findIndex((s) => s.status === order.status);
    if (currentStageIdx < 0 || currentStageIdx >= ORDER_STAGES.length - 1) {
      res.json({ order });
      return;
    }

    const nextStage = ORDER_STAGES[currentStageIdx + 1];
    const locationText =
      nextStage.status === 'Paket Telah Tiba'
        ? order.shippingAddress
        : nextStage.location;

    order.status = nextStage.status;
    order.timeline.push({
      status: nextStage.status,
      title: nextStage.title,
      detail: nextStage.detail,
      location: locationText,
      timestamp: new Date().toISOString(),
      completed: true,
    });

    store.orders[orderIndex] = order;
    writeStore(store);

    res.json({ order });
  });

  app.post('/api/orders/:id/confirm-delivery', (req, res) => {
    const store = readStore();
    const user = getAuthenticatedUser(req, store);
    if (!user) {
      res.status(401).json({ error: 'Silakan masuk terlebih dahulu.' });
      return;
    }

    const orderIndex = store.orders.findIndex((o) => o.id === req.params.id && o.userId === user.id);
    if (orderIndex < 0) {
      res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
      return;
    }

    const order = store.orders[orderIndex];
    const { note, rating } = req.body ?? {};
    const nowIso = new Date().toISOString();

    // Ensure all remaining stages up to Paket Telah Tiba are recorded
    const currentIdx = ORDER_STAGES.findIndex((s) => s.status === order.status);
    for (let i = Math.max(0, currentIdx + 1); i < ORDER_STAGES.length; i += 1) {
      const stage = ORDER_STAGES[i];
      order.timeline.push({
        status: stage.status,
        title: stage.title,
        detail: stage.detail,
        location: stage.status === 'Paket Telah Tiba' ? order.shippingAddress : stage.location,
        timestamp: nowIso,
        completed: true,
      });
    }

    order.status = 'Paket Telah Tiba';
    order.deliveryConfirmed = true;
    order.deliveryConfirmedAt = nowIso;
    order.deliveryNote = typeof note === 'string' && note.trim() ? note.trim() : 'Paket diterima dalam kondisi baik dan lengkap.';
    order.rating = typeof rating === 'number' && rating >= 1 && rating <= 5 ? Math.round(rating) : 5;

    store.orders[orderIndex] = order;
    writeStore(store);

    res.json({ order });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`IoTHome server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start IoTHome server:', err);
  process.exit(1);
});
