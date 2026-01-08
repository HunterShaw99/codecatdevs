import { HEADERS_MAPPING } from "./constants";

export const svgToDataURL = (svgText: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
};

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

export const validateName = (newName: string, layers: string[]) => {
    if (layers.includes(newName)) {
        const occurrences = layers.filter(layer => layer.startsWith(newName)).length
        return `${newName} (${occurrences})`
    }
        else {
            return newName
        }
}