import React, { useState, useEffect } from "react";
import "./Enrollment.css"; // Import CSS file for styling

function Enrollment() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    contact: "",
    email: "",
    instrument: "",
    sessions: "",
    startDate: "",
    paymentType: "",
    qualification: "", // For teachers
    experience: "", // For teachers
  });

  const [instruments, setInstruments] = useState([]);
  const [isStudent, setIsStudent] = useState(true); // Toggle between student and teacher forms

  useEffect(() => {
    fetch("/api/instruments")
      .then((res) => res.json())
      .then((data) => setInstruments(data))
      .catch((error) => console.error("Error fetching instruments:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isStudent ? "/api/enroll-student" : "/api/enroll-teacher";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert(`${isStudent ? "Student" : "Teacher"} enrollment successful!`);
        setFormData({
          name: "",
          age: "",
          address: "",
          contact: "",
          email: "",
          instrument: "",
          sessions: "",
          startDate: "",
          paymentType: "",
          qualification: "",
          experience: "",
        });
      } else {
        alert("Error enrolling.");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  return (
    <div className="enrollment-container">
      <h1 className="pageTitle">Enrollment</h1>
      
      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${isStudent ? "active" : ""}`}
          onClick={() => setIsStudent(true)}
        >
          Student
        </button>
        <button
          className={`toggle-btn ${!isStudent ? "active" : ""}`}
          onClick={() => setIsStudent(false)}
        >
          Teacher
        </button>
      </div>

      <form onSubmit={handleSubmit} className="enrollment-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact #" value={formData.contact} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

        <select name="instrument" value={formData.instrument} onChange={handleChange} required>
          <option value="">Select Instrument</option>
          {instruments.map((instrument) => (
            <option key={instrument.instrument_id} value={instrument.instrument_name}>{instrument.instrument_name}</option>
          ))}
        </select>

        {isStudent ? (
          <>
            <select name="sessions" value={formData.sessions} onChange={handleChange} required>
              <option value="">Select Sessions</option>
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>{num + 1}</option>
              ))}
            </select>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            <select name="paymentType" value={formData.paymentType} onChange={handleChange} required>
              <option value="">Select Payment Type</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </>
        ) : (
          <>
            <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} required />
            <input type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleChange} required />
          </>
        )}

        <button type="submit" className="enroll-btn">{isStudent ? "Enroll Student" : "Enroll Teacher"}</button>
      </form>
    </div>
  );
}

export default Enrollment;
