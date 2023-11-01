import React, { useRef } from "react";
import { useThree, useLoader, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial, Sparkles } from "@react-three/drei";

function Background() {
  const depthMaterial = useRef();
  const { viewport } = useThree();

  const image = useLoader(
    THREE.TextureLoader,
    process.env.PUBLIC_URL + "img/img.webp"
  );

  const depthImage = useLoader(
    THREE.TextureLoader,
    process.env.PUBLIC_URL + "img/depthImg.webp"
  );

  useFrame(
    (state) =>
      (depthMaterial.current.uMouse = [
        state.mouse.x * 0.03,
        state.mouse.y * 0.03,
      ])
  );

  return (
    <mesh>
      <planeGeometry
        attach="geometry"
        args={[viewport.width, viewport.height * 1.5, 1, 1]}
      />

      <pseudo3DMaterial
        ref={depthMaterial}
        uImage={image}
        uDepthMap={depthImage}
      />
      <Sparkles count={40} scale={5} size={10} speed={1} color={"#f7943e"} />
      <group position={[-3, -5, 0]}></group>
    </mesh>
  );
}

extend({
  Pseudo3DMaterial: shaderMaterial(
    { uMouse: [0, 0], uImage: null, uDepthMap: null },
    `
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }`,
    `
    precision mediump float;

    uniform vec2 uMouse;
    uniform sampler2D uImage;
    uniform sampler2D uDepthMap;

    varying vec2 vUv;
  
    vec4 linearTosRGB( in vec4 value ) {
      return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
    }
    
    
    void main() {
       vec4 depthDistortion = texture2D(uDepthMap, vUv);
       float parallaxMult = depthDistortion.r;

       vec2 parallax = (uMouse) * parallaxMult;

       vec4 original = texture2D(uImage, (vUv + parallax));
       gl_FragColor = linearTosRGB(original);
    }
    `
  ),
});

export default Background;
