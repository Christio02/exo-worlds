import { PlanetFilter, SortDirection, SortField } from '@/interfaces/filterTypes';
import { useQuery } from '@apollo/client';
import { useActionState, useEffect, useOptimistic } from 'react';
import { GET_PLANETS } from '../graphql/planetQuery';

type QueryVariables = {
  sortBy?: SortField;
  sortDirection?: SortDirection;
  filter?: PlanetFilter;
};

export const usePlanets = (
  sortBy?: SortField,
  sortDirection?: SortDirection,
  filter?: PlanetFilter
) => {
  const {
    data,
    error: queryError,
    loading,
  } = useQuery(GET_PLANETS, {
    variables: { sortBy, sortDirection, filter },
  });

  const [optimisticPlanets, setOptimisticPlanets] = useOptimistic(data?.planets || []);

  const [error, refetchPlanets, isPending] = useActionState(
    async (prevError: Error | null, { sortBy, sortDirection, filter }: QueryVariables) => {
      try {
        const { data } = await useQuery(GET_PLANETS, {
          variables: { sortBy, sortDirection, filter },
        });

        if (data?.planets) {
          setOptimisticPlanets(data.planets);
        }
        return null;
      } catch (err) {
        return err instanceof Error ? err : new Error('Unknown error');
      }
    },
    queryError ?? null
  );

  useEffect(() => {
    setOptimisticPlanets(data?.planets || []);
  }, [data]);

  return { error, refetchPlanets, data: optimisticPlanets, isPending: loading || isPending };
};
