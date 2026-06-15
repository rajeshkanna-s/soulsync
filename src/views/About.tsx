import React from "react";
import { Sparkles, Brain, Compass, Users, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 80 }}>
      {/* Hero */}
      <section className="about-hero">
        <h1 className="text-gradient">We Built SoulSync Because <br /><span className="text-gradient-cosmic">Personality is Everything</span></h1>
        <p>
          Standard dating applications match faces, filters, and superficial hobbies. 
          We believe true compatibility starts deep inside the mind and the heart.
        </p>
      </section>

      {/* Main Philosophy Grid */}
      <div className="about-grid">
        <div style={{ textAlign: "left" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 20 }}>True Connection Starts Inside</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
            Modern swiping cultures reduce complex human consciousness into binary photo choices. 
            This focuses entirely on immediate visual attraction, leading to short-lived sparks but 
            rarely long-term emotional resonance.
          </p>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
            SoulSync flips the script. By mapping your patterns across 5 core dimensions of human behavior 
            and thought, we establish a baseline of structural compatibility before you ever say hello.
          </p>
          
          <ul className="bullet-list">
            <li><strong>Mind Sync:</strong> Do your problem-solving and thinking styles complement?</li>
            <li><strong>Emotional Fit:</strong> How do your emotional vulnerability and resilience cycles align?</li>
            <li><strong>Life Vision:</strong> Are you walking towards parallel achievements or seeking peaceful horizons?</li>
          </ul>
        </div>

        <div className="glass-card about-image-card">
          <div className="about-floating-element">🔮</div>
          <div 
            style={{ 
              position: "absolute", 
              bottom: "20px", 
              fontSize: "0.85rem", 
              color: "var(--color-primary)",
              fontWeight: 600,
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              padding: "6px 16px",
              borderRadius: "9999px"
            }}
          >
            Mapping cognitive coordinates...
          </div>
        </div>
      </div>

      {/* How it works details */}
      <section className="glass-card" style={{ padding: "50px 40px", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: 30, textAlign: "center" }} className="text-gradient">
          Our Personality Engine Mechanics
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 30 }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-cyan)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Brain size={18} />
              1. Collect Data
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              Answer 25 questions specifically targeted at behavior under stress, communication choices, 
              decision loops, and relationship desires.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Compass size={18} />
              2. Coordinate Mapping
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              Your answers are computed into a 5-dimensional numerical profile representing your placement on 
              essential psychological scales.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-accent)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={18} />
              3. Vector Alignment
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              We compare your dimensions mathematically against potential matches, ranking compatibility by vector 
              proximity and structural fit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
