import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CHANGE_ANIMATION_NAME } from "../../context/actions";
import AppContext from "../../context/AppContext";
import "./AnimationPreview.css";
import animationKeyframes from "./animationKeyframes";
import { getStringTiming } from "../../functions.js";

const AnimationPreview = () => {
  const {
    frame,
    propsCSSList,
    propCSSGroup,
    propCSS,
    propCSSCounter,
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

  /////////////////////////////
  // CSS ANIMATION GENERATOR //
  /////////////////////////////
  const generateAnimation = () => {
    const props = Object.keys(propsCSSList);
    const hash = props.reduce((accumulator, prop) => {
      let key = propsCSSList[prop].animationIndex;
      if (accumulator[key]) accumulator[key].push(prop);
      else accumulator[key] = [prop];
      return accumulator;
    }, {});
    const hashKeys = Object.keys(hash);

    // reset all keyframes
    while (animationKeyframes.sheet.rules.length)
      animationKeyframes.sheet.deleteRule(0);

    // create animation class and remove the previous
    dummyRef.current.classList.remove("animation-class");
    animationKeyframes.sheet.insertRule(`.animation-class {
      animation-name: ${hashKeys.map((key) => animations[key].name).join(", ")};
      animation-duration: ${hashKeys
        .map((key) => {
          return (
            animations[key].duration +
            (animations[key].repeatDelay ? animations[key].delay : "") +
            "s"
          );
        })
        .join(", ")};
      animation-delay: ${hashKeys
        .map((key) => {
          return animations[key].repeatDelay
            ? "0s"
            : animations[key].delay + "s";
        })
        .join(", ")};
      animation-iteration-count: ${hashKeys
        .map((key) =>
          animations[key].infinite ? "infinite" : animations[key].repeat
        )
        .join(", ")};
    }`);

    // create new keyframes
    const keyframesArr = hashKeys.map((key) => {
      let content = "";
      for (let i = 0; i < animations[key].frames.length; i++) {
        let a = animations[key];
        let timing = i < a.frames.length - 1 && getStringTiming(a.timing[i]);
        let offset = a.repeatDelay ? a.delay / (a.duration + a.delay) : 0;
        let perc = a.frames[i] * (1 - offset) + offset;
        let init = a.repeatDelay && i === 0 ? "0%, " : "";

        content += `${init + (perc * 100).toFixed(2)}% {
          ${timing ? "animation-timing-function: " + timing + ";\n" : ""}${hash[
          key
        ]
          .map((prop) => {
            let values;
            if (propsCSSList[prop].father) {
              let children = Object.keys(propsCSSList[prop].children);
              let allProps = "";
              for (let son of children) {
                let p = propsCSSList[prop].children[son];
                allProps += son + "(" + p.values[i] + p.unit + ") ";
              }
              values = prop + ": " + allProps;
            } else {
              let p = propsCSSList[prop];
              values =
                prop +
                ": " +
                (p.type === "color"
                  ? "rgba(" + p.values[i] + ")"
                  : p.values[i] + p.unit);
            }
            return values;
          })
          .join(";\n")}
        }
        `;
      }
      return content;
    });

    // add frames to stylesheet
    for (let i = 0; i < keyframesArr.length; i++) {
      animationKeyframes.sheet.insertRule(
        `@keyframes ${animations[hashKeys[i]].name} {
        ${keyframesArr[i]}
      }`,
        animationKeyframes.sheet.rules.length
      );
    }

    // add animation class to dummy
    void dummyRef.current.offsetHeight; // trigger
    dummyRef.current.classList.add("animation-class");
  };
  ///////////////////////////////

  // update styling on frame click
  const cprop = propCSSGroup
    ? propsCSSList[propCSSGroup].children
    : propsCSSList;
  useEffect(() => {
    previewAllFrames();
  }, [frame, animations[animationIndex].frames.length]);
  useEffect(() => {
    previewFrame(propCSSGroup || propCSS);
  }, [propCSS && cprop[propCSS].values[frame], propCSS && cprop[propCSS].unit]);
  useEffect(() => {
    previewAllFrames();
    return () => {
      dummyRef.current.style = {};
    };
  }, [animationIndex, propCSSCounter]);

  const previewFrame = (key) => {
    if (!key) return;
    if (propsCSSList[key].father) {
      let children = Object.keys(propsCSSList[key].children);
      let allProps = "";
      for (let son of children) {
        let prop = propsCSSList[key].children[son];
        allProps += son + "(" + prop.values[frame] + prop.unit + ") ";
      }
      dummyRef.current.style[key] = allProps;
    } else {
      let prop = propsCSSList[key];
      dummyRef.current.style[key] =
        prop.type === "color"
          ? "rgba(" + prop.values[frame] + ")"
          : prop.values[frame] + prop.unit;
    }
  };
  const previewAllFrames = () => {
    let props = Object.keys(propsCSSList).filter(
      (prop) => propsCSSList[prop].animationIndex === animationIndex
    );
    for (let key of props) previewFrame(key);
  };

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
        <button className="space-big-row" onClick={generateAnimation}>
          play
        </button>
        <button className="space-big-row">view code</button>
      </nav>
      <div ref={dummyRef} id="dummy"></div>
    </section>
  );
};

export default AnimationPreview;
