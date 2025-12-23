export type Point = {
  coordinates: [longitude: number, latitude: number];
  name: string,
  address: string,
  note?: string,
    type: 'cafe' | 'restaurant';
};

export interface ClusterObject {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  points: Point[];
}

export type ScatterPoint = {
    name: string
    state: string
    latitude: number
    longitude: number
    status: string
}

export type SearchRing = {
  originName: string
  originCoords: [number, number]
  compareResults: Record<string, number>
}