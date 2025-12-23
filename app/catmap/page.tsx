'use client';
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import {
    EditableGeoJsonLayer,
    FeatureCollection,
    MeasureDistanceMode,
    ViewMode
} from '@deck.gl-community/editable-layers';
import {
    BackpackIcon,
    CursorArrowIcon,
    EyeNoneIcon,
    EyeOpenIcon,
    LayersIcon,
    ListBulletIcon,
    MixerHorizontalIcon,
    PlusIcon,
    RadiobuttonIcon,
    RulerHorizontalIcon,
    TableIcon,
    TrashIcon,
    UploadIcon
} from "@radix-ui/react-icons"
import { PickingInfo } from '@deck.gl/core';
import * as RadioGroup from '@radix-ui/react-radio-group';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Separator } from "radix-ui";
import { distance, point } from "@turf/turf";

import {hexToRGB, randomHex} from '../utils/color';
import { PopUpWindow } from "@components/map/popup/PopUp";
import AttributeTable from "@components/map/table/AttributeTable";
import { BASEMAP_KEYS, BASEMAPS } from './constants';
import { LabelledLayer } from "@components/map/layers/labelledScatterLayer";
import { ScatterplotLayer } from "deck.gl";
import { ScatterPoint, SearchRing } from "@components/map/utils/LayerTypes";


// debounce moved to module scope to avoid recreating on every render
const debounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
    let timeoutId: NodeJS.Timeout | null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

export default function MapPage() {
    // set minZoom and MaxZoom for both Map and Deck component
    const INITIAL_VIEW_STATE = {
        longitude: -79.9915,
        latitude: 40.4419,
        zoom: 10.5,
        maxZoom: 17,
        minZoom: 5
    } as const;

    type BaseLayerData = {
        name: string;
        type: string;
        colors: { fill?: string; stroke?: string };
        data: any[]
        visible: boolean;
        layer?: any;
    }


    const deckRef = useRef<any>(null);
    const [isUploadExpanded, setIsUploadExpanded] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);
    const [baseMap, setBaseMap] = useState<'light' | 'dark' | 'standard' | 'hybrid'>('light');
    const [isBaseMapExpanded, setIsBaseMapExpanded] = useState(false);
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const [toolboxOpen, setToolboxOpen] = useState(false)

    // layer state
    const [layerManager, setLayerManager] = useState<BaseLayerData[]>([{
        name: 'Default',
        type: 'labelled-scatter',
        colors: { fill: randomHex() },
        visible: true,
        data: []
    }]);
    const [selectedLayerName, setSelectedLayerName] = useState('Default');
    const [layerManagerClicked, setLayerManagerClicked] = useState(false);
    const [layerName, setLayerName] = useState('');
    const [popupData, setPopupData] = useState<PickingInfo<BaseLayerData>>()
    
    // search ring state
    const [searchRingSelected, setSearchRingSelected] = useState(false)
    const [searchLocationA, setSearchLocationA] = useState('Default')
    const [searchLocationB, setSearchLocationB] = useState<string>()
    const [isDisabled, setIsDisabled] = useState(true)
    const [searchDistance, setSearchDistance] = useState(1)

    useEffect(() => {
        if (searchLocationA && searchLocationB) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    },[searchLocationA, searchLocationB]);

    // meaurement state
    const [mode, setMode] = useState<any>(() => ViewMode);
    const [measurementFeatures, setMeasurementFeatures] = useState<FeatureCollection>({
        type: 'FeatureCollection',
        features: []
    })


    const measureLayer = useMemo(() => new EditableGeoJsonLayer({
        id: 'measure-layer',
        data: measurementFeatures,
        mode,
        // options for actual measurement - see turf/distance docs
        modeConfig: {
            centerTooltipsOnLine: true,
            turfOptions: { units: 'miles' }
        },
        // color of line and points - see editable-geojson-layer docs
        getTentativeLineColor: [250, 179, 135, 200],
        getEditHandlePointColor: [250, 179, 135, 255],
        getEditHandlePointOutlineColor: [250, 179, 135, 200],
        // color and style of tooltips
        _subLayerProps: {
            tooltips: {
                getColor: [30, 30, 46],
                sizeScale: 1.2,
                sizeMinPixels: 12,
                sizeMaxPixels: 18,
                getSize: 16,
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontWeight: 750,
                fontSettings: { sdf: true },
                outlineColor: [255, 255, 255, 200],
                outlineWidth: 3,
            }
        },
        // allows for double click to retain drawn features
        onEdit: ({ updatedData }) => {
            setMeasurementFeatures(updatedData);
        },
    }), [measurementFeatures, mode]);

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
                const status = 'new'
                
                return { longitude: lng, latitude: lat, name, state, status };
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

    const addNewLayer = useCallback((newLayer: any) => {
        setLayerManager(prevLayers => [...prevLayers, {
            name: newLayer.name,
            type: newLayer.type || 'labelled-scatter',
            colors: {fill: newLayer.colors?.fill ?? randomHex()},
            data: newLayer.data || [],
            visible: true,
            layer: newLayer.layer || undefined
        }]);
    }, []);

    const toggleLayerVisibility = useCallback((layerId: string) => {
        setLayerManager(prevLayers =>
            prevLayers.map(layer =>
                layer.name === layerId ? { ...layer, visible: !layer.visible } : layer
            )
        );
    }, []);

    const deleteLayer = useCallback((name: string) => {
        setLayerManager(prev =>
            prev.filter(l => l.name !== name)
        );
    }, []);

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
                        name: `${lng.toFixed(2)}, ${lat.toFixed(2)}`, state: '', status: 'new'
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

    const updateLayerColor = useCallback((layerName: string, newColors: { fill?: string }) => {
        setLayerManager(prevLayers =>
            prevLayers.map(layer =>
                layer.name === layerName ? {
                    ...layer,
                    colors: {
                        ...layer.colors,
                        fill: newColors.fill ? newColors.fill : '#ff0000'
                    }
                } : layer
            )
        );
    }, [setLayerManager]);

    const updateLayerColorDebounced = useMemo(() => debounce(updateLayerColor, 300), [updateLayerColor]);

    const getLegendList = () => {
        const legendItems = layerManager.filter(layer => layer.visible);

        return (
            <div className="p-2 text-left text-stone-500 bg-white border rounded-lg">
                <h3 className="font-bold text-m mb-2 underline">Legend</h3>
                <ul className="text-xs space-y-1">
                    {legendItems.map((layer: any) => (
                        <li key={layer.name} className="mb-1 flex items-center">
                            {getLegendColor(hexToRGB(layer.colors.fill))}
                            <span>{layer.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const tableData = useMemo(() => layerManager.filter(layer => layer.visible).flatMap(l => l.data), [layerManager]);

    const layers = useMemo(() => {
        const visible = layerManager.filter(layer => layer.visible);
        const searchLayers = visible.filter(l => l.type === 'search-ring').map(l => l.layer)
        const labelledLayers = visible.filter(l => l.type === 'labelled-scatter').map(l => [new LabelledLayer({id: l.name, data: l.data, color: l.colors.fill})])
        
        return mode === MeasureDistanceMode ? 
            [...searchLayers, ...labelledLayers, measureLayer] : 
            [...searchLayers, ...labelledLayers];
    }, [mode, layerManager, measureLayer]);

    const getDistance = (inputPoint: ScatterPoint, compareLayer?: BaseLayerData): Record<string, number> => {
        if (!compareLayer || !compareLayer.data) return {};

        return compareLayer.data.reduce((comp: Record<string, number>, row: any) => {
            const d = distance(
                point([inputPoint.longitude, inputPoint.latitude]),
                point([row.longitude, row.latitude]),
                { units: 'miles' }
            );

            if (d <= searchDistance) {
                comp[row.name] = d;
            }

            return comp;
        }, {});
    }

    const runSearchRingAnalysis = ( locationA: string, locationB: string ) => {
        const layerA = layerManager.find(layer => layer.name === locationA);
        const layerB = layerManager.find(layer => layer.name === locationB);

        const results = layerA?.data.map(row => (
            {
            'originName': row.name,
            'originCoords': [row.longitude, row.latitude],
            'compareResults': getDistance(row, layerB)
            }))

        const ringLayer = new ScatterplotLayer<SearchRing>({
            data: results,
            getPosition: (d: SearchRing) => d.originCoords,
            getRadius: searchDistance * 1609.34,
            getFillColor: [255, 255, 0],
            pickable: true,
            })
        
        addNewLayer({
            name: `${locationA} - ${locationB} search - ${searchDistance} miles`,
            type: 'search-ring',
            colors: { fill: [255, 255, 0] },
            data: results,
            visible: true,
            layer: ringLayer
        })
    };

    return (
        <div className={'max-w-full max-h-full'}>
            <div
                className="absolute top-2 left-2 z-1000 text-3xl text-peach font-bold text-shadow-2xs select-none text-shadow-peach-3">Cat
                Map
            </div>

            {/* Legend Section */}
            <div className="rounded-lg mr-2 z-100 flex flex-col absolute top-2 right-0">
                <button
                    onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                    className={`legend-container ${isLegendExpanded ? 'expanded' : 'collapsed'}`}
                >
                    {!isLegendExpanded ? <ListBulletIcon className={'w-6 h-6'} /> : getLegendList()}
                </button>
            </div>

            {/* Attribute Table */}
            <div className="rounded-lg z-100 absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <button
                    onClick={() => setIsTableExpanded(!isTableExpanded)}
                    className={`legend-container ${isTableExpanded ? 'expanded' : 'collapsed'}`}
                >
                    <TableIcon className={'w-6 h-6'}/>
                </button>

                {isTableExpanded && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50 max-w-120 max-h-[60vh] overflow-auto grid place-items-center">
                        <AttributeTable layer={tableData} />
                    </div>
                )}
            </div>

            {/* Widgets Section */}
            <div className="pl-4 pt-4 pb-4 rounded-lg z-100 flex flex-col absolute top-[30%] left-0">
                <div className="flex items-start relative">
                    <button
                        onClick={() => setLayerManagerClicked(!layerManagerClicked)}
                        title="Layers"
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${layerManagerClicked ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <LayersIcon className={'w-8 h-8'} />
                    </button>
                    {layerManagerClicked && (
                        <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                            <label className="layer-select text-stone-700">Layer Manager:</label>
                            <div className={"flex flex-row items-center justify-between gap-4"}>
                                <input
                                    type={'text'}
                                    className={"px-2 border border-zinc-500 text-stone-500 bg-stone-100 rounded-md max-w-48 max-h-6"}
                                    id={'layer-name-input'}
                                    value={layerName}
                                    onChange={(e) => {
                                        const exists = layerManager.some(l => l.name === e.target.value);
                                        if (exists) {
                                            alert('Layer name already taken');
                                            return;
                                        }
                                        setLayerName(e.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        addNewLayer({ name: `${layerName}`, type: 'labelled-scatter', data: [] });
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
                                    <div key={layer.name} className="flex items-center justify-between mb-1 space-x-4">
                                        <span className="mr-2 w-20">{layer.name}</span>
                                        <input
                                            type="color"
                                            value={layer.colors.fill}
                                            onChange={(e) => updateLayerColorDebounced(layer.name, {fill: e.target.value})}
                                            className="w-12 p-1 rounded"
                                        />
                                        <div className={'flex flex-row gap-2'}>
                                            <button
                                                onClick={() => toggleLayerVisibility(layer.name)}
                                                className="p-1 w-6 h-6 rounded text-stone-700 focus:outline-none"
                                            >
                                                {layer.visible ? (
                                                    <EyeOpenIcon className="w-full h-full"/>
                                                ) : (
                                                    <EyeNoneIcon className="w-full h-full"/>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => deleteLayer(layer.name)}
                                                aria-label={`Delete layer ${layer.name}`}
                                                className="p-1 w-6 h-6 rounded text-red-400 hover:text-red-700 focus:outline-none"
                                            >
                                                <TrashIcon className="w-full h-full"/>
                                            </button>
                                        </div>

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
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${isUploadExpanded ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <UploadIcon className={'w-8 h-8'} />
                    </button>
                    {isUploadExpanded && !isClicked && (
                        <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="block text-sm text-stone-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                            />
                            <p className="mt-2 text-sm text-stone-600">
                                Upload a CSV or Excel file with latitude and longitude columns
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex items-start relative">
                    <button
                        onClick={() => setIsClicked(!isClicked)}
                        title={'Add Points'}
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${isClicked ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <CursorArrowIcon className={'w-8 h-8'} />
                    </button>

                    {isClicked &&
                        <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                            <label className="text-stone-500">Add points to:</label>
                            <select
                                value={selectedLayerName}
                                onChange={(e) => setSelectedLayerName(e.target.value)}
                                className="p-1 rounded-lg border border-zinc-500 text-stone-500"
                            >
                                {layerManager.map(layer => (
                                    <option key={layer.name} value={layer.name}>
                                        {layer.name}
                                    </option>
                                ))}
                            </select>
                        </div>}
                </div>

                {/* Analysis Section */}
                <div className="button-menu-container">
                    <button
                        onClick={() => setToolboxOpen(!toolboxOpen)}
                        title={'Analysis Tools'}
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${toolboxOpen ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <BackpackIcon className={'w-8 h-8'} />
                    </button>

                    {toolboxOpen &&
                        (<div className={`menu-popover open`}>
                            <button
                                onClick={() => mode === ViewMode ? setMode(() => MeasureDistanceMode) : setMode(() => ViewMode)}
                                title={'Measure Tool'}
                                className={`row-span-1 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${mode === MeasureDistanceMode ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                                <RulerHorizontalIcon className={'w-8 h-8'} />
                            </button>

                            <button
                                onClick={() => setSearchRingSelected(!searchRingSelected)}
                                title={'Search Area'}
                                className={`row-span-1 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${searchRingSelected ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                                <RadiobuttonIcon className={'w-8 h-8'} />
                            </button>
                            {searchRingSelected && (
                                <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                                    <label className="search-area text-stone-500">Search Area Tool:</label>
                                    <Separator.Root className="my-[15px] bg-zinc-300 data-[orientation=horizontal]:h-px"
                                        decorative />
                                    <div className="mt-2 text-stone-500 overflow-y-auto max-h-112 p-2">
                                        <select
                                            value={searchLocationA}
                                            onChange={(e) => setSearchLocationA(e.target.value)}
                                            className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500"
                                        >
                                            {layerManager.map(layer => (layer.type === 'labelled-scatter' ?
                                                <option key={layer.name} value={layer.name}>
                                                    {layer.name}
                                                </option> : 
                                                undefined
                                            ))}
                                        </select>
                                        <select
                                            value={searchLocationB}
                                            onChange={(e) => setSearchLocationB(e.target.value)}
                                            className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500"
                                        >
                                            {layerManager.map(layer => (layer.type === 'labelled-scatter' ?
                                                <option key={layer.name} value={layer.name}>
                                                    {layer.name}
                                                </option> : 
                                                undefined
                                            ))}
                                        </select>
                                        <input
                                            type={'number'}
                                            className={"px-2 border border-zinc-500 text-stone-500 rounded-lg max-w-48 max-h-6"}
                                            id={'sr-distance-input'}
                                            value={searchDistance}
                                            onChange={(e) => {
                                        setSearchDistance(Number(e.target.value));
                                    }}
                                />
                                        <button
                                            onClick={() => runSearchRingAnalysis(searchLocationA, searchLocationB)}
                                            title={'Run Area Analysis'}
                                            disabled={isDisabled}
                                            className={`p-2 rounded-lg border border-zinc-600 text-stone-600 ${isDisabled ? 'bg-zinc-400' : 'bg-white'}`}>
                                                Run Analysis
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>)
                    }
                </div>

                <div className="flex items-start relative">
                    <button
                        onClick={() => setIsBaseMapExpanded(!isBaseMapExpanded)}
                        title={'Preferences'}
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${isBaseMapExpanded ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}
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
                onClick={isClicked ? handleCursorClick : (info) => {
                    if (info.object) {
                        setPopupData(info);
                    } else {
                        setPopupData(undefined)
                    }
                }}
                layers={layers}
            >
                {popupData?.object && (
                    <PopUpWindow props={popupData} />
                )}
                <Map
                    maxPitch={0}
                    minZoom={INITIAL_VIEW_STATE.minZoom}
                    maxZoom={INITIAL_VIEW_STATE.maxZoom}
                    mapStyle={BASEMAPS[baseMap]}
                    reuseMaps
                >
                </Map>
            </DeckGL>
        </div>
    );
}