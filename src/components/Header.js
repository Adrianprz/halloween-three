import { Html } from "@react-three/drei";

function Header() {
  return (
    <Html as="header" wrapperClass="header" zIndexRange={[0, 0]}>
      <div className="header__container">
        <div className="header__block">
          <a
            href="/"
            title=""
            style={{
              color: "white",
              fontSize: "18px",
              textDecoration: "none",
            }}
          >
            <object
              data="/img/logo.svg"
              width="40"
              height="40"
              aria-label="Company Logo"
            ></object>
          </a>
        </div>
        <div className="header__block">
          <ul className="list">
            <li>
              <a href="/" title="Home">
                Home
              </a>
            </li>
            <li>
              <a href="/" title="About">
                About
              </a>
            </li>
            <li>
              <a href="/" title="Food">
                Food
              </a>
            </li>
            <li>
              <a href="/" title="Nutritionists">
                Nutritionists
              </a>
            </li>
            <li>
              <a href="/" title="Contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="header__block">
        <ul className="list">
          <li>
            <a href="/" title="Home">
              Login
            </a>
          </li>
          <li>
            <a href="/" title="About">
              Sign up
            </a>
          </li>
        </ul>
      </div>
    </Html>
  );
}

export default Header;
