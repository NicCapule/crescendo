import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatButton.css";

const ChatButton = ({ formValues }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! Need help with your enrollment or scheduling? I can assist with finding available time slots based on your preferences." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setIsLoading(true);
    
    try {
      // Get student ID from form values if available
      const studentId = formValues?.student_id || (formValues?.isNewStudent ? "new" : null);
      
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        prompt: input,
        student_id: studentId,
        // Include additional context from the form to help the AI
        context: {
          instrument: formValues?.instrument_name || null,
          teacher_id: formValues?.teacher_id || null,
          isNewStudent: formValues?.isNewStudent || false,
          availability: formValues?.availability || [],
          first_name: formValues?.student_first_name || null,
          last_name: formValues?.student_last_name || null
        }
      });

      // Add AI response to chat
      setMessages(prev => [...prev, { sender: "ai", text: response.data.response }]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "Sorry, I couldn't process your request. Please try again later." }
      ]);
    }

    setInput("");
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSuggestions = () => {
    const suggestions = [];
    
    if (formValues?.isNewStudent) {
      suggestions.push("What days are most popular for lessons?");
      suggestions.push("How long are the typical lessons?");
    }
    
    if (formValues?.instrument_name) {
      suggestions.push(`What's the best schedule for ${formValues.instrument_name} lessons?`);
    }
    
    if (formValues?.teacher_id && !formValues?.noOfSessions) {
      suggestions.push("How many sessions should I choose?");
    }
    
    if (formValues?.availability && formValues?.availability.length > 0) {
      suggestions.push("Can you suggest some good time slots based on my availability?");
    }
    
    // Default suggestions if nothing specific is in the form
    if (suggestions.length === 0) {
      suggestions.push("What's the enrollment process?");
      suggestions.push("How do I choose a teacher?");
    }
    
    return suggestions;
  };

  return (
    <>
      {/* Chat button */}
      <button 
        className="chat-button" 
        onClick={toggleChat}
        title="Get help with scheduling"
      >
        {isChatOpen ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {isChatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Scheduling Assistant</h3>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && <div className="typing-indicator">Assistant is typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="chat-suggestions">
              {getSuggestions().map((suggestion, index) => (
                <button 
                  key={index}
                  className="suggestion-button"
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => handleSend(), 100);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className="chat-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about scheduling options..."
              rows={2}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;