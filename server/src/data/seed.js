const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

const P = {
  cam1: '1516035069371-29a1b244cc32', cam2: '1502920917128-1aa500764cbd', cam4: '1502982720700-bfff97f2ecac', cam5: '1510127034890-ba27508e9f1c',
  drone1: '1473968512647-3e447244af8f', drone2: '1507582020474-9a35b7d455d9', drone3: '1508614589041-895b88991e3e',
  ps1: '1606144042614-b2417e99c4e3', ps2: '1607853202273-797f1c22a38e', ps3: '1622297845775-5ff3fef71d13',
  mac1: '1517336714731-489689fd1ca8', mac2: '1496181133206-80ce9b88a853', mac3: '1611186871348-b1ce696e52c9',
  bike1: '1485965120184-e220f721d03e', bike2: '1532298229144-0ec0c57515c7', bike3: '1576435728678-68d0fbf94e91',
  proj1: '1478720568477-152d9b164e26', proj3: '1626379953822-baec19c3accd',
  tent1: '1504280390367-361c6d9f38f4', tent2: '1478131143081-80f7f84ca84d', tent3: '1523987355523-c7b5b0dd90a7',
  tool1: '1504148455328-c376907d081c', tool2: '1572981779307-38b8cabb2407', tool3: '1581147036324-c17ac41dfa6c',
  spk1: '1608043152269-423dbba4e7e1', spk2: '1545454675-3531b543be5d', spk3: '1589003077984-894e133dabab',
  sw1: '1578303512597-81e6cc155b3e', sw2: '1612287230202-1ff1d85d1bdf',
  gym1: '1576678927484-cc907957088c', gym2: '1534438327276-14e5300c3a48', gym3: '1571902943202-507ec2618e8f',
  vac1: '1558317374-067fb5f30001', vac2: '1527515637462-cff94eecc1ac', wash1: '1626806787461-102c1bfaaea1',
  baby1: '1566004100631-35d015d6a491', baby3: '1519689680058-324335c77eba',
  ipad1: '1544244015-0df4b3ffc6b0', ipad2: '1561154464-82e9adf32764',
  music1: '1511379938547-c1f69419868d', music2: '1510915361894-db8b60106cb1',
};
const imgs = (...keys) => keys.map((k) => u(P[k]));

export const categories = [
  { id: 'kamera', name: 'Kamera va foto', icon: 'Camera', image: u(P.cam1, 800) },
  { id: 'noutbuk', name: 'Noutbuk va planshet', icon: 'Laptop', image: u(P.mac1, 800) },
  { id: 'konsol', name: "O'yin konsollari", icon: 'Gamepad2', image: u(P.ps2, 800) },
  { id: 'dron', name: 'Dronlar', icon: 'Plane', image: u(P.drone1, 800) },
  { id: 'velosiped', name: 'Velosiped va samokat', icon: 'Bike', image: u(P.bike2, 800) },
  { id: 'sport', name: 'Sport jihozlari', icon: 'Dumbbell', image: u(P.gym2, 800) },
  { id: 'kemping', name: 'Sayohat va kemping', icon: 'Tent', image: u(P.tent2, 800) },
  { id: 'qurilish', name: 'Qurilish asboblari', icon: 'Hammer', image: u(P.tool3, 800) },
  { id: 'proyektor', name: 'Proyektor va ekran', icon: 'Projector', image: u(P.proj1, 800) },
  { id: 'musiqa', name: 'Musiqa va ovoz', icon: 'Music', image: u(P.music2, 800) },
  { id: 'maishiy', name: 'Maishiy texnika', icon: 'WashingMachine', image: u(P.wash1, 800) },
  { id: 'bolalar', name: 'Bolalar uchun', icon: 'Baby', image: u(P.baby1, 800) },
];

const owners = [
  { id: 'u1', name: 'Jasur T.', rating: 4.9, deals: 58, verified: true, since: '2024' },
  { id: 'u2', name: 'Madina R.', rating: 4.8, deals: 31, verified: true, since: '2025' },
  { id: 'u3', name: 'Sardor X.', rating: 5.0, deals: 12, verified: true, since: '2025' },
  { id: 'u4', name: 'Aziza K.', rating: 4.7, deals: 44, verified: false, since: '2024' },
];

const L = (id, title, category, pricePerDay, deposit, district, ownerIdx, rating, reviews, extra = {}) => ({
  id: String(id), title, category, pricePerDay, deposit, city: 'Toshkent', district,
  owner: owners[ownerIdx], rating, reviews, minDays: 1, condition: "A'lo",
  images: IM[id] ? imgs(...IM[id]) : [], createdAt: new Date(Date.now() - id * 36e5 * 7).toISOString(),
  description: `${title} — yaxshi holatda, to'liq komplekt bilan beriladi. Olish va qaytarish vaqtini oldindan kelishib olamiz. Ijaraga olishdan oldin mahsulotni birga tekshiramiz.`,
  ...extra,
});

const IM = {1:['cam4','cam1','cam5'],2:['drone2','drone1','drone3'],3:['ps1','ps2','ps3'],4:['mac3','mac1','mac2'],5:['bike3','bike2','bike1'],6:['proj1','proj3','mac1'],7:['tent1','tent2','tent3'],8:['tool1','tool2','tool3'],9:['spk1','spk3','spk2'],10:['cam2','cam1','cam4'],11:['sw1','sw2','ps1'],12:['bike1','bike2','bike3'],13:['gym1','gym2','gym3'],14:['vac2','vac1','wash1'],15:['baby3','baby1','baby3'],16:['ipad1','ipad2','mac2']};

export const listings = [
  L(1, 'Sony A7 III + 28-70mm obyektiv', 'kamera', 250000, 1500000, 'Yunusobod', 0, 4.9, 23, { features: ['2 ta batareya', '64 GB xotira kartasi', 'Sumka'] }),
  L(2, 'DJI Mini 4 Pro dron', 'dron', 320000, 2000000, 'Mirzo Ulug\'bek', 2, 5.0, 9, { features: ['3 ta batareya', 'RC 2 pult', 'ND filtrlar'] }),
  L(3, 'PlayStation 5 + 2 joystik', 'konsol', 150000, 800000, 'Chilonzor', 1, 4.8, 41, { features: ['5 ta o\'yin', 'HDMI kabel'] }),
  L(4, 'MacBook Pro 14" M3', 'noutbuk', 280000, 3000000, 'Yakkasaroy', 0, 4.9, 15, { features: ['Zaryadlovchi', 'Chexol'], minDays: 2 }),
  L(5, 'Tog\' velosipedi Trek Marlin 7', 'velosiped', 90000, 500000, 'Yunusobod', 3, 4.7, 27, { features: ['Shlem', 'Qulf'] }),
  L(6, 'Epson 4K proyektor + ekran', 'proyektor', 180000, 1000000, 'Shayxontohur', 1, 4.8, 19, { features: ['120" ekran', 'Tripod'] }),
  L(7, '4 kishilik chodir va kemping to\'plami', 'kemping', 70000, 300000, 'Sergeli', 2, 4.9, 33, { features: ['Uxlash qoplari', 'Gaz plita'] }),
  L(8, 'Bosch perforator GBH 2-26', 'qurilish', 60000, 400000, 'Olmazor', 3, 4.6, 52, { features: ['Burg\'u to\'plami', 'Keys'] }),
  L(9, 'JBL PartyBox 310 kolonka', 'musiqa', 120000, 700000, 'Chilonzor', 0, 4.8, 36, { features: ['Mikrofon', 'Zaryadlovchi'] }),
  L(10, 'Canon EOS R6 + 50mm f/1.8', 'kamera', 230000, 1500000, 'Mirobod', 1, 4.9, 18),
  L(11, 'Nintendo Switch OLED', 'konsol', 100000, 600000, 'Yashnobod', 2, 4.7, 14, { features: ['3 ta o\'yin', 'Pro kontroller'] }),
  L(12, 'Shosse velosipedi Giant Contend', 'velosiped', 85000, 600000, 'Mirzo Ulug\'bek', 3, 4.6, 29),
  L(13, 'Gantellar to\'plami (2–24 kg)', 'sport', 60000, 500000, 'Yunusobod', 0, 4.8, 8, { minDays: 3, features: ['Stoyka', 'Gilamcha'] }),
  L(14, 'Dyson V15 changyutgich', 'maishiy', 70000, 500000, 'Yakkasaroy', 1, 4.9, 21),
  L(15, 'Bolalar puflama basseyni + o\'yinchoqlar', 'bolalar', 45000, 200000, 'Sergeli', 2, 5.0, 11, { minDays: 2 }),
  L(16, 'iPad Pro 12.9" + Apple Pencil', 'noutbuk', 160000, 1500000, 'Shayxontohur', 0, 4.8, 16),
];

export const reviews = [
  { id: 'r1', listingId: '1', author: 'Otabek', rating: 5, text: 'Kamera juda toza holatda edi, egasi hammasini tushuntirib berdi.', date: '2026-08-14' },
  { id: 'r2', listingId: '1', author: 'Nigora', rating: 5, text: 'To\'y suratga olish uchun oldim, hammasi zo\'r o\'tdi.', date: '2026-07-30' },
  { id: 'r3', listingId: '3', author: 'Bekzod', rating: 4, text: 'Dam olish kunlari uchun ajoyib. Bitta joystik biroz eskirgan.', date: '2026-08-02' },
];
