import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  Center,
  Environment,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import RenderModel from "./RenderModel.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
  >
    <Environment preset="city" />
    <ambientLight />
    <CameraControls />
    {/* <Center> */}
    {/* <Stage> */}
      <RenderModel />
    {/* </Stage> */}
    {/* </Center> */}
  </Canvas>
);
