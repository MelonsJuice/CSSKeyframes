import React, { useContext, useRef } from "react";
import "./AnimationEditor.css";

import Select from "../Select";
import AppContext from "../../context/AppContext";
import {
  faInfinity,
  faMinus,
  faPlus,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ADD_ANIMATION,
  DELETE_ANIMATION,
  SET_ANIMATION,
  SET_ANIMATION_PARAMETER,
} from "../../context/actions";
import { isInRange } from "../../functions";

//////////////////////
// ANIMATION EDITOR //
//////////////////////
const AnimationEditor = () => {
  const { animations, animationIndex, dispatch } = useContext(AppContext);
  const animeCount = useRef(0);

  const checkValue = (parameter, value) => {
    if (value === "")
      dispatch({
        type: SET_ANIMATION_PARAMETER,
        payload: {
          parameter: parameter,
          index: animationIndex,
          value: 1,
        },
      });
  };

  const setValue = (parameter, value, range) => {
    if (isInRange(value, range) || value === "")
      dispatch({
        type: SET_ANIMATION_PARAMETER,
        payload: {
          parameter: parameter,
          index: animationIndex,
          value: value,
        },
      });
  };

  const editAnimationParameter = (parameter, value) => {
    dispatch({
      type: SET_ANIMATION_PARAMETER,
      payload: {
        parameter: parameter,
        index: animationIndex,
        value: value,
      },
    });
  };

  const addAnimation = () => {
    animeCount.current += 1;
    dispatch({ type: ADD_ANIMATION, payload: animeCount.current });
  };

  const deleteAnimation = () => {
    animations.length > 1 &&
      dispatch({
        type: DELETE_ANIMATION,
        payload: animationIndex,
      });
  };

  return (
    <section className="animation-editor flex-row">
      {/* create, delete animation */}
      <article className="flex-row" style={{ width: "max-content" }}>
        <Select
          value={animations[animationIndex].name}
          options={animations.map((animation) => animation.name)}
          direction="bottom"
          callback={(value, index) => {
            dispatch({ type: SET_ANIMATION, payload: index });
          }}
        />
        <div style={{ marginLeft: "0.6em" }}>
          {[
            [addAnimation, faPlus],
            [deleteAnimation, faMinus],
          ].map((btn, index) => {
            return (
              <button
                key={index}
                className="app-button space-mid-row"
                onClick={btn[0]}
              >
                <FontAwesomeIcon icon={btn[1]} />
              </button>
            );
          })}
        </div>
      </article>

      {/* animation parameters */}
      <article
        className="flex-center"
        style={{ width: "max-content", fontSize: "1.6em" }}
      >
        <AnimationInput
          prop="duration"
          value={animations[animationIndex].duration}
          min={0}
          unit="sec"
          onChange={setValue}
          onBlur={checkValue}
          sibling={null}
        />
        <AnimationInput
          prop="delay"
          value={animations[animationIndex].delay}
          min={0}
          unit="sec"
          onChange={setValue}
          onBlur={checkValue}
          sibling={
            <div>
              <input
                type="checkbox"
                checked={animations[animationIndex].repeatDelay}
                onChange={(e) =>
                  editAnimationParameter("repeatDelay", e.target.checked)
                }
              />
              <FontAwesomeIcon icon={faRedoAlt} />
            </div>
          }
        />
        <AnimationInput
          prop="repeat"
          value={animations[animationIndex].repeat}
          min={1}
          unit={null}
          onChange={setValue}
          onBlur={checkValue}
          sibling={
            <div>
              <FontAwesomeIcon icon={faInfinity} />
              <input
                type="checkbox"
                checked={animations[animationIndex].infinite}
                onChange={(e) =>
                  editAnimationParameter("infinite", e.target.checked)
                }
              />
            </div>
          }
        />
      </article>
    </section>
  );
};

////////////////////////////////
// ANIMATION INPUT PARAMETERS //
////////////////////////////////
const AnimationInput = ({
  prop,
  value,
  min,
  unit,
  onChange,
  onBlur,
  sibling,
}) => {
  return (
    <div
      className="flex-row space-big-double-row"
      style={{ width: "max-content" }}
    >
      <label>{prop}</label>
      <div
        className="flex-row"
        style={{ width: "max-content", background: "blue" }}
      >
        {sibling}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(prop, e.target.value, [min, null])}
          onBlur={(e) => onBlur(prop, e.target.value)}
          style={{ background: "grey", textAlign: "right" }}
        />
        <span>{unit}</span>
      </div>
    </div>
  );
};

export default AnimationEditor;
