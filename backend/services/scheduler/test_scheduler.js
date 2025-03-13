const mysql = require("mysql2/promise"); 
const { runORToolsScheduling } = require("./or_tools_scheduler");

// Configure MySQL Connection
const dbConfig = {
    user: "avnadmin",
    password: "AVNS_usW6GsGWX_qbc6xq9zJ",
    database: "defaultdb",
    host: "crescendo-service-crescendo-admin-portal.l.aivencloud.com",
    port: 24922,
};

// Function to Insert Scheduled Session into the Database
const insertScheduledSession = async (session) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const query = `
            INSERT INTO Session (student_id, program_id, session_number, session_date, session_start, session_end, session_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            session.student_id || null,  // Add correct student_id if available
            session.program_id || null,  // Add correct program_id if available
            session.session_number || 1, // Default to 1 if not provided
            session.session_date || new Date().toISOString().split('T')[0], // Use today if not set
            session.session_start || "12:00:00", // Default start time
            session.session_end || "13:00:00", // Default end time
            session.session_status || "Scheduled" // Mark as scheduled
        ];

        await connection.execute(query, values);
        console.log("✅ Successfully inserted scheduled session into DB:", session);
    } catch (error) {
        console.error(" Error inserting into database:", error.message);
    } finally {
        await connection.end();
    }
};

// Test Scheduling and Save to Database
const testScheduling = async () => {
    const existingSessions = [
        { session_id: 1, instrument_id: "Piano" },
        { session_id: 2, instrument_id: "Violin" },
        { session_id: 3, instrument_id: "Guitar" }
    ];

    const newSession = { student_id: 1, program_id: 1, session_id: 27, instrument_id: "Drums" };

    try {
        const result = await runORToolsScheduling(existingSessions, newSession);
        console.log(" Scheduling Result:", result);

        if (result && result.length > 0) {
            await insertScheduledSession(result[0]); // Save first scheduled session
        }
    } catch (error) {
        console.error(" Error:", error.message);
    }
};

testScheduling();
