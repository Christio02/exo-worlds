import { useQuery } from '@apollo/client';
import {GET_PAGINATED_PLANETS} from '../graphql/planetQuery';
import { planets } from '../vars';
import { useEffect } from 'react';
import { PlanetFilter, SortField, SortDirection } from '@/interfaces/filterTypes';

export const usePlanets = (page: number, sortBy?: SortField, sortDirection?: SortDirection, filter?: PlanetFilter) => {
  const { loading, error, data } = useQuery(GET_PAGINATED_PLANETS, {
    variables: {
      page,
      size: 8,
      sortBy,
      sortDirection,
      filter
    },
  });

  useEffect(() => {
    if (data?.paginatedPlanets?.planets) {
      planets(data.paginatedPlanets.planets);
    }
  }, [data?.paginatedPlanets?.planets, page]);

  return { loading, error, data };
};