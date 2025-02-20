import style from "../components/Users/Users.module.css";
import AllUsers from "../components/Users/AllUsers";
import CreateUser from "../components/Users/CreateUser";

function Users() {
  return (
    <>
      <h1 className="pageTitle">Users</h1>
      <div className={style.userHeader}></div>
      <AllUsers />
      <CreateUser />
    </>
  );
}
export default Users;
