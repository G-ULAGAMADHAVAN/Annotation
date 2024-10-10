import { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Annotation({ position, part, onDragStart, isSelected }) {
  return (
    <Html
      position={position}
      transform    // Ensures the annotation moves properly with the model in 3D space
      occlude     // Fixes depth-based flickering
      zIndexRange={[100, 0]}  // Keeps the annotation at the top of the render stack
    >
      <div
        onMouseDown={onDragStart}
        style={{
          background: isSelected ? 'lightblue' : 'white',
          padding: '5px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Annotation for {part.name}
      </div>
    </Html>
  );
}

function Experience({ controlsRef }) {
  const [annotations, setAnnotations] = useState([]);
  const [draggingAnnotation, setDraggingAnnotation] = useState(null);
  const { camera } = useThree();
  const modelRef = useRef();

  const handleDoubleClick = (event) => {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // Calculate normalized device coordinates from mouse event
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with current camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Raycast to detect intersecting objects
    const intersects = raycaster.intersectObjects(modelRef.current.children, true);

    if (intersects.length > 0) {
      const intersectedPart = intersects[0].object;

      // Get intersection point to place the annotation
      const position = intersects[0].point;

      // Add new annotation
      setAnnotations((prev) => [
        ...prev,
        { id: Date.now(), position: position.toArray(), part: intersectedPart }
      ]);
    }
  };

  const handleMouseMove = (event) => {
    if (!draggingAnnotation) return;

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // Calculate normalized device coordinates from mouse event
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with current camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Raycast to find where the mouse is on the plane
    const intersects = raycaster.intersectObjects(modelRef.current.children, true);
    if (intersects.length > 0) {
      const newPosition = intersects[0].point;

      // Update the annotation's position
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === draggingAnnotation.id
            ? { ...annotation, position: newPosition.toArray() }
            : annotation
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingAnnotation(null);

    // Re-enable OrbitControls when dragging ends
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
  };

  const startDrag = (annotation) => {
    setDraggingAnnotation(annotation);

    // Disable OrbitControls when dragging starts
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  };

  // Add mouse event listeners for dragging annotations
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingAnnotation]);

  return (
    <>
      <group ref={modelRef} onDoubleClick={handleDoubleClick}>
        {/* Your 3D model parts */}
        {/* Example mesh */}
        <mesh name="part1">
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        <mesh name="part2" position={[2, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </group>

      {/* Render Annotations */}
      {annotations.map((annotation) => (
        <Annotation
          key={annotation.id}
          position={annotation.position}
          part={annotation.part}
          isSelected={annotation.id === draggingAnnotation?.id}
          onDragStart={() => startDrag(annotation)}
        />
      ))}
    </>
  );
}

function App() {
  const controlsRef = useRef();

  return (
    <Canvas>
      <ambientLight />
      <Experience controlsRef={controlsRef} />
      {/* OrbitControls with ref for enabling/disabling */}
      <OrbitControls ref={controlsRef} />
    </Canvas>
  );
}

export default App;
