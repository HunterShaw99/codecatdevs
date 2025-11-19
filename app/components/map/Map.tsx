'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import DeckGL from '@deck.gl/react';
import {PickingInfo} from '@deck.gl/core';
import Map, {useControl} from 'react-map-gl/maplibre';
import {AttributionControl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import dataArray from '@map/data/data';
import type {ClusterObject, Point} from '@map/utils/LayerTypes';
import {createClusteredLayer} from '@map/layers/clusterLayer';
import {createIconLayer} from '@map/layers/iconLayer';
import {debounce} from "lodash";

const iconAtlas = '/location-icon-atlas.png';

const bounds = [
    [-80.1, 40.3],
    [-79.8, 40.6]
];

const INITIAL_VIEW_STATE = {
    longitude: -79.9915,
    latitude: 40.4419,
    zoom: 11,
} as const;

type CustomAttributionProps = {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const CustomAttribution = ({position = 'bottom-right'}: CustomAttributionProps) => {
    useControl(() => new AttributionControl(), {position});
    return null;
};

const CardMap = () => {
    const [tooltipHtml, setTooltipHtml] = useState<any | null>(null);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [cluster, setCluster] = useState<any>(null);
    const [hiddenPointNames, setHiddenPointNames] = useState<Set<string>>(new Set());
    const [prevHoveredObject, setPrevHoveredObject] = useState<any>(null);

    const workerRef = useRef<Worker | null>(null);
    if (typeof window !== 'undefined' && !workerRef.current && window.Worker) {
        workerRef.current = new Worker(
            new URL("workers/hiddenPointNamesWorker.ts", import.meta.url),
            { type: "module" }
        );
    }

    const debouncedUpdateHiddenPoints = useCallback(debounce((zoomLevel: number) => {
        if (workerRef.current) {
            workerRef.current.postMessage({ command: 'getHiddenPointNames', dataArray, zoomLevel });
        }
    }, 0), []);

    useEffect(() => {
        const currentWorker = workerRef.current;

        if (!currentWorker) return;

        const onMessage = (event: MessageEvent) => {
            if (event) {
                setHiddenPointNames(new Set(event.data.result.hiddenNames));
                setCluster(event.data.result.clusters)
            }
        };

        currentWorker.addEventListener('message', onMessage);

        return () => {
            if (currentWorker) {
                currentWorker.removeEventListener('message', onMessage);
                currentWorker.terminate();
            }
        };
    }, []);

    useEffect(() => {
        const currentWorker = workerRef.current;
        if (viewState.zoom && currentWorker) {
            debouncedUpdateHiddenPoints(viewState.zoom);
        }
    }, [viewState.zoom, debouncedUpdateHiddenPoints]);

    const visiblePoints = useMemo(
        () => dataArray.filter(point => !hiddenPointNames.has(point.name)),
        [dataArray, hiddenPointNames]
    );

    const iconLayer = createIconLayer(visiblePoints, viewState);
    const clusterLayer = createClusteredLayer(cluster, iconAtlas);

    const layers = [clusterLayer, iconLayer];

    const onViewStateChange = ({viewState}: { viewState: any }) => {
        const newViewState = {
            ...viewState,
            longitude: Math.max(Math.min(viewState.longitude, bounds[1][0]), bounds[0][0]),
            latitude: Math.max(Math.min(viewState.latitude, bounds[1][1]), bounds[0][1]),
        };
        setViewState(newViewState);
        return newViewState;
    };

    const buildTooltipHtml = useCallback((object: Point | ClusterObject) => {
        if (!object) return null;

        const baseStyle = {
            boxSizing: 'border-box',
            maxWidth: 240,
            padding: '8px 12px',
            borderRadius: 8,
            backgroundColor: 'var(--ctp-mantle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            color: 'var(--ctp-text)'
        };

        const textStyle = {
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        };

        if ('cluster' in object && object.cluster) {
            return (
                <div style={baseStyle}>
                    <div style={{...textStyle, fontSize: 13, fontWeight: 600}}>
                        {object.point_count} Locations
                    </div>
                    <div style={{...textStyle, fontSize: 12, color: 'var(--ctp-subtext0)'}}>
                        Zoom in to see individual locations.
                    </div>
                </div>
            );
        }

        if ('name' in object) {
            console.log('inside of buildTooltipHtml name', object);
            return (
                <div style={baseStyle}>
                    <div style={{...textStyle, fontSize: 13, fontWeight: 600}}>
                        {object.name}
                    </div>
                    <div style={{...textStyle, fontSize: 12, color: 'var(--ctp-subtext0)'}}>
                        {object.address}
                    </div>
                    <div style={{...textStyle, fontSize: 10, color: 'var(--ctp-subtext0)'}}>
                        {object.note}
                    </div>
                </div>
            );
        }
    }, []);

    const handleHover = useCallback(({object}: PickingInfo<Point>) => {
        if (object && JSON.stringify(object) !== JSON.stringify(prevHoveredObject)) {
            setTooltipHtml(buildTooltipHtml(object));
            setPrevHoveredObject(object);
        } else if (!object) {
            setTooltipHtml(null);
            setPrevHoveredObject(null);
        }
    }, [prevHoveredObject, buildTooltipHtml]);

    return (
        <div
            id="map-container"
            className="relative h-96 w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(128,128,128,0.4),0_0_50px_rgba(128,128,128,0.2)]"
        >
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={{inertia: false}}
                layers={layers}
                onViewStateChange={onViewStateChange}
                onHover={handleHover}
            >
                <Map
                    attributionControl={false}
                    maxPitch={0}
                    minZoom={8}
                    maxZoom={15}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    reuseMaps
                >
                    <CustomAttribution/>
                </Map>
            </DeckGL>

            <div
                className="absolute top-3 right-3 z-50"
                style={{
                    pointerEvents: 'none',
                    maxWidth: 240,
                    maxHeight: 160,
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    borderRadius: 8,
                    border: '1px solid var(--ctp-surface0)',
                    background: 'var(--ctp-mantle)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    padding: 0,
                }}>
                {tooltipHtml}
            </div>
        </div>
    );
};

export default CardMap;
