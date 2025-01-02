import { useReactiveVar } from '@apollo/client';
import { planets } from '../vars';
import {usePlanets} from '../hooks/usePlanets';
import { PlanetCard } from './PlanetCard';
import {PaginatedPlanets} from "./PaginatedPlanets.tsx";
import {useState} from "react";
import { FilterSearch } from './FilterSearch';
import { PlanetFilter, SortOptions } from '@/interfaces/filterTypes';



export const PlanetGrid= () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<PlanetFilter>({});
    const [sort, setSort] = useState<SortOptions>({ sortBy: 'NAME', sortDirection: 'ASC' });

    const { loading, error, data } = usePlanets(currentPage, sort.sortBy, sort.sortDirection, filter);    const currentPlanets = useReactiveVar(planets);

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleFilterChange = (newFilter: PlanetFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };
    const handleSortChange = (newSort: SortOptions) => {
        setSort(newSort);
        setCurrentPage(1);
    };


    return (
        <section className="flex-1 flex flex-col">
            <FilterSearch
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                initialFilter={filter}
                initialSort={sort}
            />
            <section className="flex-1 p-4">
                {loading && <h2 className="text-center text-gray-600">Loading...</h2>}
                {error && (
                    <div className="text-center text-red-600">
                        <h2>Error occurred:</h2>
                        <p>{error.message}</p>
                    </div>
                )}

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Planets</h2>
                <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {currentPlanets.map((planet) => (
                        <PlanetCard key={planet.id} {...planet} />
                    ))}
                </article>
            </section>
            <footer className="sticky bottom-0 bg-white border-t py-4">
                <PaginatedPlanets
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={data?.paginatedPlanets?.totalPages || 0}
                />
            </footer>
        </section>
    );
};

