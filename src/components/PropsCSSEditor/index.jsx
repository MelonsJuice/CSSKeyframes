import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { SET_PROP_CSS_VALUE, TRANSFORM_PROP_CSS } from "../../context/actions";
import AppContext from "../../context/AppContext";
import { isInRange, hexToRgb, rgbToHex, roundFloat } from "../../functions";
import "./PropsCSSEditor.css";

const PropsCSSEditor = () => {
  const [scale, setScale] = useState("");
  const [offset, setOffset] = useState("");
  const { propsCSSList, propCSS, propCSSGroup, dispatch } = useContext(
    AppContext
  );

  const checkValue = (value, frame) => {
    if (value === "")
      dispatch({
        type: SET_PROP_CSS_VALUE,
        payload: {
          prop: propCSS,
          propGroup: propCSSGroup,
          value: 1,
          frame: frame,
        },
      });
  };

  const setValue = (value, frame, range) => {
    if (isInRange(value, range) || value === "")
      dispatch({
        type: SET_PROP_CSS_VALUE,
        payload: {
          prop: propCSS,
          propGroup: propCSSGroup,
          value: value === "" ? "" : parseFloat(value),
          frame: frame,
        },
      });
  };

  const setColor = (param, value, prop, index) => {
    let rgb =
      param === "rgb" ? hexToRgb(value) : prop.values[index].slice(0, 3);
    let alpha = param === "alpha" ? value : prop.values[index][3];
    let newColor = [...rgb, alpha];

    dispatch({
      type: SET_PROP_CSS_VALUE,
      payload: {
        prop: propCSS,
        propGroup: propCSSGroup,
        value: newColor,
        frame: index,
      },
    });
  };

  const submitPropTransform = (e) => {
    e.preventDefault();
    let checkOffset = offset === "" ? 0 : roundFloat(parseFloat(offset));
    let checkScale = scale === "" ? 1 : roundFloat(parseFloat(scale));

    ReactDOM.unstable_batchedUpdates(() => {
      setOffset("");
      setScale("");

      dispatch({
        type: TRANSFORM_PROP_CSS,
        payload: {
          group: propCSSGroup,
          prop: propCSS,
          offset: checkOffset,
          scale: checkScale,
        },
      });
    });
  };

  return (
    <section className="prop-css-editor">
      <h1 style={{ paddingBottom: "0.8em" }}>
        {propCSS || "No Property Selected"}
      </h1>
      <article className="prop-css-editor-values">
        {propCSS &&
          (propCSSGroup
            ? propsCSSList[propCSSGroup].children[propCSS]
            : propsCSSList[propCSS]
          ).values.map((value, index) => {
            const prop = propCSSGroup
              ? propsCSSList[propCSSGroup].children[propCSS]
              : propsCSSList[propCSS];
            const [range, type] = [prop.range, prop.type];
            return (
              <div
                key={index}
                className="flex-row"
                style={{ fontSize: "1.6em", height: "2.4em" }}
              >
                <h1>Frame {index + 1}</h1>
                {type === "number" ? (
                  <div className="app-input">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value, index, range)}
                      onBlur={(e) => checkValue(e.target.value, index)}
                      style={{ textAlign: "right" }}
                    />
                    <span>px</span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="color"
                      value={rgbToHex(value.slice(0, 3))}
                      onChange={(e) =>
                        setColor("rgb", e.target.value, prop, index)
                      }
                      style={{ opacity: value[3] }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.001"
                      value={value[3]}
                      onChange={(e) =>
                        setColor("alpha", e.target.value, prop, index)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
      </article>
      {propCSS &&
        (propCSSGroup
          ? propsCSSList[propCSSGroup].children[propCSS]
          : propsCSSList[propCSS]
        ).type === "number" && (
          <form
            className="flex-row"
            style={{ fontSize: "1.6em", paddingTop: "0.8em" }}
            onSubmit={submitPropTransform}
          >
            <div>
              <label style={{ fontWeight: "700" }}>scale</label>&nbsp;&nbsp;
              <input
                type="number"
                placeholder="value"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="app-input"
              />
            </div>
            <FontAwesomeIcon icon={faArrowRight} />
            <div>
              <label style={{ fontWeight: "700" }}>offset</label>&nbsp;&nbsp;
              <input
                type="number"
                placeholder="value"
                step="0.01"
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                className="app-input"
              />
            </div>
            <button
              onSubmit={submitPropTransform}
              className="custom-button"
              style={{ padding: "0.4em" }}
            >
              apply
            </button>
          </form>
        )}
    </section>
  );
};

export default PropsCSSEditor;
