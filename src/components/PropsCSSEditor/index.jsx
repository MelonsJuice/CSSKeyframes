import {
  faAngleRight,
  faProjectDiagram,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  SET_PROP_CSS_VALUE,
  TRANSFORM_PROP_CSS,
  CHANGE_ANIMATION,
  SET_PROP_CSS_UNIT,
} from "../../context/actions";
import AppContext from "../../context/AppContext";
import { isInRange, hexToRgb, rgbToHex, roundFloat } from "../../functions";
import Select from "../Select";
import SmallSelect from "../SmallSelect";
import "./PropsCSSEditor.css";

const PropsCSSEditor = () => {
  const [scale, setScale] = useState("");
  const [offset, setOffset] = useState("");
  const [reverse, setReverse] = useState(false);
  const [transfMenuOpen, setTransfMenuOpen] = useState(false);
  const transfMenuRef = useRef(null);
  const {
    animations,
    propsCSSList,
    propCSS,
    propCSSGroup,
    dispatch,
  } = useContext(AppContext);

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
    let alpha = param === "alpha" ? Number(value) : prop.values[index][3];
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
      dispatch({
        type: TRANSFORM_PROP_CSS,
        payload: {
          group: propCSSGroup,
          prop: propCSS,
          offset: checkOffset,
          scale: checkScale,
          reverse: reverse,
        },
      });

      setOffset("");
      setScale("");
      setReverse(false);
    });
  };

  useEffect(() => {
    let menu = transfMenuRef.current.style;
    menu.height = transfMenuOpen ? "17.6em" : "0";
    menu.width = transfMenuOpen ? "20em" : "0";
    menu.left =
      "calc(var(--prop-timing-width) - " +
      (transfMenuOpen ? "0em)" : "5.28em)");
    menu.opacity = transfMenuOpen ? "1" : "0";
  }, [transfMenuOpen]);

  const prop = propCSSGroup
    ? propsCSSList[propCSSGroup].children[propCSS]
    : propsCSSList[propCSS];
  return (
    <section className="prop-css-editor">
      <div style={{ fontSize: "1.2em", paddingBottom: "0.8em" }}>
        {propCSS ? (
          <div className="flex-row">
            <div className="flex-row">
              {propCSSGroup && (
                <FontAwesomeIcon
                  icon={faProjectDiagram}
                  style={{ color: "var(--color-purple)", marginRight: "0.6em" }}
                />
              )}
              <h2>{propCSS}</h2>
            </div>
            <div className="flex-row" style={{ fontSize: "0.64em" }}>
              {prop.unitDomain === "multiple" && (
                <>
                  <SmallSelect
                    value={prop.unit}
                    options={["px", "em", "rem", "%", "vw", "vh"]}
                    origin="top"
                    callback={(value, index) => {
                      dispatch({
                        type: SET_PROP_CSS_UNIT,
                        payload: {
                          prop: propCSS,
                          group: propCSSGroup,
                          unit: value,
                        },
                      });
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </>
              )}
              <Select
                value={
                  animations[
                    propsCSSList[propCSSGroup || propCSS].animationIndex
                  ].name
                }
                options={animations.map((animation) => animation.name)}
                origin="top"
                callback={(value, index) => {
                  console.log(value, index);
                  dispatch({
                    type: CHANGE_ANIMATION,
                    payload: {
                      index: index,
                      prop: propCSSGroup || propCSS,
                    },
                  });
                }}
              />
            </div>
          </div>
        ) : (
          <h2>No Property Selected</h2>
        )}
      </div>
      <article className="prop-css-editor-values">
        {propCSS &&
          (propCSSGroup
            ? propsCSSList[propCSSGroup].children[propCSS]
            : propsCSSList[propCSS]
          ).values.map((value, index) => {
            const [range, type] = [prop.range, prop.type];
            return (
              <div
                key={index}
                className="flex-row"
                style={{
                  fontSize: "1.6em",
                  height: "2em",
                  alignItems: "center",
                }}
              >
                <h4>KeyFrame {index + 1}</h4>
                {type === "number" ? (
                  <div style={{ fontWeight: "700" }}>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value, index, range)}
                      onBlur={(e) => checkValue(e.target.value, index)}
                      style={{
                        width: "4em",
                        boxShadow: "var(--hollow-shadow)",
                      }}
                    />
                    <span>&nbsp;{prop.unit}</span>
                  </div>
                ) : (
                  <div className="prop-css-edito-color-input">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.001"
                      value={value[3]}
                      onChange={(e) =>
                        setColor("alpha", e.target.value, prop, index)
                      }
                      className="slider"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, " +
                          rgbToHex(value.slice(0, 3)) +
                          ")",
                      }}
                    />
                    <input
                      type="color"
                      value={rgbToHex(value.slice(0, 3))}
                      onChange={(e) =>
                        setColor("rgb", e.target.value, prop, index)
                      }
                      style={{
                        width: "1.6em",
                        height: "1.6em",
                        padding: "0",
                        opacity: value[3],
                        cursor: "pointer",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </article>
      <div
        style={{
          position: "relative",
          display: propCSS ? "flex" : "none",
          alignItems: "center",
          paddingTop: "0.8em",
          height: "3.2em",
        }}
      >
        <article
          className="prop-css-editor-transform-button"
          onClick={() => setTransfMenuOpen(!transfMenuOpen)}
        >
          <div className="flex-row">
            <FontAwesomeIcon
              icon={faTools}
              style={{ fontSize: "1.2em", marginRight: "0.4em" }}
            />
            <h2>Transform</h2>
          </div>
          <FontAwesomeIcon
            icon={faAngleRight}
            style={{
              fontSize: "1.6em",
              transform: "rotateZ(" + (transfMenuOpen ? 180 : 0) + "deg)",
              transition: "0.4s cubic-bezier(0.06, 0.55, 0, 1.15)",
            }}
          />
        </article>
        <form
          ref={transfMenuRef}
          className="prop-css-editor-transform-panel"
          onSubmit={submitPropTransform}
        >
          <div style={{ fontSize: "1.6em" }}>
            <div className="flex-row" style={{ height: "2em" }}>
              <label style={{ fontWeight: "700" }}>scale</label>
              <input
                type="number"
                placeholder="value"
                step="0.01"
                value={scale}
                style={{ boxShadow: "var(--hollow-shadow)" }}
                onChange={(e) => setScale(e.target.value)}
              />
            </div>
            <div className="flex-row" style={{ height: "2em" }}>
              <label style={{ fontWeight: "700" }}>offset</label>
              <input
                type="number"
                placeholder="value"
                step="0.01"
                value={offset}
                style={{ boxShadow: "var(--hollow-shadow)" }}
                onChange={(e) => setOffset(e.target.value)}
              />
            </div>
            <div className="flex-row" style={{ height: "2em" }}>
              <label style={{ fontWeight: "700" }}>reverse</label>
              <input
                type="checkbox"
                checked={reverse}
                onChange={() => setReverse(!reverse)}
                className="checkbox"
              />
            </div>
            <button
              onClick={submitPropTransform}
              className="max-button"
              style={{ marginTop: "0.8em" }}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PropsCSSEditor;
