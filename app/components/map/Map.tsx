'use client';

import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { useControl } from 'react-map-gl/maplibre';
import { AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import coffeeShopLayer from './layers/LocalLegends';

// A wrapper component for the AttributionControl
type CustomAttributionProps = {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const CustomAttribution = ({ position = 'bottom-right' }: CustomAttributionProps) => {
    useControl(() => new AttributionControl(), {
        position: position
    });
    return null;
    };

const CardMap = () => {
    return (
        <div id={'map-container'} className='relative h-96 w-full p-4'>
            <DeckGL
                initialViewState={{
                    longitude: -79.9915,
                    latitude: 40.4419,
                    zoom: 11
                }}
                controller={true}
                layers={[coffeeShopLayer]}>
                <Map
                    attributionControl={false}
                    mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
                >
                    <CustomAttribution />
                </Map>
            </DeckGL>
        </div>
    );
}

export default CardMap;