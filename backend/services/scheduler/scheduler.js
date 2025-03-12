const { Session, Program } = require("../models");
const { runORToolsScheduling } = require("./or_tools_scheduler"); // OR-Tools logic

const optimizeNewSession = async (newSession) => {
    const { session_date, session_start } = newSession;

    try {
        // Fetch existing sessions for the same time slot
        const existingSessions = await Session.findAll({
            where: { session_date, session_start, session_status: "Scheduled" },
        });

        // If max sessions (4) are already scheduled in this slot, reject
        if (existingSessions.length >= 4) {
            throw new Error("Cannot add session: Time slot is fully booked.");
        }

        // Run OR-Tools optimization **only for new session(s)**
        const optimizedSessions = await runORToolsScheduling(existingSessions, newSession);

        // Save optimized sessions to database
        for (const session of optimizedSessions) {
            await Session.update(
                { session_status: "Scheduled" },  // Mark as scheduled
                { where: { session_id: session.session_id } }
            );
        }

        console.log("New session successfully scheduled.");
    } catch (error) {
        console.error("Error optimizing session:", error.message);
    }
};

module.exports = { optimizeNewSession };
