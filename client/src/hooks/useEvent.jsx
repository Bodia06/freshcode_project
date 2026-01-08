import { useContext } from 'react';
import { EventContest } from '../contexts/eventContest';

export const useEvent = () => {
  return useContext(EventContest);
};
