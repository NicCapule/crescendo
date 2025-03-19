import openai
from openai import OpenAI

client = OpenAI(api_key="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")

# Improved content filter for broader scheduling terms
def is_scheduling_related(prompt):
    greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
    if any(greet in prompt.lower() for greet in greetings):
        return "greeting"

    keywords = [
        "schedule", "time", "availability", "class", "lesson", 
        "appointment", "meeting", "calendar", "reschedule", "cancel", 
        "postpone", "confirm", "session", "tutorial", "instructor", "teacher", "student",
        "piano", "guitar", "violin", "drums", "ukulele", "voice"
    ]
    return "scheduling" if any(keyword in prompt.lower() for keyword in keywords) else "unrelated"

# Improved post-processing to reduce false positives
def filter_response(response):
    disallowed_phrases = [
        "I'm an AI", "I don't know", "Here's a joke", 
        "I'm not sure", "I can't help with that"
    ]
    if any(phrase in response for phrase in disallowed_phrases):
        return "I'm here to help with scheduling. Please provide relevant details."
    return response

# Main chatbot function with improved greeting logic
def chat(prompt):
    content_type = is_scheduling_related(prompt)

    if content_type == "greeting":
        return "Hello! I'm here to help you with scheduling. Let me know if you have any questions."
    elif content_type == "unrelated":
        return "I'm here to assist with scheduling tasks only. Let me know if you have scheduling concerns!"

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI scheduling assistant that strictly provides optimal time slot "
                        "recommendations. Only respond to questions related to scheduling, teacher/student "
                        "availability, or class planning. If asked about anything else, politely decline to respond."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=1000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        return filter_response(response.choices[0].message.content.strip())
    
    except Exception as e:
        return f"An error occurred: {e}"

# Command-line interface for testing
if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            print("Chatbot: Goodbye! If you need scheduling assistance, feel free to return.")
            break

        response = chat(user_input)
        print("Chatbot:", response)
