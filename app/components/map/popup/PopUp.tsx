import {Cross1Icon, TrashIcon} from "@radix-ui/react-icons";
import {useEffect, useMemo, useRef} from 'react';
import {useLayerContext} from "@/app/context/layerContext";

const getPopUpValues = (props: any) => {
    let name, lat, long;

    if (props.layer.constructor.name === 'LabelledLayer') {
        name = props.object.name;
        lat = props.object.latitude;
        long = props.object.longitude;
    } else if (props.layer.constructor.name === 'SearchRingLayer') {
        name = props.object.originName;
        [long, lat] = props.object.originCoords;
    } else if (props.layer.constructor.name === 'RouteLineLayer') {
        name = props.layer.id;
        [long, lat] = [0, 0];
    }

    return [name, lat, long];
}

const getPopUpHeader = (layerType: any) => {

    if (layerType === 'LabelledLayer') {
        return 'Point Details';
    } else if (layerType === 'SearchRingLayer') {
        return 'Search Area Results';
    } else if (layerType === 'RouteLineLayer') {
        return 'Route Information';
    } else {
        return 'Layer Details';
    }
}

const getPopUpContent = (layerType: string, props: any) => {
    const [name, lat, long] = getPopUpValues(props);

    if (layerType === 'LabelledLayer') {
        return (
            <div>
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
                <p><span className="font-bold">Route Name:</span> {name}</p>
                <p><span
                    className="font-bold">Total Distance:</span> {(props.object.distance / 1606.34).toFixed(2)} miles
                </p>
                <p><span className="font-bold">Total Duration:</span> {Math.ceil((props.object.duration / 60))} minutes
                </p>
            </div>
        );
    } else {
        return null;
    }
}

export const PopUpWindow = ({props, handleClose}: any) => {
    const {
        deleteLayerFeature
    } = useLayerContext();
    const layerType = props.layer.constructor.name;
    const header = getPopUpHeader(layerType);
    const content = useMemo(() => getPopUpContent(layerType, props), [props]);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!popupRef.current) return;

        const popup = popupRef.current;
        const popupWidth = popup.offsetWidth;

        popup.style.left = `${props.x - popupWidth / 2}px`;
        popup.style.top = `${props.y - 350}px`;
    }, [props.x, props.y]);

    const handleDelete = () => {
        deleteLayerFeature(props.layer.id, props.object.id);
        handleClose();
    };

    return (
        <div
            ref={popupRef}
            className={`absolute p-2 bg-white border rounded-lg shadow-md text-stone-500 text-xs min-h-25
                overflow-y-auto min-w-48`}
        >
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm">{header}</h3>
                <button
                    onClick={() => {
                        handleClose();
                    }}
                    className="text-stone-500 hover:text-stone-700"
                    aria-label="Close popup"
                >
                    <Cross1Icon className="w-4 h-4"/>
                </button>
            </div>
            <hr className={'px-1'}/>
            {content}
            {layerType === 'LabelledLayer' && (
                <div className="absolute bottom-2 right-2">
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete feature"
                    >
                        <TrashIcon className={'h-4 w-4'}/>
                    </button>
                </div>
            )}
        </div>
    )
};