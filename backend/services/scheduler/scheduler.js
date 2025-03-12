const { Session, Program } = require("../../models");
const { runORToolsScheduling } = require("./or_tools_scheduler");

const optimizeNewSession = async (newSession) => {
    const { session_date, session_start } = newSession;

    try {
        const existingSessions = await Session.findAll({
            where: { session_date, session_start, session_status: "Scheduled" },
        });

        // 🚀 Debugging: Log fetched data
        console.log("✅ Fetched Sessions from DB:", JSON.stringify(existingSessions, null, 2));

        if (existingSessions.length >= 4) {
            throw new Error("Cannot add session: Time slot is fully booked.");
        }

        const optimizedSessions = await runORToolsScheduling(existingSessions, newSession);

        for (const session of optimizedSessions) {
            await Session.update(
                { session_status: "Scheduled" },
                { where: { session_id: session.session_id } }
            );
        }

        console.log("🎉 New session successfully scheduled.");
    } catch (error) {
        console.error("❌ Error optimizing session:", error.message);
    }
};

module.exports = { optimizeNewSession };
