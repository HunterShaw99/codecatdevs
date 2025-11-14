'use client';

import {IconLayer, ScatterplotLayer, TextLayer, IconLayerProps} from '@deck.gl/layers';
import {CompositeLayer} from '@deck.gl/core';

import { coffeeBeanSVG, forkSVG } from '@map/data/icons';
import { svgToDataURL } from '@/app/helpers';
import type {Point} from '@map/utils/LayerTypes';

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
