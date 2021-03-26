import React, { useState, useEffect, useContext, useRef } from "react";
import { CHANGE_ANIMATION_NAME } from "../../context/actions";
import AppContext from "../../context/AppContext";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { animationKeyframes } from "../AnimationPreview/animationKeyframes";

const AnimationClassPanel = ({ classSheet, onNameChange }) => {
  const { animationName, dispatch } = useContext(AppContext);
  const [className, setClassName] = useState(animationName);
  const classNameRef = useRef(null);
  const animeCodeRef = useRef(null);

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
    onNameChange();
  }, [animationName]);

  return (
    <article className="animation-preview-menu-editor animation-preview-code-window">
      <div style={{ fontSize: "1.4em" }}>
        <form className="space-big-double-col" onSubmit={changeClassName}>
          <label className="flex-row space-mid-col">Set animations name</label>
          <div className="flex-row space-mid-col">
            <input
              ref={classNameRef}
              spellCheck="false"
              type="text"
              value={className}
              onChange={handleNameChange}
              placeholder="insert a name"
              style={{
                padding: "0.32em",
                borderRadius: "0.4em",
                boxShadow: "var(--hollow-shadow)",
              }}
            />
            <button
              onClick={changeClassName}
              className="flex-center max-button"
              style={{ width: "max-content" }}
            >
              Change
            </button>
          </div>
        </form>

        <div className="space-big-double-col">
          <div className="flex-row">
            <label>Add this to your class</label>
            <CopyButton element={classNameRef.current} />
          </div>
          <input
            ref={classNameRef}
            spellCheck="false"
            value={
              animationKeyframes.sheet.rules.length > 1 ? animationName : ""
            }
            style={{
              padding: "0 0.2em",
              fontSize: "1.2em",
              width: "100%",
              background: "#410dff12",
            }}
            onChange={() => {}}
          />
        </div>

        <div className="space-big-double-col">
          <div className="flex-row space-mid-col">
            <label>Add this into your css</label>
            <CopyButton element={animeCodeRef.current} />
          </div>
          <div className="space-mid-col">
            <textarea
              ref={animeCodeRef}
              spellCheck="false"
              className="animation-preview-code"
              value={classSheet}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

const CopyButton = ({ element }) => {
  const popMsgRef = useRef(null);
  const copyToClipboard = () => {
    element.select();
    element.setSelectionRange(0, 99999);
    document.execCommand("copy");

    popMsgRef.current.classList.remove("pop-in");
    void popMsgRef.current.offsetHeight; // trigger
    popMsgRef.current.classList.add("pop-in");
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className="app-button"
        onClick={copyToClipboard}
        style={{ fontSize: "1.2em" }}
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>
      <div ref={popMsgRef} className="copy-button">
        Copied!
      </div>
    </div>
  );
};

export default AnimationClassPanel;
