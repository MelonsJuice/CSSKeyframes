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
      range: [null, null],
      type: "number",
      group: "transform",
    },
    {
      name: "scaleY",
      range: [null, null],
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
      name: "rotateZ",
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
      unit: "deg",
    },
    {
      name: "skewY",
      range: [null, null],
      type: "number",
      group: "transform",
      unit: "deg",
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

  Padding: [
    { name: "padding", range: [0, null], type: "number", unit: "multiple" },
    { name: "padding-top", range: [0, null], type: "number", unit: "multiple" },
    {
      name: "padding-right",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "padding-bottom",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "padding-left",
      range: [0, null],
      type: "number",
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

  Background: [
    { name: "background-color", type: "color" },
    // {name: "background-position", range: [null, null], type: ["number", "number"], unit: "multiple"}, WIP
  ],

  Text: [
    { name: "font-size", range: [0, null], type: "number", unit: "multiple" },
    { name: "color", type: "color" },
    { name: "font-weight", range: [0, null], type: "number" },
    { name: "font-stretch", range: [0, null], type: "number", unit: "%" },
    {
      name: "letter-spacing",
      range: [0, null],
      type: "number",
      unit: "multiple",
    },
    {
      name: "text-indent",
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
