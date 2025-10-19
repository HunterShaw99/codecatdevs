'use client';

import { IconLayer, TextLayer } from '@deck.gl/layers';

export const coffeeBeanSVG = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="none"/>
  <ellipse cx="32" cy="32" rx="20" ry="30" fill="#6f4e37ff" />
  <path d="M32 10 Q36 32 32 54" stroke="#3E2723" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

const svgToDataURL = (svgText : string) => { 
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
};

export type Point = {
  coordinates: [longitude: number, latitude: number];
  name: string,
  address: string,
  note?: string
};

const data = [
  {coordinates: [-80.08607, 40.40769], 
    name: 'Carnegie Coffee Company',
    address: '132 E Main St, Carnegie, PA 15106',
    note: 'Great espresso and cozy atmosphere in an old train station. LGBTQ+ friendly.'},
];

export const coffeeShopLayer = new IconLayer<Point>({
    id: 'IconLayer',
    data: data,
      getIcon: d => ({
    url: svgToDataURL(coffeeBeanSVG),
    width: 24,
    height: 24
  }),
    sizeScale: 10,
    getSize: 2.5,
    getPosition: d => d.coordinates,
    pickable: true
  });
  
        // The labels
export const coffeeShopText = new TextLayer<Point>({
        id: 'text-layer',
        data : data,
        getPosition : d => d.coordinates, 
        getText : d => d.name,
        getColor: [0, 0, 0, 255], // Black color
        outlineWidth: 2,
        outlineColor: [255, 255, 255, 200], // White outline
        getSize: 10, 
        getPixelOffset: [0, -20], // Example: offset text above the icon
        fontSettings: {sdf : true, cutoff: 0.15, smoothing: 0.2}, 
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      });
