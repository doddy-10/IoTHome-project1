import { ExternalLink, MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Order, User } from '../types.ts';

interface WhatsAppWidgetProps {
  open: boolean;
  onToggle: (open: boolean) => void;
  presetMessage: string;
  user: User | null;
  latestOrder: Order | null;
}

const WHATSAPP_ADMIN_NUMBER = '6289630069368';
const WHATSAPP_DISPLAY_NUMBER = '+6289630069368';

const QUICK_TOPICS = [
  {
    label: 'Rekomendasi CCTV Rumah',
    message:
      'Halo IoTHome, saya ingin konsultasi perbedaan CCTV Indoor 360°, Outdoor Bullet IP67, Dome 4K, dan Solar Wireless untuk rumah saya.',
  },
  {
    label: 'Paket Lampu & Kontrol AC',
    message:
      'Halo IoTHome, apakah ClimaSync AC IR Hub kompatibel dengan AC di rumah saya dan bagaimana cara setting Mode Tidur?',
  },
  {
    label: 'Bantuan Pemasangan',
    message:
      'Halo IoTHome, saya membutuhkan panduan instalasi / jadwal teknisi untuk perangkat smart home.',
  },
];

export function WhatsAppWidget({
  open,
  onToggle,
  presetMessage,
  user,
  latestOrder,
}: WhatsAppWidgetProps) {
  const [messageText, setMessageText] = useState(presetMessage);
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: 'cs' | 'user'; text: string; time: string }>
  >([
    {
      sender: 'cs',
      text: 'Halo! Selamat datang di Layanan Konsultasi IoTHome. Ada perangkat CCTV, lampu pintar, kontrol AC, atau status pesanan yang bisa kami bantu?',
      time: 'Sekarang',
    },
  ]);

  useEffect(() => {
    if (presetMessage) {
      setMessageText(presetMessage);
    }
  }, [presetMessage]);

  const handleSendInPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const nowLabel = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: trimmed, time: nowLabel },
      {
        sender: 'cs',
        text: `Terima kasih! Pesan Anda siap diteruskan ke WhatsApp resmi CS IoTHome (${WHATSAPP_DISPLAY_NUMBER}). Klik tombol "Lanjutkan ke Aplikasi WhatsApp" di bawah untuk chat langsung dengan tim kami.`,
        time: nowLabel,
      },
    ]);
  };

  const fullWhatsAppText = `${messageText.trim()}${
    user ? `\n\nNama Akun: ${user.name}` : ''
  }${latestOrder ? `\nOrder Terakhir: ${latestOrder.id} (${latestOrder.status})` : ''}`;

  const waUrl = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodeURIComponent(
    fullWhatsAppText
  )}`;

  return (
    <>
      {/* Floating Compact WhatsApp Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => onToggle(true)}
          aria-label="Buka Chat WhatsApp IoTHome"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold whitespace-nowrap">Chat WhatsApp</span>
        </button>
      )}

      {/* WhatsApp Chat Panel */}
      {open && (
        <div
          className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          role="dialog"
          aria-label="Chat WhatsApp IoTHome"
        >
          {/* Header */}
          <div className="bg-[#0F2942] text-white px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">CS & Konsultan IoTHome</p>
                <p className="text-xs text-sky-200 truncate">WhatsApp Resmi · {WHATSAPP_DISPLAY_NUMBER}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggle(false)}
              aria-label="Tutup chat WhatsApp"
              className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Topic Chips */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-600">Pilih Topik Cepat:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => setMessageText(topic.message)}
                  className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {topic.label}
                </button>
              ))}
              {latestOrder && (
                <button
                  type="button"
                  onClick={() =>
                    setMessageText(
                      `Halo IoTHome, saya ingin menanyakan progres pengiriman pesanan ${latestOrder.id} (Resi ${latestOrder.trackingNumber}, status saat ini: ${latestOrder.status}).`
                    )
                  }
                  className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 hover:border-emerald-500 text-[#0F2942] rounded-lg transition-colors cursor-pointer"
                >
                  Tanya Order {latestOrder.id}
                </button>
              )}
            </div>
          </div>

          {/* Chat Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE2]/40">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-emerald-600 text-white'
                    : 'mr-auto bg-white border border-slate-200 text-slate-800'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] mt-1 self-end font-mono-tabular ${
                    msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Compose & Launch WhatsApp */}
          <form onSubmit={handleSendInPreview} className="p-3 bg-white border-t border-slate-200 space-y-2.5">
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Tulis pertanyaan tentang CCTV, alat smart home, atau pesanan..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                aria-label="Kirim pesan pratinjau"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F2942] rounded-lg cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <span>Lanjutkan ke Aplikasi WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </form>
        </div>
      )}
    </>
  );
}
