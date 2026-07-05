// Personajes 2D SVG — clientes y cocineros flat design

export function Customer({ color = '#4F8EF7', x = 0, y = 0, emoji = '🍔', small = false }) {
  const scale = small ? 0.7 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Cuerpo */}
      <ellipse cx="18" cy="52" rx="12" ry="14" fill={color} opacity="0.9" />
      {/* Cabeza */}
      <circle cx="18" cy="24" r="13" fill="#FDDBB4" />
      {/* Pelo */}
      <ellipse cx="18" cy="14" rx="11" ry="6" fill="#5C3A1E" />
      {/* Ojos */}
      <circle cx="14" cy="23" r="2" fill="#333" />
      <circle cx="22" cy="23" r="2" fill="#333" />
      {/* Brillo ojos */}
      <circle cx="15" cy="22" r="0.8" fill="white" />
      <circle cx="23" cy="22" r="0.8" fill="white" />
      {/* Boca sonriente */}
      <path d="M14 28 Q18 32 22 28" stroke="#c0785a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Brazos */}
      <line x1="6" y1="42" x2="0" y2="56" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="30" y1="42" x2="36" y2="56" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Piernas */}
      <line x1="12" y1="64" x2="8" y2="80" stroke="#4a3728" strokeWidth="5" strokeLinecap="round" />
      <line x1="24" y1="64" x2="28" y2="80" stroke="#4a3728" strokeWidth="5" strokeLinecap="round" />
      {/* Burbuja de pedido */}
      <circle cx="36" cy="10" r="10" fill="white" stroke={color} strokeWidth="1.5" />
      <text x="36" y="14" textAnchor="middle" fontSize="11">{emoji}</text>
    </g>
  );
}

export function Chef({ color = '#E8593C', x = 0, y = 0, busy = false, coreIdx = 0 }) {
  const shirtColor = busy ? color : '#94a3b8';
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Gorro de chef */}
      <rect x="8" y="2" width="20" height="8" rx="3" fill="white" stroke="#ddd" strokeWidth="0.5" />
      <rect x="11" y="6" width="14" height="10" rx="2" fill="white" stroke="#ddd" strokeWidth="0.5" />
      {/* Cabeza */}
      <circle cx="18" cy="26" r="12" fill="#FDDBB4" />
      {/* Ojos */}
      <circle cx="14" cy="25" r="1.8" fill="#333" />
      <circle cx="22" cy="25" r="1.8" fill="#333" />
      <circle cx="14.6" cy="24.4" r="0.6" fill="white" />
      <circle cx="22.6" cy="24.4" r="0.6" fill="white" />
      {/* Expresión según estado */}
      {busy
        ? <path d="M13 30 Q18 34 23 30" stroke="#c0785a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        : <path d="M14 30 Q18 28 22 30" stroke="#c0785a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      }
      {/* Cuerpo con delantal */}
      <ellipse cx="18" cy="52" rx="13" ry="14" fill={shirtColor} />
      {/* Delantal */}
      <rect x="11" y="40" width="14" height="20" rx="3" fill="white" opacity="0.7" />
      {/* Brazos */}
      <line x1="5" y1="44" x2="0" y2="58" stroke={shirtColor} strokeWidth="5" strokeLinecap="round" />
      <line x1="31" y1="44" x2="36" y2="58" stroke={shirtColor} strokeWidth="5" strokeLinecap="round" />
      {/* Mano con utensilio si está ocupado */}
      {busy && (
        <g transform="translate(32, 52)">
          <line x1="0" y1="0" x2="6" y2="-14" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          <circle cx="6" cy="-16" r="3" fill="#aaa" />
        </g>
      )}
      {/* Piernas */}
      <line x1="12" y1="64" x2="9" y2="80" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      <line x1="24" y1="64" x2="27" y2="80" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      {/* Zapatos */}
      <ellipse cx="8" cy="81" rx="5" ry="2.5" fill="#1e293b" />
      <ellipse cx="28" cy="81" rx="5" ry="2.5" fill="#1e293b" />
      {/* Indicador de núcleo */}
      <text x="18" y="96" textAnchor="middle" fontSize="9" fill="#64748b">CPU-{coreIdx + 1}</text>
    </g>
  );
}

export function Waiter({ x = 0, y = 0}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Cabeza */}
      <circle cx="18" cy="22" r="12" fill="#FDDBB4" />
      {/* Pelo */}
      <ellipse cx="18" cy="13" rx="10" ry="5" fill="#2d1b69" />
      {/* Ojos */}
      <circle cx="14" cy="21" r="1.8" fill="#333" />
      <circle cx="22" cy="21" r="1.8" fill="#333" />
      {/* Moño */}
      <rect x="10" y="33" width="3" height="16" rx="1" fill="black" />
      {/* Cuerpo — traje negro */}
      <ellipse cx="18" cy="50" rx="13" ry="14" fill="#1e293b" />
      {/* Camisa blanca */}
      <rect x="14" y="36" width="8" height="14" rx="2" fill="white" />
      {/* Brazos */}
      <line x1="5" y1="42" x2="-2" y2="54" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      <line x1="31" y1="42" x2="38" y2="54" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      {/* Bandeja */}
      <ellipse cx="40" cy="50" rx="10" ry="3" fill="#d4a853" opacity="0.9" />
      <ellipse cx="40" cy="48" rx="7" ry="2" fill="#e8b96a" />
      {/* Piernas */}
      <line x1="12" y1="62" x2="9" y2="78" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      <line x1="24" y1="62" x2="27" y2="78" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}
