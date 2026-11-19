export type ProductCategory = 'all' | 'cctv' | 'lighting' | 'climate' | 'access';

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export type HardwareVisualType =
  | 'cctv-indoor-pantilt'
  | 'cctv-outdoor-bullet'
  | 'cctv-dome-poe'
  | 'cctv-solar-wireless'
  | 'smart-bulb'
  | 'smart-switch'
  | 'smart-ac-hub'
  | 'smart-door-lock'
  | 'smart-plug'
  | 'smart-core-hub';

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'all'>;
  categoryLabel: string;
  subType: string;
  price: number;
  shortDesc: string;
  description: string;
  visualType: HardwareVisualType;
  storyboardScene: string;
  warranty: string;
  rating: number;
  soldCount: number;
  specs: ProductSpec[];
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export type OrderStatus =
  | 'Pesanan Dibuat'
  | 'Dikemas di Gudang'
  | 'Diserahkan ke Kurir'
  | 'Sedang Diantar Kurir'
  | 'Paket Telah Tiba';

export interface OrderTimelineEntry {
  status: OrderStatus;
  title: string;
  detail: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  visualType: HardwareVisualType;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  courier: string;
  paymentMethod: string;
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  timeline: OrderTimelineEntry[];
  deliveryConfirmed: boolean;
  deliveryConfirmedAt?: string;
  deliveryNote?: string;
  rating?: number;
  createdAt: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  timeRange: string;
  startTimeSeconds: number;
  title: string;
  shot: string;
  narration: string;
  linkedProductId: string;
}
