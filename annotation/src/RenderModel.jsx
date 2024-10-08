import React, { useRef } from "react";
import Gltfjsx from "./CustomGltf";
import { useGLTF } from "@react-three/drei";

const RenderModel = () => {
  const modelRef = useRef();
  const { nodes, materials } = useGLTF("./shoe.glb");
  let nodesData = Object.values(nodes);
  return <Gltfjsx nodesData={nodesData} nodes={nodes} />;
};

export default RenderModel;
