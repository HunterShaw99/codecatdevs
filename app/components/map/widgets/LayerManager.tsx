import {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import Draggable from 'react-draggable';
import {Separator} from 'radix-ui';
import {EyeNoneIcon, EyeOpenIcon, TrashIcon, PlusIcon} from '@radix-ui/react-icons';
import {useLayerContext} from "@/app/context/layerContext";
import {hexToRGB, randomHex} from "@/app/utils/color";

interface LayerManagerWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LayerManagerWidget({isOpen, onClose}: LayerManagerWidgetProps) {
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
                        className="p-1 max-h-10 text-peach-5 flex-row flex items-center justify-center"
                    >
                        <PlusIcon className={'w-4 h-4'}/> Layer
                    </button>
                </div>
                <Separator.Root className="seperator-major" decorative/>
                <div className="mt-2 text-stone-500 overflow-y-auto max-h-112 p-2">
                    {layerManager.map(layer => (
                        <div key={layer.id}
                             className="flex items-center justify-between mb-1 space-x-4 h-5">
                            <span className="mr-2 w-25">{layer.name}</span>
                            <div className="relative">
                                <input
                                    type="color"
                                    value={layer.colors?.fill ? layer.colors.fill.slice(0, 7) : randomHex()}
                                    onChange={(e) => updateLayerColorDebounced(layer.id, {fill: e.target.value})}
                                    className="w-5 h-5 rounded-full border-0 cursor-pointer appearance-none bg-transparent hover:shadow-lg transition-shadow duration-200 absolute opacity-0"
                                    style={{
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        backgroundColor: layer.colors?.fill || randomHex()
                                    }}
                                />
                                <div
                                    className="w-5 h-5 rounded-full cursor-pointer hover:shadow-md transition-shadow duration-200"
                                    style={{
                                        backgroundColor: layer.colors?.fill || randomHex(),
                                    }}
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        input.click();
                                    }}
                                />
                            </div>
                            <Separator.Root
                                className="mx-8 bg-stone-400 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px"
                                decorative
                                orientation="vertical"
                            />
                            <button
                                onClick={() => toggleLayerVisibility(layer.id)}
                                className="p-1 w-6 h-6 rounded text-stone-700 focus:outline-none"
                                title="Toggle Visibility"
                            >
                                {layer.visible ? (
                                    <EyeOpenIcon className="w-full h-full"/>
                                ) : (
                                    <EyeNoneIcon className="w-full h-full"/>
                                )}
                            </button>
                            <Separator.Root
                                className="mx-8 bg-stone-400 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px"
                                decorative
                                orientation="vertical"
                            />
                            <button
                                onClick={() => deleteLayer(layer.id)}
                                aria-label={`Delete layer ${layer.name}`}
                                className="p-1 w-6 h-6 rounded text-red-400 hover:text-red-700 focus:outline-none"
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