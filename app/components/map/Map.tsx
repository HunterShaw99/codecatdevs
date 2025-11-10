'use client';

import { useCallback, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { PickingInfo } from '@deck.gl/core';
import Map, { useControl } from 'react-map-gl/maplibre';
import { AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import dataArray from '@map/data/data';
import type { ClusterObject, Point, } from '@map/utils/LayerSettings';
import {
  createIconLayer, 
  createTextLayer, 
  createClusteredLayer,
  createProxyLayer } from '@map/utils/LayerSettings';

const iconAtlas = '/location-icon-atlas.png';

const MAP_CONSTRAINTS = {
  LONGITUDE: { MIN: -80.1, MAX: -79.76 },
  LATITUDE: { MIN: 40.3, MAX: 40.5 },
  ZOOM: { MIN: 10, MAX: 15 }
} as const;

const INITIAL_VIEW_STATE = {
  longitude: -79.9915,
  latitude: 40.4419,
  zoom: 11,
} as const;

type CustomAttributionProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const CustomAttribution = ({ position = 'bottom-right' }: CustomAttributionProps) => {
  useControl(() => new AttributionControl(), { position });
  return null;
};

const CardMap = () => {
  const [tooltipHtml, setTooltipHtml] = useState<any | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  // Define layers
  const proxyLayer = createProxyLayer(dataArray, viewState);
  const textLayer = createTextLayer(dataArray, viewState);
  const iconLayer = createIconLayer(dataArray, viewState);
  const clusterLayer = createClusteredLayer(dataArray, iconAtlas, viewState);

  const layers = [clusterLayer, proxyLayer, iconLayer, textLayer];

  const onViewStateChange = useCallback(({ viewState }: { viewState: any }) => {
    const newViewState = {
      ...viewState,
      longitude: Math.max(
        MAP_CONSTRAINTS.LONGITUDE.MIN,
        Math.min(MAP_CONSTRAINTS.LONGITUDE.MAX, viewState.longitude)
      ),
      latitude: Math.max(
        MAP_CONSTRAINTS.LATITUDE.MIN,
        Math.min(MAP_CONSTRAINTS.LATITUDE.MAX, viewState.latitude)
      ),
      zoom: Math.max(
        MAP_CONSTRAINTS.ZOOM.MIN,
        Math.min(MAP_CONSTRAINTS.ZOOM.MAX, viewState.zoom)
      )
    };
    setViewState(newViewState); // Store current view state
    return newViewState;
  }, []);

  const buildTooltipHtml = useCallback((object: Point | ClusterObject) => {
    if (!object) return null;

    if ('cluster' in object && object.cluster) {
      return (
        <div
          style={{
            boxSizing: 'border-box',
            maxWidth: 240,
            maxHeight: 160,
            overflow: 'auto',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '8px 12px'
          }}
        >
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            margin: '0 0 6px 0',
            color: 'var(--ctp-text)'
          }}>
            {object.point_count} Locations
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--ctp-subtext0, rgba(255,255,255,0.8))',
            margin: 0
          }}>
            Zoom in to see individual locations.
          </div>
        </div>
      );
    }

    if ('name' in object) {
      return (
        <div
          style={{
            boxSizing: 'border-box',
            maxWidth: 240,
            maxHeight: 160,
            overflow: 'auto',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '8px 12px'
          }}
        >
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            margin: '0 0 6px 0',
            color: 'var(--ctp-text)'
          }}>
            {object.name}
          </div>
          <div style={{
            fontSize: 12,
            color: 'var(--ctp-subtext0, rgba(255,255,255,0.8))',
            margin: 0
          }}>
            {object.address}
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--ctp-subtext0, rgba(255,255,255,0.8))',
            margin: 0
          }}>
            {object.note}
          </div>
        </div>
      );
    }
  }, []);

  const handleHover = useCallback(({ object }: PickingInfo<Point>) => {
    if (object) {
      setTooltipHtml(buildTooltipHtml(object));
    } else {
      setTooltipHtml(null);
    }
  }, [buildTooltipHtml]);

    return (
    <div
      id="map-container"
      className="relative h-96 w-full rounded-lg overflow-hidden shadow-[0_0_30px_rgba(128,128,128,0.4),0_0_50px_rgba(128,128,128,0.2)]"
    >
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        onViewStateChange={onViewStateChange}
        onHover={handleHover}
      >
        <Map
          attributionControl={false}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          reuseMaps
        >
          <CustomAttribution />
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