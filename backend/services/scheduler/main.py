from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
from sqlalchemy import create_engine, MetaData, Table, select
from databases import Database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
openai.api_key = ""
# Update DATABASE_URL with the correct MySQL host and credentials
DATABASE_URL = "mysql://avnadmin:AVNS_usW6GsGWX_qbc6xq9zJ@crescendo-service-crescendo-admin-portal.l.aivencloud.com:24922/defaultdb?ssl_mode=REQUIRED"
database = Database(DATABASE_URL)
metadata = MetaData()

# Use Synchronous Engine for Metadata Reflection
sync_engine = create_engine("mysql://avnadmin:AVNS_usW6GsGWX_qbc6xq9zJ@crescendo-service-crescendo-admin-portal.l.aivencloud.com:24922/defaultdb?ssl_mode=REQUIRED")

students = Table("Student", metadata, autoload_with=sync_engine)
teachers = Table("Teacher", metadata, autoload_with=sync_engine)
sessions = Table("Session", metadata, autoload_with=sync_engine)
enrollments = Table("Enrollment", metadata, autoload_with=sync_engine)
student_availability = Table("StudentAvailability", metadata, autoload_with=sync_engine)
teacher_availability = Table("TeacherAvailability", metadata, autoload_with=sync_engine)

@app.on_event("startup")
async def connect_db():
    await database.connect()

@app.on_event("shutdown")
async def disconnect_db():
    await database.disconnect()


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    student_id = data.get("student_id")

    # Fetch student availability
    query_student_avail = select([student_availability]).where(student_availability.c.student_id == student_id)
    student_avail = await database.fetch_all(query_student_avail)

    student_avail_text = "\n".join(
        [f"{row['day_of_week']} from {row['start_time']} to {row['end_time']}" for row in student_avail]
    ) or "No available slots for the student."

    # Fetch teacher associated with the student via Enrollment
    query_teacher = (
        select([enrollments.c.teacher_id])
        .where(enrollments.c.student_id == student_id)
    )
    teacher_result = await database.fetch_one(query_teacher)
    teacher_id = teacher_result['teacher_id'] if teacher_result else None

    # Fetch teacher availability
    if teacher_id:
        query_teacher_avail = select([teacher_availability]).where(teacher_availability.c.teacher_id == teacher_id)
        teacher_avail = await database.fetch_all(query_teacher_avail)

        teacher_avail_text = "\n".join(
            [f"{row['day_of_week']} from {row['start_time']} to {row['end_time']}" for row in teacher_avail]
        ) or "No available slots for the teacher."
    else:
        teacher_avail_text = "No assigned teacher found."

    # Fetch existing sessions for conflict checking
    query_sessions = select([sessions]).where(sessions.c.student_id == student_id)
    existing_sessions = await database.fetch_all(query_sessions)

    existing_sessions_text = "\n".join(
        [f"Session on {row['session_date']} from {row['start_time']} to {row['end_time']}" for row in existing_sessions]
    ) or "No existing sessions for the student."

    # OpenAI API Call
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI scheduling assistant. Please provide scheduling suggestions based on "
                    "student and teacher availability while considering existing sessions to avoid conflicts."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Student availability:\n{student_avail_text}\n\n"
                    f"Teacher availability:\n{teacher_avail_text}\n\n"
                    f"Existing sessions:\n{existing_sessions_text}\n\n"
                    f"Now, {prompt}"
                )
            }
        ],
        temperature=0.2,
        max_tokens=1000,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    return {"response": response.choices[0].message.content.strip()}
