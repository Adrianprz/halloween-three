import { Html } from "@react-three/drei";

function InitialText() {
  return (
    <Html wrapperClass="splash" position={[0, 0, 15]} transform center pointerEvents={"none"}>
      <p
        className="splash__text"
      >
        Happy Halloween!
      </p>
      <div className="scroll"></div>
      <span className="splash__subtext">
        Scroll down
      </span>
    </Html>
  );
}

export default InitialText;
