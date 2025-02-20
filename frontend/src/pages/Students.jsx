import style from "../components/Users/Users.module.css";
import AllStudents from "../components/Students/AllStudents";

function Students() {
  return (
    <div>
      <h1 className="pageTitle">Students</h1>
      <AllStudents />
    </div>
  );
}

export default Students;
