import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import "./Select.css";

const Select = ({ value, options, callback, direction }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const borderRadius = ["0.8em 0.8em 0 0", "0 0 0.8em 0.8em"];

  const handleClick = (e) => {
    setOpenMenu(false);
    callback(e.target.textContent, e.target.dataset.index);
  };

  useEffect(() => {
    const height = openMenu ? options.length * 3.6 + "em" : "0";
    menuRef.current.style.height = height;
  }, [openMenu, options.length]);

  return (
    <div
      className="select"
      style={{
        borderRadius: direction === "top" ? borderRadius[0] : borderRadius[1],
      }}
    >
      <article
        className="flex-center select-option"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <div
          className="flex-row"
          style={{ fontSize: "1.2em", fontWeight: "700", width: "100%" }}
        >
          <span
            style={{
              width: "6em",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </span>
          <span
            style={{
              transformOrigin: "center",
              transform: "rotateZ(" + (openMenu ? 180 : 0) + "deg)",
              transition: "0.4s cubic-bezier(0.06, 0.55, 0, 1.15)",
            }}
          >
            <FontAwesomeIcon
              icon={direction === "top" ? faAngleDown : faAngleUp}
            />
          </span>
        </div>
      </article>
      <section
        ref={menuRef}
        className="select-drop-menu"
        style={{
          [direction]: "3.6em",
          borderRadius: direction === "top" ? borderRadius[1] : borderRadius[0],
        }}
        onClick={handleClick}
      >
        {options.map((option, index) => {
          return (
            <article
              key={option}
              data-index={index}
              className="flex-center select-option select-option-menu"
            >
              <div style={{ fontSize: "1.2em" }} data-index={index}>
                {option}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Select;
