import React from "react";
import AnimationEditor from "../../components/AnimationEditor";
import FramesBar from "../../components/FramesBar";

const RightArea = () => {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateRows: "auto max-content",
        height: "100vh",
      }}
    >
      <article className="flex-center">preview</article>
      <article>
        <AnimationEditor />
        <FramesBar />
      </article>
    </section>
  );
};

export default RightArea;
