import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createRef } from 'react';
import { BaseLayerData } from "@map/utils/LayerTypes";
import { PickingInfo } from '@deck.gl/core';

export const refAtom = atom(createRef<any>());

/**
 * Persistent atom for storing all layers
 * Automatically syncs with localStorage, no versioning needed
 */
export const layersAtom = atomWithStorage<BaseLayerData[]>(
  'codecat-layers',
  [{
    id: `${Date.now().toString(16)}${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
    name: 'Default',
    type: 'labelled-scatter',
    colors: { fill: '#' + Math.floor(Math.random()*16777215).toString(16) },
    visible: true,
    data: []
  }]
);

/**
 * Persistent atom for storing photo file data in localStorage
 * Stores base64-encoded image data keyed by photo ID to avoid quota issues with layersAtom
 */
export const photosAtom = atomWithStorage<Record<string, string>>(
  'codecat-photos',
  {}
);

/**
 * Non-persisted atom for storing user's current location
 * This is not saved to localStorage and is cleared on page reload
 */
export const userLocationAtom = atom<{
  latitude: number;
  longitude: number;
} | null>(null);

/**
 * Non-persisted atom for pop-up controls
 */
export const popUpAtom = atom<PickingInfo<BaseLayerData> | undefined>(undefined);