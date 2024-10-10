import * as THREE from "three";
import { CameraControls, Environment, Html, Stage } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import RenderModel from "./RenderModel";

function Annotation({ position, part }) {
  return (
    <Html position={position}>
      <div style={{ background: "white", padding: "5px", borderRadius: "5px" }}>
        Annotation for {part.name}
      </div>
    </Html>
  );
}

const FiberViwer = () => {
  const [annotations, setAnnotations] = useState([]);

  const modelRef = useRef();
  const handleSetAnnotations = (data) => {
    setAnnotations((prev) => [...prev, data]);
  };
  return (
    <>
      <Environment preset="city" />
      <ambientLight />
      <CameraControls />
      {annotations.map((annotation) => (
        <Annotation
          key={annotation.id}
          position={annotation.position}
          part={annotation.part}
        />
      ))}
      {/* <Center> */}
      <Stage>
        <RenderModel
          ref={modelRef}
          handleSetAnnotations={handleSetAnnotations}
        />
      </Stage>
      {/* </Center> */}
    </>
  );
};

export default FiberViwer;
