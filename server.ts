import express from 'express';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import cors from 'cors';

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API rutas (Backend)
  const apiRouter = express.Router();

  apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Torah Kids API running' });
  });

  // Ejemplo de endpoint: Obtener videos destacados
  apiRouter.get('/videos/featured', async (req, res) => {
    try {
      const videos = await prisma.episode.findMany({
        where: { featured: true },
        include: { series: true },
        take: 5
      });
      res.json(videos);
    } catch (error) {
      // Si la base de datos no está lista, podemos atrapar el error sin romper el servidor
      console.warn("DB not fully connected, returning fallback data or empty array.");
      res.json([]);
    }
  });

  // Ejemplo de endpoint: Obtener por categoría
  apiRouter.get('/videos/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const videos = await prisma.episode.findMany({
        where: { category: category as any },
        orderBy: { publishedAt: 'desc' },
        take: 10
      });
      res.json(videos);
    } catch (error) {
      res.json([]);
    }
  });

  // --- MOCK DB FOR PROGRESS (MVP) ---
  // Dado que la BD de Postgres puede no estar enlazada en el entorno actual, 
  // usamos un fallback en memoria para que la funcionalidad sea 100% interactiva en la demo.
  const mockProgressDB = new Map<string, any>();

  // POST /api/progress
  apiRouter.post('/progress', async (req, res) => {
    try {
      const { episodeId, timestamp, duration, userId = 'mock-user-1' } = req.body;
      
      if (!episodeId || timestamp === undefined || !duration) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
      }

      const percentage = timestamp / duration;
      const completed = percentage >= 0.9;
      
      const recordKey = `${userId}_${episodeId}`;
      const record = {
        id: recordKey,
        userId,
        episodeId,
        timestamp: completed ? duration : Math.floor(timestamp),
        percentage,
        completed,
        lastWatched: new Date().toISOString()
      };

      // Intentamos Prisma, simulamos si falla
      try {
        await prisma.watchProgress.upsert({
          where: { userId_episodeId: { userId, episodeId } },
          update: { timestamp: record.timestamp, completed },
          create: { userId, episodeId, timestamp: record.timestamp, completed }
        });
      } catch(e) {
        mockProgressDB.set(recordKey, record);
      }

      res.json(record);
    } catch (error) {
      res.status(500).json({ error: 'Error guardando progreso' });
    }
  });

  // GET /api/progress
  apiRouter.get('/progress', async (req, res) => {
    try {
      const userId = (req.query.userId as string) || 'mock-user-1';
      
      let progressList: any[] = [];
      try {
        progressList = await prisma.watchProgress.findMany({
          where: { userId, completed: false },
          orderBy: { lastWatched: 'desc' }
        });
      } catch(e) {
        progressList = Array.from(mockProgressDB.values())
          .filter(p => p.userId === userId && !p.completed)
          .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());
      }
      
      res.json(progressList);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo progresos' });
    }
  });

  // GET /api/progress/:episodeId
  apiRouter.get('/progress/:episodeId', async (req, res) => {
    try {
      const { episodeId } = req.params;
      const userId = (req.query.userId as string) || 'mock-user-1';
      
      let progress = null;
      try {
        progress = await prisma.watchProgress.findUnique({
          where: { userId_episodeId: { userId, episodeId } }
        });
      } catch(e) {
        progress = mockProgressDB.get(`${userId}_${episodeId}`) || null;
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo progreso' });
    }
  });

  // GET /api/recommendations
  // Cache simple in-memory para el MVP
  const recommendationCache = new Map<string, { data: any[], timestamp: number }>();
  let seedVideos: any[] = [];
  try {
     // Dynamic import so it does not fail if path changes, fallback robusto
     const seedModule = await import('./src/data/seed.js').catch(() => import('./src/data/seed.ts')).catch(() => null);
     if (seedModule && seedModule.videos) seedVideos = seedModule.videos;
  } catch(e) {}

  apiRouter.get('/recommendations', async (req, res) => {
    try {
      const { episodeId, userId } = req.query;
      const cacheKey = `${episodeId || ''}_${userId || ''}`;

      // Cache (60 segundos)
      const cached = recommendationCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 60000) {
        return res.json(cached.data);
      }

      // Obtener todos los videos para evaluar (O(n) viable para catálogos < 10,000 en memoria)
      let allVideos: any[] = [];
      try {
        allVideos = await prisma.episode.findMany();
        if (allVideos.length === 0) allVideos = seedVideos;
      } catch(e) {
        allVideos = seedVideos; // Fallback
      }

      let targetVideo: any = null;
      if (episodeId) {
        targetVideo = allVideos.find(v => v.id === episodeId);
      }

      // Obtener historial y preferencias del usuario
      const completedIds = new Set<string>();
      const userCategories = new Map<string, number>();

      if (userId) {
        try {
          // Extraemos progresos desde Mock o Prisma
          let progresses: any[] = [];
          try {
             progresses = await prisma.watchProgress.findMany({ where: { userId: String(userId) } });
          } catch(e) {
             progresses = Array.from(mockProgressDB.values()).filter(p => p.userId === userId);
          }

          progresses.forEach(p => {
            if (p.completed) completedIds.add(p.episodeId);
            const v = allVideos.find(vid => vid.id === p.episodeId);
            if (v && v.category) {
               userCategories.set(v.category, (userCategories.get(v.category) || 0) + 1);
            }
          });
        } catch(e) {}
      }

      // Sistema de Scoring
      const scoredVideos = allVideos.map(v => {
        // Excluir el mismo video y los ya completados
        if (v.id === episodeId) return { video: v, score: -1 };
        if (completedIds.has(v.id)) return { video: v, score: -1 };

        let score = (v.views || 0) * 0.001; // Popularidad base (muy ligera)
        
        // Recencia (últimos 30 días)
        const isRecent = new Date(v.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        if (isRecent) score += 10;

        // Contexto por similitud (Porque viste esto)
        if (targetVideo) {
           if (targetVideo.seriesId && v.seriesId === targetVideo.seriesId) {
             score += 50; 
             // Determinar si es el siguiente episodio
             if (v.episodeNum === targetVideo.episodeNum + 1) {
                score += 1000; // Máxima prioridad para auto-play/Next Episode
             }
           }
           if (targetVideo.parashaNum && v.parashaNum === targetVideo.parashaNum) score += 40;
           if (targetVideo.category && v.category === targetVideo.category) score += 30;
           if (targetVideo.subcategory && v.subcategory === targetVideo.subcategory) score += 20;
        }

        // Contexto por historial de usuario
        if (userCategories.has(v.category)) {
           score += (userCategories.get(v.category)! * 5);
        }
        
        if (v.featured) score += 5; // Empuje a featured

        return { video: v, score };
      }).filter(item => item.score >= 0);

      // Ordenar por score DESC
      scoredVideos.sort((a, b) => b.score - a.score);

      // Tomar top 20
      const results = scoredVideos.slice(0, 20).map(i => i.video);
      
      // Guardar en cache
      recommendationCache.set(cacheKey, { data: results, timestamp: Date.now() });

      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error obteniendo recomendaciones' });
    }
  });

  app.use('/api', apiRouter);

  // Integración de Vite (Frontend)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
