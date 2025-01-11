import { useReactiveVar } from '@apollo/client';
import { planets } from '../vars';
import { usePlanets } from '../hooks/usePlanets';
import { PlanetCard } from './PlanetCard';
import { useState, useRef, useCallback, useEffect } from 'react';
import { FilterSearch } from './FilterSearch';
import { PlanetFilter, SortOptions } from '@/interfaces/filterTypes';

export const PlanetGrid = () => {
  const [filter, setFilter] = useState<PlanetFilter>({});
  const [sort, setSort] = useState<SortOptions>({ sortBy: 'NAME', sortDirection: 'ASC' });
  const [displayCount, setDisplayCount] = useState(12);

  const { loading, error, data } = usePlanets(sort.sortBy, sort.sortDirection, filter);
  const currentPlanets = useReactiveVar(planets);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPlanetRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPlanets.length > displayCount) {
          setDisplayCount(prevCount => prevCount + 12);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, currentPlanets.length, displayCount]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const handleFilterChange = useCallback((newFilter: PlanetFilter) => {
    setFilter(newFilter);
    setDisplayCount(12);
  }, []);

  const handleSortChange = useCallback((newSort: SortOptions) => {
    setSort(newSort);
    setDisplayCount(12);
  }, []);

  const displayedPlanets = currentPlanets.slice(0, displayCount);

  return (
    <section className="flex-1 flex flex-col">
      <FilterSearch
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        initialFilter={filter}
        initialSort={sort}
      />
      <section className="flex-1 p-4 md:p-8">
        {loading && <h2 className="text-center text-blue-300">Loading exoplanets...</h2>}
        {error && (
          <div className="text-center text-red-400">
            <h2>Error occurred:</h2>
            <p>{error.message}</p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-center text-blue-200 mb-8">Exoplanets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedPlanets.map((planet, index) => (
            <div
              key={planet.id}
              ref={index === displayedPlanets.length - 1 ? lastPlanetRef : undefined}
            >
              <PlanetCard {...planet} />
            </div>
          ))}
        </div>
        {loading && displayCount > 12 && (
          <div className="text-center mt-8">
            <span className="text-blue-300">Discovering more exoplanets...</span>
          </div>
        )}
      </section>
    </section>
  );
};
