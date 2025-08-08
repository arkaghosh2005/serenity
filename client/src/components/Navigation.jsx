import { useState } from 'react'

function Navigation({ activeSection, setActiveSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const sections = [
    { id: 'journal', label: 'Journal', icon: '✍️' },
    { id: 'dashboard', label: 'Moods', icon: '📊' },
    { id: 'chatbot', label: 'Companion', icon: '🤖' },
    { id: 'motivation', label: 'Inspiration', icon: '🌿' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        
        <div className={`nav-items ${isMenuOpen ? 'nav-items-open' : ''}`}>
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'nav-item-active' : ''}`}
              onClick={() => {
                setActiveSection(section.id)
                setIsMenuOpen(false)
              }}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation