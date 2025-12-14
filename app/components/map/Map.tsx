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
    const [isMapInteracting, setIsMapInteracting] = useState(false);
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const workerRef = useRef<Worker | null>(null);
    if (typeof window !== 'undefined' && !workerRef.current && window.Worker) {
        try {
            workerRef.current = new Worker(
                new URL("workers/hiddenPointNamesWorker.ts", import.meta.url),
                { type: "module" }
            );
        } catch (err) {
            console.error('Failed to create worker:', err);
            setError('Failed to initialize map features. Please refresh the page.');
        }
    }

    const debouncedUpdateHiddenPoints = useCallback(debounce((zoomLevel: number) => {
        if (!workerRef.current || zoomLevel === undefined) return;

        try {
            workerRef.current.postMessage({
                command: 'getHiddenPointNames',
                dataArray,
                zoomLevel
            });
        } catch (err) {
            console.error('Error sending message to worker:', err);
            setError('Failed to process map data. Please refresh the page.');
        }
    }, 300), [dataArray]);

    useEffect(() => {
        const currentWorker = workerRef.current;
        if (!currentWorker) return;

        const onMessage = (event: MessageEvent) => {
            try {
                if (event && event.data && event.data.result) {
                    setHiddenPointNames(new Set(event.data.result.hiddenNames));
                    setCluster(event.data.result.clusters);
                }
            } catch (err) {
                console.error('Error processing worker message:', err);
                setError('Failed to process map data. Please refresh the page.');
                setHiddenPointNames(new Set());
                setCluster(null);
            }
        };

        const onError = (error: ErrorEvent) => {
            console.error('Worker error:', error);
            setError('Map processing encountered an error. Please refresh the page.');
            workerRef.current?.terminate();
            workerRef.current = null;
        };

        currentWorker.addEventListener('message', onMessage);
        currentWorker.addEventListener('error', onError);

        return () => {
            if (currentWorker) {
                currentWorker.removeEventListener('message', onMessage);
                currentWorker.removeEventListener('error', onError);
                currentWorker.terminate();
            }
        };
    }, []);

    useEffect(() => {
        const currentWorker = workerRef.current;
        if (!viewState.zoom || !currentWorker) return;

        try {
            debouncedUpdateHiddenPoints(viewState.zoom);
        } catch (err) {
            console.error('Error updating hidden points:', err);
            setError('Failed to update map data. Please refresh the page.');
        }
    }, [viewState.zoom, debouncedUpdateHiddenPoints]);

    useEffect(() => {
    return () => {
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
    };
}, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setTooltipHtml(null);
            setPrevHoveredObject(null);
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    const visiblePoints = useMemo(
        () => dataArray?.filter(point => !hiddenPointNames.has(point.name)) || [],
        [dataArray, hiddenPointNames]
    );

    const iconLayer = createIconLayer(visiblePoints, viewState);
    const clusterLayer = createClusteredLayer(cluster, iconAtlas);

    const layers = [clusterLayer, iconLayer];

    // @ts-ignore
    const onViewStateChange = useCallback(({viewState, interactionState}) => {
    try {
        // Validate and clamp coordinates to bounds
        const validatedViewState = {
            ...viewState,
            longitude: Math.max(Math.min(viewState.longitude || 0, bounds[1][0]), bounds[0][0]),
            latitude: Math.max(Math.min(viewState.latitude || 0, bounds[1][1]), bounds[0][1]),
        };

        // Check if we're currently interacting
        const isInteracting = !!interactionState.isPanning || !!interactionState.isZooming;
        console.log('isPanning:', !!interactionState.isPanning, 'is zooming', !!interactionState.isZooming);

        if (isInteracting) {
            setIsMapInteracting(true);
            // Clear any existing timeout
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
            // Set a new timeout to reset the state after 200ms of inactivity
            interactionTimeoutRef.current = setTimeout(() => {
                setIsMapInteracting(false);
            }, 200);
        } else {
            // If no interactions, make sure we're not interacting
            setIsMapInteracting(false);
        }

        return validatedViewState;
    } catch (err) {
        console.error('Error in view state change:', err);
        // Return current view state if validation fails
        return { ...viewState };
    }
}, []);

    const buildTooltipHtml = useCallback((object: Point | ClusterObject) => {
        try {
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
                            {object.point_count || 0} Locations
                        </div>
                        <div style={{...textStyle, fontSize: 12, color: 'var(--ctp-subtext0)'}}>
                            Zoom in to see individual locations.
                        </div>
                    </div>
                );
            }

            if ('name' in object) {
                return (
                    <div style={baseStyle}>
                        <div style={{...textStyle, fontSize: 13, fontWeight: 600}}>
                            {object.name || 'Unknown Location'}
                        </div>
                        <div style={{...textStyle, fontSize: 12, color: 'var(--ctp-subtext0)'}}>
                            {object.address || 'No address available'}
                        </div>
                        <div style={{...textStyle, fontSize: 10, color: 'var(--ctp-subtext0)'}}>
                            {object.note || ''}
                        </div>
                    </div>
                );
            }

            return null;
        } catch (err) {
            console.error('Error building tooltip:', err);
            return null;
        }
    }, []);

    const handleHover = useCallback(({object}: PickingInfo<Point>) => {
        if (isMapInteracting) {
            setTooltipHtml(null);
            setPrevHoveredObject(null);
            return;
        }

        try {
            if (object && JSON.stringify(object) !== JSON.stringify(prevHoveredObject)) {
                const html = buildTooltipHtml(object);
                setTooltipHtml(html);
                setPrevHoveredObject(object);
            } else if (!object) {
                setTooltipHtml(null);
                setPrevHoveredObject(null);
            }
        } catch (err) {
            console.error('Error handling hover:', err);
            setTooltipHtml(null);
        }
    }, [prevHoveredObject, buildTooltipHtml, isMapInteracting]);

    // Reset tooltip when interaction ends
    useEffect(() => {
        if (isMapInteracting) {
            const timer = setTimeout(() => {
                handleHover({object: null});
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isMapInteracting, handleHover]);

    if (error) {
        return (
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(128,128,128,0.4),0_0_50px_rgba(128,128,128,0.2)]">
                <div className="p-4 text-red-600 bg-red-50 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (isLoading && !dataArray) {
        return (
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(128,128,128,0.4),0_0_50px_rgba(128,128,128,0.2)]">
                <div className="flex items-center justify-center h-full">
                    Loading map data...
                </div>
            </div>
        );
    }

    return (
        <div
            id="map-container"
            className="relative h-96 w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(128,128,128,0.4),0_0_50px_rgba(128,128,128,0.2)]"
        >
            {error && (
                <div className="absolute top-3 right-3 z-50 p-2 text-red-600 bg-red-50 rounded">
                    {error}
                </div>
            )}

            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={{inertia: false}}
                layers={layers}
                onViewStateChange={onViewStateChange}
                onHover={handleHover}
                getTooltip={({object}) => {
                    if (isMapInteracting) return null;
                    return buildTooltipHtml(object);
                }}
            >
                <Map
                    attributionControl={false}
                    maxPitch={0}
                    minZoom={8}
                    maxZoom={15}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    reuseMaps
                    onError={(e) => {
                        console.error('Map error:', e);
                        setError('Failed to load map. Please refresh the page.');
                    }}
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