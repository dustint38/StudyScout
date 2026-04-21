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
  image: string;
  noiseLevel?: 'Quiet' | 'Moderate' | 'Loud';
  hasWifi?: boolean;
  hasOutlets?: boolean;
  imageUrl?: string;
};