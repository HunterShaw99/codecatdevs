import { useCallback, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Separator } from 'radix-ui';
import { EyeNoneIcon, EyeOpenIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { useLayerContext } from "@/app/context/layerContext";
import { randomHex } from "@/app/utils/color";

const MAX_LAYERS = 10

interface LayerManagerWidgetProps {
    isOpen: boolean;
}

type CallbackFunction = (result: any) => void;

const isMobile = navigator.maxTouchPoints > 1

const eventHandler = (cb: CallbackFunction) => {
    return (event: any) => {
        if (isMobile && event.type === 'touchstart') {
            cb(event);
        } else if (!isMobile && event.type === 'click') {
            cb(event);
        }
    };
};

export function LayerManagerWidget({ isOpen }: LayerManagerWidgetProps) {
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
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [error, setError] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const nodeRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    const handleInputMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (layerManager.length > MAX_LAYERS) {
            setIsDisabled(true)
            setError('Layer List has reached maximum')
        } else {
            setIsDisabled(false)
            setError('')
        }
    }, [layerManager]);

    const handleButtonClick = () => {
        {
            const name = layerName.trim();
            if (!name) {
                setError('Layer name cannot be empty');
                setTimeout(() => setError(''), 3000);
                return;
            }
            const exists = layerManager.some(l => l.name === name);
            if (exists) {
                setError('Layer name already taken');
                setTimeout(() => setError(''), 3000);
                return;
            }
            addNewLayer({ name: name, type: 'labelled-scatter', data: [] });
            setLayerName('');
            setError('');
        }
    }

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
            cancel="input, button, .button"
            nodeRef={nodeRef}
            position={position}
            onStop={(e, data) => {
                setPosition({ x: data.x, y: data.y });
                savePosition(data.x, data.y);
            }}
            enableUserSelectHack={false}
        >
            <div
                className="absolute p-4 bg-white left-full ml-2 border rounded-lg shadow-md shrink-0 drag-handle z-50"
                ref={nodeRef}
            >
                <label className="layer-select text-stone-700">Layer Manager:</label>
                <div className={"flex flex-row items-center justify-between gap-4"}>
                    <div className="relative mb-2 items-center justify-center">
                        <input
                            type={'text'}
                            ref={inputRef}
                            className={"px-2 border border-zinc-500 text-stone-500 bg-stone-100 rounded-md max-w-48 max-h-6 input " + (error ? 'border-red-500' : '')}
                            id={'layer-name-input'}
                            value={layerName}
                            onTouchStart={handleInputTouchStart}
                            onMouseDown={handleInputMouseDown}
                            onChange={(e) => {
                                const value = e.target.value;
                                setLayerName(value);
                                if (error) {
                                    // Clear error when user starts typing again
                                    setError('');
                                }
                            }}
                            onBlur={(e) => {
                                const name = e.target.value.trim();
                                if (!name) {
                                    setError('Layer name cannot be empty');
                                    // Clear error after 3 seconds
                                    setTimeout(() => setError(''), 3000);
                                    return;
                                }
                                const exists = layerManager.some(l => l.name === name);
                                if (exists) {
                                    setError('Layer name already taken');
                                    // Clear error after 3 seconds
                                    setTimeout(() => setError(''), 3000);
                                    return;
                                }
                                setError('');
                            }}
                            maxLength={10}
                        />
                        {error && <span className="text-red-500 text-xs absolute -bottom-4 left-0">{error}</span>}
                    </div>
                    <button
                        onClick={eventHandler(() => handleButtonClick())}
                        onTouchStart={eventHandler(() => handleButtonClick())}
                        disabled={isDisabled}
                        className={`p-1 mb-2 max-h-10 text-lg flex-row flex items-center justify-center cursor-pointer ${!isDisabled ?
                            ' text-peach-5 hover:text-peach-4' : ' text-red-700 hover:text-red-400'}`}
                    >
                        <PlusIcon className={'w-4 h-4'} /> Layer
                    </button>
                </div>
                <Separator.Root className="seperator-major" decorative />
                <div className="mt-2 text-stone-500 text-sm p-2">
                    {layerManager.length > 0 ? layerManager.map(layer => (
                        <div key={layer.id}
                            className="flex items-center justify-between">
                            <span className="mr-2 w-35">{layer.name}</span>
                            <div className="relative">
                                <input
                                    type="color"
                                    value={layer.colors?.fill ? layer.colors.fill.slice(0, 7) : randomHex()}
                                    onChange={(e) => updateLayerColorDebounced(layer.id, { fill: e.target.value })}
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
                                    onClick={eventHandler((e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        input.click();
                                    })}
                                    onTouchStart={eventHandler((e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        input.click();
                                    })}
                                />
                            </div>
                            <button
                                onClick={eventHandler(() => toggleLayerVisibility(layer.id))}
                                onTouchStart={eventHandler(() => toggleLayerVisibility(layer.id))}
                                className="w-4 h-4 rounded cursor-pointer text-stone-700 hover:text-stone-900"
                                title="Toggle Visibility"
                            >
                                {layer.visible ? (
                                    <EyeOpenIcon className="w-full h-full" />
                                ) : (
                                    <EyeNoneIcon className="w-full h-full" />
                                )}
                            </button>
                            <button
                                onClick={eventHandler(() => deleteLayer(layer.id))}
                                onTouchStart={eventHandler(() => deleteLayer(layer.id))}
                                aria-label={`Delete layer ${layer.name}`}
                                className="w-4 h-4 rounded cursor-pointer text-red-400 hover:text-red-700"
                            >
                                <TrashIcon className="w-full h-full" />
                            </button>
                        </div>
                    )) :
                        <span
                            className='italic'>No layers currently added. Click "+Layer" button above to add layer.</span>}
                </div>
            </div>
        </Draggable>
    );
}