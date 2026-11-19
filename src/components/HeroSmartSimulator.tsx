import {
  Camera,
  Lightbulb,
  Lock,
  MessageCircle,
  Minus,
  Moon,
  Plus,
  ShieldCheck,
  Snowflake,
  Sun,
  Unlock,
} from 'lucide-react';
import { useState } from 'react';
import { IoTHomeLogo } from './IoTHomeLogo.tsx';

interface HeroSmartSimulatorProps {
  onOpenWhatsApp: (presetTopic?: string) => void;
  onSelectProductById: (productId: string) => void;
}

type AutoMode = 'pulang' | 'tidur' | 'bekerja';
type CameraZone = 'halaman' | 'ruang-tamu' | 'teras';

const CAMERA_ZONES: Record<
  CameraZone,
  { label: string; deviceName: string; productId: string; status: string; resolution: string }
> = {
  halaman: {
    label: 'Halaman Depan',
    deviceName: 'GuardPro Outdoor Bullet IP67',
    productId: 'cctv-outdoor-bullet',
    status: 'Area gerbang aman · Tidak ada gerakan mencurigakan',
    resolution: '4MP Color Night',
  },
  'ruang-tamu': {
    label: 'Ruang Tamu',
    deviceName: 'Cam 360° Pan-Tilt AI',
    productId: 'cctv-indoor-360',
    status: 'Sudut 180° aktif · Pelacakan AI siaga',
    resolution: '2K QHD',
  },
  teras: {
    label: 'Plafon Teras',
    deviceName: 'DomeVision 4K PoE',
    productId: 'cctv-dome-4k',
    status: 'Lensa 130° aktif · Pencahayaan optimal',
    resolution: '4K Ultra HD',
  },
};

export function HeroSmartSimulator({
  onOpenWhatsApp,
  onSelectProductById,
}: HeroSmartSimulatorProps) {
  const [lampOn, setLampOn] = useState(true);
  const [acOn, setAcOn] = useState(true);
  const [acTemp, setAcTemp] = useState(24);
  const [doorLocked, setDoorLocked] = useState(true);
  const [activeMode, setActiveMode] = useState<AutoMode>('pulang');
  const [cameraZone, setCameraZone] = useState<CameraZone>('halaman');

  const applyMode = (mode: AutoMode) => {
    setActiveMode(mode);
    if (mode === 'tidur') {
      setLampOn(false);
      setAcOn(true);
      setAcTemp(26);
      setDoorLocked(true);
    } else if (mode === 'bekerja') {
      setLampOn(false);
      setAcOn(false);
      setDoorLocked(true);
    } else {
      setLampOn(true);
      setAcOn(true);
      setAcTemp(24);
      setDoorLocked(false);
    }
  };

  const currentCam = CAMERA_ZONES[cameraZone];

  return (
    <section id="beranda" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Brand Campaign Focal Point */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <p className="text-sm font-semibold text-[#0284C7] tracking-tight">
                IoTHome · Your Smart Living Partner
              </p>

              <h1
                className="text-4xl sm:text-5xl font-bold text-[#0F2942] leading-[1.12] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Rumah pintar untuk hidup yang lebih baik.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Tak perlu khawatir lagi apakah lampu lupa dimatikan atau AC masih menyala saat bekerja. Kendalikan pencahayaan, suhu ruangan 24°C, kunci pintu biometrik, dan berbagai jenis CCTV langsung dari genggaman Anda.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#katalog"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#163656] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Belanja Perangkat
                </a>
                <button
                  type="button"
                  onClick={() => onOpenWhatsApp('Konsultasi Perangkat Smart Home & CCTV')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Chat WhatsApp CS</span>
                </button>
              </div>
            </div>

            {/* Quiet Unboxed Trust & Storyboard Highlight Strip */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xl font-bold font-mono-tabular text-[#0F2942]">4 Tipe</p>
                <p className="text-xs text-slate-500 mt-1">CCTV Indoor & Outdoor</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono-tabular text-[#0F2942]">24°C</p>
                <p className="text-xs text-slate-500 mt-1">Kontrol AC Jarak Jauh</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono-tabular text-[#0F2942]">2–3 Thn</p>
                <p className="text-xs text-slate-500 mt-1">Garansi Resmi Produk</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono-tabular text-[#0F2942]">5 Tahap</p>
                <p className="text-xs text-slate-500 mt-1">Lacak Hingga Tiba</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive IoTHome Control Simulator (Storyboard Scenes 3-7) */}
          <div id="simulasi" className="lg:col-span-6 flex">
            <div className="w-full bg-[#0F2942] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 border border-[#1E3A5F]">
              {/* Simulator Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <IoTHomeLogo inverted />
                </div>
                <div className="flex items-center gap-1 p-1 bg-white/10 rounded-lg">
                  {(
                    [
                      { id: 'pulang', label: 'Mode Pulang', icon: Sun },
                      { id: 'tidur', label: 'Mode Tidur', icon: Moon },
                      { id: 'bekerja', label: 'Mode Kerja', icon: ShieldCheck },
                    ] as const
                  ).map((mode) => {
                    const Icon = mode.icon;
                    const active = activeMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => applyMode(mode.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-white text-[#0F2942]'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Room & Device Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Scene 4: Lamp Control (Before/After Warm Ambiance) */}
                <div
                  className={`rounded-xl p-4 border transition-colors ${
                    lampOn
                      ? 'bg-amber-500/15 border-amber-300/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Lightbulb
                        className={`w-5 h-5 ${lampOn ? 'text-amber-300' : 'text-slate-400'}`}
                      />
                      <div>
                        <p className="text-sm font-semibold">Lampu Ruang Tamu</p>
                        <p className="text-xs text-slate-300">
                          {lampOn ? 'Menyala · Hangat 2700K' : 'Mati · Hemat Daya'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLampOn((prev) => !prev)}
                      aria-pressed={lampOn}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        lampOn
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-white/15 text-slate-200 hover:bg-white/25'
                      }`}
                    >
                      {lampOn ? 'Nyala' : 'Mati'}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Lumina Smart Bulb 9W</span>
                    <button
                      type="button"
                      onClick={() => onSelectProductById('smart-bulb-lumina')}
                      className="text-sky-300 hover:underline cursor-pointer"
                    >
                      Lihat produk
                    </button>
                  </div>
                </div>

                {/* Scene 5: AC & Temperature Control */}
                <div
                  className={`rounded-xl p-4 border transition-colors ${
                    acOn ? 'bg-sky-500/15 border-sky-300/40' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Snowflake
                        className={`w-5 h-5 ${acOn ? 'text-sky-300' : 'text-slate-400'}`}
                      />
                      <div>
                        <p className="text-sm font-semibold">AC & Suhu Ruangan</p>
                        <p className="text-xs text-slate-300 font-mono-tabular">
                          {acOn ? `Aktif · ${acTemp}°C` : 'Nonaktif'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAcOn((prev) => !prev)}
                      aria-pressed={acOn}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        acOn
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-white/15 text-slate-200 hover:bg-white/25'
                      }`}
                    >
                      {acOn ? 'Nyala' : 'Mati'}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAcOn(true);
                          setAcTemp((t) => Math.max(16, t - 1));
                        }}
                        aria-label="Turunkan suhu AC"
                        className="p-1.5 hover:bg-white/15 rounded cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-mono-tabular font-semibold">
                        {acTemp}°C
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAcOn(true);
                          setAcTemp((t) => Math.min(30, t + 1));
                        }}
                        aria-label="Naikkan suhu AC"
                        className="p-1.5 hover:bg-white/15 rounded cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectProductById('smart-ac-climasync')}
                      className="text-xs text-sky-300 hover:underline cursor-pointer"
                    >
                      Lihat produk
                    </button>
                  </div>
                </div>
              </div>

              {/* Scene 6: CCTV Live Switcher + Door Lock */}
              <div className="rounded-xl bg-[#0A1D30] border border-white/10 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Camera className="w-4 h-4 text-sky-300" />
                    <span>Kamera Rumah · {currentCam.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['halaman', 'ruang-tamu', 'teras'] as const).map((zone) => (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => setCameraZone(zone)}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          cameraZone === zone
                            ? 'bg-sky-500 text-white font-semibold'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {CAMERA_ZONES[zone].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stylized Architectural Live Feed Viewport */}
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 via-[#122D48] to-slate-900 p-4 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-mono-tabular mb-3">
                    <span>{currentCam.deviceName}</span>
                    <span>{currentCam.resolution}</span>
                  </div>

                  {/* Minimalist Architectural Home Outline Reflecting Lamp & Lock State */}
                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="space-y-1.5">
                      <p className="text-xs text-emerald-300 font-medium">{currentCam.status}</p>
                      <p className="text-xs text-slate-400">
                        Kunci Pintu: {doorLocked ? 'Terkunci Aman (SafeEntry)' : 'Terbuka'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDoorLocked((prev) => !prev)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          doorLocked
                            ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                            : 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                        }`}
                      >
                        {doorLocked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                        <span>{doorLocked ? 'Pintu Terkunci' : 'Pintu Terbuka'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Scene 6 & 7 · Simulasi Real-Time</span>
                    <button
                      type="button"
                      onClick={() => onSelectProductById(currentCam.productId)}
                      className="text-sky-300 hover:underline font-medium cursor-pointer"
                    >
                      Pesan {currentCam.deviceName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
