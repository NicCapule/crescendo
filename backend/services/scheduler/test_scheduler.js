const { runORToolsScheduling } = require("./or_tools_scheduler");

const testScheduling = async () => {
    const existingSessions = [
        { session_id: 1, instrument_id: "Piano" },
        { session_id: 2, instrument_id: "Violin" },
        { session_id: 3, instrument_id: "Guitar" }
    ];

    const newSession = { session_id: 25, instrument_id: "Drums" };

    try {
        const result = await runORToolsScheduling(existingSessions, newSession);
        console.log("Scheduling Result:", result);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

testScheduling();
