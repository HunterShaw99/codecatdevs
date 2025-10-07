'use client';

import DeckGL from '@deck.gl/react';
import { PickingInfo, MapViewState } from '@deck.gl/core';
import Map, { useControl } from 'react-map-gl/maplibre';
import { AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { coffeeShopLayer, coffeeShopText, CoffeeShop } from './layers/LocalLegends';

// Map bounds and zoom constraints
const MIN_LONGITUDE = -80.3;
const MAX_LONGITUDE = -79.9;
const MIN_LATITUDE = 40.2;
const MAX_LATITUDE = 40.6;
const MIN_ZOOM = 8;
const MAX_ZOOM = 15;

const onViewStateChange = (viewState: MapViewState) => {
  // Constrain the longitude
  if (viewState.longitude < MIN_LONGITUDE) {
    viewState.longitude = MIN_LONGITUDE;
  } else if (viewState.longitude > MAX_LONGITUDE) {
    viewState.longitude = MAX_LONGITUDE;
  }

  // Constrain the latitude
  if (viewState.latitude < MIN_LATITUDE) {
    viewState.latitude = MIN_LATITUDE;
  } else if (viewState.latitude > MAX_LATITUDE) {
    viewState.latitude = MAX_LATITUDE;
  }

  // Constrain the zoom
  if (viewState.zoom < MIN_ZOOM) {
    viewState.zoom = MIN_ZOOM;
  } else if (viewState.zoom > MAX_ZOOM) {
    viewState.zoom = MAX_ZOOM;
  }

  return viewState;
};

// Attribution control wrapper
type CustomAttributionProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const CustomAttribution = ({ position = 'bottom-right' }: CustomAttributionProps) => {
  useControl(() => new AttributionControl(), { position });
  return null;
};

const CardMap = () => {
  return (
    <div id="map-container" className="relative h-96 w-full p-4">
      <DeckGL
        initialViewState={{
          longitude: -79.9915,
          latitude: 40.4419,
          zoom: 11,
        }}
        controller={true}
        layers={[coffeeShopLayer, coffeeShopText]}
        getTooltip={ 
            ({object}: PickingInfo<CoffeeShop>) => {
                return object && 
                {html: `<h2>${object.address}</h2> <div>${object.note}</div>`,
                style: 
                    {backgroundColor: 'mantle', 
                    padding: '5px', 
                    borderRadius: '5px'}
                } as any;
            }}
        onViewStateChange={({ viewState }) => onViewStateChange(viewState as any)}
        >
        <Map
          attributionControl={false}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <CustomAttribution />
        </Map>
      </DeckGL>
    </div>
  );
};

export default CardMap;