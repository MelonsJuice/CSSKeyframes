import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import "./Select.css";

const Select = ({ value, options, callback, direction }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const handleClick = (e) => {
    setOpenMenu(false);
    callback(e.target.textContent, e.target.dataset.index);
  };

  useEffect(() => {
    const height = openMenu ? options.length * 3.6 + "em" : "0em";
    menuRef.current.style.height = height;
  }, [openMenu, options.length]);

  return (
    <div className="select">
      <article
        className="flex-center select-option"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <div
          className="flex-row"
          style={{ fontSize: "1.2em", fontWeight: "700", width: "100%" }}
        >
          {value}
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
        style={{ [direction]: "4.4em" }}
        onClick={handleClick}
      >
        {options.map((option, index) => {
          return (
            <article
              key={option}
              data-index={index}
              className="flex-center select-option select-option-menu"
            >
              <div style={{ fontSize: "1.2em" }}>{option}</div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Select;
