const { Solver } = require("ortools-linear-solver");

const runORToolsScheduling = async (existingSessions, newSession) => {
    console.log("Running OR-Tools for new sessions...");

    // Create an OR-Tools solver instance
    const solver = new Solver("session_scheduler", Solver.CBC_MIXED_INTEGER_PROGRAMMING);

    // Decision variable: Assign newSession to a valid slot
    const x = solver.BoolVar(`session_${newSession.session_id}`);

    // Constraint: Ensure max 4 sessions per slot
    const sessionCount = existingSessions.length + 1; // Including new session
    if (sessionCount > 4) {
        throw new Error("Time slot already full, cannot schedule new session.");
    }

    // Constraint: No conflicting drum sessions
    if (newSession.instrument_id === "Drums") {
        for (const existingSession of existingSessions) {
            if (existingSession.instrument_id === "Drums") {
                throw new Error("Only 1 drum session allowed per time slot.");
            }
        }
    }

    // Solve the optimization problem
    const result = solver.Solve();

    if (result === Solver.OPTIMAL) {
        console.log("Optimal schedule found!");
        return [newSession]; // Return newly scheduled session
    } else {
        throw new Error("No valid schedule found.");
    }
};

module.exports = { runORToolsScheduling };
