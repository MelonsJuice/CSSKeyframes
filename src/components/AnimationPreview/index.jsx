import {
  faPlus,
  faMinus,
  faPlay,
  faPause,
  faStepBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  ADD_ANIMATION,
  DELETE_ANIMATION,
  SAVE_CHANGES,
  SET_ANIMATION,
  SET_FRAME,
} from "../../context/actions";
import AppContext from "../../context/AppContext";
import "./AnimationPreview.css";
import { animationKeyframes } from "./animationKeyframes";
import { getStringTiming } from "../../functions.js";
import Select from "../Select";
import DummyCodeEditor from "../DummyCodeEditor";
import AnimationClassPanel from "../AnimationClassPanel";
import "../../mjf_font/css/mjf.css";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faFileAlt, faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import changesTheme from "./changesTheme";

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
  const [running, setRunning] = useState(false);
  const [restart, setRestart] = useState(false);
  const restartRef = useRef(null);
  const dummyRef = useRef(null);
  const animeCount = useRef(0);

  // editor states
  const editorMenuRef = useRef(null);
  const [panel, setPanel] = useState("code");
  const [openMenu, setOpenMenu] = useState(false);
  const [styleSheet, setStyleSheet] = useState("");

  // more button
  const [viewMore, setViewMore] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  ///////////////////////
  // ANIMATION HANDLES //
  ///////////////////////
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
    // .animation-class is always at the second position
    while (animationKeyframes.sheet.rules.length > 1)
      animationKeyframes.sheet.deleteRule(1);

    // return if no property has been animated
    if (!hashKeys.length) {
      setStyleSheet("");
      return;
    }

    // create animation class and remove the previous
    dummyRef.current.classList.remove("animation-class");
    var animeStyleSheet = `.animation-class {
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
      return animations[key].repeatDelay ? "0s" : animations[key].delay + "s";
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
}

`;
    animationKeyframes.sheet.insertRule(animeStyleSheet, 1);
    animeStyleSheet = animeStyleSheet.replace(
      ".animation-class",
      "." + animationName
    );

    // create new keyframes
    const keyframesArr = hashKeys.map((key) => {
      let content = "";
      for (let i = 0; i < animations[key].frames.length; i++) {
        let a = animations[key];
        let timing = i < a.frames.length - 1 && getStringTiming(a.timing[i]);
        let offset = a.repeatDelay ? a.delay / (a.duration + a.delay) : 0;
        let perc = a.frames[i] * (1 - offset) + offset;
        let init = a.repeatDelay && i === 0 ? "0%, " : "";

        content += `\n    ${
          init + (perc * 100).toFixed(a.repeatDelay ? 2 : 0)
        }% {${
          (timing
            ? "\n        animation-timing-function: " + timing + ";\n"
            : "\n") +
          hash[key]
            .map((prop) => {
              let values = "        ";
              if (propsCSSList[prop].father) {
                let children = Object.keys(propsCSSList[prop].children);
                let p = propsCSSList[prop].children;
                let allProps = children.map(
                  (son) => son + "(" + p[son].values[i] + p[son].unit + ")"
                );
                values += prop + ": " + allProps.join(" ");
              } else {
                let p = propsCSSList[prop];
                values +=
                  prop +
                  ": " +
                  (p.type === "color"
                    ? "rgba(" + p.values[i] + ")"
                    : p.values[i] + p.unit);
              }
              return values;
            })
            .join(";\n") +
          ";"
        }
    }`;
      }
      return content;
    });

    // add frames to stylesheet
    for (let i = 0; i < keyframesArr.length; i++) {
      animeStyleSheet += `@keyframes ${animations[hashKeys[i]].name} {${
        keyframesArr[i]
      }
}

`;
      animationKeyframes.sheet.insertRule(
        `@keyframes ${animations[hashKeys[i]].name} {
        ${keyframesArr[i]}
        }`,
        animationKeyframes.sheet.rules.length
      );
    }

    // add animation class to dummy
    setStyleSheet(animeStyleSheet);
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
  useEffect(() => {
    restartAnimation();
  }, []);

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

  const handleEditorMenu = (menu) => {
    if (openMenu && menu === panel) setOpenMenu(false);
    else if (!openMenu) {
      editorMenuRef.current.children[0].style.transition = "none";
      setOpenMenu(true);
      setPanel(menu);
    } else {
      editorMenuRef.current.children[0].style.transition =
        "0.48s cubic-bezier(0.18, 0.55, 0.25, 1)";
      setPanel(menu);
    }
  };
  useEffect(() => {
    const container = editorMenuRef.current.children[0];
    const move = panel === "code" ? "0" : "-36em";
    const height = openMenu
      ? container.children[panel === "code" ? 0 : 1].getBoundingClientRect()
          .height
      : 0;

    container.style.transform = "translateX(" + move + ")";
    editorMenuRef.current.style.opacity = openMenu ? "1" : "0";
    editorMenuRef.current.style.height = height + "px";
    editorMenuRef.current.style.top = openMenu ? "4em" : "3em";
  }, [openMenu, panel]);

  return (
    <section className="animation-preview flex-center">
      <nav className="flex-row animation-preview-nav">
        <div className="flex-row">
          <div className="flex-row space-big-double-row">
            <img
              src={"/imgs/logo_" + (darkMode ? "light" : "dark") + ".png"}
              style={{ height: "4.8em" }}
            ></img>
          </div>
          <div
            className="flex-center space-big-double-row"
            style={{ position: "relative" }}
          >
            <button
              className="flex-center animation-preview-button"
              onClick={() => setViewMore(!viewMore)}
            >
              More
            </button>
            <div
              style={{
                position: "absolute",
                top: "2em",
                width: "max-content",
                height: viewMore ? "10em" : "0",
                padding: viewMore ? "0.8em" : "0",
                opacity: viewMore ? "1" : "0",
                fontSize: "1.16em",
                background: "var(--color-bg)",
                boxShadow: "0 0.2em 0.4em var(--color-purple-transparent)",
                borderRadius: "0.4em",
                overflow: "hidden",
                transition:
                  "all 0.4s ease, height cubic-bezier(0.06, 0.55, 0.2, 1) 0.2s",
              }}
            >
              <div
                className="flex-row space-big-col"
                style={{ flexDirection: "column", alignItems: "baseline" }}
              >
                <h5>Theme</h5>
                <div className="flex-row" style={{ fontSize: "0.88em" }}>
                  <FontAwesomeIcon icon={faSun} />
                  &nbsp;
                  <input
                    type="checkbox"
                    className="checkbox"
                    onClick={(e) => {
                      ReactDOM.unstable_batchedUpdates(() => {
                        changesTheme(e.target.checked);
                        setDarkMode(e.target.checked);
                      });
                    }}
                  />
                  &nbsp;
                  <FontAwesomeIcon icon={faMoon} />
                </div>
              </div>
              <div
                className="flex-row space-big-col"
                style={{ flexDirection: "column", alignItems: "baseline" }}
              >
                <h5>Docs/Repo</h5>
                <a
                  href="https://github.com/MelonsJuice/KeyFramess"
                  target="_blank"
                  className="max-button"
                  style={{ color: "white", height: "max-content" }}
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              </div>
              <div
                className="flex-row space-big-col"
                style={{ flexDirection: "column", alignItems: "baseline" }}
              >
                <h5>made by</h5>
                <a href="https://github.com/MelonsJuice" target="_blank">
                  <h6>MelonsJuice</h6>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-row">
          <article
            className="flex-row"
            style={{
              width: "max-content",
              fontSize: "0.5em",
              marginRight: "4em",
            }}
          >
            {/* animation selection */}
            <div style={{ marginRight: "0.6em" }}>
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
            <Select
              value={animations[animationIndex].name}
              options={animations.map((animation) => animation.name)}
              origin="top"
              callback={(value, index) => {
                dispatch({ type: SET_ANIMATION, payload: index });
              }}
            />
          </article>

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

          {/* edit dummy and copy class buttons */}
          {[
            ["#dummy", "code"],
            [".class", "class"],
          ].map((button) => {
            return (
              <button
                key={button[1]}
                className="flex-center space-mid-row animation-preview-button"
                onClick={() => handleEditorMenu(button[1])}
              >
                {button[0]}
              </button>
            );
          })}
        </div>
      </nav>

      <div ref={editorMenuRef} className="animation-preview-menu-editors">
        <div
          style={{
            position: "relative",
            transform: "translateX(0)",
          }}
        >
          <DummyCodeEditor dummy={dummyRef.current} />
          <AnimationClassPanel
            classSheet={styleSheet}
            onNameChange={generateAnimation}
          />
        </div>
      </div>

      <div ref={dummyRef} id="dummy">
        <i className="icon-dummy"></i>
      </div>
    </section>
  );
};

export default AnimationPreview;
