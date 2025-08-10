import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown';
function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, what's on your mind today?", sender: 'bot', timestamp: new Date() }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = { id: Date.now(), text: inputMessage.trim(), sender: 'user', timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const res = await fetch('http://localhost:5000/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      })
      const data = await res.text()

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data || 'Sorry, I could not process that.',
        sender: 'bot',
        timestamp: new Date()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '⚠️ Something went wrong. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <div className="bot-avatar">🤖</div>
        <div className="bot-info">
          <h2>Your AI Companion</h2>
          <p className="bot-status">{isTyping ? 'Typing...' : 'Online • Here to support you'}</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-bubble">
                <ReactMarkdown>
                {message.text}
               </ReactMarkdown>              
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
                  <span></span><span></span><span></span>
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
              placeholder="Share your thoughts..."
              className="chat-input"
              disabled={isTyping}
            />
            <button type="submit" className="send-button" disabled={!inputMessage.trim() || isTyping}>✨</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chatbot
