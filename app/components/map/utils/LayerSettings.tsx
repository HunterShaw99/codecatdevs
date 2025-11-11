'use client';

import {IconLayer, ScatterplotLayer, TextLayer, IconLayerProps} from '@deck.gl/layers';
import {CompositeLayer} from '@deck.gl/core';
import Supercluster from 'supercluster';

import type {PointFeature, ClusterFeature, ClusterProperties} from 'supercluster';
import type {UpdateParameters, PickingInfo} from '@deck.gl/core';

import { coffeeBeanSVG, forkSVG } from '@map/data/icons';
import { svgToDataURL } from '@/app/helpers';

export type Point = {
  coordinates: [longitude: number, latitude: number];
  name: string,
  address: string,
  note?: string,
    type: 'cafe' | 'restaurant';
};

export class LabelledPointLayer extends CompositeLayer<{data?: Point[]; viewState?: {zoom: number};}> {
    iconMapping = {
        cafe: {
            url: svgToDataURL(coffeeBeanSVG),
            width: 128,
            height: 128,
        },
        restaurant: {
            url: svgToDataURL(forkSVG),
            width: 128,
            height: 128,
        }
    };

  renderLayers() {
    return [
      new ScatterplotLayer<Point>({
    id: 'proxy-layer',
    data: this.props.data,
    pickable: true,
    opacity: 0,
    stroked: false,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 12,
    radiusMaxPixels: 18,
    getPosition: d => d.coordinates,
    getFillColor: [0, 0, 0, 0],  // transparent
    }),
      new IconLayer<Point>({
        id: 'icon-layer',
        data: this.props.data,
        getIcon: d => this.iconMapping[d.type],
        sizeScale: 10,
        getSize: 2.5,
        getPosition: d => d.coordinates,
        pickable: false
      }),
      new TextLayer<Point>({
        id: 'label-layer',
        data : this.props.data,
        getPosition : d => d.coordinates,
        getText : d => d.name,
        visible: (this.props.viewState?.zoom ?? 0) > 12,
        getColor: [0, 0, 0, 255],
        outlineWidth: 2,
        outlineColor: [255, 255, 255, 200],
        getSize: 10,
        getPixelOffset: [0, -20],
        fontSettings: {sdf : true, cutoff: 0.15, smoothing: 0.5},
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      })
    ];
  }
};

export type IconClusterLayerPickingInfo<DataT> = PickingInfo<
  DataT | (DataT & ClusterProperties),
  {objects?: DataT[]}
>;

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

export const getIndexClusters = (data: any, sizeScale: number) => {
    const index = new Supercluster({
        maxZoom: 16,
        radius: sizeScale * Math.sqrt(2)
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
      const index = getIndexClusters(this.props.data, this.props.sizeScale);
      this.setState({index});

    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
      });
    }
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
const clusterIconMapping = {
  'marker-1': {x: 0, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-2': {x: 128, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-3': {x: 256, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-4': {x: 384, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-5': {x: 0, y: 128, width: 128, height: 128, anchorY: 128},
  'marker-10': {x: 128, y: 128, width: 128, height: 128, anchorY: 128},
};


export const createClusteredLayer = (data: any, iconAtlas: string, viewState: any, clustered_names: any) => {

  // Local interfaces for typings
  interface ClusteredLayerData extends Point {}
  interface ClusteredViewState { zoom: number }
  type ClusteredNames = Set<string>;

  const filteredData: ClusteredLayerData[] = (data as ClusteredLayerData[]).filter(
    (point) => (clustered_names as ClusteredNames).has(point.name)
  );

  return new IconClusterLayer<ClusteredLayerData, {}>(
    {
      id: 'clusters',
      data: filteredData,
      iconAtlas: iconAtlas as string,
      iconMapping: clusterIconMapping,
      sizeScale: 40,
      getPosition: (d: ClusteredLayerData) => d.coordinates,
      pickable: true,
    } as unknown as Required<IconLayerProps<ClusteredLayerData>> & {}
  );
};

export const createIconLayer = (data: any, viewState: any) => {

  return new LabelledPointLayer({
    id: 'icons',
    data,
    viewState,
  });
}

export interface ClusterObject {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  points: Point[];
}
