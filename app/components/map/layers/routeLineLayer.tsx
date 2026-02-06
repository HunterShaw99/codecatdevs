import {PathLayer} from '@deck.gl/layers';
import {hexToRGB} from '@/app/utils/color';
import { RouteLine } from '../utils/LayerTypes';
import { CompositeLayer } from '@deck.gl/core';
import {generateLayerId} from "@/app/context/layerContext";

export class RouteLineLayer extends CompositeLayer<{ data: RouteLine[], color?: any}> {
    static layerName = 'RouteLineLayer'

    renderLayers() {
        return [new PathLayer<RouteLine>({
            data: this.props.data,
            getPath: (d: any) => d.geometry.coordinates,
            getColor: [...hexToRGB(this.props.color), 120],
            pickable: true,
            getWidth: 10,
            widthMinPixels: 5,
            widthMaxPixels: 20,
            // ensure layer updates when data changes
            updateTriggers: {getPath: this.props.data, getColor: this.props.color}
        })
    ]
    }
}
