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

export const GET_PAGINATED_PLANETS = gql`
  query GetPaginatedPlanets($page: Int!, $size: Int, $sortBy: SortField, $sortDirection: SortDirection, $filter: PlanetFilter) {
    paginatedPlanets(page: $page, size: $size, sortBy: $sortBy, sortDirection: $sortDirection, filter: $filter) {
      planets {
        id
        name
        mass
        radius
        habitabilityIndex
        imageType
        imageData
      }
      totalPages
      totalElements
      currentPage
    }
  }
`
