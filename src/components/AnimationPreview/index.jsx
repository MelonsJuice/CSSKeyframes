import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CHANGE_ANIMATION_NAME } from "../../context/actions";
import AppContext from "../../context/AppContext";
import "./AnimationPreview.css";

const AnimationPreview = () => {
  const {
    frame,
    propsCSSList,
    propCSSGroup,
    propCSS,
    animations,
    animationIndex,
    animationName,
    dispatch,
  } = useContext(AppContext);
  const [className, setClassName] = useState(animationName);
  const dummyRef = useRef(null);

  const handleNameChange = (e) => {
    let value = e.target.value;
    let check =
      value === "-" ? ["-"] : value.match(/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g);
    let name = check || [""];
    value === name[0] && setClassName(name[0]);
  };

  const changeClassName = (e) => {
    e.preventDefault();
    let check = className || "anime";
    !className && setClassName("anime");

    animationName !== check &&
      dispatch({
        type: CHANGE_ANIMATION_NAME,
        payload: check,
      });
  };

  useEffect(() => {
    if (!propCSS) return;
    if (propCSSGroup) {
      let prop = propsCSSList[propCSSGroup].children[propCSS];
      dummyRef.current.style[propCSSGroup] =
        propCSS + "(" + prop.values[frame] + prop.unit + ")";
    } else {
      let prop = propsCSSList[propCSS];
      dummyRef.current.style[propCSS] =
        prop.type === "color"
          ? "rgba(" + prop.values[frame] + ")"
          : prop.values[frame] + prop.unit;
    }

    return () => {
      console.log("on return:", propCSSGroup, propCSS);
    };
  }, [frame, animations[animationIndex].frames.length, propCSSGroup, propCSS]);

  return (
    <section className="animation-preview flex-center">
      <nav className="flex-row animation-preview-nav">
        <form
          className="flex-row space-big-row"
          style={{
            padding: "0.2em",
            borderRadius: "0.4em",
            boxShadow: "var(--hollow-shadow)",
          }}
          onSubmit={changeClassName}
        >
          <input
            type="text"
            value={className}
            onChange={handleNameChange}
            placeholder="insert a name"
            style={{ fontWeight: "700", width: "max-content" }}
          />
          <button
            onSubmit={changeClassName}
            className="flex-center send-button"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
        <button className="space-big-row">play</button>
        <button className="space-big-row">view code</button>
      </nav>
      <div ref={dummyRef} id="dummy"></div>
    </section>
  );
};

export default AnimationPreview;
