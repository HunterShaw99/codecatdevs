
export const PopUpWindow = ({ props } : any) => {
    const object = props.object

    return (
        <div className={`absolute p-4 bg-white border rounded-lg shadow-md text-stone-500 text-sm`}
              style={{ left: `${Math.round(props.x)}px`, top: `${Math.round(props.y)}px` }}>
            <p><span className="font-bold">Name:</span> {object.name}</p>
            <p><span className="font-bold">Coordinates:</span> {object.longitude.toFixed(3)},{object.latitude.toFixed(3)}</p>
            <p><span className="font-bold">Status:</span> {object.status}</p>
        </div>
    )
};