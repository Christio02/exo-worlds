import { makeVar } from '@apollo/client';
import { PlanetCardProps } from './interfaces/planetInterface';

export const planets = makeVar<PlanetCardProps[]>([]);
