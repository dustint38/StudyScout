import { useState } from 'react';
import { StudySpot } from '@/types';

export const useSpotSearch = (spots: StudySpot[]) => {
  const [search, setSearch] = useState('');

  const filtered = spots.filter(spot =>
    spot.name.toLowerCase().includes(search.toLowerCase())
  );

  return { search, setSearch, filtered };
};
