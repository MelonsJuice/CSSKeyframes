import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useRef, useState } from "react";
import {
  ADD_ANIMATION_FRAME,
  REMOVE_ANIMATION_FRAME,
  SET_ANIMATION_FRAME,
  SET_FRAME,
} from "../../context/actions";
import AppContext from "../../context/AppContext";
import { setInRange } from "../../functions";
import "./FramesBar.css";

const FramesBar = () => {
  const { animations, animationIndex, dispatch } = useContext(AppContext);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const [mode, setMode] = useState("edit");
  const buttons = useRef([]);

  var canvas, frame, offset, range, scale;
  const handleMoveFrame = (e) => {
    frame = parseInt(e.target.dataset.frame);
    canvas = canvasRef.current.getBoundingClientRect();
    scale = 1 / canvas.width;

    const [anime, index] = [animations, animationIndex];
    let valid = frame > 0 && frame < anime[index].frames.length - 1;
    if (frame >= 0 && frame < anime[index].frames.length)
      dispatch({ type: SET_FRAME, payload: frame });

    // switch different operation
    switch (mode) {
      case "edit":
        if (!valid) return; // return if no valid frame has been selected

        let frameSelected = anime[index].frames[frame];
        offset = e.clientX - (frameSelected * canvas.width + canvas.x);
        range = [
          anime[index].frames[frame - 1] + 0.01, // 0.01 min distance
          anime[index].frames[frame + 1] - 0.01, // 0.01 min distance
        ];

        window.addEventListener("mousemove", moveFrame);
        window.addEventListener("mouseup", releaseFrame);
        break;

      case "add":
        if (frame >= 0) return; // return if no empty space has selected

        let newIndex;
        let x = (e.clientX - canvas.x) * scale;
        let frames = anime[index].frames;

        // search the pos for new frame
        for (let i = 0; i < frames.length - 1; i++)
          if (x > frames[i] && x < frames[i + 1]) {
            let fRange = [frames[i] + 0.01, frames[i + 1] - 0.01];
            x = setInRange(x, fRange); // adjust x value
            newIndex = i + 1;
            break;
          }
        dispatch({
          type: ADD_ANIMATION_FRAME,
          payload: { animeIndex: index, pos: x, frameIndex: newIndex },
        });
        break;

      case "remove":
        if (valid)
          dispatch({
            type: REMOVE_ANIMATION_FRAME,
            payload: { animeIndex: index, frameIndex: frame },
          });
        break;
      default:
        return;
    }
  };

  const moveFrame = (e) => {
    let nextPos = setInRange((e.clientX - offset - canvas.x) * scale, range);
    dispatch({
      type: SET_ANIMATION_FRAME,
      payload: { index: animationIndex, frame: frame, value: nextPos },
    });
  };

  const releaseFrame = () => {
    window.removeEventListener("mousemove", moveFrame);
    window.removeEventListener("mouseup", releaseFrame);
  };

  const handlePreviewFrame = (e) => {
    canvas = canvasRef.current.getBoundingClientRect();
    previewRef.current.style.transform = "translate(-50%, -0.36em) scale(1)";
    mode === "add" && window.addEventListener("mousemove", movePreviewFrame);
  };

  const removeHandlePreviewFrame = () => {
    previewRef.current.style.transform = "translate(-50%, -0.36em) scale(0)";
    window.removeEventListener("mousemove", movePreviewFrame);
  };

  const movePreviewFrame = (e) => {
    let nextPos = setInRange(e.clientX - canvas.x, [0, canvas.width]);
    let perc = ((nextPos / canvas.width) * 100).toFixed(0);

    previewRef.current.style.left = perc + "%";
    previewRef.current.children[1].children[0].innerText = perc + "%";
  };

  const handleChange = (e) => {
    let btns = buttons.current;
    let toTurnOff = e.target === btns[0] ? 1 : 0;
    btns[toTurnOff].checked = false;

    setMode(
      !(btns[0].checked || btns[1].checked)
        ? "edit"
        : btns[0].checked
        ? "add"
        : "remove"
    );
  };

  const addButtonRef = (e) => {
    if (e && !buttons.current.includes(e)) buttons.current.push(e);
  };

  return (
    <section className="frames-bar">
      {/* frames bar */}
      <article style={{ padding: "0 1em" }} onMouseDown={handleMoveFrame}>
        <div
          ref={canvasRef}
          className="frames-bar-bar"
          onMouseEnter={handlePreviewFrame}
          onMouseLeave={removeHandlePreviewFrame}
        >
          {/* preview frame */}
          <div
            ref={previewRef}
            className="frames-bar-frame-container"
            style={{
              display: mode === "add" ? "block" : "none",
              opacity: "0.8",
              transition: "transform 0.2s cubic-bezier(0.06, 0.55, 0, 1)",
            }}
          >
            <span className="flex-center frames-bar-frame">
              <h2>?</h2>
            </span>
            <span className="flex-center frames-bar-frame-baloon">
              <h2></h2>
            </span>
          </div>
          {animations[animationIndex].frames.map((frame, index) => {
            return (
              <div
                key={index}
                className="frames-bar-frame-container"
                style={{ left: frame * 100 + "%" }}
              >
                <span
                  className="flex-center frames-bar-frame"
                  data-frame={index}
                >
                  <h2 data-frame={index}>{index + 1}</h2>
                </span>
                <span className="flex-center frames-bar-frame-baloon">
                  <h2>{(frame * 100).toFixed(0) + "%"}</h2>
                </span>
              </div>
            );
          })}
        </div>
      </article>

      {/* buttons */}
      <article
        className="flex-row"
        style={{ marginLeft: "0.8em" }}
        onChange={handleChange}
      >
        {[
          ["add", faPlus],
          ["remove", faMinus],
        ].map((button) => {
          return (
            <div
              key={button[0]}
              className={
                "flex-center space-mid-row app-button" +
                (mode === button[0] ? "-pressed" : "")
              }
              style={{
                position: "relative",
                width: "2.25em",
                height: "2.25em",
                borderRadius: "0.8em",
              }}
            >
              <div
                className="pop-up-background"
                style={{
                  borderRadius: "0.8em",
                  transform: "scale(" + (mode === button[0] ? "1" : "0") + ")",
                }}
              ></div>
              <FontAwesomeIcon icon={button[1]} />
              <input
                ref={addButtonRef}
                type="checkbox"
                style={{
                  position: "absolute",
                  top: "0",
                  opacity: "0",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default FramesBar;
