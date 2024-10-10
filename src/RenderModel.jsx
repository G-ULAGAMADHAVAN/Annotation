import React, { forwardRef, useRef } from "react";
import Gltfjsx from "./CustomGltf";
import { useGLTF } from "@react-three/drei";

const RenderModel = forwardRef(({ handleSetAnnotations }, forwardedRef) => {
  const modelRef = useRef();
  const { nodes, materials } = useGLTF("./shoe.glb");
  let nodesData = Object.values(nodes);
  return (
    <Gltfjsx
      ref={forwardedRef}
      handleSetAnnotations={handleSetAnnotations}
      nodesData={nodesData}
      nodes={nodes}
    />
  );
});

export default RenderModel;
