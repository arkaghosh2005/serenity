import { useState, useEffect, useRef } from 'react'

function Chatbot({ currentMood }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const botResponses = {
    positive: [
      "I'm so glad to hear you're feeling positive! 🌟 What's been bringing you joy lately?",
      "Your positive energy is wonderful! ✨ How can we keep this momentum going?",
      "It's beautiful to see you in such a good space! 💖 What would you like to talk about?",
    ],
    negative: [
      "I can sense you might be going through a tough time. 🤗 I'm here to listen and support you.",
      "Thank you for sharing your feelings with me. 💙 Sometimes talking through things can help. What's on your mind?",
      "It takes courage to acknowledge difficult emotions. 🌸 You're not alone in this. How can I support you today?",
    ],
    neutral: [
      "Hello there! 🌿 I'm here to chat and support you. How are you feeling right now?",
      "Welcome! 💜 I'm your AI companion, ready to listen and help. What would you like to talk about?",
      "Hi! 🌸 I'm here to provide a safe space for conversation. How can I support you today?",
    ]
  }

  const supportiveResponses = [
    "That sounds really challenging. 💙 Your feelings are completely valid.",
    "I hear you, and I want you to know that it's okay to feel this way. 🤗",
    "Thank you for sharing that with me. You're being very brave. 🌸",
    "It sounds like you're dealing with a lot. How are you taking care of yourself? 💜",
    "That must feel overwhelming. What usually helps you when you feel this way? 🌿",
    "I appreciate you opening up. What would feel most supportive right now? ✨",
    "Your awareness of your feelings shows great emotional intelligence. 🌟",
    "It's natural to have ups and downs. You're doing better than you think. 💖"
  ]

  const encouragingResponses = [
    "That's wonderful to hear! 🌟 I love your positive outlook.",
    "It sounds like you're in a really good place! ✨ What's been helping you feel this way?",
    "I'm so happy for you! 💖 Your joy is contagious.",
    "That's amazing! 🌸 How does it feel to experience that?",
    "What a beautiful perspective! 🌿 You're inspiring.",
    "I can feel your positive energy! ☀️ Keep shining!",
    "That's such great news! 💜 I'm excited for you.",
    "Your happiness makes me happy too! 🦋 Tell me more!"
  ]

  useEffect(() => {
    // Initial greeting based on current mood
    const greeting = botResponses[currentMood] || botResponses.neutral
    const randomGreeting = greeting[Math.floor(Math.random() * greeting.length)]
    
    setMessages([{
      id: 1,
      text: randomGreeting,
      sender: 'bot',
      timestamp: new Date()
    }])
  }, [currentMood])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Detect emotional keywords
    const positiveKeywords = ['happy', 'great', 'wonderful', 'excited', 'joy', 'love', 'amazing', 'fantastic']
    const negativeKeywords = ['sad', 'angry', 'depressed', 'anxious', 'worried', 'stressed', 'upset', 'frustrated']
    const gratitudeKeywords = ['thank', 'grateful', 'appreciate']
    const questionKeywords = ['how', 'what', 'why', 'when', 'where', 'help']

    if (gratitudeKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return "You're so welcome! 💜 I'm grateful to be here for you. Is there anything else you'd like to talk about?"
    }

    if (positiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)]
    }

    if (negativeKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)]
    }

    if (questionKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return "That's a thoughtful question. 🌸 I think the answer might depend on your unique situation. What feels right to you?"
    }

    // Default responses
    const defaultResponses = [
      "I hear you. 💙 Tell me more about that.",
      "That's interesting. 🌿 How do you feel about it?",
      "I'm listening. 🌸 What's important to you about this?",
      "Thank you for sharing that with me. 💜 What else is on your mind?",
      "That sounds meaningful. ✨ Can you help me understand more?",
      "I appreciate you opening up. 🤗 How can I support you with this?"
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.text)
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <div className="bot-avatar">🤖</div>
        <div className="bot-info">
          <h2>Your AI Companion</h2>
          <p className="bot-status">
            {isTyping ? 'Typing...' : 'Online • Here to support you'}
          </p>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-bubble">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share your thoughts, feelings, or ask for support..."
              className="chat-input"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!inputMessage.trim() || isTyping}
            >
              ✨
            </button>
          </div>
        </form>
      </div>

      <div className="chat-suggestions">
        <p>You can talk about:</p>
        <div className="suggestion-chips">
          <button onClick={() => setInputMessage("I'm feeling anxious today")} className="suggestion-chip">
            Anxiety
          </button>
          <button onClick={() => setInputMessage("I need some encouragement")} className="suggestion-chip">
            Encouragement
          </button>
          <button onClick={() => setInputMessage("How can I improve my mood?")} className="suggestion-chip">
            Mood Tips
          </button>
          <button onClick={() => setInputMessage("I'm grateful for...")} className="suggestion-chip">
            Gratitude
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot