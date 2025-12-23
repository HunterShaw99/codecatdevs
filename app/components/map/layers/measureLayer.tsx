import {
    EditableGeoJsonLayer,
    FeatureCollection
} from '@deck.gl-community/editable-layers';
import { useState } from 'react';

export const measureLayer = (features: FeatureCollection, mode: any) => {
    const [measurementFeatures, setMeasurementFeatures] = useState<FeatureCollection>(features)

    return new EditableGeoJsonLayer({
        id: 'measure-layer',
        data: measurementFeatures,
        mode,
        // options for actual measurement - see turf/distance docs
        modeConfig: {
            centerTooltipsOnLine: true,
            turfOptions: { units: 'miles' }
        },
        // color of line and points - see editable-geojson-layer docs
        getTentativeLineColor: [250, 179, 135, 200],
        getEditHandlePointColor: [250, 179, 135, 255],
        getEditHandlePointOutlineColor: [250, 179, 135, 200],
        // color and style of tooltips
        _subLayerProps: {
            tooltips: {
                getColor: [30, 30, 46],
                sizeScale: 1.2,
                sizeMinPixels: 12,
                sizeMaxPixels: 18,
                getSize: 16,
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontWeight: 750,
                fontSettings: { sdf: true },
                outlineColor: [255, 255, 255, 200],
                outlineWidth: 3,
            }
        },
        // allows for double click to retain drawn features
        onEdit: ({ updatedData }) => {
            setMeasurementFeatures(updatedData);
        },
    })
};

export default measureLayer;