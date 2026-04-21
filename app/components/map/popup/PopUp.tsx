import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useMemo, useState, useRef, useEffect } from 'react';
import { useLayerContext } from "@/app/context/layerContext";
import { AddPhotoButton } from "@/app/components/map/popup/imageHandling";
import { NearestLayer } from "@/app/components/NearestLayer";
import { ChangeEvent } from "react";
import { distance, point, featureCollection, nearestPoint } from "@turf/turf";

export const getPopUpValues = (props: any) => {
    let name, lat, long;

    if (props.layer.constructor.layerName === 'LabelledLayer') {
        name = props.object.name;
        lat = props.object.latitude;
        long = props.object.longitude;
    } else if (props.layer.constructor.layerName === 'SearchRingLayer') {
        name = props.object.originName;
        [long, lat] = props.object.originCoords;
    } else if (props.layer.constructor.layerName === 'RouteLineLayer') {
        name = props.object.points[0];
        [long, lat] = [0, 0];
    }
    else if (props.layer.constructor.layerName === 'LocationLayer') {
        name = 'user'
        lat = props.object.latitude;
        long = props.object.longitude;
    }

    return [name, lat, long];
}

const getPopUpHeader = (layerType: any, props?: any) => {

    if (layerType === 'LabelledLayer') {
        return 'Point Details';
    } else if (layerType === 'SearchRingLayer') {
        return 'Search Area Results';
    } else if (layerType === 'RouteLineLayer') {
        return 'Route Information';
    } else if (layerType === 'LocationLayer') {
        return `User Location: ${props.object.latitude.toFixed(3)}, ${props.object.longitude.toFixed(3)}`
    } else {
        return 'Layer Details';
    }
}

const getPopUpContent = (layerType: string, props: any, nearestLayerProps?: any) => {
    const [name, lat, long] = getPopUpValues(props);

    if (layerType === 'LabelledLayer') {
        return (
            <div>
                <AddPhotoButton layerId={props.layer.id} featureId={props.object.id as string} />
                <p><span className="font-bold">Name:</span> {name}</p>
                <p><span className="font-bold">Coordinates:</span> {lat.toFixed(3)}, {long.toFixed(3)}</p>
            </div>
        );
    } else if (layerType === 'SearchRingLayer') {
        return (
            <div>
                <p><span className="font-bold">Origin Point Name:</span> {name}</p>
                <p><span className="font-bold">Coordinates:</span> {lat.toFixed(3)}, {long.toFixed(3)}</p>
                <p><span className="font-bold">Search Distance:</span> {props.object.searchedDistance} miles</p>
                <p><span
                    className="font-bold">{props.object.compareLayer} Points Within Area:</span> {props.object.compareResults.length}
                </p>
            </div>
        );
    } else if (layerType === 'RouteLineLayer') {
        return (
            <div>
                <p><span className="font-bold">Starting Point:</span> {name}</p>
                <p><span
                    className="font-bold">Total Distance:</span> {(props.object.distance / 1606.34).toFixed(2)} miles
                </p>
                <p><span className="font-bold">Total Duration:</span> {Math.ceil((props.object.duration / 60))} minutes
                </p>
            </div>
        );
    } else if (layerType === 'LocationLayer' && nearestLayerProps) {
        return (
            <NearestLayer {...nearestLayerProps} />
        );
    }
    else {
        return (
            <div>
                {Object.entries(props.object.properties).map(([key, value] : [string, any]) => (
                    <p key={key}><span className="font-bold">{key}:</span> {value}</p>
                ))}
            </div>
        )
    }
}

export const PopUpWindow = ({ props, handleClose }: any) => {
    const {
        deleteLayerFeature,
        layerManager
    } = useLayerContext();

    const [popUpLayer, setPopUpLayer] = useState<string>();
    const [nearestPointData, setNearestPointData] = useState<any>(null);
    const [nearestDistance, setNearestDistance] = useState<number>();

    const handleNearestLayerChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setPopUpLayer(e.target.value);

        const layer = layerManager.find(
            (layer: { name: string }) =>
                layer.name === e.target.value,
        );

        if (layer && layer.data.length > 0) {
            // Create a user location point
            const userPoint = point([props.object.longitude, props.object.latitude]);

            // Create feature points from layer data
            const points = layer.data.map((row: any) =>
                point([row.longitude, row.latitude], row)
            );

            // Create a feature collection
            const collection = featureCollection(points);

            // Find the nearest point to the user's location
            const nearest_point = nearestPoint(userPoint, collection);

            setNearestPointData(nearest_point);

            // Optional: Log the distance to the nearest point
            const distToNearest = distance(userPoint, nearest_point, { units: "miles" });
            setNearestDistance(distToNearest);
        }
    };

    const layerType = props.layer.constructor.layerName;
    const header = getPopUpHeader(layerType, props);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!popupRef.current) return;

        const popup = popupRef.current;

        const updatePosition = () => {
            const popupWidth = popup.offsetWidth;
            const popupHeight = popup.clientHeight - (popup.offsetHeight - popup.clientHeight);
            const gap = 12;

            popup.style.left = `${props.x - popupWidth / 2}px`;
            //subtract 102 (expected popupHeight) from popupHeight to resize
            popup.style.top = `${props.y - popupHeight - gap}px`;
        };

        // Initial positioning
        updatePosition();

        // Use ResizeObserver to reposition when popup content changes
        const resizeObserver = new ResizeObserver(() => {
            updatePosition();
        });

        resizeObserver.observe(popup);

        return () => {
            resizeObserver.disconnect();
        };
    }, [props.x, props.y]);

    const nearestLayerProps = layerType === 'LocationLayer' ? {
        popUpLayer,
        nearestPoint: nearestPointData,
        nearestDistance,
        onLayerChange: handleNearestLayerChange,
        userLat: props.object.latitude,
        userLong: props.object.longitude
    } : undefined;

    const content = useMemo(() => getPopUpContent(layerType, props, nearestLayerProps), [layerType, props, nearestLayerProps]);

    const handleDelete = () => {
        deleteLayerFeature(props.layer.id, props.object.id);
        handleClose();
    };

    const handleEventStop = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div
            ref={popupRef}
            onClick={handleEventStop}
            onMouseDown={handleEventStop}
            onMouseUp={handleEventStop}
            onPointerDown={handleEventStop}
            className={`absolute p-2 bg-white border rounded-lg shadow-md text-stone-500 text-xs
                h-fit min-w-50`}
        >
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm">{header}</h3>
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        handleClose();
                    }}
                    className="text-stone-500 hover:text-stone-700"
                    aria-label="Close popup"
                >
                    <Cross1Icon className="w-4 h-4" />
                </button>
            </div>
            <hr className={'px-1'} />
            <div className="flex justify-between items-end-safe">
                {content}
                {layerType !== 'RouteLineLayer' || layerType !== 'LocationLayer' && (
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete feature"
                    >
                        <TrashIcon className={'h-4 w-4'} />
                    </button>
                )}
            </div>
        </div>
    )
};