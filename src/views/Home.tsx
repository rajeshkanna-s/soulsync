import React from "react";
import { Brain, Heart, BarChart3, Sparkles, ArrowRight } from "lucide-react";

interface HomeProps {
  onNavigate: (view: string) => void;
  hasProfile: boolean;
}

export default function Home({ onNavigate, hasProfile }: HomeProps) {
  return (
    <div className="container animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-tagline animate-float">
          <Sparkles size={14} style={{ marginRight: 4 }} />
          Souls don't match by chance — they match by design
        </div>
        
        <h1 className="text-gradient">
          Discover Who You <br />
          <span className="text-gradient-cosmic">Really Are</span>
        </h1>
        
        <p>
          SoulSync analyses your thoughts, emotions, behaviour, and personality — 
          then finds who truly matches your soul.
        </p>
        
        <div className="hero-ctas">
          <button 
            className="btn btn-primary btn-glow"
            onClick={() => onNavigate("quiz")}
          >
            {hasProfile ? "Retake Personality Analysis" : "Start Your Analysis"}
            <ArrowRight size={18} />
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigate(hasProfile ? "result" : "about")}
          >
            {hasProfile ? "View My Report" : "Philosophy"}
          </button>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features section-padding">
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon-wrapper">
              <Brain size={28} />
            </div>
            <h3>Deep Personality Analysis</h3>
            <p>
              Go beyond simple surface traits. Our advanced analysis engine maps your thinking styles, 
              communication preferences, and deep emotional patterns to uncover your true core profile.
            </p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon-wrapper">
              <Heart size={28} />
            </div>
            <h3>Soul-Level Matching</h3>
            <p>
              True compatibility isn't based on superficial swiping. We match you along five key dimensions: 
              mind styles, emotional fit, communication paths, future vision, and relationship habits.
            </p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon-wrapper">
              <BarChart3 size={28} />
            </div>
            <h3>Your Personal Report</h3>
            <p>
              Unlock a comprehensive analysis breakdown that details your primary and secondary personality type, 
              your top strengths, blind spots, emotional makeup, and communication dynamics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
