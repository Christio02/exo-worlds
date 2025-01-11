import { gql } from '@apollo/client';

export const GET_PLANETS = gql`
  query GetPlanets($sortBy: SortField, $sortDirection: SortDirection, $filter: PlanetFilter) {
    planets(sortBy: $sortBy, sortDirection: $sortDirection, filter: $filter) {
      id
      name
      mass
      radius
      habitabilityIndex
      imageType
      imageData
    }
  }
`;
