
import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Separator } from 'radix-ui';
import { EyeNoneIcon, EyeOpenIcon, TrashIcon, PlusIcon } from '@radix-ui/react-icons';
import {useLayerContext} from "@/app/context/layerContext";
import {randomHex} from "@/app/utils/color";

interface LayerManagerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LayerManagerWidget({ isOpen, onClose }: LayerManagerWidgetProps) {
  const {
    layerManager,
    selectedLayerName,
    setSelectedLayerName,
    addNewLayer,
    toggleLayerVisibility,
    deleteLayer,
    updateLayerColorDebounced,
    updateLayerOpacity
  } = useLayerContext();

  const [layerName, setLayerName] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const savePosition = (x: number, y: number) => {
    localStorage.setItem('layerManagerPosition', JSON.stringify({ x, y }));
  };

  const loadPosition = () => {
    const savedPosition = localStorage.getItem('layerManagerPosition');
    if (savedPosition) {
      return JSON.parse(savedPosition);
    }
    return { x: 0, y: 0 };
  };

  useEffect(() => {
    if (isOpen) {
      const savedPosition = loadPosition();
      setPosition(savedPosition);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Draggable
      handle=".drag-handle"
      nodeRef={nodeRef}
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        savePosition(data.x, data.y);
      }}
    >
      <div
        className="absolute p-4 bg-white left-full ml-2 border rounded-lg shadow-md shrink-0 drag-handle z-50"
        ref={nodeRef}
      >
        <label className="layer-select text-stone-700">Layer Manager:</label>
        <div className={"flex flex-row items-center justify-between gap-4"}>
          <input
            type={'text'}
            className={"px-2 border border-zinc-500 text-stone-500 bg-stone-100 rounded-md max-w-48 max-h-6"}
            id={'layer-name-input'}
            value={layerName}
            onChange={(e) => {
              const exists = layerManager.some(l => l.name === e.target.value);
              if (exists) {
                alert('Layer name already taken');
                return;
              }
              setLayerName(e.target.value);
            }}
          />
          <button
            onClick={() => {
              addNewLayer({ name: `${layerName}`, type: 'labelled-scatter', data: [] });
              setLayerName('');
            }}
            className="p-1 max-h-10 text-peach-5 flex-row flex items-center justify-center"
          >
            <PlusIcon className={'w-4 h-4'} /> Layer
          </button>
        </div>
        <Separator.Root className="seperator-major" decorative />
        <div className="mt-2 text-stone-500 overflow-y-auto max-h-112 p-2">
          {layerManager.map(layer => (
            <div key={layer.name}
              className="flex items-center justify-between mb-1 space-x-4">
              <span className="mr-2 w-20">{layer.name}</span>
              <input
                type="color"
                value={layer.colors?.fill ? layer.colors.fill.slice(0, 7) : randomHex()}
                onChange={(e) => updateLayerColorDebounced(layer.id, { fill: e.target.value })}
                className="w-12 p-1 rounded"
              />
              <div className={'flex flex-row gap-2'}>
                <button
                  onClick={() => toggleLayerVisibility(layer.id)}
                  className="p-1 w-6 h-6 rounded text-stone-700 focus:outline-none"
                  title="Toggle Visibility"
                >
                  {layer.visible ? (
                    <EyeOpenIcon className="w-full h-full" />
                  ) : (
                    <EyeNoneIcon className="w-full h-full" />
                  )}
                </button>
                <button
                  onClick={() => deleteLayer(layer.id)}
                  aria-label={`Delete layer ${layer.name}`}
                  className="p-1 w-6 h-6 rounded text-red-400 hover:text-red-700 focus:outline-none"
                >
                  <TrashIcon className="w-full h-full" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}