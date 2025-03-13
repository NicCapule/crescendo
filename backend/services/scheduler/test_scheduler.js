const mysql = require("mysql2/promise"); 
const { runORToolsScheduling } = require("./or_tools_scheduler");
require('dotenv').config(); // Load environment variables

// Configure MySQL Connection from environment variables
const dbConfig = {
    user: process.env.DB_USER || "avnadmin",
    password: process.env.DB_PASSWORD || "AVNS_usW6GsGWX_qbc6xq9zJ",
    database: process.env.DB_NAME || "defaultdb",
    host: process.env.DB_HOST || "crescendo-service-crescendo-admin-portal.l.aivencloud.com",
    port: parseInt(process.env.DB_PORT || "24922"),
};

// First, let's examine the database schema to find the correct column names
const examineSchema = async () => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log("🔍 Examining database schema...");
        const [columns] = await connection.execute("SHOW COLUMNS FROM Session");
        console.log("📋 Session table columns:", columns.map(col => col.Field));
        return columns.map(col => col.Field);
    } catch (error) {
        console.error("❌ Error examining schema:", error.message);
        return [];
    } finally {
        await connection.end();
    }
};

// Function to fetch existing sessions for a date
const fetchExistingSessions = async (date) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Assuming the column might be named 'instrument_type' instead of 'instrument_id'
        const query = `
            SELECT session_id, session_start, session_end
            FROM Session
            WHERE session_date = ? AND session_status = 'Scheduled'`;
        
        const [rows] = await connection.execute(query, [date]);
        
        // Format for OR-Tools
        return rows.map(row => ({
            session_id: row.session_id,
            session_time: row.session_start,
            // We'll temporarily use a placeholder for instrument data
            instrument_id: "Unknown" // This will be replaced with correct data
        }));
    } catch (error) {
        console.error("❌ Error fetching sessions:", error.message);
        return [];
    } finally {
        await connection.end();
    }
};

// Function to Insert Scheduled Session into the Database
const insertScheduledSession = async (session) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Adjusted query to remove the instrument_id column
        const query = `
            INSERT INTO Session (
                student_id, program_id, session_number, 
                session_date, session_start, session_end, 
                session_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            session.student_id || null,
            session.program_id || null,
            session.session_number || 1,
            session.session_date || new Date().toISOString().split('T')[0],
            session.session_start,
            session.session_end,
            session.session_status || "Scheduled"
        ];

        const [result] = await connection.execute(query, values);
        console.log("✅ Successfully inserted scheduled session into DB:", {
            id: result.insertId,
            ...session
        });
        return result.insertId;
    } catch (error) {
        console.error("❌ Error inserting into database:", error.message);
        throw error;
    } finally {
        await connection.end();
    }
};

// Test Scheduling and Save to Database
const testScheduling = async () => {
    // First, let's examine the database schema
    const columns = await examineSchema();
    
    // Test date
    const testDate = new Date().toISOString().split('T')[0];
    
    // Test configurations
    const testCases = [
        {
            name: "Schedule a drum session",
            session: {
                student_id: 1,
                program_id: 1,
                instrument_id: "Drums", // Kept for OR-Tools, but not used in DB insertion
                session_date: testDate
            }
        },
        {
            name: "Schedule a piano session",
            session: {
                student_id: 2,
                program_id: 1,
                instrument_id: "Piano", // Kept for OR-Tools, but not used in DB insertion
                session_date: testDate
            }
        }
    ];
    
    // Custom constraints for testing
    const constraints = {
        max_sessions_per_slot: 4,
        exclusive_instruments: ["Drums", "Piano"],
        time_slots: [
            ["09:00:00", "10:00:00"],
            ["10:00:00", "11:00:00"],
            ["11:00:00", "12:00:00"],
            ["12:00:00", "13:00:00"],
            ["13:00:00", "14:00:00"],
            ["14:00:00", "15:00:00"],
        ]
    };
    
    for (const testCase of testCases) {
        console.log(`\n📋 Running test: ${testCase.name}`);
        
        try {
            // Get existing sessions
            const existingSessions = await fetchExistingSessions(testDate);
            console.log(`ℹ️ Found ${existingSessions.length} existing sessions for ${testDate}`);
            
            // Run OR-Tools scheduling
            const result = await runORToolsScheduling(
                existingSessions, 
                testCase.session,
                { constraints }
            );
            
            console.log("✅ Scheduling Result:", result);
            
            if (result && result.length > 0) {
                // Save to database
                await insertScheduledSession(result[0]);
                console.log(`✅ Test "${testCase.name}" passed successfully`);
            }
        } catch (error) {
            console.error(`❌ Test "${testCase.name}" failed:`, error.message);
        }
    }
};

// Run the tests
const runTests = async () => {
    const testDate = new Date().toISOString().split('T')[0];
    await testScheduling();
    console.log("\n🎯 All tests completed");
};

// Run tests if this script is executed directly
if (require.main === module) {
    runTests().catch(error => {
        console.error("❌ Test suite failed:", error);
        process.exit(1);
    });
}

module.exports = { testScheduling, fetchExistingSessions, insertScheduledSession };