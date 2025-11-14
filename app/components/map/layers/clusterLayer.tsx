import {IconLayerProps} from '@deck.gl/layers';
import type {ClusterFeature} from 'supercluster';

import {IconClusterLayer, clusterIconMapping} from '@map/utils/ClusterSettings';


export const createClusteredLayer = (data: any, iconAtlas: string) => {

  type ClusteredLayerData = ClusterFeature<{[key: string]: any}>[]

  if (!data) {
    return null;
  }

  const filteredData: ClusteredLayerData = (data as ClusteredLayerData).filter(
    (point) => (point?.properties as any)?.point_count > 1
  );

  return new IconClusterLayer<ClusterFeature<{[key: string]: any}>, {}>(
    {
      id: 'clusters',
      data: filteredData,
      iconAtlas: iconAtlas as string,
      iconMapping: clusterIconMapping,
      sizeScale: 40,
      getPosition: (d: ClusterFeature<{[key: string]: any}>) => d.geometry.coordinates,
      pickable: true,
    } as unknown as Required<IconLayerProps<ClusterFeature<{[key: string]: any}>>> & {}
  );
};
