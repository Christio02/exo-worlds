import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_PLANETS } from '../graphql/planetQuery';
import { planets } from '../vars';

const usePlanets = () => {
  const { loading, error, data } = useQuery(GET_PLANETS);
};

export default usePlanets;
