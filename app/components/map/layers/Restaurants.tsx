'use client';

import { IconLayer, TextLayer } from '@deck.gl/layers';
import { Point } from './CoffeeShops';

export const forkSVG = `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
  <!-- handle -->
  <rect x="28" y="22" width="8" height="30" rx="3" fill="#374151"/>
  <!-- neck -->
  <rect x="26" y="12" width="12" height="12" rx="2" fill="#374151"/>
  <!-- tines -->
  <g fill="#374151">
    <rect x="22" y="2" width="4" height="14" rx="1.5"/>
    <rect x="30" y="2" width="4" height="14" rx="1.5"/>
    <rect x="38" y="2" width="4" height="14" rx="1.5"/>
  </g>
  <!-- subtle inner highlight (lighter) -->
  <g fill="#6b7280" opacity="0.12">
    <rect x="29" y="25" width="6" height="26" rx="2"/>
    <rect x="27" y="14" width="8" height="8" rx="1.5"/>
  </g>
</svg>`;

const data = [
  {coordinates: [-80.094093258995, 40.402388073253526], 
    name: 'Seoul Korean BBQ',
    address: '525 W Main St, Carnegie, PA 15106',
    note: 'Fantastic Bulgogi & Bibimbap. Do NOT order a spice level 10! Worth it to call ahead and reserve a time.'},
  {coordinates: [-79.95879014711548, 40.47303132276768],
    name: 'La Gourmandine Lawrenceville',
    address: '4605 Butler St, Pittsburgh, PA 15201',
    note: 'Yummy French pastries and coffee. Great stop after a session at Iron City Boulder, or for a snack before hitting the lanes at Arsenal Bowl.'
  },
  {coordinates: [-80.06686702883584, 40.392060028967464],
    name: 'Red Tea House',
    address: '1717 Cochran Rd, Pittsburgh, PA 15220',
    note: 'Great for take-out. Never pass up the rangoons, and their mongolian beef is top-notch.'}
];

export const restaurantLayer = new IconLayer<{Point}>({
    id: 'IconLayer',
    data: data,
      getIcon: d => ({
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(forkSVG)}`,
    width: 24,
    height: 24
  }),
    sizeScale: 10,
    getSize: 2.5,
    getPosition: d => d.coordinates,
    pickable: true
  });
  
        // The labels
export const restaurantText = new TextLayer<Point>({
        id: 'text-layer',
        data : data,
        getPosition : d => d.coordinates, 
        getText : d => d.name,
        getColor: [0, 0, 0, 255], // Black color
        outlineWidth: 2,
        outlineColor: [255, 255, 255, 200], // White outlines
        getSize: 10, 
        getPixelOffset: [0, -20], // Example: offset text above the icon
        fontSettings: {sdf : true, cutoff: 0.15, smoothing: 0.2}, 
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      });
