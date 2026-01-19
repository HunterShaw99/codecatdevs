'use client';
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {BaseLayerData} from "@map/utils/LayerTypes";
import {randomHex} from "@/app/utils/color";

/**
 * Generates a unique layer ID by combining a hexadecimal timestamp and a random 6-digit hexadecimal string.
 * @returns {string} A unique layer ID
 */
export const generateLayerId = (): string => {
    const timestamp = Date.now().toString(16);
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return `${timestamp}${randomHex}`;
};

interface LayerContextType {
    layerManager: BaseLayerData[];
    setLayerManager: React.Dispatch<React.SetStateAction<BaseLayerData[]>>;
    selectedLayerName: string;
    setSelectedLayerName: React.Dispatch<React.SetStateAction<string>>;
    addNewLayer: (newLayer: any) => void;
    toggleLayerVisibility: (layerId: string) => void;
    deleteLayer: (layerId: string) => void;
    deleteLayerFeature: (layerId: string, feature: any) => void;
    updateLayerColor: (layerId: string, newColors: { fill?: string }, opacity?: number) => void;
    updateLayerColorDebounced: (layerId: string, newColors: { fill?: string }, opacity?: number) => void;
    updateLayerOpacity: (layerId: string, newColors: { fill?: string }, opacity?: number) => void;
    getLayerById: (layerId: string) => BaseLayerData | undefined;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

/**
 * Custom hook to access the LayerContext.
 * @returns {LayerContextType} The layer context
 * @throws {Error} If used outside of a LayerProvider
 */
export const useLayerContext = () => {
    const context = useContext(LayerContext);
    if (!context) {
        throw new Error('useLayerContext must be used within a LayerProvider');
    }
    return context;
};

/**
 * Provider component for the LayerContext.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The provider component
 */
export const LayerProvider = ({children}: { children: React.ReactNode }) => {
    const [layerManager, setLayerManager] = useState<BaseLayerData[]>([{
        id: generateLayerId(),
        name: 'Default',
        type: 'labelled-scatter',
        colors: {fill: randomHex()},
        visible: true,
        data: []
    }]);

    const [selectedLayerName, setSelectedLayerName] = useState('Default');

    /**
     * Memoized map of layers by their IDs for efficient lookup.
     */
    const layerMap = useMemo(() => {
        const map = new Map<string, BaseLayerData>();
        layerManager.forEach(layer => map.set(layer.id, layer));
        return map;
    }, [layerManager]);

    /**
     * Retrieves a layer by its ID.
     * @param {string} layerId - The ID of the layer to retrieve
     * @returns {BaseLayerData | undefined} The layer data or undefined if not found
     */
    const getLayerById = useCallback((layerId: string) => {
        return layerMap.get(layerId);
    }, [layerMap]);

    /**
     * Adds a new layer to the layer manager.
     * @param {any} newLayer - The new layer configuration
     */
    const addNewLayer = useCallback((newLayer: any) => {
        const id = generateLayerId();
        const created = {
            id,
            name: newLayer.name,
            type: newLayer.type || 'labelled-scatter',
            colors: {fill: newLayer.colors?.fill ?? randomHex()},
            data: newLayer.data || [],
            visible: true,
            layer: newLayer.layer || undefined,
            parentLayerId: newLayer.parentLayerId || undefined
        } as BaseLayerData;

        setLayerManager(prevLayers => [...prevLayers, created]);
        setSelectedLayerName(created.name);
    }, []);

    /**
     * Toggles the visibility of a layer.
     * @param {string} layerId - The ID of the layer to toggle
     */
    const toggleLayerVisibility = useCallback((layerId: string) => {
        setLayerManager(prevLayers => {
            const layer = getLayerById(layerId);
            if (!layer) return prevLayers;

            return prevLayers.map(l =>
                l.id === layerId ? {...l, visible: !l.visible} : l
            );
        });
    }, [getLayerById]);

    /**
     * Deletes a layer by its ID.
     * @param {string} layerId - The ID of the layer to delete
     */
    const deleteLayer = useCallback((layerId: string) => {
        setLayerManager(prev => prev.filter(l => l.id !== layerId));
    }, []);

    /**
     * Deletes a feature from a layer.
     * @param {string} layerId - The ID of the layer containing the feature
     * @param {any} featureId - The ID of the feature to delete
     */
    const deleteLayerFeature = useCallback((layerId: string, featureId: any) => {
        setLayerManager(prevLayers => {
            const newLayers = [...prevLayers];
            const layerIndex = prevLayers.findIndex(layer => layer.id === layerId);

            if (layerIndex === -1) {
                return prevLayers;
            }

            const layer = prevLayers[layerIndex];
            const newData = layer.data.filter((item: any) => item.id !== featureId);

            if (layer.type === 'search-ring' && newData.length === 0) {
                return prevLayers.filter((_, index) => index !== layerIndex);
            }

            const updatedLayer = {...layer, data: newData};

            newLayers[layerIndex] = updatedLayer;

            if (layer.type === 'labelled-scatter') {
                const searchRingIndex = prevLayers.findIndex(layer => layer.parentLayerId === layerId);

                if (searchRingIndex !== -1) {
                    const searchLayer = prevLayers[searchRingIndex]
                    const newSearchData = prevLayers[searchRingIndex].data.filter((item: any) => item.parentRowId !== featureId);

                    if (newSearchData.length === 0) {
                        return newLayers.filter((_, index) => index !== searchRingIndex);
                    }

                    newLayers[searchRingIndex] = {...searchLayer, data: newSearchData}
                }
            }

            return newLayers;
        });
    }, []);

    /**
     * Updates the color of a layer.
     * @param {string} layerId - The ID of the layer to update
     * @param {Object} newColors - The new color configuration
     * @param {string} [newColors.fill] - The fill color
     * @param {number} [opacity] - The opacity value (0-100)
     */
    const updateLayerColor = useCallback((layerId: string, newColors: { fill?: string }, opacity?: number) => {
        setLayerManager(prevLayers => {
            const layer = getLayerById(layerId);
            if (!layer) return prevLayers;

            const opacityValue = opacity ? Math.abs((opacity / 100) * 255) : 255;
            const opacityHex = opacityValue.toString(16).padStart(2, '0').toUpperCase();

            return prevLayers.map(l =>
                l.id === layerId
                    ? {
                        ...l,
                        colors: {
                            ...l.colors,
                            fill: newColors?.fill?.slice(0, 7) + opacityHex
                        }
                    }
                    : l
            );
        });
    }, [getLayerById]);

    /**
     * Creates a debounced version of a function.
     * @template T - The function type
     * @param {T} callback - The function to debounce
     * @param {number} delay - The debounce delay in milliseconds
     * @returns {T} The debounced function
     */
    const debounce = useCallback(<T extends (...args: any[]) => void>(callback: T, delay: number) => {
        let timeoutId: NodeJS.Timeout | null = null;

        return (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    }, []);

    /**
     * Debounced version of updateLayerColor with a 300ms delay.
     */
    const updateLayerColorDebounced = useMemo(() => debounce(updateLayerColor, 300), [updateLayerColor, debounce]);

    /**
     * Debounced version of updateLayerColor with a 10ms delay for opacity updates.
     */
    const updateLayerOpacity = useMemo(() => debounce(updateLayerColor, 10), [updateLayerColor, debounce]);

    /**
     * Effect to keep selectedLayerName in sync with available layers.
     * Falls back to the first existing layer when the current selection is invalid.
     */
    useEffect(() => {
        const exists = layerManager.some(l => l.name === selectedLayerName);
        if (!exists) {
            if (layerManager.length > 0) {
                setSelectedLayerName(layerManager[0].name);
            } else {
                setSelectedLayerName('');
            }
        }
    }, [layerManager, selectedLayerName]);

    /**
     * Memoized context value containing all layer management functions and state.
     */
    const value = useMemo(() => ({
        layerManager,
        setLayerManager,
        selectedLayerName,
        setSelectedLayerName,
        addNewLayer,
        toggleLayerVisibility,
        deleteLayer,
        deleteLayerFeature,
        updateLayerColor,
        updateLayerColorDebounced,
        updateLayerOpacity,
        getLayerById
    }), [
        layerManager,
        selectedLayerName,
        addNewLayer,
        toggleLayerVisibility,
        deleteLayer,
        deleteLayerFeature,
        updateLayerColor,
        updateLayerColorDebounced,
        updateLayerOpacity,
        getLayerById
    ]);

    return (
        <LayerContext.Provider value={value}>
            {children}
        </LayerContext.Provider>
    );
};