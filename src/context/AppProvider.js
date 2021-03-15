import React, { useReducer } from "react";
import {
  solveTatX,
  splitCurveAtT,
  roundCoordX,
  filterObject,
  roundFloat,
  setInRange,
  EASE,
  BEZIER,
  getTiming,
  getColorAtSplit,
} from "../functions";
import {
  ADD_ANIMATION_FRAME,
  ADD_PROP_CSS,
  EDIT_PROP_CSS,
  REMOVE_ANIMATION_FRAME,
  REMOVE_PROP_CSS,
  SET_ANIMATION_FRAME,
  SET_ANIMATION_PARAMETER,
  SET_CONTROL_POINT,
  SET_CONTROL_POINT_AXIS,
  SET_FRAME,
  SET_PROP_CSS_VALUE,
  SET_ANIMATION_FRAME_TIMING,
  DELETE_ANIMATION,
  ADD_ANIMATION,
  SET_ANIMATION,
  CHANGE_ANIMATION,
  TRANSFORM_PROP_CSS,
  CHANGE_ANIMATION_NAME,
  SET_PROP_CSS_UNIT,
} from "./actions.js";
import AppContext from "./AppContext.js";

const createAnimation = (name) => {
  return {
    name: name,
    duration: 1,
    delay: 0,
    repeat: 1,
    infinite: false,
    repeatDelay: false,
    forwards: "none",
    frames: [0, 1],
    timing: [getTiming(EASE)],
  };
};

const createPropCSS = (group, type, unit, range, frames, animeIndex) => {
  const values = frames.map((frame) => {
    return type === "number" ? roundFloat(frame) : [66, 13, 255, 1];
  });
  let currentUnit = unit && unit === "multiple" ? "px" : unit;

  // group prop: properties that share the same animation
  // example: transform: (translate, scale, ecc...)
  return group
    ? {
        group: group,
        type: type,
        values: values,
        range: range,
        unitDomain: unit,
        unit: currentUnit,
      }
    : {
        father: false,
        group: group,
        type: type,
        values: values,
        range: range,
        unitDomain: unit,
        unit: currentUnit,
        animationIndex: animeIndex,
      };
};

const initState = {
  animationName: "anime",
  frame: 0,
  propCSSGroup: "transform",
  propCSS: "translateY",
  animationIndex: 0,
  animations: [createAnimation("anime-0")],
  propsCSSList: {
    transform: {
      animationIndex: 0,
      father: true,
      children: {
        translateY: createPropCSS(
          "transform",
          "number",
          "multiple",
          [null, null],
          [0, 1],
          0
        ),
      },
    },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_CONTROL_POINT: {
      let copy = JSON.parse(JSON.stringify(state));
      let { index, frame, point, value } = action.payload;

      copy.animations[index].timing[frame][point] = value;
      copy.animations[index].timing[frame].curve = BEZIER;
      return copy;
    }

    case SET_CONTROL_POINT_AXIS: {
      let copy = JSON.parse(JSON.stringify(state));
      let { index, frame, point, value, axis } = action.payload;

      copy.animations[index].timing[frame][point][axis] = value;
      copy.animations[index].timing[frame].curve = BEZIER;
      return copy;
    }

    case ADD_PROP_CSS: {
      let copy = JSON.parse(JSON.stringify(state));
      let { name, group, type, unit, range, index } = action.payload;

      // create css prop group (one animation for alll props of the group)
      if (group) {
        copy.propsCSSList.hasOwnProperty(group)
          ? // create group if not exist
            (copy.propsCSSList[group].children[name] = createPropCSS(
              group,
              type,
              unit,
              range,
              copy.animations[copy.propsCSSList[group].animationIndex].frames,
              copy.propsCSSList[group].animationIndex
            ))
          : (copy.propsCSSList[group] = {
              animationIndex: index,
              father: true,
              children: {
                [name]: createPropCSS(
                  group,
                  type,
                  unit,
                  range,
                  copy.animations[index].frames,
                  index
                ),
              },
            });
      } else {
        // create single prop
        copy.propsCSSList[name] = createPropCSS(
          group,
          type,
          unit,
          range,
          copy.animations[index].frames,
          index
        );
      }
      return copy;
    }

    case REMOVE_PROP_CSS: {
      let { group, prop } = action.payload;
      let props = state.propsCSSList;
      let propsKey = Object.keys(props);
      let filter = {};

      if (group) {
        let children = props[group].children;
        let filterChildren = filterObject(children, prop);

        // update props
        if (Object.keys(filterChildren).length) {
          for (let key of propsKey) {
            filter[key] = props[key];
            if (key === group) filter[key].children = filterChildren;
          }
        } else filter = filterObject(props, group);
      } else filter = filterObject(props, prop);

      return {
        ...state,
        propsCSSList: filter,
        propCSS: undefined,
        propCSSGroup: false,
      };
    }

    case EDIT_PROP_CSS: {
      let prop = action.payload.group || action.payload.prop;
      return {
        ...state,
        frame: 0,
        animationIndex: state.propsCSSList[prop].animationIndex,
        propCSS: action.payload.prop,
        propCSSGroup: action.payload.group,
      };
    }

    case SET_FRAME: {
      return { ...state, frame: action.payload };
    }

    case SET_ANIMATION_FRAME: {
      let copy = JSON.parse(JSON.stringify(state));
      let { index, frame, value } = action.payload;

      copy.animations[index].frames[frame] = roundFloat(value);
      return copy;
    }

    case ADD_ANIMATION_FRAME: {
      let { animeIndex, pos, frameIndex } = action.payload;
      let copy = JSON.parse(JSON.stringify(state));
      copy.frame = frameIndex;

      // supports
      let anime = copy.animations[animeIndex];
      let props = copy.propsCSSList;
      let cp = anime.timing[frameIndex - 1];

      // scale x value in range 0 - 1
      let width = anime.frames[frameIndex] - anime.frames[frameIndex - 1];
      let x = (pos - anime.frames[frameIndex - 1]) / width;

      // split curve and update animations frames
      let t = solveTatX(cp.clt, cp.crt, x);
      let split = splitCurveAtT(t, cp.clt, cp.crt);

      anime.frames.splice(frameIndex, 0, roundFloat(pos));
      anime.timing.splice(frameIndex, 0, roundCoordX(split.rtHalf));
      anime.timing[frameIndex - 1] = roundCoordX(split.ltHalf);

      // update properties
      let keys = Object.keys(props);
      for (let key of keys) {
        // skip cycle if animation is not equal
        if (props[key].animationIndex !== animeIndex) continue;
        let p = props[key].father ? Object.keys(props[key].children) : [key];
        let i = frameIndex;

        for (let prop of p) {
          let cprop = props[key].father
            ? props[key].children[prop]
            : props[key];

          let newValue;
          if (cprop.type === "number") {
            let height = Math.abs(cprop.values[i - 1] - cprop.values[i]);
            let scaleValue = height * split.splitY;

            newValue = roundFloat(
              cprop.values[i - 1] < cprop.values[i]
                ? cprop.values[i - 1] + scaleValue
                : cprop.values[i - 1] - scaleValue
            );
            newValue = setInRange(newValue, cprop.range);
          } else {
            newValue = getColorAtSplit(
              split.splitY,
              cprop.values[i - 1],
              cprop.values[i]
            );
          }
          cprop.values.splice(i, 0, newValue);
        }
      }

      return copy;
    }

    case REMOVE_ANIMATION_FRAME: {
      let copy = JSON.parse(JSON.stringify(state));
      let { animeIndex, frameIndex } = action.payload;

      // supports
      let anime = copy.animations[animeIndex];
      let props = copy.propsCSSList;

      let crt = anime.timing[frameIndex].crt;
      anime.frames.splice(frameIndex, 1);
      anime.timing.splice(frameIndex, 1);
      anime.timing[frameIndex - 1].crt = crt;

      // update values
      let keys = Object.keys(props);
      for (let key of keys) {
        if (props[key].animationIndex !== animeIndex) continue;
        let p = props[key].father ? Object.keys(props[key].children) : [key];

        for (let prop of p) {
          let values = props[key].father
            ? props[key].children[prop].values
            : props[key].values;
          values.splice(frameIndex, 1);
        }
      }
      copy.frame = 0;
      return copy;
    }

    case SET_PROP_CSS_VALUE: {
      let { prop, propGroup, value, frame } = action.payload;
      let copyProps = JSON.parse(JSON.stringify(state.propsCSSList));

      if (propGroup) copyProps[propGroup].children[prop].values[frame] = value;
      else copyProps[prop].values[frame] = value;

      return { ...state, propsCSSList: copyProps };
    }

    case SET_ANIMATION_PARAMETER: {
      let copyAnime = JSON.parse(JSON.stringify(state.animations));
      let { parameter, index, value } = action.payload;

      copyAnime[index][parameter] = value;
      return { ...state, animations: copyAnime };
    }

    case SET_ANIMATION_FRAME_TIMING: {
      let copyAnime = JSON.parse(JSON.stringify(state.animations));
      let { frame, index, timing } = action.payload;

      copyAnime[index].timing[frame] = getTiming(timing);
      return { ...state, animations: copyAnime };
    }

    case ADD_ANIMATION: {
      return {
        ...state,
        frame: 0,
        propCSSGroup: false,
        propCSS: undefined,
        animationIndex: state.animations.length,
        animations: [
          ...state.animations,
          createAnimation(state.animationName + "-" + action.payload),
        ],
      };
    }

    case DELETE_ANIMATION: {
      let copyAnime = JSON.parse(JSON.stringify(state.animations));
      let copyProps = JSON.parse(JSON.stringify(state.propsCSSList));
      let index = action.payload;

      copyAnime.splice(index, 1);
      let newAnimeIndex = 0;
      let keys = Object.keys(copyProps);

      // set new animtion for the props
      const frames = copyAnime[0].frames;
      for (let key of keys) {
        const prop = copyProps[key];

        if (prop.animationIndex === index) {
          let psk = prop.father ? Object.keys(prop.children) : [key];
          let deepProp = prop.father ? prop.children : copyProps;

          for (let pk of psk) {
            let values = deepProp[pk].values;
            let diff = frames.length - values.length;

            prop.animationIndex = newAnimeIndex;
            if (diff >= 0) {
              let newValue = values[values.length - 1];
              for (let i = values.length; i < frames.length; i++)
                values.push(newValue);
            } else values.splice(frames.length);
          }
        } else if (prop.animationIndex > index) prop.animationIndex -= 1;
      }

      return {
        animationName: state.animationName,
        frame: 0,
        propCSSGroup: false,
        propCSS: undefined,
        animationIndex: 0,
        animations: copyAnime,
        propsCSSList: copyProps,
      };
    }

    case SET_ANIMATION: {
      return {
        ...state,
        frame: 0,
        animationIndex: action.payload,
        propCSSGroup: false,
        propCSS: undefined,
      };
    }

    case CHANGE_ANIMATION: {
      let { index, prop } = action.payload;
      let copyProps = JSON.parse(JSON.stringify(state.propsCSSList));

      let group = copyProps[prop].father;
      let deepProp = group ? copyProps[prop].children : copyProps;
      let keys = group ? Object.keys(copyProps[prop].children) : [prop];

      copyProps[prop].animationIndex = index;
      const frames = state.animations[index].frames;
      for (let key of keys) {
        let values = deepProp[key].values;
        let pprop = deepProp[key];
        let diff = frames.length - values.length;

        if (diff >= 0) {
          let newValue = values[values.length - 1];
          for (let i = values.length; i < frames.length; i++)
            values.push(pprop.type === "color" ? "" : newValue);
        } else values.splice(frames.length);
      }
      return {
        ...state,
        frame: 0,
        propCSSGroup: group ? prop : false,
        propCSS: keys[0],
        propsCSSList: copyProps,
        animationIndex: index,
      };
    }

    case TRANSFORM_PROP_CSS: {
      let { group, prop, offset, scale, reverse } = action.payload;
      let copyProps = JSON.parse(JSON.stringify(state.propsCSSList));
      let p = group ? copyProps[group].children[prop] : copyProps[prop];

      if (p.type === "number")
        p.values = p.values.map((v) => {
          return roundFloat(setInRange(v * scale + offset, p.range));
        });
      reverse && p.values.reverse();
      return { ...state, propsCSSList: copyProps };
    }

    case CHANGE_ANIMATION_NAME: {
      let copyAnime = JSON.parse(JSON.stringify(state.animations));
      let name = action.payload;

      for (let anime of copyAnime)
        anime.name = anime.name.replace(state.animationName, name);
      return { ...state, animationName: name, animations: copyAnime };
    }

    case SET_PROP_CSS_UNIT: {
      let { prop, group, unit } = action.payload;
      let copyProps = JSON.parse(JSON.stringify(state.propsCSSList));
      let cprop = group ? copyProps[group].children[prop] : copyProps[prop];

      cprop.unit = unit;
      return { ...state, propsCSSList: copyProps };
    }

    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
