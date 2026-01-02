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
            <p><span className="font-bold">Name:</span> {name}</p>
            <p><span className="font-bold">Coordinates:</span> {lat.toFixed(3)}, {long.toFixed(3)}</p>
            {props.object.compareResults.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(props.object.compareResults[0]).filter(resKey => resKey !== 'coordinates').map((resKey) =>
                                    <th>{resKey}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {props.object.compareResults.map((result: any) =>
                                <tr key={crypto.randomUUID()}>
                                    {Object.keys(result).filter(resKey => resKey !== 'coordinates').map((resKey) =>
                                        <td>
                                            {typeof result[resKey] === 'number' ?
                                                result[resKey].toFixed(2) :
                                                result[resKey]
                                            }</td>
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    : <p>No Results for selected search area.</p>}
            </div>
    ); 
    } else if (layerName === 'RouteLineLayer') {
        return (
            <div>
                <p><span className="font-bold">Name:</span> {name}</p>
                <p><span className="font-bold">Total Distance:</span> {(props.object.distance / 1606.34).toFixed(2)} miles</p> 
                <p><span className="font-bold">Total Duration:</span> {Math.ceil((props.object.duration / 60))} minutes</p>
                {props.object.legs.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Route Start Location</th>
                                <th>Distance</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.object.legs.map((result: any, index: number) =>
                                <tr key={crypto.randomUUID()}>
                                        <td>
                                            {props.object.points[index]}
                                        </td>
                                        <td>
                                            {(result.distance / 1606.34).toFixed(2)} miles
                                        </td>
                                        <td>
                                            {Math.ceil((result.duration / 60))} minutes
                                        </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    : null}
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