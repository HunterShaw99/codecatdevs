import {ScatterplotLayer} from '@deck.gl/layers';
import {hexToRGB} from '@/app/utils/color';
import {CompositeLayer} from '@deck.gl/core';
import { SearchRing, CompResults } from '../utils/LayerTypes';

export class SearchRingLayer extends CompositeLayer<{ data: any[], color?: any}> {
    renderLayers() {
        return [new ScatterplotLayer<SearchRing>({
            id: `sr-${crypto.randomUUID()}`,
            data: this.props.data,
            getPosition: (d: any) => d.originCoords,
            getRadius: (d: any) => d.searchedDistance * 1609.34,
            getFillColor: hexToRGB(this.props.color) || [255, 0, 0, 200],
            pickable: true,
            // ensure layer updates when data changes
            updateTriggers: {getPosition: this.props.data, getFillColor: this.props.color}
        }),
        new ScatterplotLayer<SearchRing>({
            id: `sr-highlight-${crypto.randomUUID()}`,
            data: this.props.data.compareResults,
            getPosition: (d: any) => d.coordinates,
            getRadius: 100,
            getFillColor: [255, 255, 40],
            radiusMinPixels: 8,
            radiusMaxPixels: 13,
            pickable: false,
            // ensure layer updates when data changes
            updateTriggers: {getPosition: this.props.data.compareResults}
        }),
    ]
    }
}