export const propsList = {
  Transform: [
    {
      name: "translateX",
      range: [null, null],
      type: "number",
      group: "transform",
    },
    {
      name: "translateY",
      range: [null, null],
      type: "number",
      group: "transform",
    },
    { name: "scaleX", range: [0, null], type: "number", group: "transform" },
    { name: "scaleY", range: [0, null], type: "number", group: "transform" },
    {
      name: "rotateX",
      range: [null, null],
      type: "number",
      group: "transform",
    },
    {
      name: "rotateY",
      range: [null, null],
      type: "number",
      group: "transform",
    },
    { name: "skewX", range: [null, null], type: "number", group: "transform" },
    { name: "skewY", range: [null, null], type: "number", group: "transform" },
  ],

  Border: [
    { name: "border-radius", range: [0, null], type: "number" },
    { name: "border-top-left-radius", range: [0, null], type: "number" },
    { name: "border-top-right-radius", range: [0, null], type: "number" },
    { name: "border-bottom-right-radius", range: [0, null], type: "number" },
    { name: "border-bottom-left-radius", range: [0, null], type: "number" },
    { name: "border-color", type: "color" },
    { name: "border-top-color", type: "color" },
    { name: "border-right-color", type: "color" },
    { name: "border-bottom-color", type: "color" },
    { name: "border-left-color", type: "color" },
    { name: "border-width", type: "number", range: [0, null] },
    { name: "border-top-width", type: "number", range: [0, null] },
    { name: "border-right-width", type: "number", range: [0, null] },
    { name: "border-bottom-width", type: "number", range: [0, null] },
    { name: "border-left-width", type: "number", range: [0, null] },
  ],

  Size: [
    { name: "width", range: [0, null], type: "number" },
    { name: "min-width", range: [0, null], type: "number" },
    { name: "max-width", range: [0, null], type: "number" },
    { name: "height", range: [0, null], type: "number" },
    { name: "min-height", range: [0, null], type: "number" },
    { name: "max-height", range: [0, null], type: "number" },
  ],

  Absolute: [
    { name: "top", range: [null, null], type: "number" },
    { name: "right", range: [null, null], type: "number" },
    { name: "bottom", range: [null, null], type: "number" },
    { name: "left", range: [null, null], type: "number" },
  ],

  Appearance: [{ name: "opacity", range: [0, 1], type: "number" }],

  Text: [
    { name: "font-size", range: [0, null], type: "number" },
    { name: "font-color", type: "color" },
    { name: "font-weight", range: [0, null], type: "number" },
    { name: "font-stretch", range: [0, null], type: "number" },
    { name: "letter-spacing", range: [0, null], type: "number" },
    { name: "word-spacing", range: [0, null], type: "number" },
  ],
};
