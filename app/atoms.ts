import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createRef } from 'react';
import { BaseLayerData } from "@map/utils/LayerTypes";

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
 * Persistent atom for storing photos/files
 * Stores file metadata and base64 encoded file content
 */
export const photosAtom = atomWithStorage<Array<{
  id: string;
  featureId: string;
  file: string; // base64 encoded file content
  filename: string;
  timestamp: string;
}>>(
  'codecat-photos',
  []
);