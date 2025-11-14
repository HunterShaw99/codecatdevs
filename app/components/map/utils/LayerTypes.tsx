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
