'use client';

import { useCallback, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { PickingInfo, MapViewState } from '@deck.gl/core';
import Map, { useControl } from 'react-map-gl/maplibre';
import { AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { coffeeShopLayer, coffeeShopText, Point } from './layers/CoffeeShops';
import { restaurantLayer, restaurantText } from './layers/Restaurants';

// Map bounds and zoom constraints
const MAP_CONSTRAINTS = {
  LONGITUDE: { MIN: -80.1, MAX: -79.95 },
  LATITUDE: { MIN: 40.3, MAX: 40.5 },
  ZOOM: { MIN: 10, MAX: 15 }
} as const;

const INITIAL_VIEW_STATE = {
  longitude: -79.9915,
  latitude: 40.4419,
  zoom: 11,
} as const;

// Attribution control wrapper
type CustomAttributionProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const CustomAttribution = ({ position = 'bottom-right' }: CustomAttributionProps) => {
  useControl(() => new AttributionControl(), { position });
  return null;
};


const CardMap = () => {
  // Memoize layers to prevent unnecessary re-renders
  const layers = useMemo(() => [
    coffeeShopLayer, coffeeShopText, restaurantLayer, restaurantText], []);

  // Constrain view state to keep map within bounds
  const onViewStateChange = useCallback(({ viewState }: { viewState: MapViewState }) => {
    // Constrain longitude
    viewState.longitude = Math.max(
      MAP_CONSTRAINTS.LONGITUDE.MIN,
      Math.min(MAP_CONSTRAINTS.LONGITUDE.MAX, viewState.longitude)
    );

    // Constrain latitude
    viewState.latitude = Math.max(
      MAP_CONSTRAINTS.LATITUDE.MIN,
      Math.min(MAP_CONSTRAINTS.LATITUDE.MAX, viewState.latitude)
    );

    // Constrain zoom
    viewState.zoom = Math.max(
      MAP_CONSTRAINTS.ZOOM.MIN,
      Math.min(MAP_CONSTRAINTS.ZOOM.MAX, viewState.zoom)
    );

    return viewState;
  }, []);

  // Memoize tooltip getter
  const getTooltip = useCallback(({ object }: PickingInfo<Point>) => {
    if (!object) return null;

    // Inline-styled HTML so sizes don't depend on global CSS (works reliably when Deck.gl injects)
    const html = `
      <div style="
        box-sizing: border-box;
        max-width: 240px;
        max-height: 160px;
        overflow: auto;
        white-space: normal;
        word-break: break-word;
        padding: 8px 12px;
      ">
        <div style="font-size:13px; font-weight:600; margin:0 0 6px 0; color:var(--ctp-text);">
          ${object.name}
        </div>
        <div style="font-size:12px; color:var(--ctp-subtext, rgba(255,255,255,0.8)); margin:0;">
          ${object.address}
        </div>
        <div style="font-size:10px; color:var(--ctp-subtext, rgba(255,255,255,0.8)); margin:0;">
          ${object.note}
        </div>
      </div>
    `;

    return {
      html,
      // Tooltip container styles applied by Deck.gl — keep it compact and prevent overflow
      style: {
        backgroundColor: 'var(--ctp-mantle)',
        color: 'var(--ctp-text)',
        padding: 0, // inner padding handled in HTML above
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--ctp-surface0)',
        // ensure tooltip stays visually on top without escaping layout
        maxWidth: '240px',
        maxHeight: '160px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        zIndex: 9999,
      }
    };
  }, []);

    return (
    <div
      id="map-container"
      className="relative h-96 w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(128,128,128,0.4),0_0_50px_rgba(128,128,128,0.2)]"
    >
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={getTooltip}
        // @ts-ignore
        onViewStateChange={onViewStateChange}
      >
        <Map
          attributionControl={false}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          reuseMaps
        >
          <CustomAttribution />
        </Map>
      </DeckGL>
    </div>
  );
};

export default CardMap;