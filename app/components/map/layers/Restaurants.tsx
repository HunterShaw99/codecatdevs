'use client';

import {IconLayer, TextLayer, ScatterplotLayer} from '@deck.gl/layers';
import {Point} from './CoffeeShops';

export const forkSVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    width="800px" height="800px" viewBox="0 0 512 512"  xml:space="preserve">
    <g>
        <path class="st0" d="M50.57,55.239C27.758,29.036-13.992,53.833,4.68,95.145c12.438,27.563,36.469,94.922,70.016,143.438
        c33.563,48.516,69.328,43.328,105.453,55.078l25.953,13.422l177.547,204.204l35.906-31.234l0.188-0.156
        c-5.25-6.047-166.719-191.782-230.563-265.204C125.992,142.02,61.664,68.004,50.57,55.239z"/>
        <path class="st0" d="M476.664,93.551l-61.938,71.266c-3.969,4.563-10.859,5.031-15.422,1.063l-2.203-1.906
        c-4.531-3.953-5.031-10.844-1.063-15.406l62.234-71.594c10.219-11.734,5.375-22.125-2.219-28.719
        c-7.578-6.578-18.531-9.938-28.75,1.813l-62.234,71.594c-3.953,4.547-10.859,5.031-15.406,1.063l-2.188-1.906
        c-4.563-3.953-5.047-10.859-1.094-15.406l61.953-71.266c18.297-21.031-12.297-46.375-30.156-25.828
        c-21.391,24.594-59.156,68.031-59.156,68.031c-33,37.688-32.5,55.344-27.844,80.078c3.781,19.938,9.328,34.281-11.156,57.844
        l-30.234,34.781l31.719,36.453l34.641-39.844c20.469-23.547,35.453-20.047,55.719-19.094c25.156,1.203,42.703-0.766,75.422-38.672
        c0,0,37.766-43.469,59.156-68.063C524.305,99.286,494.945,72.536,476.664,93.551z"/>
        <polygon class="st0" points="185.758,322.692 49.102,479.88 85.211,511.286 219.055,357.348 191.508,325.661 \t"/>
    </g>
</svg>`;

const svgToDataURL = (svgText: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
};

const iconMapping = {
    url: svgToDataURL(forkSVG),
    width: 128,
    height: 128
};

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
        note: 'Great for take-out. Never pass up the rangoons, and their mongolian beef is top-notch.'
      },
    {
        coordinates: [-79.92054662011216, 40.43789194531048],
        name: 'Ramen Bar',
        address: '5860 Forbes Ave, Pittsburgh, PA 15217',
        note: 'Modern Japanese eatery for specialty noodle soups, and the best ramen in the city.'
    },
    {
        coordinates: [-79.76159257709517, 40.43954953514341],
        name: 'Moio\'s Italian Pastry Shop',
        address: '4209 William Penn Hwy, Monroeville, PA 15146',
        note: 'Local Italian pastry shop that serves up every wonderful Italian pastry you could think of.'
    },
];

// Add proxy layer for better hover detection
export const restaurantProxyLayer = new ScatterplotLayer<Point>({
  id: 'restaurant-proxy',
  data: data,
  pickable: true,
  opacity: 0,
  stroked: false,
  filled: true,
  radiusScale: 6,
  radiusMinPixels: 12,
  radiusMaxPixels: 18,
  getPosition: d => d.coordinates,
  getFillColor: [0, 0, 0, 0],  // transparent
});

// Update existing restaurant layer to not be pickable
export const restaurantLayer = new IconLayer<Point>({
    id: 'restaurantLayer',
    data: data,
    getIcon: d => iconMapping,
    sizeScale: 10,
    getSize: 2.5,
    getPosition: d => d.coordinates,
    pickable: false  // changed to false since proxy handles picking
});

export const restaurantText = new TextLayer<Point>({
        id: 'restaurantText',
        data : data,
        getPosition : d => d.coordinates, 
        getText : d => d.name,
        getColor: [0, 0, 0, 255],
        outlineWidth: 2,
        outlineColor: [255, 255, 255, 200],
        getSize: 10, 
        getPixelOffset: [0, -20],
        fontSettings: {sdf : true, cutoff: 0.15, smoothing: 0.5},
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      });

// Export layers in correct render order
export const restaurantLayers = [
  restaurantProxyLayer,
  restaurantLayer,
  restaurantText
];
