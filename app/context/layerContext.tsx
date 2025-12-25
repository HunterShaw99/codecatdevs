
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {BaseLayerData} from "@map/utils/LayerTypes";
import {randomHex} from "@/app/utils/color";

// Lightweight ID generator - combines timestamp and random hex for uniqueness
const generateLayerId = () => {
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
  updateLayerColor: (layerId: string, newColors: { fill?: string }, opacity?: number) => void;
  updateLayerColorDebounced: (layerId: string, newColors: { fill?: string }, opacity?: number) => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const useLayerContext = () => {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error('useLayerContext must be used within a LayerProvider');
  }
  return context;
};

export const LayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [layerManager, setLayerManager] = useState<BaseLayerData[]>([{
    id: generateLayerId(),
    name: 'Default',
    type: 'labelled-scatter',
    colors: { fill: randomHex() },
    visible: true,
    data: []
  }]);
  const [selectedLayerName, setSelectedLayerName] = useState('Default');

  const addNewLayer = useCallback((newLayer: any) => {
    setLayerManager(prevLayers => [...prevLayers, {
      id: generateLayerId(),
      name: newLayer.name,
      type: newLayer.type || 'labelled-scatter',
      colors: { fill: newLayer.colors?.fill ?? randomHex() },
      data: newLayer.data || [],
      visible: true,
      layer: newLayer.layer || undefined
    }]);
  }, []);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayerManager(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const deleteLayer = useCallback((layerId: string) => {
    setLayerManager(prev =>
      prev.filter(l => l.id !== layerId)
    );
  }, []);

  const updateLayerColor = useCallback((layerId: string, newColors: { fill?: string }, opacity?: number) => {
    const opacityString = opacity ? Math.abs((opacity / 100) * 255).toString(16) : 'FF'

    setLayerManager(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? {
          ...layer,
          colors: {
            ...layer.colors,
            fill: newColors?.fill?.slice(0, 7) + opacityString
          }
        } : layer
      )
    );
  }, [setLayerManager]);

  // debounce moved to module scope to avoid recreating on every render
  const debounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
    let timeoutId: NodeJS.Timeout | null;

    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  const updateLayerColorDebounced = useMemo(() => debounce(updateLayerColor, 300), [updateLayerColor]);

  const value = {
    layerManager,
    setLayerManager,
    selectedLayerName,
    setSelectedLayerName,
    addNewLayer,
    toggleLayerVisibility,
    deleteLayer,
    updateLayerColor,
    updateLayerColorDebounced
  };

  return (
    <LayerContext.Provider value={value}>
      {children}
    </LayerContext.Provider>
  );
};