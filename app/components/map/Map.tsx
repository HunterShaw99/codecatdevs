'use client';
import React, { useState, useMemo } from 'react';
import DeckGL from "@deck.gl/react";
import { MapViewState } from "@deck.gl/core"
import MapLibre from "react-map-gl/maplibre";
import { MeasureDistanceMode, ViewMode } from '@deck.gl-community/editable-layers';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAtom, useAtomValue } from 'jotai';

import { BASEMAPS } from '@/app/constants';
import { LabelledLayer, measureLayer, RouteLineLayer, SearchRingLayer, LocationLayer } from "@components/map/layers";
import { BaseLayerData } from "@components/map/utils/LayerTypes";
import { refAtom, popUpAtom } from '@/app/atoms';
import { PopUpWindow } from "@components/map/popup/PopUp";
import { MjolnirEvent } from 'mjolnir.js';

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
    userLocation?: { latitude: number; longitude: number } | null;
    isSubWidgetActive: (widget: string, subWidget: string) => boolean;
    isExpanded: (widget: string) => boolean;
    handleAddPointClick: (event: any) => void;
    onMapClick: (info: any) => void;
}

const Map = (
    (
        {
            baseMap,
            layerManager,
            userLocation,
            isSubWidgetActive,
            isExpanded,
            handleAddPointClick,
            onMapClick,
        }: MapProps
    ) => {
    const deckRef = useAtomValue(refAtom)
    const [popupData, setPopupData] = useAtom(popUpAtom)

     const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
    const handleViewStateChange = ({viewState} : {viewState : MapViewState}) => {
        setViewState(viewState as any);
        setPopupData(undefined);
    };

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
        const locationLayers = userLocation ? [new LocationLayer({
            id: 'user-location',
            data: [userLocation] as any,
            color: '#FF0000'
        })] : []

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
    }, [layerManager, userLocation, isSubWidgetActive]);

        const handleCursorClick = (info: any, event : any ) => {

            if (event.srcEvent.target && event.srcEvent.target.id !== 'view-default-view') {
                return;
            }
            else if (isExpanded('add-points')) {
                handleAddPointClick(info)
            } else if (isSubWidgetActive('analysis', 'measure')) {
                setPopupData(undefined)
            } else if (info.object) {
                setPopupData(info);
            } else {
                setPopupData(undefined)
            }
        };

        return (
            <DeckGL
                id='basemap'
                ref={deckRef}
                initialViewState={viewState}
                onViewStateChange={handleViewStateChange as any}
                controller={{
                    doubleClickZoom: false,
                    inertia: false
                }}
                onClick={(info, event) => handleCursorClick(info, event)}
                layers={layers}
            >
            {popupData && popupData.object && (
                <PopUpWindow
                    props={popupData}
                    deckRef={deckRef}
                    handleClose={() => {
                    setPopupData(undefined);
                    }}
                />
                )}
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
