const getPopUpValues = (props : any) => {
    let name, lat, long;
    
    if (props.layer.constructor.name === 'LabelledLayer') {
        name = props.object.name;
        lat = props.object.latitude;
        long = props.object.longitude;
    }
    else if (props.layer.constructor.name === 'SearchRingLayer') {
        name = props.object.originName;
        [long, lat] = props.object.originCoords;
    } 
    else if (props.layer.constructor.name === 'RouteLineLayer') {
        name = props.layer.id;
        [long, lat] = [0,0];
    }

    return [name, lat, long];
}

const getPopUpContent = (props : any) => {
    const layerName = props.layer.constructor.name 
    const [name, lat, long] = getPopUpValues(props);

    console.log(props.object);

    if (layerName === 'LabelledLayer') {
        return (
            <div>
                <p><span className="font-bold">Name:</span> {name}</p>
                <p><span className="font-bold">Coordinates:</span> {lat.toFixed(3)}, {long.toFixed(3)}</p>
            </div>
        );
    }
    else if (layerName === 'SearchRingLayer') {
        return (
            <div>
            <p><span className="font-bold">Origin Point Name:</span> {name}</p>
            <p><span className="font-bold">Coordinates:</span> {lat.toFixed(3)}, {long.toFixed(3)}</p>
            <p><span className="font-bold">Search Distance:</span> {props.object.searchedDistance} miles</p>
            <p><span className="font-bold">{props.object.compareLayer} Points Within Area:</span> {props.object.compareResults.length} </p>
            </div>
    ); 
    } else if (layerName === 'RouteLineLayer') {
        return (
            <div>
                <p><span className="font-bold">Route Name:</span> {name}</p>
                <p><span className="font-bold">Total Distance:</span> {(props.object.distance / 1606.34).toFixed(2)} miles</p> 
                <p><span className="font-bold">Total Duration:</span> {Math.ceil((props.object.duration / 60))} minutes</p>
            </div>
        );
    }
    else {
        return null;
    }
}

export const PopUpWindow = ({ props }: any) => {

            return (
                <div className={`absolute p-2 bg-white border rounded-lg shadow-md text-stone-500 text-xs max-h-50
                    overflow-y-auto`}
                    style={{ left: `${Math.round(props.x)}px`, top: `${Math.round(props.y)}px` }}>
                    {getPopUpContent(props)}
                </div>
            )
};