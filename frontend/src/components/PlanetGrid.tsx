import { useReactiveVar } from '@apollo/client';
import { planets } from '../vars.ts';
import usePlanets from '../hooks/usePlanets.ts';
import { PlanetCard } from '../interfaces/planetInterface.ts';


export const PlanetGrid = () => {

  const currentPlanets: PlanetCard[] = useReactiveVar(planets);

  const { loading, error } = usePlanets();


  return (
    <section className="flex flex-col gap-y-4">
      {loading && <h2>Loading...</h2>}
      {error && (
        <div>
          <h2>Error occured:</h2>
          <p>{error.message}</p>
        </div>
      )};

      <h2>Planets</h2>;
      <article className="grid grid-cols-4">
        {currentPlanets.map((planet) => (
          <div key={planet.id}>
            <h3>{planet.name}</h3>
            <ul>
              <li>
                Mass: {planet.mass}
              </li>
              <li>
                Radius: {planet.radius}
              </li>
              <li>
                Habitability: {planet.habitabilityIndex}
              </li>
            </ul>
          </div>
        ))};
      </article>
    </section>
  );

};