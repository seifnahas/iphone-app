export interface Memory {
  id: string;
  title?: string;
  body?: string;
  createdAt: string;
  happenedAt: string;
  latitude: number;
  longitude: number;
  placeLabel?: string;
  updatedAt: string;
}

export interface MemoryMedia {
  id: string;
  memoryId: string;
  type: 'image';
  uri: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
}
