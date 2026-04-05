export const BASEMAP_LIGHT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
export const BASEMAP_DARK = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
export const BASEMAP_STANDARD = "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json";
export const BASEMAP_HYBRID = "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json";

export const BASEMAP_KEYS = ['light', 'dark', 'standard', 'hybrid'];

export const BASEMAPS = {
  'light': BASEMAP_LIGHT,
  'dark': BASEMAP_DARK,
  'standard': BASEMAP_STANDARD,
  'hybrid': BASEMAP_HYBRID,
};

export const INITIAL_VIEW_STATE = {
    longitude: -79.9915,
    latitude: 40.4419,
    zoom: 10.5,
  };

export const ROUTING_PREFERENCES = ['distance', 'duration'];

export const HEADERS_MAPPING: Record<string,string[]> = {
  'labelled-scatter' : ['Name','Latitude','Longitude','Status'],
  'search-ring': ['Input Name','Input Latitude','Input Longitude','Search Distance'
      ,'Search Results - Layer','Search Results - Name','Search Results - Coordinates','Search Results - Distance'],
  'route-line': ['Route Start Name', 'Route End Name', 'Route Segment Distance', 'Route Segment Duration']
}

export const SLIDE_MAPPING: Record<string, string> = {
  'upload_clean.mp4' : 'Create layers to house your data, and upload points from a spreadsheet.',
  'search_rings_clean.mp4' : 'Add Layers, click to add points on the map, and perform spatial analysis.',
  'routing_clean.mp4' : 'Change your basemap, and route points within a layer.',
  'measure_clean.mp4' : 'Measure distances on the map using the measure tool.'
}