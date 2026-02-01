import {ScatterplotLayer} from '@deck.gl/layers';
import {hexToRGB} from '@/app/utils/color';
import {CompositeLayer} from '@deck.gl/core';
import { SearchRing } from '../utils/LayerTypes';
import {generateLayerId} from "@/app/context/layerContext";

export class SearchRingLayer extends CompositeLayer<{ data: SearchRing[], color?: any}> {
    renderLayers() {
        return [new ScatterplotLayer<SearchRing>({
            data: this.props.data,
            getPosition: (d: any) => d.originCoords,
            getRadius: (d: any) => d.searchedDistance * 1609.34,
            getFillColor: [...hexToRGB(this.props.color), 120],
            pickable: true,
            // ensure layer updates when data changes
            updateTriggers: {getPosition: this.props.data, getFillColor: this.props.color}
        }),
    ]
    }
}