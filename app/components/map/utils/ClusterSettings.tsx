import {IconLayer, IconLayerProps} from '@deck.gl/layers';
import {CompositeLayer} from '@deck.gl/core';

import Supercluster from 'supercluster';
import type {PointFeature, ClusterFeature, ClusterProperties} from 'supercluster';
import type {UpdateParameters, PickingInfo} from '@deck.gl/core';

function getIconName(size: number): string {
  if (size === 0) {
    return '';
  }
  if (size < 10) {
    return `marker-${size}`;
  }
  if (size < 100) {
    return `marker-${Math.floor(size / 10)}0`;
  }
  return 'marker-100';
}

function getIconSize(size: number): number {
  return Math.min(100, size) / 100 + 1;
}

export class IconClusterLayer<
  DataT extends {[key: string]: any} = any,
  ExtraProps extends {} = {}
> extends CompositeLayer<Required<IconLayerProps<DataT>> & ExtraProps> {
  state!: {
    data: (PointFeature<DataT> | ClusterFeature<DataT>)[];
    index: Supercluster<DataT, DataT>;
    z: number;
  };

  shouldUpdateState({changeFlags}: UpdateParameters<this>) {
    return changeFlags.somethingChanged;
  }

  updateState({props, oldProps, changeFlags}: UpdateParameters<this>) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      this.setState({
        data: props.data
      });
    }
  }

  getPickingInfo({
    info,
    mode
  }: {
    info: PickingInfo<PointFeature<DataT> | ClusterFeature<DataT>>;
    mode: string;
  }): IconClusterLayerPickingInfo<DataT> {
    const pickedObject = info.object?.properties;
    if (pickedObject) {
      let objects: DataT[] | undefined;
      if (pickedObject.cluster && mode !== 'hover') {
        objects = this.state.index.getLeaves(pickedObject.cluster_id, 25).map(f => f.properties);
      }
      return {...info, object: pickedObject, objects};
    }
    return {...info, object: undefined};
  }

  renderLayers() {
    const {data} = this.state;
    const {iconAtlas, iconMapping, sizeScale} = this.props;

    return new IconLayer<PointFeature<DataT> | ClusterFeature<DataT>>(
      {
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: d => d.geometry.coordinates as [number, number],
        getIcon: d => getIconName(d.properties.cluster ? d.properties.point_count : 1),
        getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
      },
      this.getSubLayerProps({
        id: 'icon'
      })
    );
  }
}

// Add this new icon mapping object for clusters
export const clusterIconMapping = {
  'marker-1': {x: 0, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-2': {x: 128, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-3': {x: 256, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-4': {x: 384, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-5': {x: 0, y: 128, width: 128, height: 128, anchorY: 128},
  'marker-6': {x: 128, y: 128, width: 128, height: 128, anchorY: 128},
  'marker-7': {x: 256, y: 128, width: 128, height: 128, anchorY: 128},
  'marker-8': {x: 384, y: 128, width: 128, height: 128, anchorY: 128},
  'marker-9': {x: 0, y: 256, width: 128, height: 128, anchorY: 128},
  'marker-10': {x: 128, y: 256, width: 128, height: 128, anchorY: 128},
};

export type IconClusterLayerPickingInfo<DataT> = PickingInfo<
  DataT | (DataT & ClusterProperties),
  {objects?: DataT[]}
>;

export const getIndexClusters = (data: any, sizeScale: number) => {
    const index = new Supercluster({
        maxZoom: 16,
        radius: sizeScale/2,
      });

      index.load(
        // @ts-ignore Supercluster expects proper GeoJSON feature
        (data as DataT[]).map(d => ({
          geometry: {coordinates: d.coordinates},
          properties: d
        }))
      )

      return index
    };