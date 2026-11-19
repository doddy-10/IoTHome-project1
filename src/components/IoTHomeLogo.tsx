interface IoTHomeLogoProps {
  className?: string;
  inverted?: boolean;
}

export function IoTHomeLogo({ className = '', inverted = false }: IoTHomeLogoProps) {
  const strokeColor = inverted ? '#FFFFFF' : '#0F2942';
  const wifiColor = inverted ? '#38BDF8' : '#0284C7';
  const textColor = inverted ? 'text-white' : 'text-[#0F2942]';

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M5 16.5L18 6L31 16.5"
          stroke={strokeColor}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 14V28.5C9.5 29.3284 10.1716 30 11 30H25C25.8284 30 26.5 29.3284 26.5 28.5V14"
          stroke={strokeColor}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 18.2C15.8 15.8 20.2 15.8 23 18.2"
          stroke={wifiColor}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M15.3 21.4C16.8 20.1 19.2 20.1 20.7 21.4"
          stroke={wifiColor}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <circle cx="18" cy="24.8" r="1.7" fill={wifiColor} />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${textColor}`}>IoTHome</span>
    </span>
  );
}
