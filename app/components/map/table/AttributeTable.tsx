import { BaseLayerData } from '@components/map/utils/LayerTypes'

export type AttributeTableProps = {
    layer: BaseLayerData[]
}

export const AttributeTable = ({ layer }: AttributeTableProps) => {

    const data = layer.flatMap(l => l.data)

    if (data.length < 1) {
        return (
            <div className="p-4 m-2 bg-white border rounded-lg shadow-md text-stone-500 text-sm">
                <p> No Layers in Current Workspace. </p>
            </div>
        )
    } else if (layer[0].type === 'labelled-scatter') {
        return (
            <div className="p-4 m-2 bg-white border rounded-lg shadow-md text-stone-500 text-sm">
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
            <div className="p-4 m-2 bg-white border rounded-lg shadow-md text-stone-500 text-sm">
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
    }
};

export default AttributeTable;