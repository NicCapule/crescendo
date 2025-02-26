import style from "../components/Users/Users.module.css";
import AllStudents from "../components/Students/AllStudents";
import { Outlet, useParams } from "react-router-dom";

function Students() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="pageTitle">Students</h1>
      {id ? <Outlet /> : <AllStudents />}
    </div>
  );
}

export default Students;
