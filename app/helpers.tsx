import { HEADERS_MAPPING } from "./constants";

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
