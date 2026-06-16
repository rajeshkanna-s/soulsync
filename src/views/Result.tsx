import React, { useState } from "react";
import { 
  Flame, Waves, Brain, Flower2, Palette, Mountain, Moon, Zap, 
  Sparkles, CheckCircle2, AlertTriangle, MessageSquare, Heart, RefreshCw,
  Printer, Download, Upload, FileJson, X, ArrowUpRight, Compass, Sliders
} from "lucide-react";
import { personalityTypes } from "../data/personalityTypes";
import { calculateCompatibility, CompatibilityBreakdown, ScoreProfile, UserDemographics, generateBackgroundNarrative } from "../utils/engine";

interface ResultProps {
  profile: ScoreProfile;
  userName: string;
  userGender: "male" | "female";
  onNavigate: (view: string) => void;
  onResetProfile: () => void;
}

// Partner profile import schema
interface PartnerProfileData {
  schema: string;
  name: string;
  gender: string;
  primaryTypeId: string;
  secondaryTypeId: string;
  dimensions: {
    honesty: number;
    emotionality: number;
    extraversion: number;
    agreeableness: number;
    conscientiousness: number;
    openness: number;
    eq: number;
    conflict: number;
  };
  demographics?: UserDemographics;
}

const genderExpressions = {
  male: {
    communication: "Focuses on 'report-talk' (problem-solving and sharing facts). Values respect and competence.",
    vulnerability: "Often expresses emotions through actions; needs a safe, non-judgmental space to open up.",
    stress: "Tends to withdraw to process stress internally before discussing solutions.",
    loveLanguage: "Highly appreciates Acts of Service and Physical Touch.",
    conflict: "More prone to stonewalling or retreating if feeling criticized."
  },
  female: {
    communication: "Focuses on 'rapport-talk' (building emotional connection and sharing feelings). Values empathy.",
    vulnerability: "Often expresses emotions verbally and seeks reassurance and active validation.",
    stress: "Prefers to talk through stress immediately to feel emotionally safe and connected.",
    loveLanguage: "Highly appreciates Words of Affirmation and Quality Time.",
    conflict: "More prone to pursuit or seeking immediate resolution to restore the bond."
  }
};


const borderColors: Record<string, string> = {
  warrior: "#f97316",
  feeler: "#06b6d4",
  thinker: "#6366f1",
  nurturer: "#ec4899",
  creator: "#a855f7",
  achiever: "#10b981",
  dreamer: "#14b8a6",
  spark: "#eab308"
};

const shadowColors: Record<string, string> = {
  warrior: "rgba(249, 115, 22, 0.35)",
  feeler: "rgba(6, 182, 212, 0.35)",
  thinker: "rgba(99, 102, 241, 0.35)",
  nurturer: "rgba(236, 72, 153, 0.35)",
  creator: "rgba(168, 85, 247, 0.35)",
  achiever: "rgba(16, 185, 129, 0.35)",
  dreamer: "rgba(20, 184, 166, 0.35)",
  spark: "rgba(234, 179, 8, 0.35)"
};

export default function Result({ 
  profile, 
  userName, 
  userGender, 
  onNavigate,
  onResetProfile
}: ResultProps) {
  const pType = personalityTypes[profile.primaryTypeId] || personalityTypes.thinker;
  const sType = personalityTypes[profile.secondaryTypeId] || personalityTypes.dreamer;

  const demographics = profile.demographics;
  const narrativeParagraphs = demographics 
    ? generateBackgroundNarrative(demographics, profile.dimensions) 
    : [];

  // Partner upload match state
  const [partnerData, setPartnerData] = useState<PartnerProfileData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [simulatedDimensions, setSimulatedDimensions] = useState<PartnerProfileData["dimensions"] | null>(null);

  // Convert 1-5 scale to percentage (0 - 100)
  const getPercentage = (val: number) => {
    return Math.max(0, Math.min(100, ((val - 1) / 4.0) * 100));
  };

  // Launch browser printing
  const handlePrint = () => {
    window.print();
  };

  // Download Profile file
  const handleDownloadProfile = () => {
    const exportData = {
      schema: "soulsync_profile_v1",
      name: userName,
      gender: userGender,
      primaryTypeId: profile.primaryTypeId,
      secondaryTypeId: profile.secondaryTypeId,
      dimensions: profile.dimensions,
      demographics: profile.demographics
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    
    // Clean filename: soulsync_John_profile.json
    const safeName = userName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    downloadAnchor.setAttribute("download", `soulsync_${safeName}_profile.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle partner file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Validation
        if (
          parsed.schema !== "soulsync_profile_v1" ||
          !parsed.name ||
          !parsed.gender ||
          !parsed.dimensions ||
          typeof parsed.dimensions.honesty !== "number" ||
          typeof parsed.dimensions.emotionality !== "number" ||
          typeof parsed.dimensions.openness !== "number" ||
          typeof parsed.dimensions.conscientiousness !== "number" ||
          typeof parsed.dimensions.extraversion !== "number" ||
          typeof parsed.dimensions.agreeableness !== "number" ||
          typeof parsed.dimensions.eq !== "number" ||
          typeof parsed.dimensions.conflict !== "number"
        ) {
          throw new Error("Invalid profile schema. Make sure you upload a valid SoulSync profile file.");
        }

        // Validate demographics presence if present
        if (parsed.demographics) {
          if (!parsed.demographics.name || typeof parsed.demographics.age !== "number") {
            throw new Error("Invalid demographics structure in profile.");
          }
        }

        setPartnerData(parsed as PartnerProfileData);
        setSimulatedDimensions(parsed.dimensions);
        setUploadError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: any) {
        setUploadError(err.message || "Failed to parse profile JSON. Ensure the file is not corrupted.");
        setPartnerData(null);
        setSimulatedDimensions(null);
      }
    };
    reader.readAsText(file);
  };

  // Compatibility score calculation if partner data is loaded
  const partnerCompat = partnerData 
    ? calculateCompatibility(profile.dimensions, simulatedDimensions || partnerData.dimensions)
    : null;

  const userGenderKey = (userGender || "female").toLowerCase() as "male" | "female";
  const partnerGenderKey = partnerData 
    ? (partnerData.gender || "female").toLowerCase() as "male" | "female"
    : "female";

  const userExpr = genderExpressions[userGenderKey] || genderExpressions.female;
  const partnerExpr = partnerData 
    ? (genderExpressions[partnerGenderKey] || genderExpressions.female)
    : null;

  const handleExitComparison = () => {
    setPartnerData(null);
    setSimulatedDimensions(null);
  };

    return (
    <div className="container result-container animate-fade-in" style={{ position: "relative" }}>
      {/* Decorative Ambient Background Glow Orbs */}
      <div className="hide-on-print" style={{
        position: "fixed",
        top: "15%",
        right: "10%",
        width: "350px",
        height: "350px",
        background: "rgba(236, 72, 153, 0.05)",
        borderRadius: "50%",
        filter: "blur(90px)",
        zIndex: -1,
        pointerEvents: "none"
      }} />
      <div className="hide-on-print" style={{
        position: "fixed",
        bottom: "15%",
        left: "5%",
        width: "400px",
        height: "400px",
        background: "rgba(13, 148, 136, 0.04)",
        borderRadius: "50%",
        filter: "blur(110px)",
        zIndex: -1,
        pointerEvents: "none"
      }} />

      {/* 1. COMPARISON MODE: Rendered only when a partner file is successfully uploaded */}
      {partnerData && partnerCompat && partnerExpr && (
        <div className="glass-card comparison-card" style={{ padding: 40, marginBottom: 40, border: "1px solid var(--color-primary)", position: "relative", overflow: "hidden" }}>
          {/* Top border highlight */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: 20, marginBottom: 30 }} className="comp-header">
            <div>
              <span className="quiz-category-tag" style={{ background: "rgba(236,72,153,0.1)", color: "var(--color-primary)" }}>
                Active Synchronization Match
              </span>
              <h2 style={{ fontSize: "1.8rem", textAlign: "left", marginTop: 8 }}>
                {userName} & {partnerData.name} Compatibility
              </h2>
              <div style={{ display: "flex", gap: 8, fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                <span>You ({userGenderKey === "male" ? "Male ♂️" : "Female ♀️"})</span>
                <span>•</span>
                <span>Partner ({partnerGenderKey === "male" ? "Male ♂️" : "Female ♀️"})</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div 
                className="comp-overall-badge animate-float"
                style={{ 
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "2px solid " + partnerCompat.color,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05), 0 0 15px " + partnerCompat.color + "20",
                  padding: "10px 24px"
                }}
              >
                <div className="comp-overall-score" style={{ color: partnerCompat.color, fontSize: "2.2rem", fontWeight: 800 }}>
                  {partnerCompat.overallScore}%
                </div>
                <div className="comp-overall-label" style={{ color: partnerCompat.color, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}>
                  {partnerCompat.label}
                </div>
              </div>
              
              <button 
                className="btn btn-secondary" 
                style={{ width: 40, height: 40, borderRadius: "50%", padding: 0 }}
                onClick={handleExitComparison}
                title="Exit Comparison"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Match Dynamic Archetype Card */}
          <div className="glass-card" style={{ 
            padding: 24, 
            marginBottom: 30, 
            background: `linear-gradient(135deg, ${partnerCompat.color}15, rgba(255,255,255,0.75))`,
            border: `1px solid ${partnerCompat.color}35`,
            textAlign: "left",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: "2.4rem", lineHeight: 1 }}>{partnerCompat.archetype.emoji}</span>
              <div>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: partnerCompat.color, letterSpacing: "0.05em" }}>
                  Relationship Dynamic Archetype
                </span>
                <h3 style={{ fontSize: "1.4rem", margin: "2px 0 0", color: "var(--text-dark)", fontWeight: 800 }}>
                  {partnerCompat.archetype.name}
                </h3>
              </div>
            </div>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-light)", marginBottom: 16 }}>
              {partnerCompat.archetype.description}
            </p>
            <div>
              <h5 style={{ fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-dark)", marginBottom: 8 }}>
                Key Synergy Strengths:
              </h5>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {partnerCompat.archetype.strengths.map((str, sIdx) => (
                  <span key={sIdx} style={{ 
                    fontSize: "0.8rem", 
                    padding: "6px 12px", 
                    borderRadius: "99px", 
                    background: `${partnerCompat.color}15`, 
                    border: `1px solid ${partnerCompat.color}25`,
                    color: "var(--text-dark)",
                    fontWeight: 600
                  }}>
                    ✦ {str}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Logic Highlight Insights */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 30, background: "rgba(236, 72, 153, 0.01)", borderLeft: "4px solid var(--color-primary)", textAlign: "left" }}>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-dark)", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Sliders size={16} color="var(--color-primary)" />
              Matchmaking Logic Insights
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, margin: 0 }}>
              {partnerCompat.insights.map((insight, idx) => (
                <li key={idx} style={{ fontSize: "0.9rem", color: "var(--text-light)", display: "flex", gap: 8, lineHeight: 1.5 }}>
                  <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>✦</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comparative Sliders */}
          <div className="comp-dims-list" style={{ marginBottom: 40 }}>
            {/* Dimension 1: Honesty-Humility */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Honesty-Humility (H-factor)</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.honesty - (simulatedDimensions || partnerData.dimensions).honesty)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.honesty), getPercentage((simulatedDimensions || partnerData.dimensions).honesty)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.honesty) - getPercentage((simulatedDimensions || partnerData.dimensions).honesty)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.honesty) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).honesty) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Sly / Status-seeking</span>
                  <span>Sincere / Humble</span>
                </div>
              </div>
            </div>

            {/* Dimension 2: Emotionality */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Emotionality & Sentimentality</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.emotionality - (simulatedDimensions || partnerData.dimensions).emotionality)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.emotionality), getPercentage((simulatedDimensions || partnerData.dimensions).emotionality)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.emotionality) - getPercentage((simulatedDimensions || partnerData.dimensions).emotionality)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.emotionality) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).emotionality) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Tough-minded / Detached</span>
                  <span>Sensitive / Sentimental</span>
                </div>
              </div>
            </div>

            {/* Dimension 3: Extraversion */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Extraversion & Energy</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.extraversion - (simulatedDimensions || partnerData.dimensions).extraversion)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.extraversion), getPercentage((simulatedDimensions || partnerData.dimensions).extraversion)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.extraversion) - getPercentage((simulatedDimensions || partnerData.dimensions).extraversion)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.extraversion) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).extraversion) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Introspective / Reserved</span>
                  <span>Social / Energetic</span>
                </div>
              </div>
            </div>

            {/* Dimension 4: Agreeableness */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Agreeableness & Patience</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.agreeableness - (simulatedDimensions || partnerData.dimensions).agreeableness)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.agreeableness), getPercentage((simulatedDimensions || partnerData.dimensions).agreeableness)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.agreeableness) - getPercentage((simulatedDimensions || partnerData.dimensions).agreeableness)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.agreeableness) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).agreeableness) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Skeptical / Headstrong</span>
                  <span>Patient / Forgiving</span>
                </div>
              </div>
            </div>

            {/* Dimension 5: Conscientiousness */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Conscientiousness & Order</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.conscientiousness - (simulatedDimensions || partnerData.dimensions).conscientiousness)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.conscientiousness), getPercentage((simulatedDimensions || partnerData.dimensions).conscientiousness)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.conscientiousness) - getPercentage((simulatedDimensions || partnerData.dimensions).conscientiousness)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.conscientiousness) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).conscientiousness) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Spontaneous / Flexible</span>
                  <span>Organized / Deliberate</span>
                </div>
              </div>
            </div>

            {/* Dimension 6: Openness to Experience */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Openness & Curiosity</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.openness - (simulatedDimensions || partnerData.dimensions).openness)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.openness), getPercentage((simulatedDimensions || partnerData.dimensions).openness)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.openness) - getPercentage((simulatedDimensions || partnerData.dimensions).openness)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.openness) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).openness) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Practical / Traditional</span>
                  <span>Creative / Inquisitive</span>
                </div>
              </div>
            </div>

            {/* Dimension 7: Emotional Intelligence (EQ) */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Emotional Intelligence (EQ)</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.eq - (simulatedDimensions || partnerData.dimensions).eq)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.eq), getPercentage((simulatedDimensions || partnerData.dimensions).eq)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.eq) - getPercentage((simulatedDimensions || partnerData.dimensions).eq)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.eq) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).eq) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Logical / Private</span>
                  <span>Empathetic / Vulnerable</span>
                </div>
              </div>
            </div>

            {/* Dimension 8: Conflict Handling */}
            <div className="comp-dim-row">
              <div className="comp-dim-label">
                <span className="comp-dim-title">Conflict Handling Style</span>
                <span className="comp-dim-score" style={{ color: borderColors[pType.id] || "var(--color-primary)" }}>
                  {Math.round(100 - Math.abs(profile.dimensions.conflict - (simulatedDimensions || partnerData.dimensions).conflict)/4 * 100)}% Match
                </span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  {/* Connection Bridge */}
                  <div style={{
                    position: "absolute",
                    left: Math.min(getPercentage(profile.dimensions.conflict), getPercentage((simulatedDimensions || partnerData.dimensions).conflict)) + "%",
                    width: Math.abs(getPercentage(profile.dimensions.conflict) - getPercentage((simulatedDimensions || partnerData.dimensions).conflict)) + "%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-cyan))",
                    opacity: 0.35,
                    borderRadius: "9999px"
                  }} />
                  <div className="comp-marker comp-marker-me" style={{ left: getPercentage(profile.dimensions.conflict) + "%" }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: getPercentage((simulatedDimensions || partnerData.dimensions).conflict) + "%", background: "var(--color-cyan)" }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Space-seeking / Internal</span>
                  <span>Immediate / Constructive</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🌱 Bonding Action Plan Card */}
          <div className="glass-card" style={{ padding: "30px", marginBottom: "40px", textAlign: "left", border: "1px solid var(--border-glass)" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px" }}>
              <Flower2 size={20} color="var(--color-primary)" />
              🌱 Your Custom Bonding Action Plan
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "24px", lineHeight: 1.5 }}>
              Based on the largest personality differences between you and {partnerData.name}, our engine has generated 3 high-impact exercises to foster mutual understanding and communication.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
              {partnerCompat.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="glass-card" style={{ padding: "20px", background: "rgba(255,255,255,0.45)", border: "1px solid rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-primary)", margin: 0 }}>
                      {exIdx + 1}. {ex.title}
                    </h4>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "99px", background: "rgba(13, 148, 136, 0.08)", color: "var(--color-cyan)", border: "1px solid rgba(13, 148, 136, 0.15)" }}>
                      ⏱️ {ex.duration}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-light)", marginBottom: "14px", lineHeight: 1.5 }}>
                    {ex.description}
                  </p>
                  <div style={{ paddingLeft: "4px" }}>
                    <h5 style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-dark)", marginBottom: "8px" }}>
                      Action Steps:
                    </h5>
                    <ol style={{ margin: 0, paddingLeft: "16px", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {ex.actionSteps.map((step, sIdx) => (
                        <li key={sIdx} style={{ marginBottom: "6px" }}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🔄 Relational Growth Simulator */}
          <div className="glass-card" style={{ padding: "30px", marginBottom: "40px", textAlign: "left", border: "1px solid var(--color-cyan)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px", marginBottom: "20px" }} className="comp-header">
              <h3 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <Sliders size={20} color="var(--color-cyan)" />
                🔄 Relational Growth Simulator
              </h3>
              <button 
                className="btn btn-secondary" 
                style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                onClick={() => setSimulatedDimensions(partnerData.dimensions)}
              >
                Reset to Original
              </button>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "24px", lineHeight: 1.5 }}>
              <strong>Interactive Sandbox:</strong> What if {partnerData.name} develops their emotional resilience or changes how they resolve conflicts? 
              Drag the sliders below to adjust their coordinates and watch the overall compatibility and insights update in real-time.
            </p>

            <div className="form-grid-2" style={{ gap: "20px 30px" }}>
              {([
                { key: "honesty", title: "Honesty-Humility", left: "Sly / Status-seeking", right: "Sincere / Humble" },
                { key: "emotionality", title: "Emotionality & Sentimentality", left: "Tough-minded / Detached", right: "Sensitive / Sentimental" },
                { key: "extraversion", title: "Extraversion & Energy", left: "Introspective / Reserved", right: "Social / Energetic" },
                { key: "agreeableness", title: "Agreeableness & Patience", left: "Skeptical / Headstrong", right: "Patient / Forgiving" },
                { key: "conscientiousness", title: "Conscientiousness & Order", left: "Spontaneous / Flexible", right: "Organized / Deliberate" },
                { key: "openness", title: "Openness & Curiosity", left: "Practical / Traditional", right: "Creative / Inquisitive" },
                { key: "eq", title: "Emotional Intelligence (EQ)", left: "Logical / Private", right: "Empathetic / Vulnerable" },
                { key: "conflict", title: "Conflict Handling Style", left: "Space-seeking / Internal", right: "Immediate / Constructive" }
              ] as const).map((dim) => {
                const currentVal = simulatedDimensions ? simulatedDimensions[dim.key] : partnerData.dimensions[dim.key];
                const originalVal = partnerData.dimensions[dim.key];
                
                return (
                  <div key={dim.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }} className="simulator-slider-row">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-dark)" }}>{dim.title}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-cyan)" }}>
                        {currentVal.toFixed(1)} 
                        {Math.abs(currentVal - originalVal) > 0.05 && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginLeft: "4px" }}>
                            (Orig: {originalVal.toFixed(1)})
                          </span>
                        )}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1.0" 
                      max="5.0" 
                      step="0.1" 
                      value={currentVal} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSimulatedDimensions(prev => ({
                          ...(prev || partnerData.dimensions),
                          [dim.key]: val
                        }));
                      }}
                      style={{ 
                        width: "100%", 
                        height: "6px", 
                        borderRadius: "99px", 
                        background: "rgba(0,0,0,0.06)", 
                        outline: "none", 
                        cursor: "pointer",
                        accentColor: "var(--color-cyan)"
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      <span>{dim.left}</span>
                      <span>{dim.right}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gender expressions alignments */}
          <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: 30, textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 20 }}>👫 Gender-Wise Behavioral Alignments</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Comm */}
              <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "var(--color-primary)" }} />
                <h5 style={{ fontSize: "0.95rem", color: "var(--color-primary)", fontWeight: 700, marginBottom: 8, paddingLeft: 6 }}>Communication Style</h5>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", paddingLeft: 6 }}>
                  <strong>You ({userName}):</strong> {userExpr.communication}
                </p>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 8, marginTop: 8, paddingLeft: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.communication}
                </p>
              </div>

              {/* Vulnerability */}
              <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "var(--color-cyan)" }} />
                <h5 style={{ fontSize: "0.95rem", color: "var(--color-cyan)", fontWeight: 700, marginBottom: 8, paddingLeft: 6 }}>Emotional Vulnerability</h5>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", paddingLeft: 6 }}>
                  <strong>You ({userName}):</strong> {userExpr.vulnerability}
                </p>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 8, marginTop: 8, paddingLeft: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.vulnerability}
                </p>
              </div>

              {/* Stress */}
              <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "var(--color-primary)" }} />
                <h5 style={{ fontSize: "0.95rem", color: "var(--color-primary)", fontWeight: 700, marginBottom: 8, paddingLeft: 6 }}>Stress Response & Processing</h5>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", paddingLeft: 6 }}>
                  <strong>You ({userName}):</strong> {userExpr.stress}
                </p>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 8, marginTop: 8, paddingLeft: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.stress}
                </p>
              </div>

              {/* Love Languages */}
              <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "var(--color-cyan)" }} />
                <h5 style={{ fontSize: "0.95rem", color: "var(--color-cyan)", fontWeight: 700, marginBottom: 8, paddingLeft: 6 }}>Primary Love Language Channels</h5>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", paddingLeft: 6 }}>
                  <strong>You ({userName}):</strong> {userExpr.loveLanguage}
                </p>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 8, marginTop: 8, paddingLeft: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.loveLanguage}
                </p>
              </div>

              {/* Conflict */}
              <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "var(--color-primary)" }} />
                <h5 style={{ fontSize: "0.95rem", color: "var(--color-primary)", fontWeight: 700, marginBottom: 8, paddingLeft: 6 }}>Conflict Resolution Tendencies</h5>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", paddingLeft: 6 }}>
                  <strong>You ({userName}):</strong> {userExpr.conflict}
                </p>
                <p style={{ fontSize: "0.9rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 8, marginTop: 8, paddingLeft: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.conflict}
                </p>
              </div>
            </div>
          </div>

          {/* Biographical Background Alignments */}
          {demographics && partnerData.demographics && (
            <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: 30, marginTop: 30, textAlign: "left" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: 20 }}>📊 Side-by-Side Demographic Alignment</h3>
              
              <div className="glass-card" style={{ padding: 24, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-glass)", color: "var(--text-dark)" }}>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Biographical Factor</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>You ({userName})</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Partner ({partnerData.name})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>Age</td>
                      <td style={{ padding: "12px" }}>{demographics.age} years</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.age} years</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>Country</td>
                      <td style={{ padding: "12px" }}>{demographics.country}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.country}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>Birth / Living Cities</td>
                      <td style={{ padding: "12px" }}>{demographics.bornCity} / {demographics.livingCity}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.bornCity} / {partnerData.demographics.livingCity}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>Languages</td>
                      <td style={{ padding: "12px" }}>{demographics.knownLanguages}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.knownLanguages}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>Education</td>
                      <td style={{ padding: "12px" }}>{demographics.education}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.education}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>Languages Studied</td>
                      <td style={{ padding: "12px" }}>{demographics.languagesStudied}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.languagesStudied}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>No. of Siblings</td>
                      <td style={{ padding: "12px" }}>{demographics.siblings} siblings</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.siblings} siblings</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", textTransform: "capitalize", fontWeight: 600 }}>Parents Educated?</td>
                      <td style={{ padding: "12px" }}>{demographics.parentsEducated}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.parentsEducated}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", textTransform: "capitalize", fontWeight: 600 }}>Socioeconomic Standing</td>
                      <td style={{ padding: "12px" }}>{demographics.wealthStatus}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.wealthStatus}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "12px", textTransform: "capitalize", fontWeight: 600 }}>Experienced Heartbreak?</td>
                      <td style={{ padding: "12px" }}>{demographics.loveFailure?.replace(/_/g, " ")}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.loveFailure?.replace(/_/g, " ")}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px", fontWeight: 600 }}>Disability Status</td>
                      <td style={{ padding: "12px" }}>{demographics.disability}</td>
                      <td style={{ padding: "12px" }}>{partnerData.demographics.disability}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <button className="btn btn-secondary animate-float" onClick={handleExitComparison}>
              Exit Match & View My Report
            </button>
          </div>
        </div>
      )}

      {/* 2. CORE USER SOUL REPORT */}
      <div className="print-report-area">
        {/* Header Profile Card */}
        <div className="glass-card result-header-card" style={{ position: "relative", overflow: "hidden" }}>
          {/* Top Gradient Highlight Bar (for standard borders that play well with border radius) */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: pType.color }} />
          
          <div 
            style={{ 
              position: "absolute", 
              top: "-50px", 
              left: "-50px", 
              width: 200, 
              height: 200, 
              background: borderColors[pType.id] || "#ec4899", 
              opacity: 0.15, 
              filter: "blur(60px)",
              borderRadius: "50%",
              zIndex: 0
            }} 
          />
          
          <div 
            className="result-badge-glow animate-float"
            style={{ 
              background: pType.color,
              boxShadow: "0 8px 30px " + (shadowColors[pType.id] || "rgba(236, 72, 153, 0.4)"),
              border: "3px solid #ffffff",
              transition: "transform 0.5s ease"
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>{pType.emoji}</span>
          </div>

          <h1 className="result-type-title text-gradient" style={{ fontWeight: 800 }}>{userName}'s Soul Type: {pType.title}</h1>
          <p style={{ fontStyle: "italic", color: borderColors[pType.id] || "var(--color-primary)", fontWeight: 700, marginBottom: 16 }}>
            Secondary Influence: {sType.emoji} {sType.title} • ({userGenderKey === "male" ? "Male ♂️" : "Female ♀️"})
          </p>

          <p className="result-desc" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>{pType.description}</p>

          <div className="result-actions hide-on-print" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-glow" onClick={handleDownloadProfile}>
              <Download size={16} />
              Download My Profile File
            </button>

            <button className="btn btn-accent btn-glow" onClick={handlePrint}>
              <Printer size={16} />
              Print My Report
            </button>
            
            <button className="btn btn-secondary" onClick={onResetProfile}>
              <RefreshCw size={14} />
              Reset Quiz
            </button>
          </div>
        </div>

        {/* Background Upbringing Synthesis Card */}
        {demographics && narrativeParagraphs.length > 0 && (
          <div className="glass-card result-subcard" style={{ 
            textAlign: "left", 
            marginBottom: 40, 
            position: "relative",
            overflow: "hidden",
            borderLeft: "6px solid " + (borderColors[pType.id] || "var(--color-primary)"),
            background: "radial-gradient(circle at top right, rgba(236, 72, 153, 0.03) 0%, transparent 60%)" 
          }}>
            <h3 style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={22} color={borderColors[pType.id] || "var(--color-primary)"} />
              🧬 Upbringing & Background Synthesis
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, lineHeight: 1.7, fontSize: "1rem", color: "var(--text-light)" }}>
              {narrativeParagraphs.map((para, idx) => (
                <p key={idx} style={{ margin: 0, textIndent: idx > 0 ? "1.5em" : "0" }}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Main Details Grid */}
        <div className="result-grid" style={{ marginBottom: 40 }}>
          {/* Left column: Strengths & Blindspots */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div className="glass-card result-subcard" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: pType.color }} />
              <h3 style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: 12 }}>
                <CheckCircle2 size={20} color="var(--color-emerald)" />
                Core Strengths
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {pType.strengths.map((str, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 12, 
                      padding: "12px 16px", 
                      background: "rgba(5, 150, 105, 0.04)", 
                      border: "1px solid rgba(5, 150, 105, 0.1)", 
                      borderRadius: "var(--radius-md)" 
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--color-emerald)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-light)" }}>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card result-subcard" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: pType.color }} />
              <h3 style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: 12 }}>
                <AlertTriangle size={20} color="var(--color-rose)" />
                Blind Spots
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {pType.blindSpots.map((bs, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 12, 
                      padding: "12px 16px", 
                      background: "rgba(225, 29, 72, 0.04)", 
                      border: "1px solid rgba(225, 29, 72, 0.1)", 
                      borderRadius: "var(--radius-md)" 
                    }}
                  >
                    <AlertTriangle size={18} color="var(--color-rose)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-light)" }}>{bs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Emotional & Comm style */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div className="glass-card result-subcard" style={{ position: "relative", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: pType.color }} />
              
              <div>
                <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: 12, marginBottom: 12 }}>
                  <Heart size={20} color="var(--color-secondary)" />
                  Emotional Style
                </h3>
                <p className="result-detail-text" style={{ background: "rgba(244, 114, 182, 0.04)", border: "1px solid rgba(244, 114, 182, 0.1)", padding: 18, borderRadius: "var(--radius-md)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {pType.emotionalStyle}
                </p>
              </div>

              <div>
                <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: 12, marginBottom: 12 }}>
                  <MessageSquare size={20} color="var(--color-primary)" />
                  Communication Style
                </h3>
                <p className="result-detail-text" style={{ background: "rgba(236, 72, 153, 0.04)", border: "1px solid rgba(236, 72, 153, 0.1)", padding: 18, borderRadius: "var(--radius-md)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {pType.communicationStyle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Dimensions Chart Card */}
        <div className="glass-card result-subcard" style={{ textAlign: "left", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: pType.color }} />
          <h3 style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={20} color="var(--color-accent)" />
            Your 8 Soul Coordinates (Likert Scale 1 - 5)
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 30 }}>
            Here is exactly where your thoughts, behaviors, and emotions settle on our 8 personality dimensions.
          </p>

          <div className="dimensions-visual" style={{ gap: 28 }}>
            {/* Dimension 1: Honesty-Humility */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>🤝 Sly / Status-seeking (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Honesty-Humility ({profile.dimensions.honesty.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Sincere & Humble 🛡️</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.honesty) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.honesty) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>

            {/* Dimension 2: Emotionality */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>🌊 Tough-minded / Detached (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Emotionality & Sentimentality ({profile.dimensions.emotionality.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Sensitive & Sentimental 🧘</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.emotionality) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.emotionality) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>

            {/* Dimension 3: Extraversion */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>🤫 Quiet & Introspective (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Extraversion & Energy ({profile.dimensions.extraversion.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Social & Expressive 📢</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.extraversion) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.extraversion) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>

            {/* Dimension 4: Agreeableness */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>🦅 Skeptical & Independent (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Agreeableness & Patience ({profile.dimensions.agreeableness.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Patient & Forgiving 💖</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.agreeableness) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.agreeableness) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>

            {/* Dimension 5: Conscientiousness */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>⚡ Spontaneous & Flexible (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Conscientiousness & Order ({profile.dimensions.conscientiousness.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Organized & Structured 📈</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.conscientiousness) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.conscientiousness) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>

            {/* Dimension 6: Openness to Experience */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>🎨 Practical & Focused (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Openness & Curiosity ({profile.dimensions.openness.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Creative & Curious 🔮</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.openness) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.openness) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>

            {/* Dimension 7: EQ */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>🧠 Private & Logical (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Emotional Intelligence ({profile.dimensions.eq.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Empathetic & Listening 🤝</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.eq) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.eq) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>

            {/* Dimension 8: Conflict Handling */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left" style={{ fontWeight: 600 }}>🚪 Space-seeking & Internal (1.0)</span>
                <span style={{ color: "var(--text-dark)", fontWeight: 700 }}>Conflict Handling ({profile.dimensions.conflict.toFixed(1)})</span>
                <span className="dim-right" style={{ fontWeight: 600 }}>(5.0) Immediate & Constructive 🗣️</span>
              </div>
              <div className="dim-slider-bg" style={{ height: 10, background: "rgba(0,0,0,0.05)" }}>
                {/* Active fill track */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: getPercentage(profile.dimensions.conflict) + "%",
                  background: pType.color,
                  borderRadius: "9999px"
                }} />
                <div 
                  className="dim-node" 
                  style={{ 
                    left: getPercentage(profile.dimensions.conflict) + "%", 
                    borderColor: borderColors[pType.id] || "var(--color-primary)",
                    boxShadow: "0 0 12px " + (shadowColors[pType.id] || "rgba(236,72,153,0.3)")
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PARTNER COMPATIBILITY FILE UPLOAD SECTION */}
      <div className="glass-card result-subcard hide-on-print" style={{ border: "1px dashed var(--border-glass-glow)", padding: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "center" }}>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.4rem", borderBottom: "none", paddingBottom: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Compass size={22} color="var(--color-primary)" />
              Match Compatibility with Partner
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              SoulSync values absolute privacy. Ask your partner to take the test on their device, download their profile file, and upload it here. 
              We calculate your compatibility directly in your browser without saving it to any public servers.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <label 
              htmlFor="partner-file-upload" 
              className="btn btn-secondary btn-glow"
              style={{ padding: "24px 30px", borderStyle: "dashed", width: "100%", height: 120, display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <Upload size={24} style={{ marginBottom: 6, color: "var(--color-primary)" }} />
              <span style={{ fontSize: "0.9rem" }}>Upload Partner's Profile File (.json)</span>
              <input 
                type="file" 
                id="partner-file-upload" 
                accept=".json" 
                onChange={handleFileUpload} 
                style={{ display: "none" }}
              />
            </label>

            {uploadError && (
              <div style={{ color: "var(--color-rose)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={14} />
                <span>{uploadError}</span>
              </div>
            )}
            
            {partnerData && (
              <div style={{ color: "var(--color-emerald)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={14} />
                <span>Loaded profile for {partnerData.name}!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
