require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const { OpenAI } = require("openai");

const app = express();
app.use(express.json());

const corsOptions = {
    origin: "http://localhost:5173", // Allow frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Ensure OPTIONS is included
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow headers
    credentials: true, // Allow cookies & authentication
};

app.use(cors(corsOptions));

// Manually handle preflight requests
app.options("*", cors(corsOptions));


// Database Connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

app.post("/chat", async (req, res) => {
    try {
        console.log("Received request:", req.body); // Log input data

        const { prompt, student_id } = req.body;
        if (!prompt || !student_id) {
            return res.status(400).json({ error: "Missing prompt or student_id" });
        }

        const student_avail = await StudentAvailability.findAll({ where: { student_id } });
        console.log("Student availability:", student_avail);

        const enrollment = await Enrollment.findOne({ where: { student_id } });
        console.log("Enrollment:", enrollment);

        if (!enrollment) {
            return res.status(404).json({ error: "Student is not enrolled" });
        }

        const teacher_id = enrollment.teacher_id;
        const teacher_avail = await TeacherAvailability.findAll({ where: { teacher_id } });
        console.log("Teacher availability:", teacher_avail);

        const existing_sessions = await Session.findAll({ where: { student_id } });
        console.log("Existing sessions:", existing_sessions);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an AI scheduling assistant." },
                { role: "user", content: `Find a schedule for the student based on availability.\n\nStudent: ${student_avail}\n\nTeacher: ${teacher_avail}\n\nSessions: ${existing_sessions}` }
            ],
            temperature: 0.2,
            max_tokens: 1000
        });

        console.log("OpenAI response:", response);
        res.json({ response: response.choices[0].message.content.trim() });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});


