import { setInRange } from "./generic";

function normalizeColor(color) {
  const normArr = [0, 0, 0];
  for (let i = 0; i < 3; i++) normArr[i] = color[i] / 255;

  return normArr;
}

function convertToRGB(rgba) {
  var rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) rgb[i] = 255 * (1 - rgba[3]) + rgba[i] * rgba[3];

  return rgb;
}

function convertToRGBA(rgb, alpha) {
  var rgba = [255, 255, 255, alpha];
  if (alpha === 0) return rgba;

  for (let c = 0; c < 3; c++)
    rgba[c] = Number(Math.abs((255 * (1 - alpha) - rgb[c]) / alpha).toFixed(0));
  return rgba;
}

function getMergeColor(mixFactor, rgba1, rgba2, normRgba1, normRgba2) {
  mixFactor = setInRange(mixFactor, [0, 1]);
  let mixColor = [0, 0, 0, 1];
  let alpha = rgba1[3] * (1 - mixFactor) + rgba2[3] * mixFactor;

  // merge two colors
  for (let c = 0; c < 3; c++) {
    mixColor[c] = (normRgba2[c] - normRgba1[c]) * mixFactor + normRgba1[c];
    mixColor[c] = Number((mixColor[c] * 255).toFixed(0)); // reset value to 0 - 255
  }

  // resetset with alpha value
  mixColor = convertToRGBA(mixColor, alpha);
  mixColor[3] = parseFloat(mixColor[3].toFixed(3));
  return mixColor;
}

export function hexToRgb(hex) {
  return [
    parseInt(hex[1] + hex[2], 16),
    parseInt(hex[3] + hex[4], 16),
    parseInt(hex[5] + hex[6], 16),
  ];
}

export function rgbToHex(rgb) {
  let hex = "#";
  for (let i = 0; i < 3; i++) {
    let c = rgb[i].toString(16);
    c = c.length === 2 ? c : "0" + c;

    hex += c;
  }
  return hex;
}

export function getColorAtSplit(split, rgba1, rgba2) {
  const normColorUp = normalizeColor(convertToRGB(rgba1));
  const normColorDw = normalizeColor(convertToRGB(rgba2));

  return getMergeColor(split, rgba1, rgba2, normColorUp, normColorDw);
}
