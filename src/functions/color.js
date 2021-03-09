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
    rgba[c] = Math.ceil(Math.abs((255 * (1 - alpha) - rgb[c]) / alpha));
  return rgba;
}

// function getBezierValueAt(t, axis, cp) {
//   return (
//     3 * cp[0][axis] * t * (1 - t) * (1 - t) +
//     3 * cp[1][axis] * t * t * (1 - t) +
//     t * t * t
//   );
// }

// function getMergeColor(t, timing, rgba1, rgba2, normRgba1, normRgba2) {
//   let mixFactor = setInRange(getBezierValueAt(t, 1, timing), [0, 1]);
//   let mixColor = [0, 0, 0, 1];
//   let alpha = rgba1[3] * (1 - mixFactor) + rgba2[3] * mixFactor;

//   // merge two colors
//   for (let c = 0; c < 3; c++) {
//     mixColor[c] = (normRgba2[c] - normRgba1[c]) * mixFactor + normRgba1[c];
//     mixColor[c] = Math.ceil(mixColor[c] * 255); // reset value to 0 - 255
//   }

//   // resetset with alpha value
//   mixColor = convertToRGBA(mixColor, alpha);
//   mixColor[3] = parseFloat(mixColor[3].toFixed(3));
//   return mixColor;
// }

function getMergeColor(mixFactor, rgba1, rgba2, normRgba1, normRgba2) {
  mixFactor = setInRange(mixFactor, [0, 1]);
  let mixColor = [0, 0, 0, 1];
  let alpha = rgba1[3] * (1 - mixFactor) + rgba2[3] * mixFactor;

  // merge two colors
  for (let c = 0; c < 3; c++) {
    mixColor[c] = (normRgba2[c] - normRgba1[c]) * mixFactor + normRgba1[c];
    mixColor[c] = Math.ceil(mixColor[c] * 255); // reset value to 0 - 255
  }

  // resetset with alpha value
  mixColor = convertToRGBA(mixColor, alpha);
  mixColor[3] = parseFloat(mixColor[3].toFixed(3));
  return mixColor;
}

// export function getGradient(
//   rgb1,
//   rgb2,
//   alpha1,
//   alpha2,
//   timingFunction,
//   deg = 0
// ) {
//   const colorUp = [...rgb1, alpha1];
//   const colorDw = [...rgb2, alpha2];

//   // normalized colors converted in rgb with white background
//   // this allows to make the most similar gradient
//   const normColorUp = normalizeColor(convertToRGB(colorUp));
//   const normColorDw = normalizeColor(convertToRGB(colorDw));

//   const palette = [];
//   const scale = 0.2;

//   const timing = timingFunction;

//   for (let t = 0; t <= 1; t += scale) {
//     let perc = (getBezierValueAt(t, 0, timing) * 100).toFixed(2);
//     let mixColor = getMergeColor(
//       t,
//       timing,
//       colorUp,
//       colorDw,
//       normColorUp,
//       normColorDw
//     );

//     palette.push({ perc: perc, color: mixColor });
//   }

//   const steps = palette.map((step) => {
//     return `rgba(${step.color[0]}, ${step.color[1]}, ${step.color[2]}, ${step.color[3]}) ${step.perc}%`;
//   });

//   return "linear-gradient(" + deg + "deg, " + steps.join(", ") + ")";
// }

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

// export function getColorAtT(t, timing, hex1, hex2, alpha1, alpha2) {
//   const colorUp = [...hexToRgb(hex1), alpha1];
//   const colorDw = [...hexToRgb(hex2), alpha2];

//   // normalized colors converted in rgb with white background
//   // this allows to make the most similar gradient
//   const normColorUp = normalizeColor(convertToRGB(colorUp));
//   const normColorDw = normalizeColor(convertToRGB(colorDw));

//   return getMergeColor(t, timing, colorUp, colorDw, normColorUp, normColorDw);
// }
export function getColorAtSplit(split, rgba1, rgba2) {
  const normColorUp = normalizeColor(convertToRGB(rgba1));
  const normColorDw = normalizeColor(convertToRGB(rgba2));

  return getMergeColor(split, rgba1, rgba2, normColorUp, normColorDw);
}
