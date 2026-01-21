'use client';
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import {useEffect, useMemo, useRef, useState} from 'react';
import {MeasureDistanceMode, ViewMode} from '@deck.gl-community/editable-layers';
import {
    DownloadIcon,
    LayersIcon,
    ListBulletIcon,
    RulerHorizontalIcon,
    Share1Icon,
    TableIcon,
    TargetIcon,
} from "@radix-ui/react-icons"
import {PickingInfo} from '@deck.gl/core';
import * as RadioGroup from '@radix-ui/react-radio-group';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Separator} from "radix-ui";
import {distance, point} from "@turf/turf";

import {hexToRGB, randomHex} from '../utils/color';
import {PopUpWindow} from "@components/map/popup/PopUp";
import AttributeTable from "@components/map/table/AttributeTable";
import {BASEMAP_KEYS, BASEMAPS, ROUTING_PREFERENCES} from '../constants';
import {LabelledLayer, measureLayer, RouteLineLayer, SearchRingLayer} from "@components/map/layers";
import {BaseLayerData, CompResults, ScatterPoint} from "@components/map/utils/LayerTypes";
import CodeCatLine from "../components/icons/CodeCatLine";
import {LayerProvider, useLayerContext} from '../context/layerContext';
import {LayerManagerWidget} from "@map/widgets/LayerManager";
import {useWidgetManager, WidgetProvider} from "../context/widgetManager";
import WidgetButton from "@components/WidgetButton";
import CSVReader from "@map/widgets/csvReader";
import {downloadCsv, validateName} from "../helpers";

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
    const [uploadedData, setUploadedData] = useState<any>(null);
    const [isLegendExpanded, setIsLegendExpanded] = useState(true);
    const [baseMap, setBaseMap] = useState<'light' | 'dark' | 'standard' | 'hybrid'>('light');
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure hydration matches by deferring render until client mounts
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // layer state
    const {
        layerManager,
        setLayerManager,
        selectedLayerName,
        setSelectedLayerName,
        addNewLayer,
    } = useLayerContext();

    const {
        isExpanded,
        isActive,
        isSubWidgetActive,
        toggleWidget,
        toggleSubWidget
    } = useWidgetManager();

    const [popupData, setPopupData] = useState<PickingInfo<BaseLayerData>>()
    const [layersOpen, setLayersOpen] = useState(false)

    // search ring state
    const [searchLocationA, setSearchLocationA] = useState('Default')
    const [searchLocationB, setSearchLocationB] = useState('Default')
    const [isRingDisabled, setIsRingDisabled] = useState(true)
    const [searchDistance, setSearchDistance] = useState(1)

    // routing state
    const [routingLayer, setRoutingLayer] = useState('Default')
    const [routingStart, setRoutingStart] = useState('')
    const [isRoutingDisabled, setIsRoutingDisabled] = useState(true)
    const [routePreference, setRoutingPreference] = useState<'distance' | 'duration'>('distance')

    useEffect(() => {
        if (searchLocationA && searchLocationB && searchLocationA !== searchLocationB) {
            setIsRingDisabled(false)
        } else {
            setIsRingDisabled(true)
        }
    }, [searchLocationA, searchLocationB]);

    useEffect(() => {
        if (routingLayer) {
            const layer = layerManager.find(layer => layer.name === routingLayer);
            //check that routing layer has at least 2 points
            if (layer && layer.data && layer.data.length >= 2) {
                setIsRoutingDisabled(false)
            } else {
                setIsRoutingDisabled(true)
            }
        }
    }, [routingLayer, layerManager]);

    useMemo(() => {
        const layer = layerManager.find(layer => layer.name === selectedLayerName);
        if (layer && layer.type === 'labelled-scatter') {
            setRoutingLayer(selectedLayerName)
            setSearchLocationA(selectedLayerName)
            setSearchLocationB(selectedLayerName)
        }
    }, [selectedLayerName])


    const measurementLayer = measureLayer({
        type: 'FeatureCollection',
        features: []
    }, isSubWidgetActive('analysis', 'measure') ? MeasureDistanceMode : ViewMode);

    useEffect(() => {
        if (uploadedData && uploadedData.data) {
            setLayerManager(prevLayers =>
                prevLayers.map(layer =>
                    layer.name === selectedLayerName ? {
                        ...layer,
                        data: [...layer?.data, ...uploadedData.data]
                    } : layer
                )
            );
        }
    }, [uploadedData]);

    const handleAddPointClick = (event: any) => {
        const deck = deckRef.current.deck;
        const viewport = deck.getViewports()[0];

        const [lng, lat] = viewport.unproject([event.x, event.y]);

        const selectedLayer = layerManager.find(layer => layer.name === selectedLayerName);
        if (!selectedLayer) return;

        const pointCount = selectedLayer.data.length;

        setLayerManager(prevLayers =>
            prevLayers.map(layer =>
                layer.name === selectedLayerName ? {
                    ...layer,
                    data: [...layer?.data, {
                        latitude: lat, longitude: lng,
                        name: `${selectedLayerName}-${pointCount}`, status: 'new',
                        id: `${layer.id}-${pointCount}`
                    }]
                } : layer
            )
        );
    };


    const getLegendColor = (color: any) => {
        const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        return (<span
            className="inline-block w-3 h-3 mr-2 rounded-full"
            style={{backgroundColor: rgb}}
        ></span>);
    }

    const getLegendList = useMemo(() => {
        const legendItems = layerManager.filter(layer => layer.visible);

        return (
            <div className="p-2 text-left text-stone-500 bg-white border rounded-lg">
                <h3 className="font-bold text-m mb-2 underline">Legend</h3>
                <ul className="text-xs space-y-1">
                    {legendItems.length > 0 ? legendItems.map((layer: any) => (
                            <li key={layer.name} className="mb-1 flex items-center">
                                {getLegendColor(hexToRGB(layer.colors.fill))}
                                <span>{layer.name}</span>
                            </li>
                        )) :
                        <span className='italic'>No Layers currently visible</span>}
                </ul>
            </div>
        );
    }, [layerManager]);

    const layers = useMemo(() => {
        const visible = layerManager.filter(layer => layer.visible);
        const searchLayers = visible.filter(l => l.type === 'search-ring').map(l => [new SearchRingLayer({
            id: l.id,
            data: l.data,
            color: l.colors.fill
        })])
        const labelledLayers = visible.filter(l => l.type === 'labelled-scatter').map(l => [new LabelledLayer({
            id: l.id,
            data: l.data,
            color: l.colors.fill
        })])
        const routeLayers = visible.filter(l => l.type === 'route-line').map(l => [new RouteLineLayer({
            id: l.id,
            data: l.data as any,
            color: l.colors.fill
        })])

        type AllLayerTypes = RouteLineLayer | SearchRingLayer | LabelledLayer | any;

        const allLayers: AllLayerTypes[] = [
            ...routeLayers,
            ...searchLayers,
            ...labelledLayers
        ];

        if (isSubWidgetActive('analysis', 'measure')) {
            allLayers.push(measurementLayer);
        }

        return allLayers;
    }, [layerManager, measurementLayer, isSubWidgetActive]);

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

        const results = layerA?.data.map((row) => ({
            'originName': row.name,
            'originCoords': [row.longitude, row.latitude],
            'searchedDistance': searchDistance,
            'compareLayer': locationB,
            'compareResults': getDistance(row, layerB),
            'parentRowId': `${row.id}`
        }))

        addNewLayer({
            name: validateName(`${locationA}-${locationB} ${searchDistance} mile`, layerManager.map(layer => layer.name)),
            type: 'search-ring',
            colors: {fill: randomHex()},
            data: results,
            visible: true,
            parentLayerId: `${layerA?.id}`,
        })
    };

    const routePoints = (layerName: string) => {
        const layer = layerManager.find(layer => layer.name === layerName);

        let pointNames: string[] = [];

        const points = layer?.data ?? [];
        const startIndex = points.findIndex(p => p.name === routingStart);

        const start = startIndex !== -1 ? points[startIndex] : undefined;
        const remainingItems = points.filter((_, i) => i !== startIndex);

        const data = start ? [start, ...remainingItems] : remainingItems;

        const coordinates = data.map((point) => {
            pointNames.push(point.name);
            return `${point.longitude},${point.latitude}`
        }).join(';');

        const service = layer && layer?.data.length > 2 ? 'trip' : 'route';

        const url = `/routing?service=${service}&coordinates=${coordinates}&annotations=${routePreference}&geometries=geojson&overview=full`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json()
            })
            .then((data: any) => {
                if (data) {
                    const routeData = {...data[service === 'trip' ? 'trips' : 'routes'][0], points: pointNames}
                    addNewLayer({
                        name: validateName(`Route - ${layerName} (${routePreference})`, layerManager.map(layer => layer.name)),
                        type: 'route-line',
                        colors: {fill: randomHex()},
                        data: [routeData],
                        visible: true
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const handleCursorClick = (info: any) => {
        if (isExpanded('add-points')) {
            handleAddPointClick(info)
        } else if (isSubWidgetActive('analysis', 'measure')) {
            setPopupData(undefined)
        } else if (info.object) {
            setPopupData(info);
        } else {
            setPopupData(undefined)
        }
    };

    const handleDownloadClick = () => {
        const layer = layerManager.find(layer => layer.name === selectedLayerName);
        const data = layer?.data || [];
        const type = layer?.type || 'labelled-scatter'

        downloadCsv(data, type)
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
                    {!isLegendExpanded ? <ListBulletIcon className={'w-6 h-6'}/> : isMounted && getLegendList}
                </button>
            </div>

            {/* Attribute Table */}
            <div className="rounded-lg z-100 absolute bottom-2 left-1/2 transform -translate-x-1/2">
                {isTableExpanded ?
                    <div className="absolute bottom-2 m-2 left-1/2 transform -translate-x-1/2 z-50 max-w-[70vw] max-h-[30vh]
                        overflow-auto grid place-items-center rounded-lg shadow-md hover:shadow-lg transition-shadow bg-base">
                        <div className="flex flex-row">
                            <button
                                onClick={() => setIsTableExpanded(!isTableExpanded)}
                                className={'p-2 w-10 h-10 bg-base'}
                            ><TableIcon className={'w-6 h-6'}/>
                            </button>
                            <select
                                value={selectedLayerName}
                                onChange={(e) => setSelectedLayerName(e.target.value)}
                                className="p-1 m-2 rounded-lg border border-zinc-500 text-stone-500 bg-white"
                            >
                                {layerManager.length > 0 ?
                                    layerManager.map(layer => (
                                        <option key={layer.id} value={layer.name}>
                                            {layer.name}
                                        </option>))
                                    :
                                    <option>
                                        No valid layer(s)
                                    </option>
                                }
                            </select>
                            <button
                                onClick={handleDownloadClick}
                                className={'p-2 w-10 h-10 bg-base'}>
                                <DownloadIcon className={'w-6 h-6'}/>
                            </button>
                        </div>
                        <AttributeTable layer={layerManager.filter(layer => layer.name === selectedLayerName)}/>
                    </div>
                    :
                    <button
                        onClick={() => setIsTableExpanded(!isTableExpanded)}
                        className={'widget-btn btn-collapsed'}
                    ><TableIcon className={'w-6 h-6'}/>
                    </button>

                }
            </div>

            {/* layer manager */}
            <div className="pl-4 pt-4 pb-4 rounded-lg z-100 flex flex-col absolute top-10 left-0">
                <div className="flex items-start relative">
                    <button
                        className={`widget-btn ${layersOpen ? 'btn-expanded' : 'btn-collapsed'}`}
                        title={'Layer Manager'}
                        onClick={() => setLayersOpen(!layersOpen)}
                    >
                        <LayersIcon className={'w-8 h-8'}/>
                    </button>
                    <LayerManagerWidget
                        isOpen={layersOpen
                        }
                    />
                </div>
            </div>

            {/* Widgets Section */}
            <div className="pl-4 pt-4 pb-4 rounded-lg z-100 flex flex-col absolute top-[30%] left-0">
                <div className="flex items-start relative">
                    <WidgetButton id={'upload-data'} label={"Upload Data"} iconType="upload"/>
                    {isExpanded('upload-data') && (
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
                                    {layerManager.length > 0 ?
                                        layerManager.filter((layer: {
                                            type: string;
                                        }) => layer.type === 'labelled-scatter').map(layer => (
                                            <option key={layer.id} value={layer.name}>
                                                {layer.name}
                                            </option>
                                        ))
                                        :
                                        <option>
                                            No valid layer(s)
                                        </option>
                                    }
                                </select>
                            </div>
                            <CSVReader onUpload={setUploadedData}/>
                        </div>
                    )}
                </div>
                <div className="flex items-start relative">
                    <WidgetButton id={'add-points'} label={'Add Points to Map'} iconType="click"/>

                    {isExpanded('add-points') &&
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
                                    {layerManager.length > 0 ?
                                        layerManager.filter(layer => layer.type === 'labelled-scatter').map(layer => (
                                            <option key={layer.id} value={layer.name}>
                                                {layer.name}
                                            </option>
                                        ))
                                        :
                                        <option>
                                            No valid layer(s)
                                        </option>}
                                </select>
                            </div>
                        </div>}
                </div>

                {/* Analysis Section */}
                <div className="button-menu-container">
                    <WidgetButton id={'analysis'} label={'Analysis Tools'} iconType="analysis"/>

                    {isExpanded('analysis') &&
                        (<div className={`menu-popover open`}>
                            <button
                                onClick={() => toggleSubWidget('analysis', 'measure')}
                                title={'Measure Tool'}
                                className={`row-span-1 menu-popover-btn ${isSubWidgetActive('analysis', 'measure') ? 'menu-popover-btn-expanded' : 'menu-popover-btn-collapsed'}`}>
                                <RulerHorizontalIcon className={'w-6 h-6'}/>
                            </button>

                            <button
                                onClick={() => toggleSubWidget('analysis', 'searchRings')}
                                title={'Search Area'}
                                className={`row-span-1 menu-popover-btn ${isSubWidgetActive('analysis', 'searchRings') ? 'menu-popover-btn-expanded' : 'menu-popover-btn-collapsed'}`}>
                                <TargetIcon className={'w-6 h-6'}/>
                            </button>
                            {isSubWidgetActive('analysis', 'searchRings') && (
                                <div className="absolute left-full p-2 bg-white border rounded-lg shadow-md shrink-0">
                                    <label className="ml-2 text-sm text-stone-500">Search Area Tool:</label>
                                    <Separator.Root className="seperator-major"
                                                    decorative/>
                                    <div className="text-stone-500 overflow-y-auto max-h-112 p-2">
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-xs">Input Layer:</p>
                                            <select
                                                value={searchLocationA}
                                                onChange={(e) => setSearchLocationA(e.target.value)}
                                                className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500 text-xs"
                                            >
                                                {layerManager.filter(layer => (layer.type === 'labelled-scatter')).length > 0
                                                    ? layerManager.filter(layer => (layer.type === 'labelled-scatter')).map(layer =>
                                                        <option key={layer.id} value={layer.name}>
                                                            {layer.name}
                                                        </option>
                                                    )
                                                    :
                                                    <option>
                                                        No valid layer(s)
                                                    </option>}
                                            </select>
                                        </div>
                                        <Separator.Root className="seperator-minor"
                                                        decorative/>
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-xs">Comparison Layer:</p>
                                            <select
                                                value={searchLocationB}
                                                onChange={(e) => setSearchLocationB(e.target.value)}
                                                className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500 text-xs"
                                            >
                                                {layerManager.filter(layer => (layer.type === 'labelled-scatter')).length > 0
                                                    ? layerManager.filter(layer => (layer.type === 'labelled-scatter')).map(layer =>
                                                        <option key={layer.id} value={layer.name}>
                                                            {layer.name}
                                                        </option>
                                                    )
                                                    :
                                                    <option>
                                                        No valid layer(s)
                                                    </option>}
                                            </select>
                                        </div>
                                        <Separator.Root className="seperator-minor"
                                                        decorative/>
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-xs">Distance (miles):</p>
                                            <input
                                                type={'number'}
                                                className={"p-2 ml-1 border border-zinc-500 text-xs text-stone-500 rounded-lg h-6 w-16"}
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
                                                title={isRingDisabled ? 'Select distinct layers to run analysis' : 'Run Area Analysis'}
                                                disabled={isRingDisabled}
                                                className={`mt-2 py-2 px-4 text-sm rounded-md font-semibold ${isRingDisabled ?
                                                    ' text-red-700 bg-red hover:bg-red-400' :
                                                    ' text-peach-5 bg-peach-8 hover:bg-peach-7'}`}>
                                                Run Analysis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => toggleSubWidget('analysis', 'routeTool')}
                                title={'Route Planner'}
                                className={`row-span-1 menu-popover-btn ${isSubWidgetActive('analysis', 'routeTool') ? 'menu-popover-btn-expanded' : 'menu-popover-btn-collapsed'}`}>
                                <Share1Icon className={'w-6 h-6'}/>
                            </button>
                            {isSubWidgetActive('analysis', 'routeTool') && (
                                <div className="absolute left-full p-2 bg-white border rounded-lg shadow-md shrink-0">
                                    <label className="ml-2 text-sm text-stone-500">Route Points Tool:</label>
                                    <Separator.Root className="seperator-major"
                                                    decorative/>
                                    <div className="text-stone-500 overflow-y-auto max-h-112 p-2">
                                        <div className="flex flex-row items-center">
                                            <p className="font-bold text-xs">Input Layer:</p>
                                            <select
                                                value={routingLayer}
                                                onChange={(e) => setRoutingLayer(e.target.value)}
                                                className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500 text-xs"
                                            >
                                                {layerManager.filter(layer => (layer.type === 'labelled-scatter')).length > 0
                                                    ? layerManager.filter(layer => (layer.type === 'labelled-scatter')).map(layer =>
                                                        <option key={layer.id} value={layer.name}>
                                                            {layer.name}
                                                        </option>
                                                    )
                                                    :
                                                    <option>
                                                        No valid layer(s)
                                                    </option>}
                                            </select>
                                        </div>
                                        <Separator.Root className="seperator-minor"
                                                        decorative/>
                                        <div className='flex flex-row items-center'>
                                            <p className="font-bold text-xs">Starting Point:</p>
                                            <select
                                                value={routingStart}
                                                onChange={(e) => setRoutingStart(e.target.value)}
                                                className="p-1 m-1 rounded-lg border border-zinc-500 text-stone-500 text-xs"
                                            >
                                                {layerManager.length > 0 ? (
                                                    <>
                                                        {layerManager
                                                            .filter(layer => layer.name === routingLayer && layer.data.length > 0)
                                                            .flatMap(layer =>
                                                                layer.data.map(point =>
                                                                    <option key={`point-${point.id}`}
                                                                            value={point.name}>
                                                                        {point.name}
                                                                    </option>
                                                                )
                                                            )
                                                        }
                                                        {layerManager
                                                            .filter(layer => layer.name === routingLayer && layer.data.length === 0)
                                                            .length > 0 && (
                                                            <option key="no-points" value="" disabled>
                                                                No Points in Selected Layer
                                                            </option>
                                                        )}
                                                        {layerManager
                                                            .filter(layer => layer.name === routingLayer)
                                                            .length === 0 && (
                                                            <option key="no-layer" value="" disabled>
                                                                Select a valid layer first
                                                            </option>
                                                        )}
                                                    </>
                                                ) : (
                                                    <option key="no-data" value="" disabled>
                                                        No data available
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                        <Separator.Root className="seperator-minor"
                                                        decorative/>
                                        <div className="flex flex-row items-center">
                                            <RadioGroup.Root
                                                className="RadioGroupRoot"
                                                value={routePreference}
                                                onValueChange={(value) => setRoutingPreference(value as 'distance' | 'duration')}
                                                aria-label="Routing Preference"
                                            >
                                                {ROUTING_PREFERENCES.map((key) => (
                                                    <div key={key} className="flex items-center">
                                                        <RadioGroup.Item className="RadioGroupItem" value={key}
                                                                         id={`${key}`}>
                                                            <RadioGroup.Indicator className="RadioGroupIndicator"/>
                                                        </RadioGroup.Item>
                                                        <label className="radio-label" htmlFor={`${key}`}>
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                        </label>
                                                    </div>
                                                ))}
                                            </RadioGroup.Root>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => routePoints(routingLayer)}
                                                title={isRoutingDisabled ? 'Select a layer with at least 2 points' : 'Route Selected Points'}
                                                disabled={isRoutingDisabled}
                                                className={`mt-2 py-2 px-4 text-sm rounded-md font-semibold ${isRoutingDisabled ?
                                                    ' text-red-700 bg-red hover:bg-red-400' :
                                                    ' text-peach-5 bg-peach-8 hover:bg-peach-7'}`}>
                                                Route Points
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>)
                    }
                </div>

                <div className="flex items-start relative">
                    <WidgetButton id={'settings'} label={'Basemap Selection'} iconType="settings"/>

                    {isExpanded('settings') && (
                        <div className="absolute left-full ml-2 p-4 bg-white border rounded-lg shadow-md shrink-0">
                            <h3 className="text-sm text-stone-500">
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
                                            <label className="radio-label" htmlFor={`${key}`}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup.Root>
                            </form>
                        </div>
                    )}
                </div>
                {popupData?.object && (
                    <PopUpWindow props={popupData} deckRef={deckRef} handleClose={() => {
                        setPopupData(undefined);
                    }}/>
                )}
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
            <WidgetProvider>
                <MapPageContent/>
            </WidgetProvider>
        </LayerProvider>
    );
}