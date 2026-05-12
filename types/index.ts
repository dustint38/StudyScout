export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type StudySpot = {
  id: string;
  name: string;
  address: string;
  rating: number;
  ratingCount?: number;
  distance?: string;
  imageURL?: string;
  noiseLevel?: 'Quiet' | 'Moderate' | 'Loud';
  hasWifi?: boolean;
  hasOutlets?: boolean;
  latitude?: number;
  longitude?: number;
};

export type SpotFilters = {
  noiseLevels: ('Quiet' | 'Moderate' | 'Loud')[];
  hasWifi: boolean | null;
  hasOutlets: boolean | null;
};