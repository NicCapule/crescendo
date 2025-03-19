const handleSend = async () => {
    const studentId = formValues?.student_id;

    if (!studentId) {
        console.error("Student ID not found.");
        return;
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/chat", {
            prompt: input,
            student_id: studentId
        });        
        console.log(response.data);
    } catch (error) {
        console.error("Error communicating with AI:", error);
    }
};
