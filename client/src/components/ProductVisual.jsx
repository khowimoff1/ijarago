import { useState } from 'react';
import { categoryIcons, getCategoryTheme, FallbackIcon } from '../lib/icons.js';

// Rasm bo'lsa rasmni, bo'lmasa (yoki yuklanmasa) kategoriya rangidagi vizualni ko'rsatadi
export default function ProductVisual({ item, index = 0, className = '', iconSize = 'h-16 w-16', sizes }) {
  const [failed, setFailed] = useState(false);
  const src = item.images?.[index] || item.images?.[0];

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={item.title}
        loading="lazy"
        sizes={sizes}
        onError={() => setFailed(true)}
        className={`h-full w-full bg-sand object-cover ${className}`}
      />
    );
  }

  const theme = getCategoryTheme(item.category);
  const Icon = categoryIcons[theme.icon] || FallbackIcon;
  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br ${theme.bg} ${className}`}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/30" />
      <Icon className={`relative ${iconSize} ${theme.fg}`} strokeWidth={1.4} />
    </div>
  );
}
