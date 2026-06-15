import React, { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { calculateQuizResults, ScoreProfile, UserDemographics } from "./utils/engine";
import { personalityTypes } from "./data/personalityTypes";
import { supabase } from "./utils/supabase";

// Styles
import "./styles/App.css";

// Views
import Home from "./views/Home";
import Quiz from "./views/Quiz";
import Result from "./views/Result";
import About from "./views/About";

export default function App() {
  // Navigation Routing State
  const [view, setView] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // User State persisted in localStorage
  const [userName, setUserName] = useLocalStorage<string>("soulsync_name", "Seeker Soul");
  const [userAvatar, setUserAvatar] = useLocalStorage<string>("soulsync_avatar", "🔮");
  const [userGender, setUserGender] = useLocalStorage<"male" | "female">("soulsync_gender", "female");
  const [quizAnswers, setQuizAnswers] = useLocalStorage<Record<number, number> | null>("soulsync_answers", null);
  const [userProfile, setUserProfile] = useLocalStorage<ScoreProfile | null>("soulsync_profile", null);
  const [userDemographics, setUserDemographics] = useLocalStorage<UserDemographics | null>("soulsync_demographics", null);

  // Automatically migrate/clear legacy profiles to avoid runtime crashes
  React.useEffect(() => {
    if (userProfile && (!userProfile.dimensions || userProfile.dimensions.honesty === undefined)) {
      setUserProfile(null);
      setQuizAnswers(null);
      if (view === "result") {
        setView("home");
      }
    }
  }, [userProfile, setUserProfile, setQuizAnswers, view]);

  const handleQuizComplete = async (answers: Record<number, number>, demographics: UserDemographics) => {
    setQuizAnswers(answers);
    setUserDemographics(demographics);
    
    // Sync legacy values
    setUserName(demographics.name);
    setUserGender(demographics.gender);

    const calculatedProfile = calculateQuizResults(answers);
    calculatedProfile.demographics = demographics;
    setUserProfile(calculatedProfile);

    // Navigate to Results immediately
    setView("result");

    // Asynchronously log user data to Supabase database for analysis
    try {
      const { error } = await supabase
        .from("personality_responses")
        .insert([
          {
            name: demographics.name,
            gender: demographics.gender,
            age: demographics.age,
            born_city: demographics.bornCity,
            living_city: demographics.livingCity,
            known_languages: demographics.knownLanguages,
            education: demographics.education,
            country: demographics.country,
            siblings: demographics.siblings,
            languages_studied: demographics.languagesStudied,
            parents_educated: demographics.parentsEducated,
            wealth_status: demographics.wealthStatus,
            love_failure: demographics.loveFailure,
            disability: demographics.disability,
            honesty: calculatedProfile.dimensions.honesty,
            emotionality: calculatedProfile.dimensions.emotionality,
            openness: calculatedProfile.dimensions.openness,
            conscientiousness: calculatedProfile.dimensions.conscientiousness,
            extraversion: calculatedProfile.dimensions.extraversion,
            agreeableness: calculatedProfile.dimensions.agreeableness,
            eq: calculatedProfile.dimensions.eq,
            conflict: calculatedProfile.dimensions.conflict,
            primary_type: calculatedProfile.primaryTypeId,
            secondary_type: calculatedProfile.secondaryTypeId
          }
        ]);
      
      if (error) {
        console.error("Error storing to Supabase:", error.message);
      } else {
        console.log("Profile response logged to database successfully.");
      }
    } catch (err) {
      console.error("Supabase insertion error:", err);
    }
  };

  const handleResetProfile = () => {
    setQuizAnswers(null);
    setUserProfile(null);
    setUserDemographics(null);
    setUserName("Seeker Soul");
    setUserAvatar("🔮");
    setUserGender("female");
    setView("home");
  };

  const handleNavigate = (targetView: string) => {
    setView(targetView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasCompletedQuiz = !!userProfile;
  const primaryType = userProfile ? personalityTypes[userProfile.primaryTypeId] : null;

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="nav-logo" onClick={() => handleNavigate("home")} style={{ cursor: "pointer" }}>
            <Sparkles size={22} style={{ color: "var(--color-primary)" }} />
            SoulSync
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links">
            <span 
              className={`nav-link ${view === "home" ? "active" : ""}`}
              onClick={() => handleNavigate("home")}
            >
              Home
            </span>
            
            <span 
              className={`nav-link ${view === "quiz" ? "active" : ""}`}
              onClick={() => handleNavigate("quiz")}
            >
              {hasCompletedQuiz ? "Retake Quiz" : "Take Quiz"}
            </span>

            {hasCompletedQuiz && (
              <span 
                className={`nav-link ${view === "result" ? "active" : ""}`}
                onClick={() => handleNavigate("result")}
              >
                My Report
              </span>
            )}

            <span 
              className={`nav-link ${view === "about" ? "active" : ""}`}
              onClick={() => handleNavigate("about")}
            >
              Philosophy
            </span>
          </div>

          {/* Mobile Menu Hamburger */}
          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 16, 
              padding: "20px 24px", 
              background: "#faf6f0", 
              borderBottom: "1px solid var(--border-glass)" 
            }}
          >
            <span 
              className={`nav-link ${view === "home" ? "active" : ""}`}
              onClick={() => handleNavigate("home")}
            >
              Home
            </span>
            <span 
              className={`nav-link ${view === "quiz" ? "active" : ""}`}
              onClick={() => handleNavigate("quiz")}
            >
              {hasCompletedQuiz ? "Retake Quiz" : "Take Quiz"}
            </span>
            {hasCompletedQuiz && (
              <span 
                className={`nav-link ${view === "result" ? "active" : ""}`}
                onClick={() => handleNavigate("result")}
              >
                My Report
              </span>
            )}
            <span 
              className={`nav-link ${view === "about" ? "active" : ""}`}
              onClick={() => handleNavigate("about")}
            >
              Philosophy
            </span>
          </div>
        )}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="main-content section-padding">
        {view === "home" && (
          <Home 
            onNavigate={handleNavigate} 
            hasProfile={hasCompletedQuiz} 
          />
        )}
        {view === "quiz" && (
          <Quiz 
            onComplete={handleQuizComplete} 
            onNavigate={handleNavigate}
            defaultDemographics={userDemographics}
          />
        )}
        {view === "result" && userProfile && (
          <Result 
            profile={userProfile} 
            userName={userName}
            userGender={userGender}
            onNavigate={handleNavigate} 
            onResetProfile={handleResetProfile}
          />
        )}
        {view === "about" && <About />}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-content">
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: 6 }}>
              <Sparkles size={16} color="var(--color-primary)" />
              SoulSync
            </div>
            <p style={{ fontSize: "0.85rem", maxWidth: 350 }}>
              Deep psychological matching mapping the coordinates of human personality, behaviour, and emotion.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem", textAlign: "left" }}>
              <span style={{ fontWeight: 600, color: "var(--text-dark)" }}>Platform</span>
              <span style={{ cursor: "pointer" }} onClick={() => handleNavigate("home")}>Home</span>
              <span style={{ cursor: "pointer" }} onClick={() => handleNavigate("quiz")}>Personality Quiz</span>
              {hasCompletedQuiz && <span style={{ cursor: "pointer" }} onClick={() => handleNavigate("result")}>My Report</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem", textAlign: "left" }}>
              <span style={{ fontWeight: 600, color: "var(--text-dark)" }}>Engine</span>
              <span style={{ cursor: "pointer" }} onClick={() => handleNavigate("about")}>Philosophy</span>
            </div>
          </div>
        </div>
        <div className="container" style={{ borderTop: "1px solid var(--border-glass)", marginTop: 24, paddingTop: 20, fontSize: "0.8rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span>© 2026 SoulSync Labs Inc. All rights reserved.</span>
          <span>Not just a match. A mirror.</span>
        </div>
      </footer>
    </div>
  );
}
