import React from "react";
import AnimationEditor from "../../components/AnimationEditor";
import AnimationPreview from "../../components/AnimationPreview";
import FramesBar from "../../components/FramesBar";

const RightArea = () => {
  return (
    <section className="right-area">
      <article className="flex-center">
        <AnimationPreview />
      </article>
      <article>
        <AnimationEditor />
        <FramesBar />
      </article>
    </section>
  );
};

export default RightArea;
