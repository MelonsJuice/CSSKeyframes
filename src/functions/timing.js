export const LINEAR = "linear";
export const EASE = "ease";
export const EASEIN = "ease-in";
export const EASEOUT = "ease-out";
export const EASEINOUT = "ease-in-out";
export const BEZIER = "cubic-bezier";

export function getTiming(timing) {
  switch (timing) {
    case EASE:
      return { curve: EASE, clt: [0.25, 0.1], crt: [0.25, 1] };
    case EASEIN:
      return { curve: EASEIN, clt: [0.42, 0], crt: [1, 1] };
    case EASEOUT:
      return { curve: EASEOUT, clt: [0, 0], crt: [0.58, 1] };
    case EASEINOUT:
      return { curve: EASEINOUT, clt: [0.42, 0], crt: [0.58, 1] };
    case BEZIER:
      return { curve: BEZIER, clt: [0.5, 0], crt: [0.5, 1] };
    default:
      // return linear in other case
      return { curve: LINEAR, clt: [0, 0], crt: [1, 1] };
  }
}

export function getStringTiming(timingObject) {
  return timingObject.curve === BEZIER
    ? "cubic-bezier(" +
        timingObject.clt.join(", ") +
        ", " +
        timingObject.crt.join(", ") +
        ")"
    : timingObject.curve;
}
