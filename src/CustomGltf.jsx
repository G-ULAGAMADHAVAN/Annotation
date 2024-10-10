import { useState, useRef, forwardRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Gltfjsx = forwardRef(
  ({ nodesData, nodes, handleSetAnnotations }, ref) => {
    const { scene, camera } = useThree();
    // const modelRef = useRef();

    const groups = [];
    const meshes = [];

    console.log({ nodesData });

    nodesData[0].children.forEach((node) => {
      if (node.type === "Group" && node.name !== "Scene") {
        groups.push(node);
      } else if (node.type === "Mesh") {
        meshes.push(node);
      }
    });

    const getMeshProps = (name) => {
      const mesh = nodes[name] || {};
      return {
        position: [
          mesh.position?.x || 0,
          mesh.position?.y || 0,
          mesh.position?.z || 0,
        ],
        scale: [mesh.scale?.x || 1, mesh.scale?.y || 1, mesh.scale?.z || 1],
        rotation: [
          mesh.rotation?.x || 0,
          mesh.rotation?.y || 0,
          mesh.rotation?.z || 0,
        ],
      };
    };

    const handleDoubleClick = (event) => {
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      // Calculate normalized device coordinates from mouse event
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update raycaster with current camera and mouse position
      raycaster.setFromCamera(mouse, camera);
console.log({ref});
      // Raycast to detect intersecting objects
      const intersects = raycaster.intersectObjects(ref.current.children, true);

      console.log({
        raycaster,
        mouse,
        children: ref.current.children,
        intersects,
      });

      if (intersects.length > 0) {
        const intersectedPart = intersects[0].object;

        // Get intersection point to place the annotation
        const position = intersects[0].point;

        // Add new annotation
        handleSetAnnotations({
          id: Date.now(),
          position: position.toArray(),
          part: intersectedPart,
        });
      }
    };

    return (
      <>
        <group ref={ref} dispose={null} onDoubleClick={handleDoubleClick}>
          {meshes.map((child, i) => (
            // <Select
            //   key={child.name}
            //   name={child.name}
            //   enabled={child.name === highlighted}
            // >
            <mesh
              name={child.name}
              key={child.name}
              visible={child?.material?.visible}
              castShadow={child?.material?.visible}
              geometry={nodes[child.name]?.geometry}
              material={new THREE.MeshStandardMaterial()}
              position={getMeshProps(child.name).position}
              scale={getMeshProps(child.name).scale}
              rotation={getMeshProps(child.name).rotation}
              // onDoubleClick={() => handleHighlight(child.material.name)}
            />
            // </Select>
          ))}
          {groups.map((child, index) => (
            <group
              key={`${child.name}-${index}`}
              position={getMeshProps(child.name).position}
              scale={getMeshProps(child.name).scale}
              rotation={getMeshProps(child.name).rotation}
              // onDoubleClick={() => handleHighlightGroup(child)}
            >
              {child.children.map((childMesh, i) => (
                <mesh
                  key={`${childMesh.name}-${i}`}
                  visible={childMesh?.material?.visible}
                  castShadow={childMesh?.material?.visible}
                  geometry={nodes[childMesh.name]?.geometry}
                  material={new THREE.MeshStandardMaterial()}
                  position={getMeshProps(childMesh.name).position}
                  scale={getMeshProps(childMesh.name).scale}
                  rotation={getMeshProps(childMesh.name).rotation}
                />
              ))}
            </group>
          ))}
        </group>
      </>
    );
  }
);

export default Gltfjsx;
