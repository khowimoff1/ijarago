// Express ilova — lokal serverda ham, Netlify Functions'da ham ishlatiladi
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

// Lokal: /api/...   Netlify: /.netlify/functions/api/...
app.use('/api', apiRoutes);
app.use('/.netlify/functions/api', apiRoutes);

app.use((req, res) => res.status(404).json({ message: 'Topilmadi' }));

export default app;
