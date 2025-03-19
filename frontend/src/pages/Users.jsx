import style from "../components/Users/Users.module.css";
import AllUsers from "../components/Users/AllUsers";

function Users() {
  return (
    <>
      <div className={style.userHeader}></div>
      <AllUsers />
    </>
  );
}
export default Users;
