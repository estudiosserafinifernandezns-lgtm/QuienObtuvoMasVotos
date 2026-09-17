interface FlagIconProps {
  code: string;
  size?: number;
  className?: string;
}

export function FlagIcon({ code, size = 24, className = '' }: FlagIconProps) {
  if (code === 'PY') {
    return (
      <svg
        width={size}
        height={Math.round(size * 0.667)}
        viewBox="0 0 30 20"
        className={className}
        style={{ borderRadius: '15%', overflow: 'hidden' }}
      >
        <rect width="30" height="6.67" y="0" fill="#d52b1e" />
        <rect width="30" height="6.67" y="6.67" fill="#ffffff" />
        <rect width="30" height="6.67" y="13.33" fill="#0038a8" />
        <circle cx="15" cy="10" r="2.5" fill="#0038a8" stroke="#d52b1e" strokeWidth="0.5" />
        <path d="M15 7.8 L15.5 9.2 L16.8 9.2 L15.7 10 L16.1 11.3 L15 10.5 L13.9 11.3 L14.3 10 L13.2 9.2 L14.5 9.2 Z" fill="#ffffff" opacity="0.9" />
      </svg>
    );
  }

  if (code === 'AR') {
    return (
      <svg
        width={size}
        height={Math.round(size * 0.667)}
        viewBox="0 0 30 20"
        className={className}
        style={{ borderRadius: '15%', overflow: 'hidden' }}
      >
        <rect width="30" height="6.67" y="0" fill="#74acdf" />
        <rect width="30" height="6.67" y="6.67" fill="#ffffff" />
        <rect width="30" height="6.67" y="13.33" fill="#74acdf" />
      </svg>
    );
  }

  return (
    <span style={{ fontSize: size * 0.8 }} className={className}>🌐</span>
  );
}
