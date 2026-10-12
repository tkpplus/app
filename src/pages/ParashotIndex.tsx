import { SeriesCard } from '../components/video/SeriesCard';
import { getSeriesByCategory } from '../data/seed';

export function ParashotIndex() {
  const parashotSeries = getSeriesByCategory('PARASHOT');

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <div className="mb-14 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 tracking-tight drop-shadow-md">
          Especial Parashot
        </h1>
        <p className="text-lg text-white/80 leading-relaxed font-medium">
          Explora los libros de la Torá y sus parashot. Cada serie incluye sus porciones semanales 
          listas para reproducir como una serie continua.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {parashotSeries.map((series) => (
          <div key={series.id} className="min-w-0">
            <SeriesCard
              id={series.id}
              title={series.title}
              thumbnail={series.thumbnail}
              category={series.categoryId}
              description={series.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
