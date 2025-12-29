import { on } from 'events';
import React, { useState, CSSProperties } from 'react';

import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from 'react-papaparse';

const LAT_HEADERS = ['latitude', 'lat', 'y']
const LNG_HEADERS = ['longitude', 'lng', 'long', 'x']
const NAME_HEADERS = ['name', 'id', 'location']

const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);

const styles = {
  remove: {
    height: 23,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};


export default function CSVReader({ onUpload }: { onUpload: (results: any) => void }) {
  const { CSVReader } = useCSVReader();
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );
  const [error, setError] = useState<string | null>(null);

  const checkHeader = (header : string) => {
        const acceptedHeaders = ['latitude', 'lat', 'y', 'longitude', 'lng', 'long', 'x', 'name', 'id', 'location'];

        if (!acceptedHeaders.includes(header)) {
            setError(`Invalid header: ${header}. Accepted headers are: ${acceptedHeaders.join(', ')}`);
            throw new Error(`Invalid header: ${header}. Accepted headers are: ${acceptedHeaders.join(', ')}`);
        }
        setError(null);
    }

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {   
        onUpload(results);
      }}
        config={{ header: true,
            transformHeader: (header : any) => {
                const cleanHeader = header.trim().toLowerCase();
                checkHeader(cleanHeader);

                if (LAT_HEADERS.includes(cleanHeader)) {
                    return 'latitude';
                }
                if (LNG_HEADERS.includes(cleanHeader)) {
                    return 'longitude';
                }   
                if (NAME_HEADERS.includes(cleanHeader)) {
                    return 'name';
                }   
        },
            transform: (value : any) => {
        return value.trim();
        },
        dynamicTyping: true
        }}
        
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: any) => (
        <>
          <div
            {...getRootProps()}
            className='items-center flex flex-col h-full justify-center p-4 text-sm text-stone-500 border border-dashed border-zinc-200 rounded-md
            hover:bg-stone-100 hover:border-zinc-300 transition-colors duration-200 cursor-pointer'
          >
            {acceptedFile && !error ? (
              <>
                <div className='h-20 w-25 p-2 flex flex-col justify-center relative z-10 bg-linear-to-r from-peach-5 to-peach-7 rounded-md'>
                  <div className='flex flex-col items-center px-10'>
                    <span className='mb-1 text-xs text-white justify-center flex flex-row'>
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span className='text-sm text-white mb-1'>{acceptedFile.name}</span>
                  </div>
                  <div className='bottom-1 absolute w-full px-4'>
                    <ProgressBar />
                  </div>
                  <div
                    {...getRemoveFileProps()}
                    style={styles.remove}
                    onMouseOver={(event: Event) => {
                      event.preventDefault();
                      setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                    }}
                    onMouseOut={(event: Event) => {
                      event.preventDefault();
                      setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                    }}
                  >
                    <Remove color={removeHoverColor} />
                  </div>
                </div>
              </>
            ) : 
            error ? (
                <div className='text-red-500 text-center'>
                    {error}
                </div>
            ) :
              'Drop CSV file here or click to upload'
            }
          </div>
        </>
      )}
    </CSVReader>
  );
}