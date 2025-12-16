'use client';
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { useState, useRef } from 'react';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import { StackIcon, CursorArrowIcon} from "@radix-ui/react-icons"
import { is, vi } from "zod/locales";

export default function MapPage() {
  const INITIAL_VIEW_STATE = {
    longitude: -79.9915,
    latitude: 40.4419,
    zoom: 10.5,
  } as const;

  const deckRef = useRef<any>(null);
  const [isUploadExpanded, setIsUploadExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [uploadedPoints, setUploadedPoints] = useState<any[]>([]);

  console.log(uploadedPoints);

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
      setUploadedPoints(uploadedPoints => [...uploadedPoints, ...points]);
    };
    reader.readAsText(file);
  };

  const handleCursorClick = (event: any) => {
    const deck = deckRef.current.deck;
    const viewport = deck.getViewports()[0]; // Assumes a single viewport like MapView  

    const [lng, lat] = viewport.unproject([event.x, event.y]);
    setUploadedPoints(uploadedPoints => [...uploadedPoints, { latitude: lat, longitude: lng, 
      name: `${(lng).toFixed(2)}, ${(lat).toFixed(2)}`, state: '' }]);

    setIsClicked(false);
  };

  return (
    <div className={'max-w-full max-h-full'}>
      <div className="absolute top-2 left-2 z-1000 text-3xl text-peach font-bold text-shadow-2xs select-none text-shadow-peach-3">Cat Map</div>
      <div className="p-4 rounded-lg mb-4 z-100 flex flex-col absolute top-[30%] left-0">
        <div className="flex items-start space-x-2">
          <button
            onClick={() => setIsUploadExpanded(!isUploadExpanded)}
            className="p-2 h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950"
          >
            <StackIcon className={'w-6 h-6 rounded-full'}/>
          </button>

          {isUploadExpanded && !isClicked && (
            <div className="p-4 bg-white border rounded-lg ml-2 flex-shrink-0">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="block text-sm text-gray-500
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
        <button
          onClick={() => setIsClicked(!isClicked)}
          className="p-2 mt-2 h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950">
          <CursorArrowIcon className={'w-6 h-6 rounded-full'}/>
        </button>

        {isClicked && 
        <div className="mt-2 p-2 bg-white border rounded-lg text-sm text-gray-600">
          Click on the map to add a point at the clicked location.
          </div>}
      </div>

      <DeckGL
        ref={deckRef}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{inertia: false}}
        onClick={isClicked ? handleCursorClick : undefined}
        layers={[new ScatterplotLayer({
                id: 'uploaded-points',
                data: uploadedPoints,
                getPosition: (d: any) => [d.longitude, d.latitude],
                getRadius: 100,
                getFillColor: [255, 0, 0],
                radiusMinPixels: 5,
                radiusMaxPixels: 10,
                updateTriggers: 
                  {getPosition: [uploadedPoints]}
              }),
            new TextLayer({
              id: 'uploaded-labels',
              data: uploadedPoints,
              getPosition: (d: any) => [d.longitude, d.latitude],
              getText: (d: any) => `${d.name}`,
              getSize: 12,
              getColor: [0, 0, 0],
              getPixelOffset: [0, -20],
              background: true,
              backgroundPadding: [3, 3],
              backgroundColor: [255, 255, 255, 0.9],
              updateTriggers: 
                  {getPosition: [uploadedPoints]}
            })
          ]}
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