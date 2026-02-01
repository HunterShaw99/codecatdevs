import { BaseLayerData } from '@components/map/utils/LayerTypes'

export type AttributeTableProps = {
    layer: BaseLayerData[]
}

export const AttributeTable = ({ layer }: AttributeTableProps) => {

    const data = layer.flatMap(l => l.data)

    if (data.length > 0) {
        if (layer[0].type === 'labelled-scatter') {
            return (
                <div className="attribute-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(l =>
                                <tr key={l.name}>
                                    <td>{l.name}</td>
                                    <td>{l.latitude.toFixed(5)}</td>
                                    <td>{l.longitude.toFixed(5)}</td>
                                    <td>{l.status}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>)
        } else if (layer[0].type === 'search-ring') {
            return (
                <div className="attribute-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Input Name</th>
                                <th>Input Latitude</th>
                                <th>Input Longitude</th>
                                <th>Search Results</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(l =>
                                <tr key={`attr-${crypto.randomUUID()}`}>
                                    <td>{l.originName}</td>
                                    <td>{l.originCoords[1].toFixed(5)}</td>
                                    <td>{l.originCoords[0].toFixed(5)}</td>
                                    {l.compareResults.length > 0 ?
                                        <td colSpan={l.compareResults.length}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Point Name</th>
                                                        <th>Distance to Point</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {l.compareResults.map((c: any) =>
                                                        <tr key={`comp-attr-${crypto.randomUUID()}`}>
                                                            <td>{c.name}</td>
                                                            <td>{c.distance}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </td> :
                                        <td>
                                            No Information
                                        </td>
                                    }
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>)
        } else if (layer[0].type === 'route-line') {
            return (
            <div className="attribute-table">
                <table>
                    <thead>
                        <tr>
                            <th>Route Start Name</th>
                            <th>Route End Name</th>
                            <th>Route Segment Distance</th>
                            <th>Route Segment Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data[0].legs.map((leg :any, index: number) => 
                                <tr key={crypto.randomUUID()}>
                                        <td>
                                            {data[0].points[index]}
                                        </td>
                                        <td>
                                            {index + 1 === data[0].points.length ? data[0].points[0] : data[0].points[index + 1]}
                                        </td>
                                        <td>
                                            {(leg.distance / 1606.34).toFixed(2)} miles
                                        </td>
                                        <td>
                                            {Math.ceil((leg.duration / 60))} minutes
                                        </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>)
        } 
    }
    else {
        return (
            <div className="attribute-table">
                <p> No Layers in Current Workspace. </p>
            </div>
        )
    }
};

export default AttributeTable;