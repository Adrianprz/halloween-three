import React, { Suspense, useRef, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Loader from "./components/Loader";

import "./styles/style.scss";

const InitialText = lazy(() => import("./components/InitialText"));
const Grass = lazy(() => import("./components/Grass"));
const Background = lazy(() => import("./components/Background"));
const Flock = lazy(() => import("./components/Flock"));
const Main = lazy(() => import("./components/Main"));

function App() {
  const mouse = useRef([0, 0, false]);

  return (
    <Suspense fallback={<Loader />}>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
        <ScrollControls pages={3}>
          <Main>
            <InitialText />
            <Grass />
            <Background />
            <Flock mouse={mouse} count={70} />
          </Main>
        </ScrollControls>
      </Canvas>
    </Suspense>
  );
}

export default App;
