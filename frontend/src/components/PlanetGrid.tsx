import { useReactiveVar } from '@apollo/client';
import { planets } from '../vars.ts';
import usePlanets from '../hooks/usePlanets.ts';
import { PlanetCard } from '../interfaces/planetInterface.ts';

export const PlanetGrid = () => {
    const currentPlanets: PlanetCard[] = useReactiveVar(planets);

    const { loading, error } = usePlanets();

    return (
        <section className="flex flex-col gap-y-6">
            {loading && <h2>Loading...</h2>}
            {error && (
                <div>
                    <h2>Error occurred:</h2>
                    <p>{error.message}</p>
                </div>
            )}

            <h2 className="text-xl font-bold text-center">Planets</h2>
            <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentPlanets.map((planet) => (
                    <div
                        key={planet.id}
                        className="flex flex-col items-center p-4 border rounded-lg hover:shadow-lg transition-shadow"
                    >
                        {planet.imageData ? (
                            <img
                                src={`data:${planet.imageType};base64,${planet.imageData}`}
                                alt={`Planet ${planet.name}`}
                                className="w-24 h-24 object-cover rounded-full mb-3"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-full mb-3 animate-pulse" />
                        )}
                        <h3 className="text-md font-semibold text-center">{planet.name}</h3>
                        <ul className="mt-2 text-sm space-y-1 text-center">
                            <li>Mass: {planet.mass.toFixed(2)} Earth masses</li>
                            <li>Radius: {planet.radius.toFixed(2)} Earth radii</li>
                            <li>Habitability: {(planet.habitabilityIndex * 100).toFixed(2)}%</li>
                        </ul>
                    </div>
                ))}
            </article>
        </section>
    );
};
