'use client';

import { ScatterplotLayer } from '@deck.gl/layers';

const data = [
  {position: [-80.08607, 40.40769], color: [255, 0, 0], radius: 100},
];

const coffeeShopLayer = new ScatterplotLayer({
  data: data,
  getPosition: d => d.position,
  getFillColor: d => d.color,
  getRadius: d => d.radius
});

export default coffeeShopLayer;