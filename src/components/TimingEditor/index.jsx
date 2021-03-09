import React, { useContext, useRef } from "react";
import {
  SET_ANIMATION_FRAME_TIMING,
  SET_CONTROL_POINT,
  SET_CONTROL_POINT_AXIS,
} from "../../context/actions";
import AppContext from "../../context/AppContext";
import {
  isInRange,
  setInRange,
  LINEAR,
  EASE,
  EASEIN,
  EASEOUT,
  EASEINOUT,
  BEZIER,
} from "../../functions";
import Select from "../Select";
import "./TimingEditor.css";

const TimingEditor = () => {
  const { animations, animationIndex, frame, dispatch } = useContext(
    AppContext
  );

  const canvasRef = useRef(null);
  var canvas, point, offset;

  const handleMovePoint = (e) => {
    point = e.target.dataset.point;
    canvas = canvasRef.current.getBoundingClientRect();
    const [animes, index] = [animations, animationIndex];

    // move point if point has been selected
    if (point) {
      let cpoint = animes[index].timing[frame][point];
      offset = [
        e.clientX - (cpoint[0] * canvas.width + canvas.x),
        e.clientY - ((1 - cpoint[1]) * canvas.height + canvas.y),
      ];

      window.addEventListener("mousemove", movePoint);
      window.addEventListener("mouseup", releasePoint);
    }
  };

  const movePoint = (e) => {
    let x = setInRange(e.clientX - offset[0] - canvas.x, [0, canvas.width]);
    let y = e.clientY - offset[1] - canvas.y;
    let posNMZ = [
      parseFloat((x / canvas.width).toFixed(2)),
      parseFloat((1 - y / canvas.height).toFixed(2)),
    ];

    dispatch({
      type: SET_CONTROL_POINT,
      payload: {
        index: animationIndex,
        frame: frame,
        point: point,
        value: posNMZ,
      },
    });
  };

  const releasePoint = () => {
    window.removeEventListener("mousemove", movePoint);
    window.removeEventListener("mouseup", releasePoint);
  };

  const checkPoint = (value, point, axis) => {
    if (value === "")
      dispatch({
        type: SET_CONTROL_POINT_AXIS,
        payload: {
          index: animationIndex,
          frame: frame,
          point: point,
          axis: axis,
          value: point === "clt" ? 0 : 1,
        },
      });
  };

  const setPoint = (value, point, axis, range) => {
    if (isInRange(value, range) || value === "")
      dispatch({
        type: SET_CONTROL_POINT_AXIS,
        payload: {
          index: animationIndex,
          frame: frame,
          point: point,
          axis: axis,
          value: value === "" ? "" : value,
        },
      });
  };

  const setTiming = (preset, wasted) => {
    dispatch({
      type: SET_ANIMATION_FRAME_TIMING,
      payload: {
        frame: frame,
        index: animationIndex,
        timing: preset,
      },
    });
  };

  return (
    <section className="timing-editor-container">
      <div className="timing-editor">
        <div className="flex-row" style={{ padding: "0 4em" }}>
          <span className="flex-center timing-editor-frame">{frame + 1}</span>
          <Select
            value={animations[animationIndex].timing[frame].curve}
            options={[LINEAR, EASE, EASEIN, EASEOUT, EASEINOUT, BEZIER]}
            direction="top"
            callback={setTiming}
          />
          <span className="flex-center timing-editor-frame">{frame + 2}</span>
        </div>
        <article className="flex-center timing-editor-curve">
          <svg ref={canvasRef} viewBox="0 0 1 1" onMouseDown={handleMovePoint}>
            {/* lines */}
            {[
              ["clt", "var(--color-dodge-blue"],
              ["crt", "var(--color-purple"],
            ].map((cp) => {
              return (
                <line
                  key={cp[0]}
                  x1={cp[0] === "clt" ? 0 : 1}
                  y1={cp[0] === "clt" ? 1 : 0}
                  x2={animations[animationIndex].timing[frame][cp[0]][0] || 0}
                  y2={1 - animations[animationIndex].timing[frame][cp[0]][1]}
                  style={{
                    stroke: cp[1],
                    strokeWidth: "0.04",
                    fill: "none",
                    opacity: "0.4",
                  }}
                />
              );
            })}

            {/* curve */}
            <path
              d={`M0 1 C ${
                animations[animationIndex].timing[frame].clt[0] || 0
              } ${1 - animations[animationIndex].timing[frame].clt[1]}, ${
                animations[animationIndex].timing[frame].crt[0] || 0
              } ${1 - animations[animationIndex].timing[frame].crt[1]} 1 0`}
              style={{
                stroke: "var(--font-color)",
                strokeWidth: "0.04",
                fill: "none",
                strokeLinecap: "round",
              }}
            />

            {/* control points */}
            {[
              ["clt", "var(--color-dodge-blue"],
              ["crt", "var(--color-purple"],
            ].map((cp) => {
              return (
                <circle
                  key={cp}
                  r="0.06"
                  cx={animations[animationIndex].timing[frame][cp[0]][0] || 0}
                  cy={1 - animations[animationIndex].timing[frame][cp[0]][1]}
                  data-point={cp[0]}
                  style={{ cursor: "pointer", fill: cp[1] }}
                />
              );
            })}
          </svg>
        </article>
        <article className="flex-row" style={{ fontSize: "1.6em" }}>
          {["clt", "crt"].map((cp) => {
            return (
              <div key={cp} className="timing-editor-coords-point">
                <div className="timing-editor-coords-point-input">
                  <span>x</span>
                  <input
                    type="number"
                    value={animations[animationIndex].timing[frame][cp][0]}
                    onChange={(e) => setPoint(e.target.value, cp, 0, [0, 1])}
                    onBlur={(e) => checkPoint(e.target.value, cp, 0)}
                  />
                  <span>y</span>
                  <input
                    type="number"
                    value={animations[animationIndex].timing[frame][cp][1]}
                    onChange={(e) =>
                      setPoint(e.target.value, cp, 1, [null, null])
                    }
                    onBlur={(e) => checkPoint(e.target.value, cp, 1)}
                  />
                </div>
              </div>
            );
          })}
        </article>
      </div>
    </section>
  );
};

export default TimingEditor;
