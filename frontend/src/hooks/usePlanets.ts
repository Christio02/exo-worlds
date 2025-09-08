import { PlanetFilter, SortDirection, SortField } from '@/interfaces/filterTypes';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_PLANETS } from '../graphql/planetQuery';
import { planets } from '../vars';

export const usePlanets = (
  sortBy?: SortField,
  sortDirection?: SortDirection,
  filter?: PlanetFilter
) => {
  const { loading, error, data } = useQuery(GET_PLANETS, {
    variables: {
      sortBy,
      sortDirection,
      filter,
    },
  });

  useEffect(() => {
    if (data?.planets) {
      planets(data.planets);
    }
  }, [data?.planets]);

  return { loading, error, data };
};
