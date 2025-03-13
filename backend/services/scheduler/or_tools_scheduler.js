// Enhanced or_tools_scheduler.js
const { spawn } = require("child_process");

/**
 * Runs the OR-Tools scheduling algorithm via Python
 * @param {Array} existingSessions - Currently scheduled sessions
 * @param {Object} newSession - Session to schedule
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} - Array of scheduled sessions
 */
const runORToolsScheduling = async (existingSessions, newSession, options = {}) => {
    const {
        pythonPath = "python",
        scriptPath = "or_tools_scheduler.py",
        timeout = 30000 // 30 seconds timeout
    } = options;

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(pythonPath, [scriptPath]);
        let timeoutId;

        // Set timeout
        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                pythonProcess.kill();
                reject(new Error(`Scheduling timed out after ${timeout}ms`));
            }, timeout);
        }

        const inputData = JSON.stringify({ 
            existing_sessions: existingSessions, 
            new_session: newSession,
            constraints: options.constraints || {} // Allow passing custom constraints
        });
        
        let resultData = "";

        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on("data", (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("Python Error:", data.toString());
        });

        pythonProcess.on("error", (error) => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to start Python process: ${error.message}`));
        });

        pythonProcess.on("close", (code) => {
            clearTimeout(timeoutId);
            
            if (code !== 0) {
                return reject(new Error(`Python process exited with code ${code}`));
            }

            try {
                const jsonLines = resultData.trim().split("\n");
                const lastJsonLine = jsonLines[jsonLines.length - 1];

                const result = JSON.parse(lastJsonLine);
                if (result.error) {
                    reject(new Error(result.error));
                } else if (result.success && result.scheduled_session) {
                    resolve([result.scheduled_session]);
                } else {
                    reject(new Error("Unexpected response from OR-Tools"));
                }
            } catch (err) {
                reject(new Error(`Failed to parse Python response: ${err.message}`));
            }
        });
    });
};

module.exports = { runORToolsScheduling };