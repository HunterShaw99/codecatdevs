'use client';
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { useRef, useState } from 'react';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { ViewMode, MeasureDistanceMode, EditableGeoJsonLayer, FeatureCollection } from '@deck.gl-community/editable-layers';
import {
  CursorArrowIcon,
  LayersIcon,
  ListBulletIcon,
  MixerHorizontalIcon,
  PlusIcon,
  UploadIcon,
  RulerHorizontalIcon
} from "@radix-ui/react-icons"
import { CompositeLayer } from '@deck.gl/core';
import * as RadioGroup from '@radix-ui/react-radio-group';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Separator } from "radix-ui";

import { BASEMAP_KEYS, BASEMAPS } from './constants';

export default function MapPage() {
  const INITIAL_VIEW_STATE = {
    longitude: -79.9915,
    latitude: 40.4419,
    zoom: 10.5,
  } as const;

  type BaseLayerData = {
    name: string;
    type: string;
    colors: { fill?: [number, number, number]; stroke?: [number, number, number] };
    data: any[];
    visible: boolean;
  }

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
        // ensure layer updates when data changes
        updateTriggers: { getPosition: this.props.data }
      }),
      new TextLayer({
        id: `${this.props.id}-labels`,
        data: this.props.data,
        getPosition: (d: any) => [d.longitude, d.latitude],
        getText: (d: any) => `${d.name}`,
        getSize: 12,
        sizeUnits: 'pixels',
        getColor: [0, 0, 0],
        getPixelOffset: [0, -20],
        background: true,
        backgroundPadding: [3, 3],
        getBackgroundColor: [255, 255, 255, 0.9],
        updateTriggers: { getPosition: this.props.data, getText: this.props.data },
        // render above points
        parameters: { depthTest: false },
        pickable: false,
      })
      ]
    };
  }

  const deckRef = useRef<any>(null);
  const [isUploadExpanded, setIsUploadExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [baseMap, setBaseMap] = useState<'light' | 'dark' | 'standard' | 'hybrid'>('light');
  const [isBaseMapExpanded, setIsBaseMapExpanded] = useState(false);
  const [layerManager, setLayerManager] = useState<BaseLayerData[]>([{
    name: 'Default',
    type: 'scatterplot',
    colors: { fill: [255, 0, 0] },
    visible: true,
    data: []
  }]);
  const [selectedLayerName, setSelectedLayerName] = useState('Default');
  const [layerManagerClicked, setLayerManagerClicked] = useState(false);
  const [layerName, setLayerName] = useState('');
  const [mode, setMode] = useState<any>(() => ViewMode);
  const [measurementFeatures,setMeasurementFeatures] = useState<FeatureCollection>({
      type: 'FeatureCollection',
      features: []
    })

  const measureLayer = new EditableGeoJsonLayer({
    id: 'measure-layer',
    data: measurementFeatures,
    mode,
    modeConfig: { centerTooltipsOnLine : true, 
      turfOptions: 
        {units: 'miles'}
    },
    getTentativeLineColor: [250, 179, 135, 200],
    getEditHandlePointColor: [250, 179, 135, 255],
    getEditHandlePointOutlineColor: [250, 179, 135, 200],
    onEdit: ({ updatedData }) => {
      setMeasurementFeatures(updatedData);
    },
  });

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

      setLayerManager(prevLayers =>
        prevLayers.map(layer =>
          layer.name === selectedLayerName ? {
            ...layer,
            data: [...layer?.data, ...points]
          } : layer
        )
      );
    };
    reader.readAsText(file);
  };

  const addNewLayer = (newLayer: any) => {
    setLayerManager(prevLayers => [...prevLayers, {
      name: newLayer.name,
      type: newLayer.type || 'scatterplot',
      colors: newLayer.colors || { fill: [255, 0, 0] },
      data: newLayer.data || [],
      visible: true
    }]);
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayerManager(prevLayers =>
      prevLayers.map(layer =>
        layer.name === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleCursorClick = (event: any) => {
    const deck = deckRef.current.deck;
    const viewport = deck.getViewports()[0];

    const [lng, lat] = viewport.unproject([event.x, event.y]);

    const selectedLayer = layerManager.find(layer => layer.name === selectedLayerName);
    if (!selectedLayer) return;

    setLayerManager(prevLayers =>
      prevLayers.map(layer =>
        layer.name === selectedLayerName ? {
          ...layer,
          data: [...layer?.data, {
            latitude: lat, longitude: lng,
            name: `${lng.toFixed(2)}, ${lat.toFixed(2)}`, state: ''
          }]
        } : layer
      )
    );

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
          {legendItems.filter((layer : any) => layer.id !== 'measure-layer').map((layer: any) => (
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
      <div
        className="absolute top-2 left-2 z-1000 text-3xl text-peach font-bold text-shadow-2xs select-none text-shadow-peach-3">Cat
        Map
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
        <div className="flex items-start relative">
          <button
            onClick={() => setLayerManagerClicked(!layerManagerClicked)}
            title="Layers"
            className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950 ${layerManagerClicked ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
            <LayersIcon className={'w-8 h-8 rounded-full'} />
          </button>
          {layerManagerClicked && (
            <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
              <label className="layer-select text-stone-500">Layer Manager:</label>
              <div className={"flex flex-row items-center justify-between gap-4"}>
                <input
                  type={'text'}
                  className={"px-2 border border-zinc-500 text-stone-500 rounded-lg max-w-48 max-h-6"}
                  id={'layer-name-input'}
                  value={layerName}
                  onChange={(e) => {
                    setLayerName(e.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    addNewLayer({ name: `${layerName}`, type: 'scatterplot', data: [] });
                    setLayerName('');
                  }}
                  className="p-1 max-h-10 text-blue-700 flex-row flex items-center justify-center"
                >
                  <PlusIcon className={'w-4 h-4'} /> Layer
                </button>
              </div>
              <Separator.Root className="my-[15px] bg-zinc-300 data-[orientation=horizontal]:h-px"
                decorative />
              <div className="mt-2 text-stone-500 overflow-y-auto max-h-112 p-2">
                {layerManager.map(layer => (
                  <div key={layer.name} className="flex items-center justify-between mb-1">
                    <span className="mr-2">{layer.name}</span>
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayerVisibility(layer.name)}
                      className="ml-2 p-1 rounded bg-zinc-800 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-start relative">
          <button
            onClick={() => setIsUploadExpanded(!isUploadExpanded)}
            title={"Upload Data"}
            className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950 ${isUploadExpanded ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
            <UploadIcon className={'w-8 h-8 rounded-full'} />
          </button>
          {isUploadExpanded && !isClicked && (
            <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
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
        <div className="flex items-start relative">
          <button
          onClick={() => setIsClicked(!isClicked)}
          title={'Add Points'}
          className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950 ${isClicked ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
          <CursorArrowIcon className={'w-8 h-8 rounded-full'} />
        </button>

        {isClicked &&
          <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
            <label className="text-stone-500">Add points to:</label>
                <select
                  value={selectedLayerName}
                  onChange={(e) => setSelectedLayerName(e.target.value)}
                  className="p-1 rounded-lg border border-zinc-500"
                >
                  {layerManager.map(layer => (
                    <option key={layer.name} value={layer.name}>
                      {layer.name}
                    </option>
                  ))}
              </select>
          </div>}
        </div>
        <div className="flex items-start relative">
          <button
            onClick={() => mode === ViewMode ? setMode(() => MeasureDistanceMode) : setMode(() => ViewMode)}
            title={'Measure Tool'}
            className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950 ${mode === MeasureDistanceMode ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
            <RulerHorizontalIcon className={'w-8 h-8 rounded-full'} />
          </button>
        </div>
        <div className="flex items-start relative">
          <button
            onClick={() => setIsBaseMapExpanded(!isBaseMapExpanded)}
            title={'Preferences'}
            className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-zinc-950 ${isBaseMapExpanded ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}
          >
            <MixerHorizontalIcon className={'w-8 h-8 rounded-full'} />
          </button>

          {isBaseMapExpanded && (
            <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
              <h3 className="text-m  text-gray-600">
                Basemap Selection
              </h3>
              <Separator.Root className="my-[15px] bg-zinc-300 data-[orientation=horizontal]:h-px"
                decorative />
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
        controller={{
          doubleClickZoom: false,
          inertia: false
        }}
        onClick={isClicked ? handleCursorClick :  undefined}
        layers={mode === MeasureDistanceMode ? 
          [measureLayer,
          ...layerManager.filter(layer => layer.visible)
          .map(l => {
            if (l.type === 'scatterplot') {
              return new LabelledLayer({ id: l.name, data: l.data, color: l.colors.fill })
            }
          }
          )
        ] : [...layerManager.filter(layer => layer.visible)
          .map(l => {
            if (l.type === 'scatterplot') {
              return new LabelledLayer({ id: l.name, data: l.data, color: l.colors.fill })
            }
          }
          )
        ]}
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