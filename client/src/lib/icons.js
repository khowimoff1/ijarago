import {
  Camera, Laptop, Gamepad2, Plane, Bike, Dumbbell, Tent, Hammer, Projector, Music,
  WashingMachine, Baby, Package,
} from 'lucide-react';

export const categoryIcons = {
  Camera, Laptop, Gamepad2, Plane, Bike, Dumbbell, Tent, Hammer, Projector, Music, WashingMachine, Baby,
};

// Har bir kategoriya uchun o'z rang palitrasi (rasm o'rniga ishlatiladi)
export const categoryTheme = {
  kamera:    { bg: 'from-[#ffe7d6] to-[#ffd0b0]', fg: 'text-[#b4532a]', icon: 'Camera' },
  noutbuk:   { bg: 'from-[#e3ecff] to-[#c9d9ff]', fg: 'text-[#3552a8]', icon: 'Laptop' },
  konsol:    { bg: 'from-[#ece4ff] to-[#d7c8ff]', fg: 'text-[#5b3db0]', icon: 'Gamepad2' },
  dron:      { bg: 'from-[#dff4f7] to-[#bfe7ee]', fg: 'text-[#1f7382]', icon: 'Plane' },
  velosiped: { bg: 'from-[#e3f5e6] to-[#c5ebcc]', fg: 'text-[#2c7a3d]', icon: 'Bike' },
  sport:     { bg: 'from-[#fde6ea] to-[#f9c9d2]', fg: 'text-[#a8354d]', icon: 'Dumbbell' },
  kemping:   { bg: 'from-[#eef3dc] to-[#dde8b8]', fg: 'text-[#5d6d1f]', icon: 'Tent' },
  qurilish:  { bg: 'from-[#fff1cf] to-[#ffe2a0]', fg: 'text-[#9a6a06]', icon: 'Hammer' },
  proyektor: { bg: 'from-[#e6e8ee] to-[#cfd3de]', fg: 'text-[#3d4458]', icon: 'Projector' },
  musiqa:    { bg: 'from-[#fbe3f4] to-[#f4c5e6]', fg: 'text-[#973c80]', icon: 'Music' },
  maishiy:   { bg: 'from-[#e1f1ff] to-[#c2e2ff]', fg: 'text-[#22649c]', icon: 'WashingMachine' },
  bolalar:   { bg: 'from-[#fff0e0] to-[#ffdcb8]', fg: 'text-[#a35a12]', icon: 'Baby' },
};

export const getCategoryTheme = (id) =>
  categoryTheme[id] || { bg: 'from-sand to-line', fg: 'text-muted', icon: null };

export const FallbackIcon = Package;
