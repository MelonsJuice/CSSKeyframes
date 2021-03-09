import React, { useContext, useRef } from "react";
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
  const mod = useRef("edit");
  const buttons = useRef([]);

  var canvas, frame, offset, range, scale;

  const handleMoveFrame = (e) => {
    frame = parseInt(e.target.dataset.frame);
    canvas = canvasRef.current.getBoundingClientRect();
    scale = 1 / canvas.width;

    const [anime, index] = [animations, animationIndex];
    let valid = frame > 0 && frame < anime[index].frames.length - 1;
    if (frame >= 0 && frame < anime[index].frames.length - 1)
      dispatch({ type: SET_FRAME, payload: frame });

    // switch different operation
    switch (mod.current) {
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
            // adjust x value
            let fRange = [frames[i] + 0.01, frames[i + 1] - 0.01];
            x = setInRange(x, fRange);

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

  const handleChange = (e) => {
    let btns = buttons.current;
    let toTurnOff = e.target === btns[0] ? 1 : 0;
    btns[toTurnOff].checked = false;

    mod.current = !(btns[0].checked || btns[1].checked)
      ? "edit"
      : btns[0].checked
      ? "add"
      : "remove";
  };

  const addButtonRef = (e) => {
    if (e && !buttons.current.includes(e)) buttons.current.push(e);
  };

  return (
    <section className="frames-bar">
      {/* buttons */}
      <article
        className="flex-row"
        style={{ marginRight: "0.8em" }}
        onChange={handleChange}
      >
        {["+", "-"].map((button) => {
          return (
            <div
              key={button}
              className="space-big-row"
              style={{ position: "relative" }}
            >
              <div className="flex-center app-button">{button}</div>
              <input
                ref={addButtonRef}
                type="checkbox"
                style={{
                  position: "absolute",
                  top: "0",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          );
        })}
      </article>

      {/* frames bar */}
      <article style={{ padding: "0 1.8em" }} onMouseDown={handleMoveFrame}>
        <div ref={canvasRef} className="frames-bar-bar">
          {animations[animationIndex].frames.map((frame, index) => {
            return (
              <span
                key={index}
                className="flex-center frames-bar-frame"
                style={{ left: frame * 100 + "%" }}
                data-frame={index}
              >
                {index + 1}
              </span>
            );
          })}
        </div>
      </article>
    </section>
  );
};

export default FramesBar;
