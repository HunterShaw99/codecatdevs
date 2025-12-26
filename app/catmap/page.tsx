'use client';
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import {useEffect, useMemo, useRef, useState} from 'react';
import {MeasureDistanceMode, ViewMode} from '@deck.gl-community/editable-layers';
import {
    BackpackIcon,
    CursorArrowIcon,
    DownloadIcon,
    LayersIcon,
    ListBulletIcon,
    MixerHorizontalIcon,
    RadiobuttonIcon,
    RulerHorizontalIcon,
    TableIcon,
    UploadIcon
} from "@radix-ui/react-icons"
import {PickingInfo} from '@deck.gl/core';
import * as RadioGroup from '@radix-ui/react-radio-group';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Separator} from "radix-ui";
import {distance, point} from "@turf/turf";

import {hexToRGB, randomHex} from '../utils/color';
import {PopUpWindow} from "@components/map/popup/PopUp";
import AttributeTable from "@components/map/table/AttributeTable";
import {BASEMAP_KEYS, BASEMAPS} from './constants';
import {LabelledLayer} from "@components/map/layers/labelledScatterLayer";
import measureLayer from "@components/map/layers/measureLayer";
import {SearchRingLayer} from "@components/map/layers/searchRingLayer"
import {BaseLayerData, CompResults, ScatterPoint} from "@components/map/utils/LayerTypes";
import CodeCatLine from "../components/icons/CodeCatLine";
import {LayerProvider, useLayerContext} from '../context/layerContext';
import {LayerManagerWidget} from "@map/widgets/LayerManager";

function MapPageContent() {
    // set minZoom and MaxZoom for both Map and Deck component
    const INITIAL_VIEW_STATE = {
        longitude: -79.9915,
        latitude: 40.4419,
        zoom: 10.5,
        maxZoom: 17,
        minZoom: 5
    } as const;

    const deckRef = useRef<any>(null);
    const [isUploadExpanded, setIsUploadExpanded] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);
    const [baseMap, setBaseMap] = useState<'light' | 'dark' | 'standard' | 'hybrid'>('light');
    const [isBaseMapExpanded, setIsBaseMapExpanded] = useState(false);
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const [toolboxOpen, setToolboxOpen] = useState(false)
    const [tableName, setTableName] = useState('Default')

    // layer state
    const {
        layerManager,
        setLayerManager,
        selectedLayerName,
        setSelectedLayerName,
        addNewLayer,
    } = useLayerContext();

    const [layerManagerClicked, setLayerManagerClicked] = useState(false);
    const [popupData, setPopupData] = useState<PickingInfo<BaseLayerData>>()

    // search ring state
    const [searchRingSelected, setSearchRingSelected] = useState(false)
    const [searchLocationA, setSearchLocationA] = useState('Default')
    const [searchLocationB, setSearchLocationB] = useState<string>()
    const [isDisabled, setIsDisabled] = useState(true)
    const [searchDistance, setSearchDistance] = useState(1)

    useEffect(() => {
        if (searchLocationA && searchLocationB && searchLocationA !== searchLocationB) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [searchLocationA, searchLocationB]);

    // meaurement state
    const [mode, setMode] = useState<any>(() => ViewMode);

    const measurementLayer = measureLayer({
        type: 'FeatureCollection',
        features: []
    }, mode);

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

                return {longitude: lng, latitude: lat, name, state, status};
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

    const handleAddPointClick = (event: any) => {
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
            style={{backgroundColor: rgb}}
        ></span>);
    }

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

    const layers = useMemo(() => {
        const visible = layerManager.filter(layer => layer.visible);
        const searchLayers = visible.filter(l => l.type === 'search-ring').map(l => [new SearchRingLayer({
            data: l.data,
            color: l.colors.fill
        })])
        const labelledLayers = visible.filter(l => l.type === 'labelled-scatter').map(l => [new LabelledLayer({
            id: l.name,
            data: l.data,
            color: l.colors.fill
        })])

        return mode === MeasureDistanceMode ?
            [...searchLayers, ...labelledLayers, measurementLayer] :
            [...searchLayers, ...labelledLayers];
    }, [mode, layerManager, measurementLayer]);

    const getDistance = (inputPoint: ScatterPoint, compareLayer?: BaseLayerData): CompResults[] => {
        if (!compareLayer || !compareLayer.data) return [];

        const output: CompResults[] = [];

        for (const row of compareLayer.data) {
            const d = distance(
                point([inputPoint.longitude, inputPoint.latitude]),
                point([row.longitude, row.latitude]),
                {units: 'miles'}
            );

            if (d <= searchDistance) {
                output.push({
                    name: row.name,
                    coordinates: [row.longitude, row.latitude],
                    distance: d,
                });
            }
        }

        return output;
    }

    const runSearchRingAnalysis = (locationA: string, locationB?: string) => {
        const layerA = layerManager.find(layer => layer.name === locationA);
        const layerB = layerManager.find(layer => layer.name === locationB);

        const results = layerA?.data.map(row => (
            {
                'originName': row.name,
                'originCoords': [row.longitude, row.latitude],
                'searchedDistance': searchDistance,
                'compareResults': getDistance(row, layerB)
            }))

        addNewLayer({
            name: `${locationA} ${searchDistance} search - ${new Date().getTime().toString()}`,
            type: 'search-ring',
            colors: {fill: randomHex()},
            data: results,
            visible: true
        })
    };

    const handleCursorClick = (info: any) => {
        if (isClicked) {
            handleAddPointClick(info)
        } else if (mode === MeasureDistanceMode) {
            setPopupData(undefined)
        } else if (info.object) {
            setPopupData(info);
        } else {
            setPopupData(undefined)
        }
    };

    const handleDownloadClick = () => {
        const layer = layerManager.find(layer => layer.name === tableName);
        const data = layer?.data || [];

        let headers = Object.keys(data[0]).join(",");

        if (layer?.type === 'search-ring') {
            headers = headers.replace('compareResults', 'compareResultsName,compareResultsCoordinates,compareResultsDistance');
        }

        const rows = data.map(obj => 
            Object.entries(obj).map(([key, val]) => {
                if (key === 'compareResults' && Array.isArray(val)) {
                    if (val.length > 0) {
                        let first = true;
                        const compResult = val.map((compVal) => {
                            if (first) {
                                first = false;
                                return Object.values(compVal).map(
                                    v => String(v).replace(/,/g, ' ')).join(",") 
                            }
                        else {
                            return `${obj['originName'].replace(/,/, ' ')},${obj['originCoords'].join(';')},${obj['searchedDistance']},
                            ${Object.values(compVal).map(v => String(v).replace(/,/g, ' ')).join(",")}`
                                }
                     }) 
                        return compResult.join(",");
                    }
                    else {
                        return ",,,";
                     }
                }
                if (key === 'originCoords' && Array.isArray(val)) {
                    return val.join(";");
                }
                else {
                    return String(val).replace(/,/g, ''); // remove commas to avoid CSV issues
                }
            }).join(",")
        ).join("\n");

        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.setAttribute("href", url);
        link.setAttribute("download", "exported_data.csv");
        link.style.visibility = "hidden";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={'max-w-full max-h-full'}>
            <div
                className="absolute top-2 left-2 z-1000 text-3xl text-peach font-bold text-shadow-2xs select-none text-shadow-peach-3 flex flex-row">
                <CodeCatLine
                    width={35}
                    height={35}
                    className="opacity-80 rounded-lg mr-1"
                    fill="#fab387"
                />
                Cat Map
            </div>

            {/* Legend Section */}
            <div className="rounded-lg mr-2 z-100 flex flex-col absolute top-2 right-0">
                <button
                    onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                    className={`legend-container ${isLegendExpanded ? 'expanded' : 'collapsed'}`}
                >
                    {!isLegendExpanded ? <ListBulletIcon className={'w-6 h-6'}/> : getLegendList()}
                </button>
            </div>

            {/* Attribute Table */}
            <div className="rounded-lg z-100 absolute bottom-2 left-1/2 transform -translate-x-1/2">
                {isTableExpanded ?
                    <div className="absolute bottom-2 m-2 left-1/2 transform -translate-x-1/2 z-50 max-w-[50vw] max-h-[30vh]
                        overflow-auto grid place-items-center rounded-lg shadow-md hover:shadow-lg transition-shadow bg-zinc-950">
                        <div className="flex flex-row">
                            <button
                                onClick={() => setIsTableExpanded(!isTableExpanded)}
                                className={'subdomain-btn'}
                            ><TableIcon className={'w-6 h-6'}/>
                            </button>
                            <select
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                className="p-1 m-2 rounded-lg border border-zinc-500 text-stone-500 bg-white"
                            >
                                {layerManager.map(layer => (
                                    <option key={layer.name} value={layer.name}>
                                        {layer.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleDownloadClick}
                                className={'subdomain-btn'}>
                                <DownloadIcon className={'w-6 h-6'} />
                            </button>
                        </div>
                        <AttributeTable layer={layerManager.filter(layer => layer.name === tableName)}/>
                    </div>
                    :
                    <button
                        onClick={() => setIsTableExpanded(!isTableExpanded)}
                        className={'subdomain-btn'}
                    ><TableIcon className={'w-6 h-6'}/>
                    </button>

                }
            </div>

            {/* Widgets Section */}
            <div className="pl-4 pt-4 pb-4 rounded-lg z-100 flex flex-col absolute top-[30%] left-0">
                <div className="flex items-start relative">
                    <button
                        onClick={() => setLayerManagerClicked(!layerManagerClicked)}
                        title="Layers"
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${layerManagerClicked ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <LayersIcon className={'w-8 h-8'}/>
                    </button>
                    <LayerManagerWidget
                        isOpen={layerManagerClicked}
                        onClose={() => setLayerManagerClicked(false)}
                    />
                </div>
                <div className="flex items-start relative">
                    <button
                        onClick={() => setIsUploadExpanded(!isUploadExpanded)}
                        title={"Upload Data"}
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${isUploadExpanded ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <UploadIcon className={'w-8 h-8'}/>
                    </button>
                    {isUploadExpanded && !isClicked && (
                        <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                            <label className="text-stone-500 text-sm">Upload Locations:</label>
                            <Separator.Root className="seperator-major"
                                            decorative/>
                            <div className="flex flex-row items-center">
                                <p className="p-2 text-stone-500 font-bold text-xs">Select Layer:</p>
                                <select
                                    value={selectedLayerName}
                                    onChange={(e) => setSelectedLayerName(e.target.value)}
                                    className="p-1 ml-1">
                                    {layerManager.filter((layer: {
                                        type: string;
                                    }) => layer.type === 'labelled-scatter').map(layer => (
                                        <option key={layer.name} value={layer.name}>
                                            {layer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Separator.Root className="seperator-minor"
                                            decorative/>
                            <input
                                type="file"
                                title="Upload a CSV or Excel file with latitude and longitude columns."
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="block text-sm text-stone-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-peach-8 file:text-peach-5
                              hover:file:bg-peach-7"
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-start relative">
                    <button
                        onClick={() => setIsClicked(!isClicked)}
                        title={'Add Points'}
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${isClicked ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <CursorArrowIcon className={'w-8 h-8'}/>
                    </button>

                    {isClicked &&
                        <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                            <label className="text-stone-500 text-sm">Add points:</label>
                            <Separator.Root className="seperator-major"
                                            decorative/>
                            <div className="flex flex-row items-center">
                                <p className="p-2 text-stone-500 font-bold text-xs">Select Layer:</p>
                                <select
                                    value={selectedLayerName}
                                    onChange={(e) => setSelectedLayerName(e.target.value)}
                                    className="p-1 ml-1 rounded-lg border border-zinc-500 text-stone-500 text-sm"
                                >
                                    {layerManager.filter(layer => layer.type === 'labelled-scatter').map(layer => (
                                        <option key={layer.name} value={layer.name}>
                                            {layer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>}
                </div>

                {/* Analysis Section */}
                <div className="button-menu-container">
                    <button
                        onClick={() => setToolboxOpen(!toolboxOpen)}
                        title={'Analysis Tools'}
                        className={`my-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${toolboxOpen ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                        <BackpackIcon className={'w-8 h-8'}/>
                    </button>

                    {toolboxOpen &&
                        (<div className={`menu-popover open`}>
                            <button
                                onClick={() => mode === ViewMode ? setMode(() => MeasureDistanceMode) : setMode(() => ViewMode)}
                                title={'Measure Tool'}
                                className={`row-span-1 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${mode === MeasureDistanceMode ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                                <RulerHorizontalIcon className={'w-8 h-8'}/>
                            </button>

                            <button
                                onClick={() => setSearchRingSelected(!searchRingSelected)}
                                title={'Search Area'}
                                className={`row-span-1 rounded-full shadow-md hover:shadow-lg transition-shadow bg-base ${searchRingSelected ? 'p-4 w-16 h-16' : 'p-2 w-12 h-12'}`}>
                                <RadiobuttonIcon className={'w-8 h-8'}/>
                            </button>
                            {searchRingSelected && (
                                <div className="absolute left-full p-2 bg-white border rounded-lg shadow-md shrink-0">
                                    <label className="ml-2 text-m text-stone-500">Search Area Tool:</label>
                                    <Separator.Root className="seperator-major"
                                                    decorative/>
                                    <div className="text-stone-500 overflow-y-auto max-h-112 p-2">
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-sm">Input Layer:</p>
                                            <select
                                                value={searchLocationA}
                                                onChange={(e) => setSearchLocationA(e.target.value)}
                                                className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500 text-sm"
                                            >
                                                {layerManager.map(layer => (layer.type === 'labelled-scatter' ?
                                                        <option key={layer.name} value={layer.name}>
                                                            {layer.name}
                                                        </option> :
                                                        undefined
                                                ))}
                                            </select>
                                        </div>
                                        <Separator.Root className="seperator-minor"
                                                        decorative/>
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-sm">Comparison Layer:</p>
                                            <select
                                                value={searchLocationB}
                                                onChange={(e) => setSearchLocationB(e.target.value)}
                                                className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500 text-sm"
                                            >
                                                {layerManager.map(layer => (layer.type === 'labelled-scatter' ?
                                                        <option key={layer.name} value={layer.name}>
                                                            {layer.name}
                                                        </option> :
                                                        undefined
                                                ))}
                                            </select>
                                        </div>
                                        <Separator.Root className="seperator-minor"
                                                        decorative/>
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-sm">Distance (miles):</p>
                                            <input
                                                type={'number'}
                                                className={"p-2 ml-1 border border-zinc-500 text-sm text-stone-500 rounded-lg h-6 w-16"}
                                                id={'sr-distance-input'}
                                                min={"1"}
                                                max={"10"}
                                                step={"0.2"}
                                                value={searchDistance}
                                                onChange={(e) => {
                                                    setSearchDistance(Number(e.target.value));
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => runSearchRingAnalysis(searchLocationA, searchLocationB)}
                                                title={isDisabled ? 'Select distinct layers to run analysis' : 'Run Area Analysis'}
                                                disabled={isDisabled}
                                                className={`mt-2 py-2 px-4 rounded-md font-semibold ${isDisabled ?
                                                    ' text-red-700 bg-red hover:bg-red-400' :
                                                    ' text-peach-5 bg-peach-8 hover:bg-peach-7'}`}>
                                                Run Analysis
                                            </button>
                                        </div>
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
                        <MixerHorizontalIcon className={'w-8 h-8 rounded-full'}/>
                    </button>

                    {isBaseMapExpanded && (
                        <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                            <h3 className="text-m  text-gray-600">
                                Basemap Selection
                            </h3>
                            <Separator.Root className="seperator-major"
                                            decorative/>
                            <form>
                                <RadioGroup.Root
                                    className="RadioGroupRoot"
                                    value={baseMap}
                                    onValueChange={(value) => setBaseMap(value as 'light' | 'dark' | 'standard' | 'hybrid')}
                                    aria-label="Basemap Selection"
                                >
                                    {BASEMAP_KEYS.map((key) => (
                                        <div key={key} style={{display: "flex", alignItems: "center"}}>
                                            <RadioGroup.Item className="RadioGroupItem" value={key} id={`${key}`}>
                                                <RadioGroup.Indicator className="RadioGroupIndicator"/>
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
                onClick={(info) => handleCursorClick(info)}
                layers={layers}
            >
                {popupData?.object && (
                    <PopUpWindow props={popupData}/>
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

export default function MapPage() {
    return (
        <LayerProvider>
            <MapPageContent/>
        </LayerProvider>
    );
}