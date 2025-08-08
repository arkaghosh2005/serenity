import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Journal from './components/Journal';
import MoodDashboard from './components/MoodDashboard';
import Chatbot from './components/Chatbot';
import MotivationCorner from './components/MotivationCorner';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('journal');
  const [journalEntries, setJournalEntries] = useState([]);
  const [moodData, setMoodData] = useState([]);

  // Load from backend on start
  useEffect(() => {
    fetch('http://localhost:5000/api/journal')
      .then(res => res.json())
      .then(data => {
        setJournalEntries(data);
        setMoodData(data.map(entry => ({
          date: new Date(entry.timestamp).toLocaleDateString(),
          mood: entry.mood,
          sentiment: entry.sentiment
        })));
      });
  }, []);

  const addJournalEntry = (entry) => {
    fetch('http://localhost:5000/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    })
      .then(res => res.json())
      .then(newEntry => {
        setJournalEntries(prev => [newEntry, ...prev]);
        setMoodData(prev => [
          { date: new Date(newEntry.timestamp).toLocaleDateString(), mood: newEntry.mood, sentiment: newEntry.sentiment },
          ...prev
        ]);
      });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'journal':
        return <Journal onAddEntry={addJournalEntry} entries={journalEntries} />;
      case 'dashboard':
        return <MoodDashboard moodData={moodData} />;
      case 'chatbot':
        return <Chatbot currentMood={moodData[0]?.mood || 'neutral'} />;
      case 'motivation':
        return <MotivationCorner />;
      default:
        return <Journal onAddEntry={addJournalEntry} entries={journalEntries} />;
    }
  };

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
  );
}

export default App;
