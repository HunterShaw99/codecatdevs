'use client';

import { IconLayer, TextLayer } from '@deck.gl/layers';
import {coffeeBeanSVG, Point} from './CoffeeShops';

export const forkSVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128" viewBox="0 0 128 128" version="1.1" xml:space="preserve" style="fill-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <use xlink:href="#_Image1" x="0" y="0" width="128px" height="128px"/>
    <defs>
        <image id="_Image1" width="128px" height="128px" xlink:href="data:image/png;base64,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"/>
    </defs>
</svg>`;

const svgToDataURL = (svgText : string) => {
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

export const restaurantLayer = new IconLayer<Point>({
    id: 'restaurantLayer',
    data: data,
    getIcon: d => iconMapping,
    sizeScale: 10,
    getSize: 2.5,
    getPosition: d => d.coordinates,
    pickable: true
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
