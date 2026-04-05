"use client"

import { useLayerContext } from "@/app/context/layerContext";
import { ChangeEvent } from "react";

interface NearestLayerProps {
    userLat: number
    userLong: number
    popUpLayer: string | undefined
    nearestPoint: any
    nearestDistance: number | undefined
    onLayerChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

export const NearestLayer = ({
    popUpLayer,
    nearestPoint,
    nearestDistance,
    onLayerChange
}: NearestLayerProps) => {
    const { layerManager } = useLayerContext();

    return (
        <div>
            <div className="flex flex-row items-center">
                <p className="p-2 mt-2 text-stone-500 font-bold text-xs">
                    Select Layer:
                </p>
                <select
                    value={popUpLayer || ""}
                    onChange={onLayerChange}
                    className="p-1 ml-1"
                >
                    <option value="">Select a layer...</option>
                    {layerManager.length > 0 ? (
                        layerManager
                            .filter(
                                (layer: { type: string }) =>
                                    layer.type === "labelled-scatter",
                            )
                            .map((layer) => (
                                <option key={layer.id} value={layer.name}>
                                    {layer.name}
                                </option>
                            ))
                    ) : (
                        <option disabled>No valid layer(s)</option>
                    )}
                </select>
            </div>

            {nearestPoint &&
                (
                    <div>
                        <p><span className="font-bold">Closest Point Name:</span> {nearestPoint.properties.name}</p>
                        <p><span className="font-bold">Closest Point Coordinates:</span> {nearestPoint.geometry.coordinates[1].toFixed(3)}, {nearestPoint.geometry.coordinates[0].toFixed(3)}</p>
                        <p><span className="font-bold">Closest Point Distance:</span> {nearestDistance?.toFixed(2)} miles</p>
                    </div>
                )
            }
        </div>)
}