import { PlanetFilter, SortOptions } from '@/interfaces/filterTypes';
import { PlanetCardProps } from '@/interfaces/planetInterface';
import { useCallback, useEffect, useOptimistic, useRef, useState, useTransition } from 'react';
import { useLoader } from '../context/LoadingContext';
import { usePlanets } from '../hooks/usePlanets';
import { FilterSearch } from './FilterSearch';
import { PlanetCard } from './PlanetCard';

export const PlanetGrid = () => {
  const [filter, setFilter] = useState<PlanetFilter>({});
  const [sort, setSort] = useState<SortOptions>({ sortBy: 'NAME', sortDirection: 'ASC' });
  const [displayCount, setDisplayCount] = useState(12);
  const [isPending, startTransition] = useTransition();

  const {
    error,
    data,
    isPending: isFetching,
  } = usePlanets(sort.sortBy, sort.sortDirection, filter);

  const [optimisticPlanets, setOptimisticPlanets] = useOptimistic<PlanetCardProps[]>(data || []);

  const { setShowLoader } = useLoader();

  useEffect(() => {
    setShowLoader((isPending || isFetching) && optimisticPlanets.length === 0);
  }, [isPending, isFetching, setShowLoader, setShowLoader]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPlanetRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && optimisticPlanets.length > displayCount) {
          startTransition(() => {
            setDisplayCount(prevCount => prevCount + 12);
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, optimisticPlanets.length, displayCount, startTransition]
  );

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  const handleFilterChange = useCallback((newFilter: PlanetFilter) => {
    startTransition(() => {
      setFilter(newFilter);
      setDisplayCount(12);
    });
  }, []);

  const handleSortChange = useCallback((newSort: SortOptions) => {
    startTransition(() => {
      setSort(newSort);
      setDisplayCount(12);
    });
  }, []);

  useEffect(() => {
    setOptimisticPlanets(data || []);
  }, [data, setOptimisticPlanets]);

  const displayedPlanets = optimisticPlanets.slice(0, displayCount);

  return (
    <section className="flex-1 flex flex-col">
      <FilterSearch
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        initialFilter={filter}
        initialSort={sort}
      />
      <section className="flex-1 p-4 md:p-8">
        {error && (
          <div className="text-center text-red-400">
            <h2>Error occurred:</h2>
            <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
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
        {isFetching && displayCount > 12 && (
          <div className="text-center mt-8">
            <span className="text-blue-300">Discovering more exoplanets...</span>
          </div>
        )}
      </section>
    </section>
  );
};
