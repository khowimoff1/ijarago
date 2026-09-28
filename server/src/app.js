// Express ilova — lokal serverda ham, Netlify Functions'da ham ishlatiladi
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Lokal: /api/...   Netlify: /.netlify/functions/api/...
app.use('/api', apiRoutes);
app.use('/.netlify/functions/api', apiRoutes);

app.use((req, res) => res.status(404).json({ message: 'Topilmadi' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: "So'rov formati noto'g'ri" });
  console.error(err);
  res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
});

export default app;
