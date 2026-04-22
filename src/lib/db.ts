// Simulated mock database implementation mimicking Prisma for the MVP
import { videos } from '../data/seed';

export const db = {
  episode: {
    findMany: async (options: any) => {
      let result = [...videos];
      
      if (options?.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          if (value !== undefined) {
             result = result.filter(v => (v as any)[key] === value);
          }
        });
      }
      
      if (options?.orderBy) {
        if (options.orderBy.episodeNum) {
            result.sort((a, b) => {
                const dir = options.orderBy.episodeNum === 'asc' ? 1 : -1;
                return (((a as any).episodeNum || 0) - ((b as any).episodeNum || 0)) * dir;
            });
        }
      }
      
      return result;
    },
    findUnique: async (options: any) => {
        if(options?.where?.id) {
            return videos.find(v => v.id === options.where.id) || null;
        }
        return null;
    }
  },
  series: {
    findUnique: async (options: any) => {
        if(options?.where?.slug) {
            const seriesIdMap: Record<string, any> = {
                'parasha-en-un-minuto': {
                    id: 's1',
                    title: 'Parashá en un minuto',
                    slug: 'parasha-en-un-minuto',
                    description: 'Toda la porción semanal de la Torá resumida en tan solo 60 segundos con nuestros amigos puppets. Rápido, claro y divertido.',
                    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200&h=675'
                },
                'cuentos-especiales': {
                    id: 's2',
                    title: 'Cuentos Especiales',
                    slug: 'cuentos-especiales',
                    description: 'Historias increíbles de nuestras tradiciones y festividades cantadas y actuadas para toda la familia.',
                    thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200&h=675'
                }
            };
            return seriesIdMap[options.where.slug] || null;
        }
        return null;
    }
  }
};
