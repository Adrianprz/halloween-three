import { useThree, useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

function Grass() {
  const { viewport } = useThree();
  const ref = useRef();

  const image = useLoader(
    THREE.TextureLoader,
    process.env.PUBLIC_URL + "img/first.webp"
  );

  return (
    <mesh ref={ref} position={[0, 0, 12]}>
      <planeGeometry
        attach="geometry"
        args={[viewport.width, viewport.height, 1, 1]}
      />
      <meshBasicMaterial transparent map={image}></meshBasicMaterial>
    </mesh>
  );
}

export default Grass;
