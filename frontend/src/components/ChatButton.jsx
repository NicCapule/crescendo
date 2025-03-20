import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatButton.css";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! How can I assist you today?" }
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

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        prompt: input
      });

      setMessages(prev => [...prev, { sender: "ai", text: response.data.response }]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages(prev => [...prev, { sender: "ai", text: "Oops! Something went wrong. Try again later." }]);
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

  return (
    <>
      <button className="chat-button" onClick={toggleChat} title="Chat with AI">
        {isChatOpen ? "✕" : "💬"}
      </button>

      {isChatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Chat Assistant</h3>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}>
                {message.text}
              </div>
            ))}
            {isLoading && <div className="typing-indicator">AI is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question here..."
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
