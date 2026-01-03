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

export type BaseLayerData = {
        id: string;
        name: string;
        type: string;
        colors: { fill?: string; stroke?: string };
        data: any[]
        visible: boolean;
    }

export type ScatterPoint = {
    name: string
    latitude: number
    longitude: number
    status?: string
}

export interface CompResults {
  name: string;
  coordinates: [number, number];
  distance: number;
}

export type SearchRing = {
  originName: string
  originCoords: [number, number]
  searchedDistance: number
  compareLayer: string
  compareResults: Record<string, CompResults[]>
}

export type RouteLine = {
  distance: number
  duration: number
  geometry: {coordinates: [number, number][]; type: string},
  }