import { Html } from "@react-three/drei";

function Social({ children }) {
  return (
    <Html
      as="ul"
      wrapperClass="social"
      zIndexRange={[0, 0]}
      position={[0, 0, 0]}
    >
      <img src="img/social.webp" alt="Social icons" draggable={false} />
    </Html>
  );
}

export default Social;
