import { ScatterplotLayer } from '@deck.gl/layers';
import { hexToRGB } from '@/app/utils/color';
import { CompositeLayer } from '@deck.gl/core';

export class LocationLayer extends CompositeLayer<{ data: any[], color?: any, radius?: any }> {
    static layerName = 'LocationLayer';

    renderLayers() {
        return [new ScatterplotLayer({
            id: 'points-layer',
            data: this.props.data,
            getPosition:  (d: any) => [d.longitude, d.latitude],
            getFillColor: [...hexToRGB(this.props.color), 150],
            getRadius: this.props.radius || 500,
            transitions: {
                // transition with a duration of 3000ms
                getFillColor: 1000,
                getRadius: {
                    duration: 1000,
                },
            },
        })
    ];
}
}