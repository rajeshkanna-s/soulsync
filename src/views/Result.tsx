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
        setUploadError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: any) {
        setUploadError(err.message || "Failed to parse profile JSON. Ensure the file is not corrupted.");
        setPartnerData(null);
      }
    };
    reader.readAsText(file);
  };

  // Compatibility score calculation if partner data is loaded
  const partnerCompat = partnerData 
    ? calculateCompatibility(profile.dimensions, partnerData.dimensions)
    : null;

  const userGenderKey = (userGender || "female").toLowerCase() as "male" | "female";
  const partnerGenderKey = partnerData 
    ? (partnerData.gender || "female").toLowerCase() as "male" | "female"
    : "female";

  const userExpr = genderExpressions[userGenderKey] || genderExpressions.female;
  const partnerExpr = partnerData 
    ? (genderExpressions[partnerGenderKey] || genderExpressions.female)
    : null;

  return (
    <div className="container result-container animate-fade-in">
      
      {/* 1. COMPARISON MODE: Rendered only when a partner file is successfully uploaded */}
      {partnerData && partnerCompat && partnerExpr && (
        <div className="glass-card" style={{ padding: 40, marginBottom: 40, border: "1px solid var(--color-primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: 20, marginBottom: 30 }}>
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
                className="comp-overall-badge"
                style={{ 
                  background: "rgba(236, 72, 153, 0.08)",
                  border: `1px solid ${partnerCompat.color}`,
                  padding: "8px 20px"
                }}
              >
                <div className="comp-overall-score" style={{ color: partnerCompat.color, fontSize: "2rem" }}>
                  {partnerCompat.overallScore}%
                </div>
                <div className="comp-overall-label" style={{ color: partnerCompat.color, fontSize: "0.75rem" }}>
                  {partnerCompat.label}
                </div>
              </div>
              
              <button 
                className="btn btn-secondary" 
                style={{ width: 40, height: 40, borderRadius: "50%", padding: 0 }}
                onClick={() => setPartnerData(null)}
                title="Exit Comparison"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Logic Highlight Insights */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 30, background: "rgba(0,0,0,0.01)", textAlign: "left" }}>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-dark)", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Sliders size={16} color="var(--color-primary)" />
              Matchmaking Logic Insights
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, paddingLeft: 0 }}>
              {partnerCompat.insights.map((insight, idx) => (
                <li key={idx} style={{ fontSize: "0.9rem", color: "var(--text-light)", display: "flex", gap: 8 }}>
                  <span style={{ color: "var(--color-primary)" }}>✦</span>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.honesty - partnerData.dimensions.honesty)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.honesty)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.honesty)}%` }}>{partnerData.name[0]}</div>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.emotionality - partnerData.dimensions.emotionality)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.emotionality)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.emotionality)}%` }}>{partnerData.name[0]}</div>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.extraversion - partnerData.dimensions.extraversion)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.extraversion)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.extraversion)}%` }}>{partnerData.name[0]}</div>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.agreeableness - partnerData.dimensions.agreeableness)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.agreeableness)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.agreeableness)}%` }}>{partnerData.name[0]}</div>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.conscientiousness - partnerData.dimensions.conscientiousness)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.conscientiousness)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.conscientiousness)}%` }}>{partnerData.name[0]}</div>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.openness - partnerData.dimensions.openness)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.openness)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.openness)}%` }}>{partnerData.name[0]}</div>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.eq - partnerData.dimensions.eq)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.eq)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.eq)}%` }}>{partnerData.name[0]}</div>
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
                <span className="comp-dim-score">{Math.round(100 - Math.abs(profile.dimensions.conflict - partnerData.dimensions.conflict)/4 * 100)}%</span>
              </div>
              <div className="comp-slider-container">
                <div className="comp-double-track">
                  <div className="comp-marker comp-marker-me" style={{ left: `${getPercentage(profile.dimensions.conflict)}%` }}>Me</div>
                  <div className="comp-marker comp-marker-them" style={{ left: `${getPercentage(partnerData.dimensions.conflict)}%` }}>{partnerData.name[0]}</div>
                </div>
                <div className="comp-track-labels">
                  <span>Space-seeking / Internal</span>
                  <span>Immediate / Constructive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gender expressions alignments */}
          <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: 30, textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 20 }}>👫 Gender-Wise Behavioral Alignments</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Comm */}
              <div className="glass-card" style={{ padding: 16 }}>
                <h5 style={{ fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: 6 }}>Communication Style</h5>
                <p style={{ fontSize: "0.85rem", margin: "4px 0" }}>
                  <strong>You ({userName}):</strong> {userExpr.communication}
                </p>
                <p style={{ fontSize: "0.85rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.communication}
                </p>
              </div>

              {/* Vulnerability */}
              <div className="glass-card" style={{ padding: 16 }}>
                <h5 style={{ fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: 6 }}>Emotional Vulnerability</h5>
                <p style={{ fontSize: "0.85rem", margin: "4px 0" }}>
                  <strong>You ({userName}):</strong> {userExpr.vulnerability}
                </p>
                <p style={{ fontSize: "0.85rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.vulnerability}
                </p>
              </div>

              {/* Stress */}
              <div className="glass-card" style={{ padding: 16 }}>
                <h5 style={{ fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: 6 }}>Stress Response & Processing</h5>
                <p style={{ fontSize: "0.85rem", margin: "4px 0" }}>
                  <strong>You ({userName}):</strong> {userExpr.stress}
                </p>
                <p style={{ fontSize: "0.85rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.stress}
                </p>
              </div>

              {/* Love Languages */}
              <div className="glass-card" style={{ padding: 16 }}>
                <h5 style={{ fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: 6 }}>Primary Love Language Channels</h5>
                <p style={{ fontSize: "0.85rem", margin: "4px 0" }}>
                  <strong>You ({userName}):</strong> {userExpr.loveLanguage}
                </p>
                <p style={{ fontSize: "0.85rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 6 }}>
                  <strong>{partnerData.name}:</strong> {partnerExpr.loveLanguage}
                </p>
              </div>

              {/* Conflict */}
              <div className="glass-card" style={{ padding: 16 }}>
                <h5 style={{ fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: 6 }}>Conflict Resolution Tendencies</h5>
                <p style={{ fontSize: "0.85rem", margin: "4px 0" }}>
                  <strong>You ({userName}):</strong> {userExpr.conflict}
                </p>
                <p style={{ fontSize: "0.85rem", margin: "4px 0", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 6 }}>
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
                      <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700 }}>Biographical Factor</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700 }}>You ({userName})</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700 }}>Partner ({partnerData.name})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Age</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.age} years</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.age} years</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Country</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.country}</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.country}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Birth / Living Cities</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.bornCity} / {demographics.livingCity}</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.bornCity} / {partnerData.demographics.livingCity}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Languages</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.knownLanguages}</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.knownLanguages}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Education</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.education}</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.education}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Languages Studied</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.languagesStudied}</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.languagesStudied}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>No. of Siblings</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.siblings} siblings</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.siblings} siblings</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Parents Educated?</td>
                      <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{demographics.parentsEducated}</td>
                      <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{partnerData.demographics.parentsEducated}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Socioeconomic Standing</td>
                      <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{demographics.wealthStatus}</td>
                      <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{partnerData.demographics.wealthStatus}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Experienced Heartbreak?</td>
                      <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{demographics.loveFailure?.replace(/_/g, " ")}</td>
                      <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{partnerData.demographics.loveFailure?.replace(/_/g, " ")}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>Disability Status</td>
                      <td style={{ padding: "10px 12px" }}>{demographics.disability}</td>
                      <td style={{ padding: "10px 12px" }}>{partnerData.demographics.disability}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <button className="btn btn-secondary" onClick={() => setPartnerData(null)}>
              Exit Match & View My Report
            </button>
          </div>
        </div>
      )}

      {/* 2. CORE USER SOUL REPORT */}
      <div className="print-report-area">
        {/* Header Profile Card */}
        <div className="glass-card result-header-card">
          <div 
            style={{ 
              position: "absolute", 
              top: "-50px", 
              left: "-50px", 
              width: 200, 
              height: 200, 
              background: pType.color, 
              opacity: 0.15, 
              filter: "blur(60px)",
              borderRadius: "50%",
              zIndex: 0
            }} 
          />
          
          <div 
            className="result-badge-glow"
            style={{ 
              background: pType.color,
              boxShadow: `0 8px 30px ${pType.color.split(" ")[2] || "rgba(236, 72, 153, 0.4)"}` 
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>{pType.emoji}</span>
          </div>

          <h1 className="result-type-title text-gradient">{userName}'s Soul Type: {pType.title}</h1>
          <p style={{ fontStyle: "italic", color: "var(--color-primary)", fontWeight: 700, marginBottom: 16 }}>
            Secondary Influence: {sType.emoji} {sType.title} • ({userGenderKey === "male" ? "Male ♂️" : "Female ♀️"})
          </p>

          <p className="result-desc">{pType.description}</p>

          <div className="result-actions hide-on-print" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleDownloadProfile}>
              <Download size={16} />
              Download My Profile File
            </button>

            <button className="btn btn-primary btn-glow" onClick={handlePrint}>
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
          <div className="glass-card result-subcard" style={{ textAlign: "left", marginBottom: 30, background: "radial-gradient(circle at top right, rgba(236, 72, 153, 0.04) 0%, transparent 60%)" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: 12, marginBottom: 16 }}>
              <Sparkles size={20} color="var(--color-primary)" />
              🧬 Upbringing & Background Synthesis
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, lineHeight: 1.6, fontSize: "0.95rem", color: "var(--text-light)" }}>
              {narrativeParagraphs.map((para, idx) => (
                <p key={idx} style={{ margin: 0 }}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Main Details Grid */}
        <div className="result-grid">
          {/* Left column: Strengths & Blindspots */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div className="glass-card result-subcard">
              <h3>
                <CheckCircle2 size={20} color="var(--color-emerald)" />
                Core Strengths
              </h3>
              <ul className="bullet-list">
                {pType.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card result-subcard">
              <h3>
                <AlertTriangle size={20} color="var(--color-rose)" />
                Blind Spots
              </h3>
              <ul className="bullet-list">
                {pType.blindSpots.map((bs, idx) => (
                  <li key={idx} style={{ color: "var(--text-light)" }}>{bs}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column: Emotional & Comm style */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div className="glass-card result-subcard" style={{ flex: 1 }}>
              <h3>
                <Heart size={20} color="var(--color-secondary)" />
                Emotional Style
              </h3>
              <p className="result-detail-text" style={{ marginBottom: 20 }}>
                {pType.emotionalStyle}
              </p>

              <h3>
                <MessageSquare size={20} color="var(--color-primary)" />
                Communication Style
              </h3>
              <p className="result-detail-text">
                {pType.communicationStyle}
              </p>
            </div>
          </div>
        </div>

        {/* Full Dimensions Chart Card */}
        <div className="glass-card result-subcard" style={{ textAlign: "left", marginBottom: 40 }}>
          <h3 style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: 12 }}>
            <Sparkles size={20} color="var(--color-accent)" />
            Your 8 Soul Coordinates (Likert Scale 1 - 5)
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
            Here is exactly where your thoughts, behaviors, and emotions settle on our 8 personality dimensions.
          </p>

          <div className="dimensions-visual">
            {/* Dimension 1: Honesty-Humility */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">🤝 Sly / Status-seeking (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Honesty-Humility ({profile.dimensions.honesty.toFixed(1)})</span>
                <span className="dim-right">(5.0) Sincere & Humble 🛡️</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.honesty)}%`, borderColor: "var(--color-primary)" }} />
              </div>
            </div>

            {/* Dimension 2: Emotionality */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">🌊 Tough-minded / Detached (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Emotionality & Sentimentality ({profile.dimensions.emotionality.toFixed(1)})</span>
                <span className="dim-right">(5.0) Sensitive & Sentimental 🧘</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.emotionality)}%`, borderColor: "var(--color-cyan)" }} />
              </div>
            </div>

            {/* Dimension 3: Extraversion */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">🤫 Quiet & Introspective (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Extraversion & Energy ({profile.dimensions.extraversion.toFixed(1)})</span>
                <span className="dim-right">(5.0) Social & Expressive 📢</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.extraversion)}%`, borderColor: "var(--color-primary)" }} />
              </div>
            </div>

            {/* Dimension 4: Agreeableness */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">🦅 Skeptical & Independent (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Agreeableness & Patience ({profile.dimensions.agreeableness.toFixed(1)})</span>
                <span className="dim-right">(5.0) Patient & Forgiving 💖</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.agreeableness)}%`, borderColor: "var(--color-secondary)" }} />
              </div>
            </div>

            {/* Dimension 5: Conscientiousness */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">⚡ Spontaneous & Flexible (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Conscientiousness & Order ({profile.dimensions.conscientiousness.toFixed(1)})</span>
                <span className="dim-right">(5.0) Organized & Structured 📈</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.conscientiousness)}%`, borderColor: "var(--color-accent)" }} />
              </div>
            </div>

            {/* Dimension 6: Openness to Experience */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">🎨 Practical & Focused (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Openness & Curiosity ({profile.dimensions.openness.toFixed(1)})</span>
                <span className="dim-right">(5.0) Creative & Curious 🔮</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.openness)}%`, borderColor: "var(--color-primary)" }} />
              </div>
            </div>

            {/* Dimension 7: EQ */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">🧠 Private & Logical (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Emotional Intelligence ({profile.dimensions.eq.toFixed(1)})</span>
                <span className="dim-right">(5.0) Empathetic & Listening 🤝</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.eq)}%`, borderColor: "var(--color-secondary)" }} />
              </div>
            </div>

            {/* Dimension 8: Conflict Handling */}
            <div className="dim-row">
              <div className="dim-label-row">
                <span className="dim-left">🚪 Space-seeking & Internal (1.0)</span>
                <span style={{ color: "var(--text-muted)" }}>Conflict Handling ({profile.dimensions.conflict.toFixed(1)})</span>
                <span className="dim-right">(5.0) Immediate & Constructive 🗣️</span>
              </div>
              <div className="dim-slider-bg">
                <div className="dim-node" style={{ left: `${getPercentage(profile.dimensions.conflict)}%`, borderColor: "var(--color-primary)" }} />
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
