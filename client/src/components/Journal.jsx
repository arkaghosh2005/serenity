import { useState } from 'react'

function Journal({ onAddEntry, entries }) {
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Simulated AI mood analysis
  const analyzeMood = (text) => {
    const positiveWords = ['happy', 'joy', 'excited', 'wonderful', 'great', 'amazing', 'love', 'grateful', 'blessed', 'peaceful']
    const negativeWords = ['sad', 'angry', 'frustrated', 'depressed', 'anxious', 'worried', 'stressed', 'overwhelmed', 'tired', 'lonely']

    const words = text.toLowerCase().split(' ')
    let positiveCount = 0
    let negativeCount = 0

    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++
    })

    if (positiveCount > negativeCount) return { mood: 'positive', sentiment: 0.7 + Math.random() * 0.3 }
    if (negativeCount > positiveCount) return { mood: 'negative', sentiment: 0.1 + Math.random() * 0.4 }
    return { mood: 'neutral', sentiment: 0.4 + Math.random() * 0.2 }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsAnalyzing(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const analysis = analyzeMood(text)
      onAddEntry({
        text: text.trim(),
        ...analysis
      })
      setText('')
      setIsAnalyzing(false)
    }, 1500)
  }

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'positive': return '#90EE90'
      case 'negative': return '#FFB6C1'
      default: return '#E6E6FA'
    }
  }

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'positive': return '😊'
      case 'negative': return '😔'
      default: return '😐'
    }
  }

  return (
    <div className="journal">
      <div className="journal-header">
        <h2>Daily Reflections</h2>
        <p>Share your thoughts and let our AI companion understand your emotions</p>
      </div>

      <form onSubmit={handleSubmit} className="journal-form">
        <div className="textarea-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="How are you feeling today? Write about your thoughts, experiences, or anything on your mind..."
            className="journal-textarea"
            rows="8"
            disabled={isAnalyzing}
          />
          {isAnalyzing && (
            <div className="analyzing-overlay">
              <div className="analyzing-spinner"></div>
              <p>Analyzing your mood...</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!text.trim() || isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : '✨ Save Entry'}
        </button>
      </form>

      <div className="entries-section">
        <h3>Your Recent Entries</h3>
        {entries.length === 0 ? (
          <div className="no-entries">
            <p>🌸 Start your wellness journey by writing your first entry</p>
          </div>
        ) : (
          <div className="entries-list">
            {entries.slice(0, 5).map(entry => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-date">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                  <div className="mood-indicator" style={{ backgroundColor: getMoodColor(entry.mood) }}>
                    {getMoodEmoji(entry.mood)}
                  </div>
                </div>
                <p className="entry-text">{entry.text}</p>
                <div className="entry-sentiment">
                  Mood Score: {Math.round(entry.sentiment * 100)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Journal