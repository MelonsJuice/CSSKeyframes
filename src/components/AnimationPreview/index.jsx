import {
  faPaperPlane,
  faPlus,
  faMinus,
  faPlay,
  faPause,
  faEdit,
  faStepBackward,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  ADD_ANIMATION,
  CHANGE_ANIMATION_NAME,
  DELETE_ANIMATION,
  SAVE_CHANGES,
  SET_ANIMATION,
  SET_FRAME,
} from "../../context/actions";
import AppContext from "../../context/AppContext";
import "./AnimationPreview.css";
import animationKeyframes from "./animationKeyframes";
import { getStringTiming } from "../../functions.js";
import Select from "../Select";

const AnimationPreview = () => {
  const {
    frame,
    changes,
    propsCSSList,
    propCSSGroup,
    propCSS,
    propCSSCounter,
    animations,
    animationIndex,
    animationName,
    dispatch,
  } = useContext(AppContext);
  // animation states
  const [className, setClassName] = useState(animationName);
  const [running, setRunning] = useState(false);
  const [restart, setRestart] = useState(false);
  const restartRef = useRef(null);
  const dummyRef = useRef(null);
  const animeCount = useRef(0);

  // editor states
  const [HTMLCode, setHTMLCode] = useState("");
  const [CSSCode, setCSSCode] = useState("");
  const [editorSelected, setEditorSelected] = useState("HTML");

  ///////////////////////
  // ANIMATION HANDLES //
  ///////////////////////
  const handleNameChange = (e) => {
    let value = e.target.value;
    let check =
      value === "-" ? ["-"] : value.match(/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g);
    let name = check || [""];
    value === name[0] && setClassName(name[0]);
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
      animation-fill-mode: ${hashKeys
        .map((key) => animations[key].fillMode)
        .join(", ")};
      animation-direction: ${hashKeys
        .map((key) => animations[key].direction)
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

  const playAnimation = () => {
    setRunning(!running);
    restartRef.current.style.color = "var(--color-purple)";

    if (restart) {
      void dummyRef.current.offsetHeight; // trigger
      dummyRef.current.classList.add("animation-class");
      dummyRef.current.style.animationPlayState = "running";
      setRestart(false);
    } else {
      dummyRef.current.style.animationPlayState = running
        ? "paused"
        : "running";
    }
  };
  const restartAnimation = () => {
    restartRef.current.style.color = "var(--font-color)";
    dummyRef.current.classList.remove("animation-class");
    dummyRef.current.style.animationPlayState = "paused";
    ReactDOM.unstable_batchedUpdates(() => {
      setRunning(false);
      setRestart(true);
      dispatch({ type: SET_FRAME, payload: 0 });
    });
  };
  const updateAnimation = () => {
    if (changes) {
      dispatch({ type: SAVE_CHANGES });
      generateAnimation();
      restartAnimation();
    }
  };

  ////////////////////
  // STYLING UPDATE //
  ////////////////////
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

  ///////////////////////////
  // EDITOR CHANGES HANDLE //
  ///////////////////////////
  const applyChanges = () => {
    switch (editorSelected) {
      case "HTML":
        dummyRef.current.innerHTML = HTMLCode;
        break;
      case "CSS":
        break;
      default:
        return;
    }
  };

  return (
    <section className="animation-preview flex-center">
      <nav className="flex-row animation-preview-nav">
        <article
          className="flex-row"
          style={{ width: "max-content", fontSize: "0.5em" }}
        >
          {/* animation selection */}
          <Select
            value={animations[animationIndex].name}
            options={animations.map((animation) => animation.name)}
            direction="top"
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

        {/* change animations names */}
        <div className="flex-row">
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

          {/* play/pause - restart - update animation */}
          <div className="flex-row space-mid-row">
            <button
              className="flex-center space-small-row"
              onClick={updateAnimation}
              style={{
                position: "relative",
                padding: "0.2em 0.6em",
                fontWeight: "700",
                color: changes ? "#fff" : "var(--font-color)",
                transition: "color 0.2s ease",
              }}
            >
              <div
                className="pop-up-background"
                style={{
                  borderRadius: "0.4em",
                  transform: "scale(" + (changes ? "1" : "0") + ")",
                }}
              ></div>
              Update
            </button>
            <button className="space-small-row" onClick={restartAnimation}>
              <span
                ref={restartRef}
                className="flex-row"
                style={{ transition: "0.2s ease" }}
              >
                <FontAwesomeIcon icon={faStepBackward} />
              </span>
            </button>
            <button className="space-small-row" onClick={playAnimation}>
              <FontAwesomeIcon
                icon={running ? faPause : faPlay}
                style={{ fontSize: "0.8em" }}
              />
            </button>
          </div>

          {/* edit dummy */}
          <button className="flex-center space-mid-row animation-preview-button">
            Dummy&nbsp;&nbsp;
            <FontAwesomeIcon icon={faEdit} style={{ fontSize: "0.8em" }} />
          </button>

          {/* copy & view code */}
          <button className="flex-center space-mid-row animation-preview-button">
            Code&nbsp;&nbsp;
            <FontAwesomeIcon icon={faCode} style={{ fontSize: "0.8em" }} />
          </button>
        </div>
      </nav>
      <div className="animation-preview-menu-editors">
        <article style={{ width: "100%" }}>
          <div className="flex-row">
            {["HTML", "CSS"].map((button) => {
              return (
                <button
                  key={button}
                  onClick={() => setEditorSelected(button)}
                  className={
                    "flex-center space-mid-row app-button" +
                    (editorSelected === button ? "-pressed" : "")
                  }
                  style={{
                    position: "relative",
                    fontSize: "1.2em",
                    fontWeight: "700",
                    padding: "0.32em 0.6em",
                  }}
                >
                  <div
                    className="pop-up-background"
                    style={{
                      borderRadius: "0.4em",
                      transform:
                        "scale(" +
                        (editorSelected === button ? "1" : "0") +
                        ")",
                    }}
                  ></div>
                  {button}
                </button>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "1.2em 0",
            }}
          >
            {/* editor */}
            <h2>
              {editorSelected === "HTML" ? "<div id='dummy'>" : "#dummy {"}
            </h2>
            <textarea
              className="animation-preview-menu-editor-text"
              value={editorSelected === "HTML" ? HTMLCode : CSSCode}
              onChange={(e) => {
                editorSelected === "HTML"
                  ? setHTMLCode(e.target.value)
                  : setCSSCode(e.target.value);
              }}
            />
            <h2>{editorSelected === "HTML" ? "</div>" : "}"}</h2>
          </div>
          {/* save changes */}
          <button
            className="max-button"
            onClick={applyChanges}
            style={{ fontSize: "1.6em" }}
          >
            Apply changes
          </button>
        </article>
      </div>
      <div ref={dummyRef} id="dummy"></div>
    </section>
  );
};

export default AnimationPreview;
