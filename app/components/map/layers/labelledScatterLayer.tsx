import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {CompositeLayer} from '@deck.gl/core';
import {hexToRGB} from '@/app/utils/color';

export class LabelledLayer extends CompositeLayer<{ data: any[], color?: any }> {
    renderLayers() {
        return [new ScatterplotLayer({
            id: `${this.props.id}-points`,
            data: this.props.data,
            getPosition: (d: any) => [d.longitude, d.latitude],
            getRadius: 100,
            getFillColor: hexToRGB(this.props.color) || [255, 0, 0],
            radiusMinPixels: 5,
            radiusMaxPixels: 10,
            pickable: true,
            // ensure layer updates when data changes
            updateTriggers: {getPosition: this.props.data, getFillColor: this.props.color}
        }),
            new TextLayer({
                id: `${this.props.id}-labels`,
                data: this.props.data,
                getPosition: (d: any) => [d.longitude, d.latitude],
                getText: (d: any) => `${d.name}`,
                getSize: 12,
                getColor: [30, 30, 46],
                getPixelOffset: [0, -20],
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontWeight: 700,
                fontSettings: {sdf: true},
                outlineColor: [255, 255, 255, 200],
                outlineWidth: 3,
                updateTriggers: {getPosition: this.props.data, getText: this.props.data},
            })
        ]
    };
};
