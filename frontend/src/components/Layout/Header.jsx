import style from "./Layout.module.css";

import logo from "../../assets/logo.png";

function Header() {
  return (
    <header className={style.headerContainer}>
      <div className={style.logoContainer}>
        <img src={logo} className={style.clogo} />
      </div>

      <p className={style.userd}>Admin</p>
    </header>
  );
}

export default Header;
