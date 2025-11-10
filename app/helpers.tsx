export const svgToDataURL = (svgText: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
};