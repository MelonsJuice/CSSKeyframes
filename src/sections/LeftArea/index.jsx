import React from "react";
import PropsCSSEditor from "../../components/PropsCSSEditor";
import PropsCSSList from "../../components/PropsCSSList";
import TimingEditor from "../../components/TimingEditor";

const LeftArea = () => {
  return (
    <div className="flex-row" style={{ width: "max-content" }}>
      <PropsCSSList />
      <div
        style={{
          display: "grid",
          gridTemplateRows:
            "calc(100vh - var(--timing-editor-height) - 3.2em) max-content",
          height: "100vh",
          paddingBottom: "3.2em",
        }}
      >
        <div style={{ padding: "3.2em 0" }}>
          <PropsCSSEditor />
        </div>
        <TimingEditor />
      </div>
    </div>
  );
};

export default LeftArea;
