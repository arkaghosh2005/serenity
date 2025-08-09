import { useState, useEffect } from 'react'

function Journal() {
  const [entries, setEntries] = useState([])
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    fetch('/api/journal')
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Error fetching journal entries:', err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsAnalyzing(true)

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const savedEntry = await res.json()
      setEntries(prev => [savedEntry, ...prev])
      setText('')
    } catch (err) {
      console.error('Error saving entry:', err)
      alert('Could not save entry')
    } finally {
      setIsAnalyzing(false)
    }
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
            placeholder="How are you feeling today? Write about your thoughts..."
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
