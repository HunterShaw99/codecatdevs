// workers/hiddenPointNamesWorker.ts
import {getIndexClusters} from '@map/utils/ClusterSettings';
import type {ClusterFeature} from 'supercluster';
import type {Point} from '@map/utils/LayerTypes';

interface HiddenPointsCommand {
    command: 'getHiddenPointNames',
    dataArray: Point[],
    zoomLevel: number,
    taskId?: number,
    signal?: AbortSignal;
}

interface HiddenPointsResponse {
    result?: { hiddenNames: Set<string>, clusters: ClusterFeature<any>[] };
    error?: string;
    taskId?: number;
}

addEventListener('message', async (event: MessageEvent<HiddenPointsCommand>) => {
    const {dataArray, zoomLevel, taskId} = event.data;

    if (!dataArray || typeof zoomLevel !== 'number') {
        postMessage({error: 'Invalid input', taskId} as HiddenPointsResponse);
        return;
    }

    try {
        const index = getIndexClusters(dataArray, 40);

        let raw: ClusterFeature<any>[];

        try {
            raw = index.getClusters([-180, -90, 180, 90], zoomLevel) as ClusterFeature<any>[];
        } catch (error) {
            postMessage({error: 'Failed to get clusters', taskId} as HiddenPointsResponse);
            return;
        }

        const names = new Set<string>();

        for (const feature of raw) {
            const props = feature && feature.properties;
            if (props && props.cluster) {
                const pointCount = props.point_count ?? 0;
                if (pointCount > 1) {
                    const clusterId = props.cluster_id;
                    let leaves: any[];

                    try {
                        leaves = index.getLeaves(clusterId, Infinity) || [];
                    } catch (error) {
                        console.error('Failed to get leaves:', error);
                        continue;
                    }
                    for (const leaf of leaves) {
                        const p = leaf && leaf.properties;
                        if (p && 'name' in p) names.add(p.name);
                    }
                }
            }
        }

        postMessage({result: {hiddenNames: names, clusters: raw}, taskId} as HiddenPointsResponse);

    } catch (error) {
        postMessage({error: (error as Error).message, taskId} as HiddenPointsResponse);
    }
});
