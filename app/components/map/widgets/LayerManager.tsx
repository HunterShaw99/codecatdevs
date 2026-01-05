import {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import Draggable from 'react-draggable';
import {Separator} from 'radix-ui';
import {EyeNoneIcon, EyeOpenIcon, TrashIcon, PlusIcon} from '@radix-ui/react-icons';
import {useLayerContext} from "@/app/context/layerContext";
import {randomHex} from "@/app/utils/color";

interface LayerManagerWidgetProps {
    isOpen: boolean;
}

export function LayerManagerWidget({isOpen}: LayerManagerWidgetProps) {
    const {
        layerManager,
        selectedLayerName,
        setSelectedLayerName,
        addNewLayer,
        toggleLayerVisibility,
        deleteLayer,
        updateLayerColorDebounced,
        updateLayerOpacity,
        getLayerById
    } = useLayerContext();

    const [layerName, setLayerName] = useState('');
    const [position, setPosition] = useState({x: 0, y: 0});
    const nodeRef = useRef(null);

    const loadPosition = useCallback(() => {
        const savedPosition = localStorage.getItem('layerManagerPosition');
        return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
    }, []);

    const savePosition = useCallback((x: number, y: number) => {
        localStorage.setItem('layerManagerPosition', JSON.stringify({ x, y }));
    }, []);

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
                setPosition({x: data.x, y: data.y});
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
                        maxLength={10}
                    />
                    <button
                        onClick={() => {
                            addNewLayer({name: `${layerName}`, type: 'labelled-scatter', data: []});
                            setLayerName('');
                        }}
                        className="p-1 max-h-10 text-lg text-peach-5 flex-row flex items-center justify-center cursor-pointer hover:text-peach-4"
                    >
                        <PlusIcon className={'w-4 h-4'}/> Layer
                    </button>
                </div>
                <Separator.Root className="seperator-major" decorative/>
                <div className="mt-2 text-stone-500 text-sm p-2">
                    {layerManager.map(layer => (
                        <div key={layer.id}
                             className="flex items-center justify-between">
                            <span className="mr-2 w-35">{layer.name}</span>
                            <div className="relative">
                                <input
                                    type="color"
                                    value={layer.colors?.fill ? layer.colors.fill.slice(0, 7) : randomHex()}
                                    onChange={(e) => updateLayerColorDebounced(layer.id, {fill: e.target.value})}
                                    className="w-4 h-4 appearance-none rounded-full shadow-sm shadow-stone-600 hover:shadow-md
                                    transition-shadow duration-200 cursor-pointer bg-transparent absolute
                                    [&::-webkit-color-swatch-wrapper]:p-0
                                        [&::-webkit-color-swatch]:border-none
                                        [&::-moz-color-swatch]:border-none"
                                    style={{
                                        backgroundColor: layer.colors?.fill || randomHex()
                                    }}
                                />
                                <div
                                    className="w-4 h-4 rounded-full cursor-pointer"
                                    style={{
                                        backgroundColor: layer.colors?.fill || randomHex(),
                                    }}
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        input.click();
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => toggleLayerVisibility(layer.id)}
                                className="w-4 h-4 rounded cursor-pointer text-stone-700 hover:text-stone-900"
                                title="Toggle Visibility"
                            >
                                {layer.visible ? (
                                    <EyeOpenIcon className="w-full h-full"/>
                                ) : (
                                    <EyeNoneIcon className="w-full h-full"/>
                                )}
                            </button>
                            <button
                                onClick={() => deleteLayer(layer.id)}
                                aria-label={`Delete layer ${layer.name}`}
                                className="w-4 h-4 rounded cursor-pointer text-red-400 hover:text-red-700"
                            >
                                <TrashIcon className="w-full h-full"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Draggable>
    );
}