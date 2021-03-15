export const propsList = {
  Transform: [
    {
      name: "translateX",
      range: [null, null],
      type: "number",
      group: "transform",
      unit: "multiple",
    },
    {
      name: "translateY",
      range: [null, null],
      type: "number",
      group: "transform",
      unit: "multiple",
    },
    {
      name: "scaleX",
      range: [0, null],
      type: "number",
      group: "transform",
    },
    {
      name: "scaleY",
      range: [0, null],
      type: "number",
      group: "transform",
    },
    {
      name: "rotateX",
      range: [null, null],
      type: "number",
      group: "transform",
      unit: "deg",
    },
    {
      name: "rotateY",
      range: [null, null],
      type: "number",
      group: "transform",
      unit: "deg",
    },
    {
      name: "skewX",
      range: [null, null],
      type: "number",
      group: "transform",
      unit: "multiple",
    },
    {
      name: "skewY",
      range: [null, null],
      type: "number",
      group: "transform",
      unit: "multiple",
    },
  ],

  Border: [
    {
      name: "border-radius",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "border-top-left-radius",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "border-top-right-radius",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "border-bottom-right-radius",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "border-bottom-left-radius",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    { name: "border-color", type: "color" },
    { name: "border-top-color", type: "color" },
    { name: "border-right-color", type: "color" },
    { name: "border-bottom-color", type: "color" },
    { name: "border-left-color", type: "color" },
    {
      name: "border-width",
      type: "number",
      range: [0, null],
      unit: "multiple",
    },
    {
      name: "border-top-width",
      type: "number",
      range: [0, null],
      unit: "multiple",
    },
    {
      name: "border-right-width",
      type: "number",
      range: [0, null],
      unit: "multiple",
    },
    {
      name: "border-bottom-width",
      type: "number",
      range: [0, null],
      unit: "multiple",
    },
    {
      name: "border-left-width",
      type: "number",
      range: [0, null],
      unit: "multiple",
    },
  ],

  Size: [
    { name: "width", range: [0, null], type: "number", unit: "multiple" },
    { name: "min-width", range: [0, null], type: "number", unit: "multiple" },
    { name: "max-width", range: [0, null], type: "number", unit: "multiple" },
    { name: "height", range: [0, null], type: "number", unit: "multiple" },
    { name: "min-height", range: [0, null], type: "number", unit: "multiple" },
    { name: "max-height", range: [0, null], type: "number", unit: "multiple" },
  ],

  Absolute: [
    { name: "top", range: [null, null], type: "number", unit: "multiple" },
    { name: "right", range: [null, null], type: "number", unit: "multiple" },
    { name: "bottom", range: [null, null], type: "number", unit: "multiple" },
    { name: "left", range: [null, null], type: "number", unit: "multiple" },
  ],

  Appearance: [{ name: "opacity", range: [0, 1], type: "number" }],

  Text: [
    { name: "font-size", range: [0, null], type: "number", unit: "multiple" },
    { name: "font-color", type: "color" },
    { name: "font-weight", range: [0, null], type: "number" },
    { name: "font-stretch", range: [0, null], type: "number" },
    {
      name: "letter-spacing",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "word-spacing",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
  ],
};
