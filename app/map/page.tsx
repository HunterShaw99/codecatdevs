'use client';
import dynamic from 'next/dynamic';
import CardMap from "@map/Map";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";

export default function MapPage() {
const INITIAL_VIEW_STATE = {
  longitude: -79.9915,
  latitude: 40.4419,
  zoom: 10.5,
} as const;

  return (
    <div className={'max-w-full max-h-full'}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{inertia: false}}
      >
        <Map
          attributionControl={false}
          maxPitch={0}
          minZoom={5}
          maxZoom={15}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          reuseMaps
        >
        </Map>
      </DeckGL>
    </div>
  );
}