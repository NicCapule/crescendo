import style from "./Layout.module.css";
import useAuth from "../../hooks/useAuth";

import logo from "../../assets/logo.png";

function Header() {
  const { user } = useAuth();
  return (
    <header className={style.headerContainer}>
      <div className={style.logoContainer}>
        <img src={logo} className={style.clogo} />
      </div>
      <div className={style.userDisplay}>
        <p>{`${user.first_name} ${user.last_name}`}</p>
        <p>{user.email}</p>
        <p>{user.role}</p>
      </div>
    </header>
  );
}

export default Header;
