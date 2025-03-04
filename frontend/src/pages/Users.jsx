import style from "../components/Users/Users.module.css";
import AllUsers from "../components/Users/AllUsers";

function Users() {
  return (
    <>
      <h1 className="pageTitle">User Accounts</h1>
      <div className={style.userHeader}></div>
      <AllUsers />
    </>
  );
}
export default Users;
