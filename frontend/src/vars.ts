import { makeVar } from '@apollo/client';
import { PlanetCard } from './interfaces/planetInterface';

export const planets = makeVar<PlanetCard[]>([]);
