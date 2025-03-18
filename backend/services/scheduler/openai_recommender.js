const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generate schedule recommendations using OpenAI
 * @param {Array} existingSessions - Currently scheduled sessions
 * @param {Object} sessionRequest - Session for which to generate recommendations
 * @param {Object} constraints - Scheduling constraints
 * @returns {Promise<Object>} - Recommended time slots with preference scores
 */
const getScheduleRecommendations = async (existingSessions, sessionRequest, constraints) => {
  const startTime = Date.now();
  
  try {
    // Prepare the prompt for OpenAI
    const prompt = createPrompt(existingSessions, sessionRequest, constraints);
    
    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI scheduling assistant that provides optimal time slot recommendations. Analyze the scheduling constraints and existing sessions to recommend the best available time slots. Return results in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" }
    });

    // Extract recommendations from response
    const content = response.data.choices[0].message.content;
    const recommendations = JSON.parse(content);
    
    // Calculate solution time
    const solutionTime = (Date.now() - startTime) / 1000;
    
    return {
      success: true,
      recommendations: recommendations.recommendations || [],
      stats: {
        solution_time: solutionTime,
        model: "gpt-4",
        status: "COMPLETED"
      }
    };
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    
    return {
      success: false,
      error: `Failed to generate recommendations: ${error.message}`,
      stats: {
        solution_time: (Date.now() - startTime) / 1000,
        status: "ERROR"
      }
    };
  }
};

/**
 * Create a prompt for OpenAI based on scheduling data
 * @param {Array} existingSessions - Currently scheduled sessions
 * @param {Object} sessionRequest - Session for which to generate recommendations
 * @param {Object} constraints - Scheduling constraints
 * @returns {String} - Formatted prompt for OpenAI
 */
function createPrompt(existingSessions, sessionRequest, constraints) {
  const { max_sessions_per_slot, exclusive_instruments, time_slots } = constraints;
  
  return `
I need recommendations for scheduling a new session with the following details:
${JSON.stringify(sessionRequest, null, 2)}

Here are the existing sessions already scheduled:
${JSON.stringify(existingSessions, null, 2)}

The scheduling constraints are:
- Maximum sessions per time slot: ${max_sessions_per_slot}
- Exclusive instruments (only one session per time slot): ${JSON.stringify(exclusive_instruments)}
- Available time slots: ${JSON.stringify(time_slots)}

Please analyze the constraints and provide recommendations for available time slots.
Each recommendation should include:
- session_start: The start time in format "HH:MM:SS"
- session_end: The end time in format "HH:MM:SS"
- preference_score: A number from 1-5 indicating how good this slot is (5 being best)
- current_utilization: How many sessions are already scheduled in this slot
- max_capacity: Maximum capacity of the slot (from constraints)

For preference_score, consider these factors:
- Lower utilization is better
- Time slots with no exclusive instrument conflicts are better
- Earlier slots in the day are generally better

Return ONLY a JSON object with the following structure:
{
  "recommendations": [
    {
      "session_start": "HH:MM:SS",
      "session_end": "HH:MM:SS",
      "preference_score": number,
      "current_utilization": number,
      "max_capacity": number
    },
    ...
  ]
}

Sort the recommendations by preference_score in descending order (best first).
`;
}

module.exports = { getScheduleRecommendations };