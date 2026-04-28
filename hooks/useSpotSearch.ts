import { useState } from 'react';
import { StudySpot, SpotFilters } from '@/types';

export const DEFAULT_FILTERS: SpotFilters = {
  noiseLevels: [],
  hasWifi: null,
  hasOutlets: null,
};

export const useSpotSearch = (spots: StudySpot[]) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<SpotFilters>(DEFAULT_FILTERS);

  const filtered = spots.filter(spot => {
    if (!spot.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.noiseLevels.length > 0 && !filters.noiseLevels.includes(spot.noiseLevel!)) return false;
    if (filters.hasWifi !== null && spot.hasWifi !== filters.hasWifi) return false;
    if (filters.hasOutlets !== null && spot.hasOutlets !== filters.hasOutlets) return false;
    return true;
  });

  const activeFilterCount =
    filters.noiseLevels.length +
    (filters.hasWifi !== null ? 1 : 0) +
    (filters.hasOutlets !== null ? 1 : 0);

  return { search, setSearch, filters, setFilters, filtered, activeFilterCount };
};
