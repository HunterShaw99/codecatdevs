'use client';
import React, { useRef, useMemo } from 'react';
import DeckGL from "@deck.gl/react";
import MapLibre from "react-map-gl/maplibre";
import { MeasureDistanceMode, ViewMode } from '@deck.gl-community/editable-layers';
import { PickingInfo } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAtomValue } from 'jotai';

import { BASEMAPS } from '@/app/constants';
import { LabelledLayer, measureLayer, RouteLineLayer, SearchRingLayer, LocationLayer } from "@components/map/layers";
import { BaseLayerData } from "@components/map/utils/LayerTypes";
import { refAtom } from '@/app/atoms';

const INITIAL_VIEW_STATE = {
        longitude: -79.9915,
        latitude: 40.4419,
        zoom: 10.5,
        maxZoom: 17,
        minZoom: 5
    } as const;

interface MapProps {
    baseMap: 'light' | 'dark' | 'standard' | 'hybrid';
    layerManager: BaseLayerData[];
    isSubWidgetActive: (widget: string, subWidget: string) => boolean;
    isExpanded: (widget: string) => boolean;
    popupData: PickingInfo<BaseLayerData> | undefined;
    setPopupData: (data: PickingInfo<BaseLayerData> | undefined) => void;
    handleAddPointClick: (event: any) => void;
    onMapClick: (info: any) => void;
}

const Map = (
    (
        {
            baseMap,
            layerManager,
            isSubWidgetActive,
            isExpanded,
            popupData,
            setPopupData,
            handleAddPointClick,
            onMapClick,
        }: MapProps
    ) => {
    const deckRef = useAtomValue(refAtom)

    const measurementLayer = measureLayer({
        type: 'FeatureCollection',
        features: []
    }, isSubWidgetActive('analysis', 'measure') ? MeasureDistanceMode : ViewMode);

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
        const locationLayers = visible.filter(l => l.type === 'user-location').map(l => [new LocationLayer({
            id: l.id,
            data: l.data as any,
            color: l.colors.fill
        })])

        type AllLayerTypes = RouteLineLayer | SearchRingLayer | LabelledLayer | any;

        const allLayers: AllLayerTypes[] = [
            ...routeLayers,
            ...searchLayers,
            ...labelledLayers,
            ...locationLayers
        ];

        if (isSubWidgetActive('analysis', 'measure')) {
            allLayers.push(measurementLayer);
        }

        return allLayers;
    }, [layerManager, isSubWidgetActive]);

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
            onMapClick(info);
        };

        return (
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
                <MapLibre
                    maxPitch={0}
                    minZoom={INITIAL_VIEW_STATE.minZoom}
                    maxZoom={INITIAL_VIEW_STATE.maxZoom}
                    mapStyle={BASEMAPS[baseMap]}
                    reuseMaps
                >
                </MapLibre>
            </DeckGL>
        );
    }
);

export default Map;
