import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // gambar dikirim sebagai Base64

app.get('/', (req, res) => res.json({ name: 'YukGambar API', status: 'ok' }));
app.use('/api', routes);
app.use((req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan' }));

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`YukGambar API berjalan di http://localhost:${PORT}`));
}

export default app;
