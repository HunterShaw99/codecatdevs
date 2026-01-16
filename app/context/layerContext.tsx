import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {BaseLayerData} from "@map/utils/LayerTypes";
import {randomHex} from "@/app/utils/color";

export const generateLayerId = () => {
    const timestamp = Date.now().toString(16); // Hex timestamp
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); // 6-digit hex
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

export const useLayerContext = () => {
    const context = useContext(LayerContext);
    if (!context) {
        throw new Error('useLayerContext must be used within a LayerProvider');
    }
    return context;
};

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

    const layerMap = useMemo(() => {
        const map = new Map<string, BaseLayerData>();
        layerManager.forEach(layer => map.set(layer.id, layer));
        return map;
    }, [layerManager]);

    const getLayerById = useCallback((layerId: string) => {
        return layerMap.get(layerId);
    }, [layerMap]);

    const addNewLayer = useCallback((newLayer: any) => {
        const id = generateLayerId();
        const created = {
            id,
            name: newLayer.name,
            type: newLayer.type || 'labelled-scatter',
            colors: {fill: newLayer.colors?.fill ?? randomHex()},
            data: newLayer.data || [],
            visible: true,
            layer: newLayer.layer || undefined
        } as BaseLayerData;

        setLayerManager(prevLayers => [...prevLayers, created]);

        // Make the newly added layer the selected layer if the current selection is invalid
        setSelectedLayerName(created.name);
    }, []);

    const toggleLayerVisibility = useCallback((layerId: string) => {
        setLayerManager(prevLayers => {
            const layer = getLayerById(layerId);
            if (!layer) return prevLayers;

            return prevLayers.map(l =>
                l.id === layerId ? {...l, visible: !l.visible} : l
            );
        });
    }, [getLayerById]);

    const deleteLayer = useCallback((layerId: string) => {
        setLayerManager(prev => prev.filter(l => l.id !== layerId));
    }, []);

    const deleteLayerFeature = useCallback((layerId: string, featureId: any) => {
        setLayerManager(prevLayers => {
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

            const newLayers = [...prevLayers];
            newLayers[layerIndex] = updatedLayer;

            return newLayers;
        });
    }, []);

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

    const updateLayerColorDebounced = useMemo(() => debounce(updateLayerColor, 300), [updateLayerColor, debounce]);
    const updateLayerOpacity = useMemo(() => debounce(updateLayerColor, 10), [updateLayerColor, debounce]);

    // Keep selectedLayerName in-sync with available layers: fallback to first existing layer when needed
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