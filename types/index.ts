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
  distance?: string;
  imageURL?: string;
  noiseLevel?: 'Quiet' | 'Moderate' | 'Loud';
  hasWifi?: boolean;
  hasOutlets?: boolean;
};

export type SpotFilters = {
  noiseLevels: ('Quiet' | 'Moderate' | 'Loud')[];
  hasWifi: boolean | null;
  hasOutlets: boolean | null;
};