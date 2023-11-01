import Header from "./Header";
import Social from "./Social";
import Section from "./Section";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";

function Main({ children }) {
  const scroll = useScroll();
  const [offset, setOffset] = useState(0);
  const showDistanceComponents = 1.66;

  useFrame((state) => {
    const distance = -70;
    setOffset(2 - scroll.offset);

    if (offset <= 1.63) return;

    state.camera.position.set(
      0,
      0,
      Math.cos((offset * Math.PI) / 3) * distance
    );

    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {offset <= showDistanceComponents && <Header />}
      {offset <= showDistanceComponents && <Section />}
      {offset <= showDistanceComponents && <Social />}
      {children}
    </>
  );
}

export default Main;
