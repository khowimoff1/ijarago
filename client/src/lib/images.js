// Unsplash suratlari (bepul litsenziya). Keyinchalik o'z suratlaringiz bilan almashtiring.
export const unsplash = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export const heroShots = {
  drone: unsplash('1507582020474-9a35b7d455d9', 900),
  camera: unsplash('1502982720700-bfff97f2ecac', 600),
  console: unsplash('1606144042614-b2417e99c4e3', 600),
  tent: unsplash('1504280390367-361c6d9f38f4', 600),
  people: unsplash('1522202176988-66273c2fd55f', 1000),
  handoff: unsplash('1556742049-0cfed4f6a45d', 1000),
};
