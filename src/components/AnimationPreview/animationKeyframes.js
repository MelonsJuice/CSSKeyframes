const animationKeyframes = document.createElement("style");
const initStyle = `display: flex;
justify-content: center;
align-items: center;
font-size: 10px;
width: 16em;
height: 16em;
padding: 0;
border: 0px solid var(--color-purple);
transform-origin: center;
transition: 0.4s ease;`;

document.head.appendChild(animationKeyframes);
// #dummy style
animationKeyframes.sheet.insertRule(
  `#dummy {
  ${initStyle}
}`,
  0
);

export { animationKeyframes, initStyle };
