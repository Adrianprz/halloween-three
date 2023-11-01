import { Html } from "@react-three/drei";

function Section() {
  return (
    <Html as="section" wrapperClass="section" zIndexRange={[0, 0]}>
      <div>
        <div className="section__content">
          <h1>Terrifying and delicious recipes</h1>
          <h2>
            You're just 2 minutes away from discovering your dog's new favorite
            food!
          </h2>
        </div>
        <button id="view_all" type="button" aria-label="view_all">
          View all menus
        </button>
      </div>
    </Html>
  );
}

export default Section;
