import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {CollisionFilterExtension} from '@deck.gl/extensions';
import type {CollisionFilterExtensionProps} from '@deck.gl/extensions';
import {CompositeLayer} from '@deck.gl/core';

import {hexToRGB} from '@/app/utils/color';

export class LabelledLayer extends CompositeLayer<{ data: any[], color?: any }> {
    fontSize = 12

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
            new TextLayer<any, CollisionFilterExtensionProps<any>>({
                id: `${this.props.id}-labels`,
                data: this.props.data,
                getPosition: (d: any) => [d.longitude, d.latitude],
                getText: (d: any) => `${d.name}`,
                getSize: this.fontSize,
                getColor: [30, 30, 46],
                getPixelOffset: [0, -20],

                fontFamily: 'Arial, Helvetica, sans-serif',
                fontWeight: 700,
                fontSettings: {sdf: true, radius: 16, cutoff:0.20, buffer: 6},
                outlineColor: [255, 255, 255, 200],
                outlineWidth: 10,
                updateTriggers: {getPosition: this.props.data, getText: this.props.data},
                
                // prevent text collision
                collisionEnabled: true,
                getCollisionPriority: (d: any) => d.name.length,
                collisionTestProps: {
                sizeScale: 4,
                getPixelOffset: [0, -20]
                },
                extensions: [new CollisionFilterExtension()]
            })
        ]
    };
};
