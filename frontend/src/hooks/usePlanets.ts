import { useQuery } from '@apollo/client';
import { GET_PLANETS } from '../graphql/planetQuery';
import { planets } from '../vars';
import { useEffect } from 'react';

const usePlanets = () => {
  const { loading, error, data } = useQuery(GET_PLANETS);


  useEffect(() => {
    if (data?.planets) {
      planets(data?.planets);
    }
  }, [data?.planets]);

  return { loading, error };


};

export default usePlanets;
