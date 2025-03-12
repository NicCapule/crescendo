const { spawn } = require("child_process");

const runORToolsScheduling = async (existingSessions, newSession) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", ["or_tools_scheduler.py"]);

        const inputData = JSON.stringify({ existing_sessions: existingSessions, new_session: newSession });
        let resultData = "";

        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on("data", (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("Python Error:", data.toString());
        });

        pythonProcess.on("close", () => {
            try {
                // Extract last valid JSON line (ignoring OR-Tools logs)
                const jsonLines = resultData.trim().split("\n");
                const lastJsonLine = jsonLines[jsonLines.length - 1];

                const result = JSON.parse(lastJsonLine);
                if (result.error) {
                    reject(new Error(result.error));
                } else {
                    resolve([newSession]);
                }
            } catch (err) {
                reject(new Error("Failed to parse Python response"));
            }
        });
    });
};

module.exports = { runORToolsScheduling };
