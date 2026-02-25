import { HEADERS_MAPPING, DB_NAME, DB_VERSION } from "./constants";
import React, { useState, useEffect, useRef } from 'react';
import { DBSchema, openDB } from 'idb';

/**
 * Converts SVG text to a data URL that can be used in image sources.
 * @param {string} svgText - The SVG content as a string
 * @returns {string} A data URL in the format 'data:image/svg+xml;charset=utf-8,...'
 */
export const svgToDataURL = (svgText: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
};

/**
 * Exports layer data to a CSV file and triggers a download.
 * Handles different data types including labelled-scatter, search-ring, and route-line layers.
 * For search-ring data, flattens nested compareResults arrays into multiple rows.
 * For route-line data, creates rows from route legs with point-to-point information.
 * 
 * @param {any[]} data - The layer data to export
 * @param {string} type - The type of layer ('labelled-scatter', 'search-ring', or 'route-line')
 * @returns {void} Triggers a CSV file download
 */
export const downloadCsv = (data: any[], type: string) => {

    const headers = HEADERS_MAPPING[type].join(',')

    const rows = 
        type !== 'route-line' ? 
        data.map(obj =>
            Object.entries(obj).map(([key, val]) => {
                if (key === 'compareResults' && Array.isArray(val)) {
                    if (val.length > 0) {
                        let first = true;
                        const compResult = val.map((compVal) => {
                            if (first) {
                                first = false;
                                return Object.values(compVal).map(
                                    v => String(v).replace(/,/g, ' ')).join(",")
                            }
                            else {
                                return `\n${obj['originName'].replace(/,/, ' ')},${obj['originCoords'].join(',')},${obj['searchedDistance']},${obj['compareLayer']},${Object.values(compVal).map(v => String(v).replace(/,/g, ' ')).join(",")}`
                            }
                        })
                        return compResult.join(",");
                    }
                    else {
                        return ",,,";
                    }
                }
                if (key === 'originCoords' && Array.isArray(val)) {
                    return val.join(",");
                }
                else {
                    return String(val).replace(/,/g, ''); // remove commas to avoid CSV issues
                }
            }).join(",").trim()
        ).join("\n")
        :
        data[0].legs.map((leg :any, index: number) => (
            `${data[0].points[index].replace(/,/g, '')},${index + 1 === data[0].points.length ? data[0].points[0].replace(/,/g, '') : data[0].points[index + 1].replace(/,/g, '')},${(leg.distance / 1606.34).toFixed(2)} miles,${Math.ceil((leg.duration / 60))} minutes`)
        ).join("\n")

        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", "exported_data.csv");
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

}

/**
 * Validates a new layer name against existing layer names.
 * If the name already exists, appends a counter (e.g., "Layer Name (2)") to make it unique.
 * 
 * @param {string} newName - The proposed layer name
 * @param {string[]} layers - Array of existing layer names
 * @returns {string} The validated name, either the original or with a counter appended if a duplicate exists
 */
export const validateName = (newName: string, layers: string[]) => {
    if (layers.includes(newName)) {
        const occurrences = layers.filter(layer => layer.startsWith(newName)).length
        return `${newName} (${occurrences})`
    }
        else {
            return newName
        }
}

/**
 * Finds all indices in an array where a specified property matches a given value.
 * @param {any[]} array - The array to search
 * @param {string} propName - The property name to check
 * @param {any} value - The value to match
 * @returns {number[]} An array of indices where the property matches the value
 */
export const getAllIndicesByProperty = (array: any[], propName: string, value: any): number[] => {
    const indices: number[] = [];
    array.forEach((item, index) => {
        if (item[propName] === value) {
            indices.push(index);
        }
    });
    return indices;
}

interface MyDB extends DBSchema {
  'files': {
    key: string;
    value: {
        id: string;
        featureId: string;
        file: File;
        timestamp: string;
    };
    indexes: {
        'by-feature-id' : string;
    }
  };
  // You can define other object stores here
}

async function initializeDatabase(v: number) {
  const db = await openDB<MyDB>(DB_NAME, v, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('files')) {
        const fileStore = db.createObjectStore('files', {
          keyPath: 'id', 
          autoIncrement: true, 
        });

        fileStore.createIndex('by-feature-id', 'featureId', { unique: false });
        console.log('db upgraded to version:', v)
      }
    },
  });

  return db;
}

export const ImagePreview : React.FC<{ files: any[]; }> = ({files}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((i) => (i + 1) % files.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + files.length) % files.length);

  if (files.length === 0) return null;

  const current = files[currentIndex];
  const next = files[(currentIndex + 1) % files.length];

  return (
    <div className="image-preview">
      <button onClick={goPrev}>←</button>
      <img src={URL.createObjectURL(current.file)} alt="current" />
      <div className="file-counter">{currentIndex + 1} / {files.length}</div>
      {files.length > 1 && <img src={URL.createObjectURL(next.file)} alt="next" className="next-preview" />}
      <button onClick={goNext}>→</button>
    </div>
  );
}

export const AddPhotoButton : React.FC<{ featureId: string; }> = ({featureId}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [hasFiles, setHasFiles] = useState<any>(null);
    const [database, setDatabase] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); 

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const addFileToIndexedDB = async (featureId: string, file: File) => {

        const newFile = {
            id: `${featureId}-${Date.now()}`,
            featureId: featureId,
            file: file,
            timestamp: Date.now().toString(),
        };

        await database.add('files', newFile);
    };

    useEffect(() => {
        const initDB = async () => {
            try {
                const db = await initializeDatabase(DB_VERSION);
                setDatabase(db);
            } catch (error) {
                console.error('Error initializing database:', error);
            }
        };

        initDB();
    }, []);

    useEffect(() => {
        if (selectedFile && featureId) {
            addFileToIndexedDB(featureId, selectedFile);
            setSelectedFile(null);
        }
    }, [selectedFile, featureId]);

    useEffect(() => {
        const checkForFiles = async () => {
            if (!database) return;
            
            try {
                const allFiles = await database.getAll('files');
                const featureFiles = allFiles.filter(( f: any ) => f.featureId === featureId);
                setHasFiles(featureFiles);
            } catch (error) {
                console.error('Error checking for files:', error);
            }
        };

        checkForFiles();
    }, [featureId, selectedFile, database]);

    return (
        <div>
            {hasFiles && hasFiles.length > 0 && <ImagePreview files={hasFiles}/>}
            <button onClick={handleClick} className="custom-file-upload-button">
                Upload File
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
