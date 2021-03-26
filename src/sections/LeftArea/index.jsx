import React from "react";
import PropsCSSEditor from "../../components/PropsCSSEditor";
import PropsCSSList from "../../components/PropsCSSList";
import TimingEditor from "../../components/TimingEditor";

const LeftArea = () => {
  return (
    <div className="flex-row left-area">
      <PropsCSSList />
      <div className="prop-timing-container">
        <PropsCSSEditor />
        <TimingEditor />
      </div>
    </div>
  );
};

export default LeftArea;
