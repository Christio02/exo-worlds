import { gql } from '@apollo/client';

export const GET_PLANETS = gql`
  query GetPlanets {
    planets {
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
