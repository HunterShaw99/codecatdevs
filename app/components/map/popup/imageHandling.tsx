import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, ArrowLeftIcon, TrashIcon} from '@radix-ui/react-icons'
import { useAtom } from 'jotai';
import { useLayerContext } from "@/app/context/layerContext";
import { photosAtom } from "@/app/atoms";
import { compressImage } from "@/app/utils/imageCompression";

export const ImagePreview : React.FC<{ files: any[]; onDelete: (photoId: string) => void; }> = ({files, onDelete}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((i) => (i + 1) % files.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + files.length) % files.length);

  const handleDelete = () => {
    if (files[currentIndex] && confirm('Are you sure you want to delete this image?')) {
      onDelete(files[currentIndex].id);
    }

    if (files.length > 0) {
        setCurrentIndex(0);
    }
  };

  if (files.length === 0) return null;

  const current = files[currentIndex];
  const next = files[(currentIndex + 1) % files.length];

  return (
    <div className="py-1 flex items-center gap-4">
      <div>
        <img src={current.file} alt="current" className="image-preview"/>
        <div className="file-counter flex flex-row">
            <button onClick={handleDelete} className="delete-image-button mr-2" title="Delete image">
                <TrashIcon />
            </button>
            {currentIndex + 1} / {files.length}
        </div>
      </div>
      {files.length > 1 && (
        <div className="flex flex-col items-center gap-2">
            <img src={next.file} alt="next" className="next-preview" />
            <div className="flex gap-2">
              <button onClick={goPrev}><ArrowLeftIcon/></button>
              <button onClick={goNext}><ArrowRightIcon/></button>
            </div>
        </div>
      )}
    </div>
  );
}

export const AddPhotoButton : React.FC<{ layerId: string, featureId: string; }> = ({layerId, featureId}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [hasFiles, setHasFiles] = useState<any>(null);

    const [photos] = useAtom(photosAtom);

    // layer state
    const {
        addPhotos,
        deletePhoto,
        layerManager
    } = useLayerContext();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = (event : React.MouseEvent ) => {
        event.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleDeletePhoto = (photoId: string) => {
        deletePhoto(layerId, featureId, photoId);
    };

    const addFileToStorage = async (layerId:string, featureId: string, file: File) => {
        try {
            // Compress image to reduce storage size (~5-10x reduction)
            const compressedBase64 = await compressImage(file, 800, 800, 0.7);
            
            const photoId = `${featureId}-${Date.now()}`;
            
            // Store only metadata in layer data, file data separately
            const photoMetadata = {
                id: photoId,
                filename: file.name,
                timestamp: Date.now().toString(),
            };

            addPhotos(layerId, featureId, photoMetadata, compressedBase64);
        } catch (error) {
            console.error('Failed to compress/store image:', error);
            alert('Failed to upload image. Please try again.');
        }
    };

    useEffect(() => {
        if (selectedFile && featureId) {
            addFileToStorage(layerId, featureId, selectedFile);
            setSelectedFile(null);
        }
    }, [selectedFile, layerId, featureId]);

    useEffect(() => {
        const featureData = layerManager.find((p: any) => p.id === layerId)?.data.find((d: any) => d.id === featureId);
        if (featureData?.photoUrls && featureData.photoUrls.length > 0) {
            // Reconstruct full photo objects with file data from photosAtom
            const fullPhotos = featureData.photoUrls.map((photoMeta: any) => ({
                ...photoMeta,
                file: photos[photoMeta.id] || ''
            }));
            setHasFiles(fullPhotos);
        } else {
            setHasFiles(null);
        }
    }, [featureId, layerManager, photos]);

    return (
        <div>
            {hasFiles && hasFiles.length > 0 && <ImagePreview files={hasFiles} onDelete={handleDeletePhoto}/>}
            <button onClick={handleClick} className="custom-file-upload-button">
                Upload Picture
            </button>
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden-input"
                accept="image/png, image/jpeg, image/gif" 
                onChange={handleFileChange} 
            />
        </div>
    );
};
