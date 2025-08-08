import { useState, useEffect } from 'react'

function MotivationCorner() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [favoriteQuotes, setFavoriteQuotes] = useState([])

  const inspirationalQuotes = [
    {
      text: "You are stronger than you think, braver than you feel, and more loved than you know.",
      author: "Serenity"
    },
    {
      text: "Every small step forward is progress. Be patient with yourself.",
      author: "Mindful Wisdom"
    },
    {
      text: "Your mental health is just as important as your physical health. Take care of both.",
      author: "Wellness Guide"
    },
    {
      text: "It's okay to not be okay. What matters is that you're trying.",
      author: "Gentle Reminder"
    },
    {
      text: "You have survived 100% of your difficult days. You're doing better than you think.",
      author: "Inner Strength"
    },
    {
      text: "Healing is not linear. Some days will be better than others, and that's perfectly normal.",
      author: "Recovery Journey"
    },
    {
      text: "Your feelings are valid, your struggles are real, and your journey matters.",
      author: "Self-Compassion"
    },
    {
      text: "Take time to rest. You cannot pour from an empty cup.",
      author: "Self-Care Wisdom"
    },
    {
      text: "Progress, not perfection. Every effort counts.",
      author: "Growth Mindset"
    },
    {
      text: "You are worthy of love, kindness, and all the good things life has to offer.",
      author: "Self-Worth"
    },
    {
      text: "Tomorrow is a fresh start. Today's struggles don't define tomorrow's possibilities.",
      author: "Hope & Renewal"
    },
    {
      text: "Your sensitivity is a superpower, not a weakness. The world needs your compassion.",
      author: "Empathy Appreciation"
    }
  ]

  const calmingMessages = [
    "Take a deep breath. You are exactly where you need to be right now. 🌸",
    "This moment is temporary. You have the strength to get through this. 💜",
    "Be gentle with yourself today. You deserve kindness, especially from yourself. 🌿",
    "Your pace is perfect. There's no rush in healing and growing. ✨",
    "You matter. Your existence makes a difference in this world. 🦋",
    "It's okay to rest. Recovery requires both action and stillness. 🌙",
    "You are not alone in this journey. Support is always available. 💙",
    "Celebrate the small victories. They add up to big changes. 🌟"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % inspirationalQuotes.length)
    }, 8000) // Change quote every 8 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('serenity-favorite-quotes')
    if (saved) {
      setFavoriteQuotes(JSON.parse(saved))
    }
  }, [])

  const toggleFavorite = (quote) => {
    const isAlreadyFavorite = favoriteQuotes.some(fav => fav.text === quote.text)
    let updatedFavorites

    if (isAlreadyFavorite) {
      updatedFavorites = favoriteQuotes.filter(fav => fav.text !== quote.text)
    } else {
      updatedFavorites = [...favoriteQuotes, quote]
    }

    setFavoriteQuotes(updatedFavorites)
    localStorage.setItem('serenity-favorite-quotes', JSON.stringify(updatedFavorites))
  }

  const isFavorite = (quote) => {
    return favoriteQuotes.some(fav => fav.text === quote.text)
  }

  const nextQuote = () => {
    setCurrentQuote(prev => (prev + 1) % inspirationalQuotes.length)
  }

  const prevQuote = () => {
    setCurrentQuote(prev => prev === 0 ? inspirationalQuotes.length - 1 : prev - 1)
  }

  const getRandomCalmingMessage = () => {
    return calmingMessages[Math.floor(Math.random() * calmingMessages.length)]
  }

  return (
    <div className="motivation-corner">
      <div className="motivation-header">
        <h2>Inspiration Corner</h2>
        <p>Find peace, wisdom, and encouragement for your journey</p>
      </div>

      <div className="quote-section">
        <div className="quote-card">
          <button className="quote-nav prev" onClick={prevQuote}>‹</button>
          
          <div className="quote-content">
            <div className="quote-icon">💝</div>
            <blockquote className="quote-text">
              "{inspirationalQuotes[currentQuote].text}"
            </blockquote>
            <cite className="quote-author">— {inspirationalQuotes[currentQuote].author}</cite>
            
            <div className="quote-actions">
              <button 
                className={`favorite-btn ${isFavorite(inspirationalQuotes[currentQuote]) ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(inspirationalQuotes[currentQuote])}
                title="Add to favorites"
              >
                {isFavorite(inspirationalQuotes[currentQuote]) ? '💜' : '🤍'}
              </button>
              
              <button 
                className="share-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Inspirational Quote',
                      text: `"${inspirationalQuotes[currentQuote].text}" — ${inspirationalQuotes[currentQuote].author}`
                    })
                  } else {
                    navigator.clipboard.writeText(`"${inspirationalQuotes[currentQuote].text}" — ${inspirationalQuotes[currentQuote].author}`)
                    alert('Quote copied to clipboard!')
                  }
                }}
                title="Share quote"
              >
                🔗
              </button>
            </div>
          </div>
          
          <button className="quote-nav next" onClick={nextQuote}>›</button>
        </div>

        <div className="quote-indicators">
          {inspirationalQuotes.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentQuote ? 'active' : ''}`}
              onClick={() => setCurrentQuote(index)}
            />
          ))}
        </div>
      </div>

      <div className="calming-section">
        <h3>Gentle Reminders</h3>
        <div className="calming-card" onClick={() => document.querySelector('.calming-message').textContent = getRandomCalmingMessage()}>
          <div className="calming-icon">🌸</div>
          <p className="calming-message">{getRandomCalmingMessage()}</p>
          <small>Click for a new gentle reminder</small>
        </div>
      </div>

      <div className="activities-section">
        <h3>Mindful Activities</h3>
        <div className="activities-grid">
          <div className="activity-card">
            <div className="activity-icon">🫁</div>
            <h4>Breathing Exercise</h4>
            <p>Take 5 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.</p>
          </div>
          
          <div className="activity-card">
            <div className="activity-icon">📝</div>
            <h4>Gratitude List</h4>
            <p>Write down 3 things you're grateful for today, no matter how small.</p>
          </div>
          
          <div className="activity-card">
            <div className="activity-icon">🚶‍♀️</div>
            <h4>Mindful Walk</h4>
            <p>Take a 10-minute walk and notice 5 things you can see, hear, or feel.</p>
          </div>
          
          <div className="activity-card">
            <div className="activity-icon">💧</div>
            <h4>Hydration Check</h4>
            <p>Drink a glass of water mindfully, noticing the temperature and taste.</p>
          </div>
        </div>
      </div>

      {favoriteQuotes.length > 0 && (
        <div className="favorites-section">
          <h3>Your Favorite Quotes</h3>
          <div className="favorites-list">
            {favoriteQuotes.map((quote, index) => (
              <div key={index} className="favorite-quote">
                <blockquote>"{quote.text}"</blockquote>
                <cite>— {quote.author}</cite>
                <button 
                  className="remove-favorite"
                  onClick={() => toggleFavorite(quote)}
                  title="Remove from favorites"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MotivationCorner