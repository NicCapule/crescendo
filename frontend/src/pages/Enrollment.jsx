import React, { useState } from "react";
import EnrollmentForm from "../components/Forms/EnrollmentForm";
import ChatButton from "../components/ChatButton"; // Import the ChatButton

function Enrollment() {
  const [formValues, setFormValues] = useState(null);
  
  // This function will be passed to EnrollmentForm to get current values
  const updateFormValues = (values) => {
    setFormValues(values);
  };

  return (
    <>
      <h1 className="pageTitle">Enrollment</h1>
      <EnrollmentForm onFormValuesChange={updateFormValues} />
      <ChatButton/>
    </>
  );
}

export default Enrollment;