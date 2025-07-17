import { useState } from 'react'
import { CreditApplicationPage } from './pages'
import './App.css'

/**
 * Main Application Component for Aqueron Frontend
 * A modern React application focusing on modernization efforts
 */
function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'credit'>('credit')

  const renderHomePage = () => (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Aqueron</h1>
        <p className="app-subtitle">Modern Frontend Application</p>
      </header>
      
      <main className="app-main">
        <section className="welcome-section">
          <h2>Welcome to Aqueron</h2>
          <p>
            This is a modern React application built with TypeScript and Vite,
            designed for modernization efforts with best practices.
          </p>
          
          <div className="feature-showcase">
            <button 
              className="feature-button"
              onClick={() => setCurrentPage('credit')}
            >
              🏦 Solicitud de Crédito
            </button>
            
            <div className="feature-content">
              <p>🚀 Modern React with TypeScript</p>
              <p>⚡ Fast development with Vite</p>
              <p>🎨 Component-based architecture</p>
              <p>📱 Responsive design ready</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 Aqueron - Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  )

  if (currentPage === 'credit') {
    return <CreditApplicationPage />
  }

  return renderHomePage()
}

export default App
