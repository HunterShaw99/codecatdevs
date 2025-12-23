/**
 * Converts a HEX colour to binary RGB values.
 *
 * @param hex - A valid 6‑character hex colour code (e.g. "#FF5733").
 * @returns A tuple of three numbers representing red, green and blue components.
 */
export const hexToRGB = (hex: string): [number, number, number, number] => {
    if (hex.length > 6) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const a = parseInt(hex.slice(7, 9), 16);

        return [r, g, b, a];
    } else {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const a = 255

        return [r, g, b, a];
    }

};

/**
 * Produces a random 6‑digit HEX colour.
 *
 * @returns A new colour in the format "#XXXXXX".
 */
export const randomHex = () => {
    return `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0")}` + 'FF';
};