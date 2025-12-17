'use client';
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { useState, useRef } from 'react';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { StackIcon, CursorArrowIcon, ListBulletIcon, MixerHorizontalIcon } from "@radix-ui/react-icons"
import { CompositeLayer } from '@deck.gl/core';
import * as RadioGroup from '@radix-ui/react-radio-group';
import 'maplibre-gl/dist/maplibre-gl.css';

import { BASEMAPS, BASEMAP_KEYS, INITIAL_VIEW_STATE } from './constants';

export default function MapPage() {
  const deckRef = useRef<any>(null);
  const [isUploadExpanded, setIsUploadExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [uploadedPoints, setUploadedPoints] = useState<any[]>([]);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [baseMap, setBaseMap] = useState<'light' | 'dark' | 'standard' | 'hybrid'>('light');
  const [isBaseMapExpanded, setIsBaseMapExpanded] = useState(false);

  class LabelledLayer extends CompositeLayer<{ data: any[], color?: any }> {
    renderLayers() {
      return [new ScatterplotLayer({
        id: `${this.props.id}-points`,
        data: this.props.data,
        getPosition: (d: any) => [d.longitude, d.latitude],
        getRadius: 100,
        getFillColor: this.props.color || [255, 0, 0],
        radiusMinPixels: 5,
        radiusMaxPixels: 10,
        updateTriggers:
          { getPosition: [uploadedPoints] }
      }),
      new TextLayer({
        id: `${this.props.id}-labels`,
        data: this.props.data,
        getPosition: (d: any) => [d.longitude, d.latitude],
        getText: (d: any) => `${d.name}`,
        getSize: 12,
        getColor: [0, 0, 0],
        getPixelOffset: [0, -20],
        background: true,
        backgroundPadding: [3, 3],
        getBackgroundColor: [255, 255, 255, 0.9],
        updateTriggers:
          { getPosition: [uploadedPoints] }
      })
      ]
    };
  };

  const layerList = [new LabelledLayer({ id: 'Uploaded Points', data: uploadedPoints })];

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

    setUploadedPoints(uploadedPoints => [...uploadedPoints, {
      latitude: lat, longitude: lng,
      name: `${(lng).toFixed(2)}, ${(lat).toFixed(2)}`, state: ''
    }]);

    setIsClicked(false);
  };

  const getLegendColor = (color: any) => {
    const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    return (<span
      className="inline-block w-3 h-3 mr-2 rounded-full"
      style={{ backgroundColor: rgb }}
    ></span>);
  }

  const getLegendList = () => {
    const legendItems = deckRef.current.deck.props.layers

    return (
      <div className="p-2 text-left text-gray-600 bg-white border rounded-lg">
        <h3 className="font-bold text-m mb-2 underline">Legend</h3>
        <div></div>
        <ul className="text-xs space-y-1">
          {legendItems.map((layer: any) => (
            <li key={layer.id} className="mb-1 flex items-center">
              {getLegendColor([255, 0, 0])}
              <span>{layer.id}</span>
            </li>
          ))}
        </ul>
      </div>);
  };

  return (
    <div className={'max-w-full max-h-full'}>
      <div className="absolute top-2 left-2 z-1000 text-3xl text-peach font-bold text-shadow-2xs select-none text-shadow-peach-8">
        Cat Map
      </div>
      <div className="rounded-lg mr-2 z-100 flex flex-col absolute top-2 right-0">
        <button
          onClick={() => setIsLegendExpanded(!isLegendExpanded)}
          className={`legend-container ${isLegendExpanded ? 'expanded' : 'collapsed'}`}
        >
          {!isLegendExpanded ? <ListBulletIcon className={'w-6 h-6'} /> : getLegendList()}
        </button>
      </div>

      <div className="p-4 rounded-lg mb-4 z-100 flex flex-col absolute top-[30%] left-0">
        <div className="flex items-start space-x-2">
          <button
            onClick={() => setIsUploadExpanded(!isUploadExpanded)}
            className="subdomain-btn"
          >
            <StackIcon className={'w-6 h-6'} />
          </button>

          {isUploadExpanded && !isClicked && (
            <div className="p-4 bg-white border rounded-lg ml-2 shrink-0">
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
          className="subdomain-btn mt-2">
          <CursorArrowIcon className={'w-6 h-6'} />
        </button>

        {isClicked &&
          <div className="mt-2 p-2 bg-white border rounded-lg text-sm text-gray-600">
            Click on the map to add a point at the clicked location.
          </div>}
      </div>

      <div className="p-4 rounded-lg mb-4 z-100 absolute bottom-0 left-0">
        <div className="flex items-start space-x-2">
          <button
            onClick={() => setIsBaseMapExpanded(!isBaseMapExpanded)}
            className="subdomain-btn"
          >
            <MixerHorizontalIcon className={'w-6 h-6'} />
          </button>

          {isBaseMapExpanded && (
            <div className="p-4 bg-white border rounded-lg ml-2 shrink-0">
              <h3 className="text-m  text-gray-600">
                Basemap Selection
              </h3>
              <hr className="p-1 border-t-2 border-gray-300" />
              <form>
                <RadioGroup.Root
                  className="RadioGroupRoot"
                  value={baseMap}
                  onValueChange={(value) => setBaseMap(value as 'light' | 'dark' | 'standard' | 'hybrid')}
                  aria-label="Basemap Selection"
                >
                  {BASEMAP_KEYS.map((key) => (
                    <div key={key} style={{ display: "flex", alignItems: "center" }}>
                      <RadioGroup.Item className="RadioGroupItem" value={key} id={`${key}`}>
                        <RadioGroup.Indicator className="RadioGroupIndicator" />
                      </RadioGroup.Item>  
                      <label className="Label" htmlFor={`${key}`}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    </div>
                  ))}
                </RadioGroup.Root>
              </form>
            </div>
          )}
        </div>
      </div>

      <DeckGL
        ref={deckRef}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{ inertia: false }}
        onClick={isClicked ? handleCursorClick : undefined}
        layers={layerList}
      >
        <Map
          maxPitch={0}
          minZoom={5}
          maxZoom={15}
          mapStyle={BASEMAPS[baseMap]}
          reuseMaps
        >
        </Map>
      </DeckGL>
    </div>
  );
} 