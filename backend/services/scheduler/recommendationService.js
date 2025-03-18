const { Session, Program, Instrument } = require("../../models");
const { getScheduleRecommendations } = require("./openai_recommender");
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
            exclusive_instruments: ["4", "5"], // Update with your actual instrument IDs
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
 * Generate schedule recommendations for a session request using OpenAI
 * @param {Object} sessionRequest - Session details for generating recommendations
 * @returns {Promise<Object>} - Recommended schedules with scores
 */
const getSessionRecommendations = async (sessionRequest) => {
    const { session_date, instrument_id, program_id } = sessionRequest;

    try {
        // Get program details if not provided but instrument_id is
        if (!program_id && instrument_id) {
            const programDetails = await Program.findOne({
                where: { instrument_id },
                attributes: ['program_id']
            });
            
            if (programDetails) {
                sessionRequest.program_id = programDetails.program_id;
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

        // Convert DB format to match OpenAI expectations
        const formattedSessions = existingSessions.map(session => ({
            session_id: session.session_id,
            session_time: session.session_start,
            session_end: session.session_end,
            instrument_id: session.Program?.instrument_id?.toString() || null,
            instrument_name: session.Program?.Instrument?.instrument_name || "Unknown"
        }));

        console.log("✅ Fetched Sessions from DB:", JSON.stringify(formattedSessions, null, 2));

        // Get recommendations from OpenAI
        const result = await getScheduleRecommendations(
            formattedSessions, 
            sessionRequest, 
            constraints
        );

        if (result.success && result.recommendations.length > 0) {
            // Enhance the recommendations with additional metadata
            const enhancedRecommendations = result.recommendations.map(rec => ({
                ...rec,
                formatted_time: `${rec.session_start.slice(0, 5)} - ${rec.session_end.slice(0, 5)}`,
                recommended_level: getRecommendationLevel(rec.preference_score),
                session_date,
                instrument_id: sessionRequest.instrument_id,
                program_id: sessionRequest.program_id
            }));

            return {
                success: true,
                recommendations: enhancedRecommendations,
                stats: result.stats
            };
        } else {
            throw new Error(result.error || "No valid recommendations found.");
        }
    } catch (error) {
        console.error("❌ Error generating recommendations:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Categorize recommendation based on preference score
 * @param {Number} score - Preference score from 1-5
 * @returns {String} - Recommendation level
 */
const getRecommendationLevel = (score) => {
    if (score >= 4) return "Highly Recommended";
    if (score >= 3) return "Recommended";
    if (score >= 2) return "Acceptable";
    return "Available";
};

/**
 * Book a session based on a selected recommendation
 * @param {Object} recommendation - Selected recommendation
 * @param {Object} sessionDetails - Additional details needed for booking
 * @returns {Promise<Object>} - Created session or error
 */
const bookRecommendedSession = async (recommendation, sessionDetails) => {
    try {
        const { session_date, session_start, session_end, program_id } = recommendation;
        const { student_id, session_number } = sessionDetails;
        
        // Create the session in the database
        const createdSession = await Session.create({
            session_date,
            session_start,
            session_end,
            program_id,
            student_id,
            session_number: session_number || 1,
            session_status: "Scheduled",
        });

        console.log("🎉 New session successfully booked:", createdSession.toJSON());
        return {
            success: true,
            session: createdSession.toJSON()
        };
    } catch (error) {
        console.error("❌ Error booking session:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { 
    getSessionRecommendations,
    bookRecommendedSession
};