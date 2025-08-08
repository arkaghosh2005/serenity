import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Journal from './components/Journal'
import MoodDashboard from './components/MoodDashboard'
import Chatbot from './components/Chatbot'
import MotivationCorner from './components/MotivationCorner'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('journal')
  const [journalEntries, setJournalEntries] = useState([])
  const [moodData, setMoodData] = useState([])

  useEffect(() => {
    // Load data from localStorage on app start
    const savedEntries = localStorage.getItem('serenity-journal-entries')
    const savedMoodData = localStorage.getItem('serenity-mood-data')
    
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries))
    }
    
    if (savedMoodData) {
      setMoodData(JSON.parse(savedMoodData))
    }
  }, [])

  const addJournalEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      ...entry,
      timestamp: new Date().toISOString()
    }
    
    const updatedEntries = [newEntry, ...journalEntries]
    setJournalEntries(updatedEntries)
    localStorage.setItem('serenity-journal-entries', JSON.stringify(updatedEntries))
    
    // Add mood data point
    const moodPoint = {
      date: new Date().toLocaleDateString(),
      mood: entry.mood,
      sentiment: entry.sentiment
    }
    
    const updatedMoodData = [moodPoint, ...moodData]
    setMoodData(updatedMoodData)
    localStorage.setItem('serenity-mood-data', JSON.stringify(updatedMoodData))
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'journal':
        return <Journal onAddEntry={addJournalEntry} entries={journalEntries} />
      case 'dashboard':
        return <MoodDashboard moodData={moodData} />
      case 'chatbot':
        return <Chatbot currentMood={moodData[0]?.mood || 'neutral'} />
      case 'motivation':
        return <MotivationCorner />
      default:
        return <Journal onAddEntry={addJournalEntry} entries={journalEntries} />
    }
  }

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">🌸</span>
            <h1>Serenity</h1>
          </div>
          <p className="tagline">Your gentle companion for mental wellness</p>
        </header>
        
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="main-content">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  )
}

export default App