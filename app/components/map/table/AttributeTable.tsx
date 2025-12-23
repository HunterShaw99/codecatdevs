import {ScatterPoint} from '@components/map/utils/LayerTypes'

export type AttributeTableProps = {
    layer: ScatterPoint[]
}

export const AttributeTable = ({ layer }: AttributeTableProps) => {
    if (layer.length < 1) {
        return (
            <div className="p-4 bg-white border rounded-lg shadow-md text-stone-500 text-sm">
                <p> No Layers in Current Workspace. </p>
            </div>
        )
    }

    return (
        <div className="p-4 bg-white border rounded-lg shadow-md text-stone-500 text-sm">
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
                    {layer.map(l =>
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
};

export default AttributeTable;