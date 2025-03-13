const { Session, Program, Instrument } = require("../../models");
const { runORToolsScheduling } = require("./or_tools_scheduler");
const { Op } = require("sequelize");

/**
 * Get configuration for scheduling constraints including instruments
 */
const getSchedulingConfig = async () => {
    try {
        // Get all instruments that require exclusive scheduling
        const exclusiveInstruments = await Instrument.findAll({
            where: {
                requires_exclusive_time: true // Assuming this column exists
            },
            attributes: ['instrument_id']
        });
        
        return {
            max_sessions_per_slot: 4,
            exclusive_instruments: exclusiveInstruments.map(inst => inst.instrument_id.toString()),
            time_slots: [
                ["09:00:00", "10:00:00"],
                ["10:00:00", "11:00:00"],
                ["11:00:00", "12:00:00"],
                ["12:00:00", "13:00:00"],
                ["13:00:00", "14:00:00"],
                ["14:00:00", "15:00:00"],
                ["15:00:00", "16:00:00"],
                ["16:00:00", "17:00:00"],
            ]
        };
    } catch (error) {
        console.error("❌ Error loading scheduling config:", error);
        // Fallback to default config
        return {
            max_sessions_per_slot: 4,
            exclusive_instruments: ["4", ""], // Assume drums and piano are IDs 1 and 2
            time_slots: [
                ["09:00:00", "10:00:00"],
                ["10:00:00", "11:00:00"],
                ["11:00:00", "12:00:00"],
                ["12:00:00", "13:00:00"],
                ["13:00:00", "14:00:00"],
                ["14:00:00", "15:00:00"],
                ["15:00:00", "16:00:00"],
                ["16:00:00", "17:00:00"],
            ]
        };
    }
};

/**
 * Optimize a new session and insert it into the schedule
 * @param {Object} newSession - Session to be scheduled
 * @returns {Promise<Object>} - Scheduled session or error
 */
const optimizeNewSession = async (newSession) => {
    const { session_date, instrument_id, program_id } = newSession;

    try {
        // Get program details if not provided but instrument_id is
        let programDetails = null;
        if (!program_id && instrument_id) {
            programDetails = await Program.findOne({
                where: { instrument_id },
                attributes: ['program_id']
            });
            
            if (programDetails) {
                newSession.program_id = programDetails.program_id;
            }
        }
        
        // Fetch all existing sessions for the given date with instrument information
        const existingSessions = await Session.findAll({
            where: { 
                session_date, 
                session_status: "Scheduled" 
            },
            include: [{
                model: Program,
                attributes: ['program_id', 'instrument_id'],
                include: [{
                    model: Instrument,
                    attributes: ['instrument_id', 'instrument_name']
                }]
            }],
            attributes: ['session_id', 'session_start', 'session_end']
        });

        // Load scheduling configuration
        const constraints = await getSchedulingConfig();

        // Convert DB format to match OR-Tools expectations
        const formattedSessions = existingSessions.map(session => ({
            session_id: session.session_id,
            session_time: session.session_start,
            instrument_id: session.Program?.instrument_id?.toString() || null,
            instrument_name: session.Program?.Instrument?.instrument_name || "Unknown"
        }));

        console.log("✅ Fetched Sessions from DB:", JSON.stringify(formattedSessions, null, 2));

        // Run OR-Tools scheduling with configuration
        const optimizedSessions = await runORToolsScheduling(
            formattedSessions, 
            newSession, 
            { constraints }
        );

        if (optimizedSessions.length > 0) {
            const newOptimizedSession = optimizedSessions[0];

            // Insert newly scheduled session into DB
            const createdSession = await Session.create({
                session_date,
                session_start: newOptimizedSession.session_start,
                session_end: newOptimizedSession.session_end,
                program_id: newSession.program_id,
                student_id: newSession.student_id,
                session_number: newSession.session_number || 1,
                session_status: "Scheduled",
            });

            console.log("🎉 New session successfully scheduled:", newOptimizedSession);
            return {
                success: true,
                session: createdSession.toJSON()
            };
        } else {
            throw new Error("No valid schedule found.");
        }
    } catch (error) {
        console.error("❌ Error optimizing session:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { optimizeNewSession };