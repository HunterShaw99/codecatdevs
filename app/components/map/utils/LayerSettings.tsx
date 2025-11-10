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

export const createTextLayer = (data: any, viewState: any) => { 

    return new TextLayer<Point>({
        id: 'label-layer',
        data : data,
        getPosition : d => d.coordinates,
        getText : d => d.name,
        visible: viewState.zoom > 11.5,
        getColor: [0, 0, 0, 255],
        outlineWidth: 2,
        outlineColor: [255, 255, 255, 200],
        getSize: 10,
        getPixelOffset: [0, -20],
        fontSettings: {sdf : true, cutoff: 0.15, smoothing: 0.5},
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      });
};

export const createIconLayer = (data: any, viewState: any) => {
    // For each data point, set the icon based on type
    const iconMapping = {
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

    return new IconLayer<Point>({
        id: 'icon-layer',
        data: data,
        visible: viewState.zoom > 11.2,
        getIcon: d => iconMapping[d.type],
        sizeScale: 10,
        getSize: 2.5,
        getPosition: d => d.coordinates,
        pickable: false
    });
};

export const createProxyLayer = (data: any, viewState: any) => {
    return new ScatterplotLayer<Point>({
    id: 'proxy-layer',
    data: data,
    visible: viewState.zoom > 11.2,
    pickable: true,
    opacity: 0,
    stroked: false,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 12,
    radiusMaxPixels: 18,
    getPosition: d => d.coordinates,
    getFillColor: [0, 0, 0, 0],  // transparent
    });
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

export default class IconClusterLayer<
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
      const index = new Supercluster<DataT, DataT>({
        maxZoom: 16,
        radius: props.sizeScale * Math.sqrt(2)
      });
      index.load(
        // @ts-ignore Supercluster expects proper GeoJSON feature
        (props.data as DataT[]).map(d => ({
          geometry: {coordinates: (props.getPosition as Function)(d)},
          properties: d
        }))
      );
      this.setState({index});
    }

    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
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
const clusterIconMapping = {
  'marker-1': {x: 0, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-2': {x: 128, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-3': {x: 256, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-4': {x: 384, y: 0, width: 128, height: 128, anchorY: 128},
  'marker-5': {x: 0, y: 128, width: 128, height: 128, anchorY: 128},
  'marker-10': {x: 128, y: 128, width: 128, height: 128, anchorY: 128},
};


export const createClusteredLayer = (data: any, iconAtlas: string, viewState: any) => {

  return new IconClusterLayer({
    id: 'clusters',
    visible: viewState.zoom <= 11.2,
    data,
    iconAtlas,
    iconMapping: clusterIconMapping,
    sizeScale: 40,
    getPosition: (d: Point) => d.coordinates,
    pickable: true,
  });
};

export interface ClusterObject {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  points: Point[];
}
