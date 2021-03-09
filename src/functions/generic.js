/////////////
// GENERIC //
/////////////
export function setInRange(value, range) {
  let valueInRange = value;
  if (valueInRange < range[0] && range[0] !== null) valueInRange = range[0];
  if (valueInRange > range[1] && range[1] !== null) valueInRange = range[1];

  return valueInRange;
}

export function isInRange(value, range) {
  let minCheck = range[0] === null ? true : value >= range[0];
  let maxCheck = range[1] === null ? true : value <= range[1];

  return minCheck && maxCheck;
}

export function filterObject(obj, removeKey) {
  let keys = Object.keys(obj);
  let filter = {};

  for (let key of keys) if (key !== removeKey) filter[key] = obj[key];
  return filter;
}

export function roundFloat(num) {
  return parseFloat(num.toFixed(2));
}
