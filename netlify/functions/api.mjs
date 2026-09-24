// Netlify serverless funksiyasi: Express API'ni /api/* manzilida ishga tushiradi
import serverless from 'serverless-http';
import app from '../../server/src/app.js';

export const handler = serverless(app);
