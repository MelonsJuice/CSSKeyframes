import React, { useState } from "react";
import "./DummyCodeEditor.css";
import {
  animationKeyframes,
  initStyle,
} from "../AnimationPreview/animationKeyframes";

const DummyCodeEditor = ({ dummy }) => {
  const [editorSelected, setEditorSelected] = useState("HTML");
  const [HTMLCode, setHTMLCode] = useState("<i class='icon-dummy'></i>");
  const [CSSCode, setCSSCode] = useState(initStyle);

  const applyChanges = () => {
    switch (editorSelected) {
      case "HTML":
        dummy.innerHTML = HTMLCode;
        break;
      case "CSS":
        // #dummy is always at the first position
        animationKeyframes.sheet.deleteRule(0);
        animationKeyframes.sheet.insertRule(
          `#dummy {
          ${CSSCode}
        }`,
          0
        );
        break;
      default:
        return;
    }
  };

  return (
    <article className="animation-preview-menu-editor">
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
                    "scale(" + (editorSelected === button ? "1" : "0") + ")",
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
        <h2>{editorSelected === "HTML" ? "<div id='dummy'>" : "#dummy {"}</h2>
        <textarea
          className="dummy-code-editor-text"
          spellCheck="false"
          value={editorSelected === "HTML" ? HTMLCode : CSSCode}
          onChange={(e) => {
            editorSelected === "HTML"
              ? setHTMLCode(e.target.value)
              : setCSSCode(e.target.value);
          }}
        />
        <h2>{editorSelected === "HTML" ? "</div>" : "}"}</h2>
      </div>

      <button
        className="max-button"
        onClick={applyChanges}
        style={{ fontSize: "1.6em" }}
      >
        Apply changes
      </button>
    </article>
  );
};

export default DummyCodeEditor;
