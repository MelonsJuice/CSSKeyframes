import React, { useEffect, useRef, useState } from "react";
import "./SmallSelect.css";

const SmallSelect = ({ value, options, callback, origin }) => {
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
      className="small-select"
      style={{
        borderRadius: origin === "top" ? borderRadius[0] : borderRadius[1],
      }}
    >
      <article
        className="flex-center small-select-option"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <div
          className="flex-row"
          style={{
            fontSize: "1.2em",
            fontWeight: "700",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {value}
        </div>
      </article>
      <section
        ref={menuRef}
        className="small-select-drop-menu"
        style={{
          [origin]: "3.6em",
          borderRadius: origin === "top" ? borderRadius[1] : borderRadius[0],
        }}
        onClick={handleClick}
      >
        {options.map((option, index) => {
          return (
            <article
              key={option}
              data-index={index}
              className="flex-center small-select-option small-select-option-menu"
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

export default SmallSelect;
