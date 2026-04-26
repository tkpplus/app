import React from 'react';
import { SeriesCard } from '../components/video/SeriesCard';
import { seriesData } from '../data/seed';

export function Catalog() {
  const categoriesMap = seriesData.reduce((acc, series) => {
    const cat = series.categoryId || 'OTROS';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(series);
    return acc;
  }, {} as Record<string, typeof seriesData>);

  const categoryOrder = ["PARASHOT", "FESTIVIDADES", "CUENTOS", "OTROS"];

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-14 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 tracking-tight drop-shadow-md">
          Catálogo Completo
        </h1>
        <p className="text-lg text-white/80 leading-relaxed font-medium">
          Explora todas nuestras series agrupadas por categoría. Encuentra tu próxima historia o aprendizaje.
        </p>
      </div>

      <div className="space-y-16">
        {categoryOrder.map((category) => {
          const series = categoriesMap[category];
          if (!series || series.length === 0) return null;

          return (
            <div key={category}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">
                  {category}
                </h2>
                <div className="h-px bg-white/10 flex-grow" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {series.map((s) => (
                  <div key={s.id}>
                    <SeriesCard
                      id={s.id}
                      title={s.title}
                      thumbnail={s.thumbnail}
                      category={s.categoryId}
                      description={s.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
