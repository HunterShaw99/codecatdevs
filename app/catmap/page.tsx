'use client';
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { useState } from 'react';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import { StackIcon} from "@radix-ui/react-icons"

export default function MapPage() {
  const INITIAL_VIEW_STATE = {
    longitude: -79.9915,
    latitude: 40.4419,
    zoom: 10.5,
  } as const;

  const [isUploadExpanded, setIsUploadExpanded] = useState(false);
  const [uploadedPoints, setUploadedPoints] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const rows = content.split('\n');
      const points = rows.slice(1).map(row => {
        const [lat, lng] = row.split(',').map(Number);
        const [, , name, state] = row.split(',');
        return { longitude: lng, latitude: lat, name, state };
      });
      setUploadedPoints(points);
    };
    reader.readAsText(file);
  };

  return (
    <div className={'max-w-full max-h-full'}>
      <div className="p-4 rounded-lg mb-4 z-100 flex absolute top-[30%] left-0">
        <button
          onClick={() => setIsUploadExpanded(!isUploadExpanded)}
          className="absolute p-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950"
        >
          <StackIcon className={'w-6 h-6 rounded-full'}/>
        </button>

        {isUploadExpanded && (
          <div className="mt-4 p-4 bg-white border rounded-lg ml-[10%]">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-2 text-sm text-gray-600">
              Upload a CSV or Excel file with latitude and longitude columns
            </p>
          </div>
        )}
      </div>

      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{inertia: false}}
        layers={uploadedPoints.length > 0 ? [
            new ScatterplotLayer({
                id: 'uploaded-points',
                data: uploadedPoints,
                getPosition: (d: any) => [d.longitude, d.latitude],
                getRadius: 100,
                getFillColor: [255, 0, 0],
                radiusMinPixels: 5,
                radiusMaxPixels: 10
              }),
            new TextLayer({
              id: 'uploaded-labels',
              data: uploadedPoints,
              getPosition: (d: any) => [d.longitude, d.latitude],
              getText: (d: any) => `${d.name}, ${d.state}`,
              getSize: 12,
              getColor: [0, 0, 0],
              getPixelOffset: [0, -20],
              background: true,
              backgroundPadding: [3, 3],
              backgroundColor: [255, 255, 255, 0.9]
            })
        ] : []}
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