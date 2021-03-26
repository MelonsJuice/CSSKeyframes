import { setInRange } from "./generic";
import { BEZIER } from "./timing";

//////////////////////
// BEZIER FUNCTIONS //
//////////////////////
export function calcBezierCurve(lt, clt, crt, rt, t, axis) {
  return (
    lt[axis] * (1 - t) * (1 - t) * (1 - t) +
    3 * clt[axis] * t * (1 - t) * (1 - t) +
    3 * crt[axis] * t * t * (1 - t) +
    rt[axis] * t * t * t
  );
}

// https://gist.github.com/weepy/6009631
export function solveTatX(clt, crt, x) {
  let a = 3 * clt[0] - 3 * crt[0] + 1;
  let b = (-6 * clt[0] + 3 * crt[0]) / a;
  let c = (3 * clt[0]) / a;
  let d = -x / a;

  let q = (3 * c - b * b) / 9;
  let r = (-(27 * d) + b * (9 * c - 2 * (b * b))) / 54;
  let delta = q * q * q + r * r;
  let term = b / 3;

  if (delta > 0) {
    let s = Math.cbrt(r + Math.sqrt(delta));
    let t = Math.cbrt(r - Math.sqrt(delta));

    // calculate and return only the real solution
    return parseFloat((s + t - term).toFixed(2));
  } // return first solution
  if (delta === 0) return parseFloat((2 * Math.cbrt(r) - term).toFixed(2));

  q = -q;
  let dum = Math.acos(r / Math.sqrt(q * q * q));
  let rz = 2 * Math.sqrt(q);

  // negative delta, three real solutions
  // check if it is the correct solution
  let temp;
  for (let i = 0; i <= 4; i += 2) {
    temp = -term + rz * Math.cos((i * Math.PI + dum) / 3.0);
    if (temp >= 0 && temp <= 1) return parseFloat(temp.toFixed(2));
  }
}

export function splitCurveAtT(t, clt, crt) {
  let temp = [(crt[0] - clt[0]) * t + clt[0], (crt[1] - clt[1]) * t + clt[1]];

  let ltlt = [clt[0] * t, clt[1] * t];
  let rtrt = [(1 - crt[0]) * t + crt[0], (1 - crt[1]) * t + crt[1]];

  let splitrt = [
    (temp[0] - ltlt[0]) * t + ltlt[0],
    (temp[1] - ltlt[1]) * t + ltlt[1],
  ];
  let splitlt = [
    (rtrt[0] - temp[0]) * t + temp[0],
    (rtrt[1] - temp[1]) * t + temp[1],
  ];
  let split = [
    (splitlt[0] - splitrt[0]) * t + splitrt[0],
    (splitlt[1] - splitrt[1]) * t + splitrt[1],
  ];

  // normalize new timings
  let ltScale = [1 / split[0], 1 / split[1]];
  let rtScale = [1 / (1 - split[0]), 1 / (1 - split[1])];

  return {
    splitY: parseFloat(split[1].toFixed(2)),
    ltHalf: {
      curve: BEZIER,
      clt: [
        parseFloat((ltlt[0] * ltScale[0]).toFixed(2)),
        parseFloat((ltlt[1] * ltScale[1]).toFixed(2)),
      ],
      crt: [
        parseFloat((splitrt[0] * ltScale[0]).toFixed(2)),
        parseFloat((splitrt[1] * ltScale[1]).toFixed(2)),
      ],
    },
    rtHalf: {
      curve: BEZIER,
      clt: [
        parseFloat(((splitlt[0] - split[0]) * rtScale[0]).toFixed(2)),
        parseFloat(((splitlt[1] - split[1]) * rtScale[1]).toFixed(2)),
      ],
      crt: [
        parseFloat(((rtrt[0] - split[0]) * rtScale[0]).toFixed(2)),
        parseFloat(((rtrt[1] - split[1]) * rtScale[1]).toFixed(2)),
      ],
    },
  };
}

export function roundCoordX(cp) {
  cp.clt[0] = setInRange(cp.clt[0], [0, 1]);
  cp.crt[0] = setInRange(cp.crt[0], [0, 1]);

  return cp;
}
