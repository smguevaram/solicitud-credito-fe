import React from 'react';
import { Button } from '../components';

/**
 * Home Page Component
 * Main landing page for the Aqueron application
 */
const HomePage: React.FC = () => {
  const handleGetStarted = () => {
    console.log('Get Started clicked!');
    // Add navigation logic here
  };

  const handleLearnMore = () => {
    console.log('Learn More clicked!');
    // Add navigation logic here
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Aqueron
          </h1>
          <p className="hero-description">
            A modern React application built with TypeScript and Vite.
            Experience the power of modern web development with best practices
            and cutting-edge tools.
          </p>
          <div className="hero-actions">
            <Button 
              variant="primary" 
              size="large" 
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              variant="secondary" 
              size="large" 
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Fast Development</h3>
            <p>Built with Vite for lightning-fast development and hot module replacement.</p>
          </div>
          <div className="feature-card">
            <h3>🔧 TypeScript</h3>
            <p>Type-safe development with full TypeScript support and IntelliSense.</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Modern UI</h3>
            <p>Clean, responsive design with modern CSS techniques and animations.</p>
          </div>
          <div className="feature-card">
            <h3>🧩 Component-Based</h3>
            <p>Modular architecture with reusable React components and hooks.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
