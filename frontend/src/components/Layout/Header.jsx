import useAuth from "../../hooks/useAuth";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Header() {
  const { user } = useAuth();
  return (
    <header className="headerContainer">
      <div className="logoContainer">
        <img src={logo} className="clogo" />
      </div>
      <div className="userDisplay">
        {user.role === "Teacher" ? (
          <Link to={"/profile"}>{`${user.first_name} ${user.last_name}`}</Link>
        ) : (
          <p>{`${user.first_name} ${user.last_name}`}</p>
        )}

        <p>{user.email}</p>
        <p>{user.role}</p>
      </div>
    </header>
  );
}

export default Header;
