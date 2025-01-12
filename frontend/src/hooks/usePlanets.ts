import { useQuery } from '@apollo/client';
import { GET_PLANETS } from '../graphql/planetQuery';
import { planets } from '../vars';
import { useEffect } from 'react';
import { PlanetFilter, SortField, SortDirection } from '@/interfaces/filterTypes';

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
