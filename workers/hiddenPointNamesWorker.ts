// workers/hiddenPointNamesWorker.ts
import { getIndexClusters } from '@map/utils/ClusterSettings';
import type { ClusterFeature } from 'supercluster';
import type { Point } from '@map/utils/LayerTypes';

interface HiddenPointsCommand {
  command: 'getHiddenPointNames',
  dataArray: Point[],
  zoomLevel: number,
}

interface HiddenPointsResponse {
  result?: Set<string>;
  error?: string;
}

addEventListener('message', (event: MessageEvent<HiddenPointsCommand>) => {
  try {
    const { dataArray, zoomLevel } = event.data;

    if (!dataArray || typeof zoomLevel !== 'number') {
      throw new Error('Invalid input');
    }

    const index = getIndexClusters(dataArray, 40);
    const raw = index.getClusters([-180, -90, 180, 90], zoomLevel) as ClusterFeature<any>[];

    const names = new Set<string>();
    raw.forEach((feature) => {
      const props = feature && feature.properties;
      if (props && props.cluster) {
        const pointCount = props.point_count ?? 0;
        if (pointCount > 1) {
          const clusterId = props.cluster_id;
          const leaves = index.getLeaves(clusterId, Infinity) || [];
          leaves.forEach((leaf: any) => {
            const p = leaf && leaf.properties;
            if (p && 'name' in p) names.add(p.name);
          });
        }
      }
    });

    postMessage({ result: names } as HiddenPointsResponse);

  } catch (error) {
    postMessage({ error: (error as Error).message } as HiddenPointsResponse);
  }
});
