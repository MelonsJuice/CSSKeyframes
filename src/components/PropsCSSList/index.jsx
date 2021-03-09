import {
  faPlus,
  faCheck,
  faMinus,
  faEdit,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import {
  ADD_PROP_CSS,
  CHANGE_ANIMATION,
  EDIT_PROP_CSS,
  REMOVE_PROP_CSS,
} from "../../context/actions";
import AppContext from "../../context/AppContext";
import Select from "../Select";
import "./PropsCSSList.css";
import { propsList } from "./propsList";

/////////////////////////
// PROPS CSS CONTAINER //
/////////////////////////
const PropsCSSList = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
      }}
    >
      <section className="props-css-list">
        <div
          className="flex-row"
          style={{ paddingBottom: "0.8em", justifyContent: "start" }}
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{ fontSize: "1.2em", marginRight: "0.72em" }}
          />
          <h2 style={{ fontWeight: "800" }}>CURRENT PROPERTIES</h2>
        </div>
        <div className="props-css-list-container">
          <PropsCSSListCurrent />
        </div>
      </section>
      <section className="props-css-list">
        <div
          className="flex-row"
          style={{ paddingBottom: "0.8em", justifyContent: "start" }}
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{ fontSize: "1.2em", marginRight: "0.72em" }}
          />
          <h2 style={{ fontWeight: "800" }}>PROPERTIES LIST</h2>
        </div>
        <div className="props-css-list-container">
          <PropsCSSListAll />
        </div>
      </section>
    </div>
  );
};

////////////////////////////
// CURRENT CSS PROPS LIST //
////////////////////////////
const PropsCSSListCurrent = () => {
  const { propsCSSList, animations, dispatch } = useContext(AppContext);
  const handleClick = (action, group, prop) => {
    action &&
      dispatch({
        type: action === "remove" ? REMOVE_PROP_CSS : EDIT_PROP_CSS,
        payload: {
          group: group,
          prop: prop,
        },
      });
  };

  return (
    <article>
      {Object.keys(propsCSSList).map((prop) => {
        return propsCSSList[prop].father ? (
          <div key={prop} style={{ display: "block" }}>
            <div className="flex-row props-css-list-current">
              <h2>{prop}</h2>
              <div className="flex-row" style={{ fontSize: "0.8em" }}>
                <Select
                  value={animations[propsCSSList[prop].animationIndex].name}
                  options={animations.map((animation) => animation.name)}
                  direction="top"
                  callback={(value, index) => {
                    dispatch({
                      type: CHANGE_ANIMATION,
                      payload: {
                        index: index,
                        prop: prop,
                      },
                    });
                  }}
                />
              </div>
            </div>
            {Object.keys(propsCSSList[prop].children).map((child) => {
              return (
                <div key={child} className="flex-row props-css-list-current">
                  <h2>{child}</h2>
                  <div className="flex-row" style={{ fontSize: "0.8em" }}>
                    {[
                      ["remove", faMinus],
                      ["edit", faEdit],
                    ].map((btn) => {
                      return (
                        <button
                          key={btn[0]}
                          className="flex-center app-button space-mid-row custom-button"
                          onClick={() => handleClick(btn[0], prop, child)}
                        >
                          <FontAwesomeIcon icon={btn[1]} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div key={prop} className="flex-row props-css-list-current">
            <h2>{prop}</h2>
            <div className="flex-row" style={{ fontSize: "0.8em" }}>
              {[
                ["remove", faMinus],
                ["edit", faEdit],
              ].map((btn) => {
                return (
                  <button
                    key={btn[0]}
                    className="flex-center app-button space-mid-row custom-button"
                    onClick={() => handleClick(btn[0], false, prop)}
                  >
                    <FontAwesomeIcon icon={btn[1]} />
                  </button>
                );
              })}
              <div style={{ marginLeft: "0.6em" }}>
                <Select
                  value={animations[propsCSSList[prop].animationIndex].name}
                  options={animations.map((animation) => animation.name)}
                  direction="top"
                  callback={(value, index) => {
                    dispatch({
                      type: CHANGE_ANIMATION,
                      payload: {
                        index: index,
                        prop: prop,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </article>
  );
};

//////////////////////////////
// AVAILABLE CSS PROPS LIST //
//////////////////////////////
const PropsCSSListAll = () => {
  const { propsCSSList, dispatch } = useContext(AppContext);
  const handleClick = (e) => {
    let { prop, category, catindex } = e.target.dataset;
    prop = prop === "false" ? false : prop;
    if (!(prop && category)) return;

    let { range, type, group } = propsList[category][catindex];
    dispatch({
      type: ADD_PROP_CSS,
      payload: {
        name: prop,
        group: group || false,
        type: type,
        range: range || [null, null],
        index: 0,
      },
    });
  };

  return (
    <article style={{ fontSize: "1.4em" }} onClick={handleClick}>
      {Object.keys(propsList).map((key) => {
        return (
          <ul key={key} className="props-css-list-all space-big-double-col">
            <li>
              <h1>{key}</h1>
            </li>
            {propsList[key].map((prop, index) => {
              // check if prop has been already selected
              let propAlreadyExist =
                propsCSSList.hasOwnProperty(prop.name) ||
                (propsCSSList[prop.group] &&
                  propsCSSList[prop.group].children.hasOwnProperty(prop.name));

              return (
                <li
                  key={prop.name}
                  data-category={key}
                  data-catindex={index}
                  data-prop={propAlreadyExist ? false : prop.name}
                  className="flex-row props-css-list-all-prop"
                  style={{ opacity: propAlreadyExist ? "1" : "0.8" }}
                >
                  <FontAwesomeIcon
                    icon={propAlreadyExist ? faCheck : faPlus}
                    style={{ fontSize: "0.8em", marginRight: "0.72em" }}
                  />
                  {prop.name}
                </li>
              );
            })}
          </ul>
        );
      })}
    </article>
  );
};

export default PropsCSSList;
