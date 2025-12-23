
export const PopUpWindow = ({ props }: any) => {
    const object = props.object

        if (props.layer.id === 'SearchRingLayer') {
            return (
                <div className={`absolute p-4 bg-white border rounded-lg shadow-md text-stone-500 text-sm`}
                    style={{ left: `${Math.round(props.x)}px`, top: `${Math.round(props.y)}px` }}>
                    <p><span className="font-bold">Name:</span> {object.originName}</p>
                    <p><span className="font-bold">Coordinates:</span> {object.originCoords[0].toFixed(3)}, {object.originCoords[1].toFixed(3)}</p>
                    {object.compareResults.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(object.compareResults[0]).filter(key => key !== 'coordinates').map((key) =>
                                    <th>{key}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {object.compareResults.map((result: any) =>
                                <tr key={crypto.randomUUID()}>
                                    {Object.keys(result).filter(key => key !== 'coordinates').map((key) =>
                                        <td>
                                            {typeof result[key] === 'number' ?
                                                result[key].toFixed(2) :
                                                result[key]
                                            }</td>
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    : <p>No Results for selected search area.</p>}
                </div>
            )
        }
        else {
            return (
                <div className={`absolute p-4 bg-white border rounded-lg shadow-md text-stone-500 text-sm`}
                    style={{ left: `${Math.round(props.x)}px`, top: `${Math.round(props.y)}px` }}>
                    <p><span className="font-bold">Name:</span> {object.name}</p>
                    <p><span className="font-bold">Coordinates:</span> {object.longitude.toFixed(3)},{object.latitude.toFixed(3)}</p>
                    <p><span className="font-bold">Status:</span> {object.status}</p>
                </div>
            )
        }
};