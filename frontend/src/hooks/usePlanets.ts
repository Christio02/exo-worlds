import { useQuery } from '@apollo/client';
import { GET_PLANETS } from '../graphql/planetQuery';
import { planets } from '../vars';
import { useMemo } from 'react';

const usePlanets = () => {
  const { loading, error, data } = useQuery(GET_PLANETS);


  useMemo(() => {
    if (data?.planets) {
      planets(data?.planets);
    }
  }, [data?.planets]);

  return { loading, error };


};

export default usePlanets;
