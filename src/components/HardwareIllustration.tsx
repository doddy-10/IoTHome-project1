import { HardwareVisualType } from '../types.ts';

interface HardwareIllustrationProps {
  type: HardwareVisualType;
  className?: string;
  activeGlow?: boolean;
}

export function HardwareIllustration({
  type,
  className = 'w-full h-full',
  activeGlow = true,
}: HardwareIllustrationProps) {
  switch (type) {
    case 'cctv-indoor-pantilt':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="154" rx="52" ry="9" fill="#CBD5E1" fillOpacity="0.65" />
          {/* Base */}
          <path d="M84 134C84 127 100 123 120 123C140 123 156 127 156 134V146C156 151 140 155 120 155C100 155 84 151 84 146V134Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <ellipse cx="120" cy="134" rx="36" ry="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
          {/* Neck */}
          <rect x="108" y="108" width="24" height="22" rx="4" fill="#CBD5E1" />
          {/* Spherical Pan-Tilt Head */}
          <circle cx="120" cy="76" r="42" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
          <path d="M85 95C94 108 106 114 120 114C134 114 146 108 155 95" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
          {/* Black Lens Housing */}
          <circle cx="120" cy="74" r="23" fill="#0F172A" />
          <circle cx="120" cy="74" r="17" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <circle cx="120" cy="74" r="9.5" fill="#0F2942" stroke="#38BDF8" strokeOpacity="0.6" strokeWidth="1.5" />
          <circle cx="116.5" cy="70.5" r="3" fill="#7DD3FC" fillOpacity="0.7" />
          {/* IR & Status LED */}
          <circle cx="120" cy="103" r="2.2" fill="#10B981" />
          <circle cx="105" cy="59" r="1.5" fill="#475569" />
          <circle cx="135" cy="59" r="1.5" fill="#475569" />
          {/* 360 Rotation Arrows */}
          <path d="M72 138C63 135 58 130 58 125" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M168 138C177 135 182 130 182 125" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );

    case 'cctv-outdoor-bullet':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="122" cy="154" rx="58" ry="8" fill="#CBD5E1" fillOpacity="0.6" />
          {/* Wall Mount Plate */}
          <rect x="40" y="72" width="12" height="54" rx="3" fill="#0F2942" />
          <path d="M52 94H78L94 108V120H78L52 104V94Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Dual Wi-Fi Antennas */}
          <rect x="86" y="34" width="5" height="36" rx="2.5" fill="#1E293B" />
          <rect x="102" y="38" width="5" height="32" rx="2.5" fill="#334155" />
          {/* Bullet Camera Body */}
          <rect x="78" y="64" width="96" height="48" rx="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
          {/* Weatherproof Sun Visor Hood */}
          <path d="M74 62C74 56 79 52 86 52H172L186 64H74V62Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.4" />
          {/* Front Bezel & Lens */}
          <ellipse cx="174" cy="88" rx="14" ry="22" fill="#0F172A" />
          <ellipse cx="174" cy="88" rx="9" ry="15" fill="#1E293B" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.2" />
          <ellipse cx="175" cy="88" rx="4.5" ry="8" fill="#0284C7" fillOpacity="0.55" />
          {/* Spotlight LEDs */}
          <circle cx="174" cy="70" r="2.2" fill="#FDE68A" />
          <circle cx="174" cy="106" r="2.2" fill="#FDE68A" />
          <rect x="92" y="83" width="44" height="6" rx="3" fill="#E2E8F0" />
        </svg>
      );

    case 'cctv-dome-poe':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="150" rx="58" ry="9" fill="#CBD5E1" fillOpacity="0.65" />
          {/* Ceiling Mounting Collar */}
          <ellipse cx="120" cy="64" rx="64" ry="16" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.6" />
          <path d="M56 64V80C56 90 85 98 120 98C155 98 184 90 184 80V64" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.6" />
          {/* Dark Tinted Dome Glass */}
          <path d="M68 78C68 118 91 142 120 142C149 142 172 118 172 78H68Z" fill="#0F172A" />
          <path d="M76 84C78 112 96 130 116 133" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="3.5" strokeLinecap="round" />
          {/* Internal Gimbal Lens */}
          <circle cx="124" cy="105" r="18" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="125" cy="105" r="9" fill="#0F2942" stroke="#38BDF8" strokeWidth="1.4" />
          <circle cx="122" cy="102" r="2.8" fill="#BAE6FD" fillOpacity="0.8" />
          {/* PoE Tag Marker */}
          <rect x="111" y="54" width="18" height="5" rx="2.5" fill="#0284C7" />
        </svg>
      );

    case 'cctv-solar-wireless':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="155" rx="56" ry="8" fill="#CBD5E1" fillOpacity="0.6" />
          {/* Solar Panel on Top */}
          <path d="M66 36L164 26L176 62L78 72L66 36Z" fill="#0F2942" stroke="#334155" strokeWidth="2" />
          <path d="M90 34L102 69M115 31L127 66M140 29L152 64" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.2" />
          <path d="M72 54L170 44" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.2" />
          {/* Arm Connector */}
          <rect x="115" y="68" width="10" height="22" rx="3" fill="#94A3B8" />
          {/* Wireless Camera Body */}
          <rect x="78" y="88" width="82" height="50" rx="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.8" />
          <circle cx="144" cy="113" r="17" fill="#0F172A" />
          <circle cx="144" cy="113" r="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.4" />
          <circle cx="141" cy="110" r="2.5" fill="#7DD3FC" />
          {/* PIR Sensor Window */}
          <rect x="92" y="104" width="22" height="18" rx="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.2" />
          <circle cx="103" cy="113" r="2.5" fill="#10B981" />
        </svg>
      );

    case 'smart-bulb':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          {activeGlow && (
            <circle cx="120" cy="74" r="56" fill="#FDE68A" fillOpacity="0.45" />
          )}
          <ellipse cx="120" cy="156" rx="34" ry="7" fill="#CBD5E1" fillOpacity="0.6" />
          {/* Glass Bulb Dome */}
          <path
            d="M84 72C84 49 100 32 120 32C140 32 156 49 156 72C156 89 144 100 140 112H100C96 100 84 89 84 72Z"
            fill={activeGlow ? '#FEF3C7' : '#FFFFFF'}
            stroke="#D97706"
            strokeOpacity={activeGlow ? '0.65' : '0.3'}
            strokeWidth="2"
          />
          {/* Inner Warm Core */}
          <circle cx="120" cy="72" r="18" fill={activeGlow ? '#F59E0B' : '#E2E8F0'} fillOpacity="0.35" />
          {/* Mid Collar */}
          <rect x="99" y="112" width="42" height="14" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.4" />
          {/* E27 Screw Base */}
          <path d="M104 126H136L133 146C133 149 127 152 120 152C113 152 107 149 107 146L104 126Z" fill="#94A3B8" />
          <path d="M105 132H135M106 138H134M107 144H133" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      );

    case 'smart-switch':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="155" rx="52" ry="7" fill="#CBD5E1" fillOpacity="0.6" />
          {/* Glass Plate Outer */}
          <rect x="66" y="30" width="108" height="114" rx="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <rect x="74" y="38" width="92" height="98" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.2" />
          {/* 3 Touch Zones */}
          {[88, 120, 152].map((cx, i) => (
            <g key={cx}>
              <rect x={cx - 12} y="64" width="24" height="46" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
              <circle cx={cx} cy="87" r="4.5" fill={i === 0 ? '#0284C7' : '#94A3B8'} />
              <rect x={cx - 6} y="100" width="12" height="2.5" rx="1.2" fill={i === 0 ? '#38BDF8' : '#CBD5E1'} />
            </g>
          ))}
        </svg>
      );

    case 'smart-ac-hub':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="154" rx="54" ry="8" fill="#CBD5E1" fillOpacity="0.6" />
          {/* Rounded Square IR Hub */}
          <rect x="68" y="42" width="104" height="100" rx="22" fill="#0F2942" stroke="#1E3A5F" strokeWidth="2" />
          <rect x="78" y="52" width="84" height="80" rx="16" fill="#133453" />
          {/* Digital 24°C Display */}
          <text
            x="120"
            y="98"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="28"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            24°C
          </text>
          <text
            x="120"
            y="117"
            textAnchor="middle"
            fill="#38BDF8"
            fontSize="10"
            fontWeight="600"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            COOL · AUTO
          </text>
          {/* Signal Arcs */}
          <path d="M104 32C113 26 127 26 136 32" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M111 38C116 35 124 35 129 38" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'smart-door-lock':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="158" rx="44" ry="7" fill="#CBD5E1" fillOpacity="0.6" />
          {/* Vertical Lock Escutcheon */}
          <rect x="88" y="24" width="64" height="126" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          {/* Keypad Dots */}
          <rect x="102" y="36" width="36" height="44" rx="6" fill="#1E293B" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={110 + col * 10}
                cy={46 + row * 10}
                r="2"
                fill="#94A3B8"
              />
            ))
          )}
          {/* Handle + Fingerprint Sensor */}
          <rect x="100" y="92" width="68" height="18" rx="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <circle cx="114" cy="101" r="6" fill="#0284C7" />
          <circle cx="114" cy="101" r="3" fill="#BAE6FD" />
          {/* NFC Card Zone */}
          <rect x="108" y="122" width="24" height="14" rx="3" stroke="#475569" strokeWidth="1.4" />
          <circle cx="120" cy="142" r="2.2" fill="#10B981" />
        </svg>
      );

    case 'smart-plug':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="150" rx="46" ry="8" fill="#CBD5E1" fillOpacity="0.65" />
          {/* Cylindrical Body */}
          <circle cx="120" cy="88" r="48" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="120" cy="88" r="34" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* EU/ID Socket Holes */}
          <circle cx="106" cy="88" r="5" fill="#1E293B" />
          <circle cx="134" cy="88" r="5" fill="#1E293B" />
          <rect x="118" y="56" width="4" height="8" rx="2" fill="#94A3B8" />
          <rect x="118" y="112" width="4" height="8" rx="2" fill="#94A3B8" />
          {/* Power Button */}
          <circle cx="120" cy="130" r="6" fill="#0F2942" />
          <circle cx="120" cy="130" r="2.2" fill="#10B981" />
        </svg>
      );

    case 'smart-core-hub':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className} aria-hidden="true">
          <ellipse cx="120" cy="152" rx="64" ry="9" fill="#CBD5E1" fillOpacity="0.65" />
          {/* Sleek Gateway Box */}
          <rect x="54" y="64" width="132" height="74" rx="18" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <rect x="64" y="74" width="112" height="54" rx="12" fill="#0F2942" />
          {/* IoTHome Roof Icon in Center */}
          <path d="M104 98L120 85L136 98" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M111 103C116 99 124 99 129 103" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="120" cy="111" r="2.5" fill="#38BDF8" />
          {/* Bottom Status Bar */}
          <rect x="102" y="132" width="36" height="3.5" rx="1.75" fill="#10B981" />
        </svg>
      );
  }
}
