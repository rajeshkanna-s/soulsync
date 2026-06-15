import React, { useState } from "react";
import { User, Sparkles, AlertTriangle, CheckCircle2, Trash2, Edit2, Check } from "lucide-react";
import { personalityTypes } from "../data/personalityTypes";
import { ScoreProfile } from "../utils/engine";

interface ProfileProps {
  profile: ScoreProfile;
  userName: string;
  userAvatar: string;
  userGender: "male" | "female";
  onUpdateUser: (name: string, avatar: string, gender: "male" | "female") => void;
  onReset: () => void;
  onNavigate: (view: string) => void;
}

const avatarEmojis = ["🔮", "✨", "🧠", "🌊", "🔥", "🌸", "🎨", "🏔️", "🌙", "⚡", "🦁", "🦋", "🦉", "🧸"];

export default function Profile({ 
  profile, 
  userName, 
  userAvatar, 
  userGender,
  onUpdateUser, 
  onReset,
  onNavigate
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [editGender, setEditGender] = useState<"male" | "female">(userGender);

  const pType = personalityTypes[profile.primaryTypeId] || personalityTypes.thinker;
  const sType = personalityTypes[profile.secondaryTypeId] || personalityTypes.dreamer;

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateUser(editName.trim(), editAvatar, editGender);
      setIsEditing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "60px 0 100px", maxWidth: 800 }}>
      {/* Profile Header Card */}
      <div className="glass-card" style={{ padding: 40, marginBottom: 40 }}>
        <div className="profile-header">
          {/* Avatar Icon */}
          <div className="profile-avatar-large">
            {userAvatar}
          </div>

          <div className="profile-meta-details" style={{ textAlign: "left" }}>
            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="form-label" style={{ marginBottom: 6 }}>Display Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ maxWidth: 300 }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: 6 }}>Biological Gender</label>
                  <div style={{ display: "flex", gap: 12, maxWidth: 300 }}>
                    <button
                      type="button"
                      className={`gender-toggle-btn ${editGender === "female" ? "active" : ""}`}
                      onClick={() => setEditGender("female")}
                    >
                      Female ♀️
                    </button>
                    <button
                      type="button"
                      className={`gender-toggle-btn ${editGender === "male" ? "active" : ""}`}
                      onClick={() => setEditGender("male")}
                    >
                      Male ♂️
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: 6 }}>Choose Soul Icon</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
                    {avatarEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditAvatar(emoji)}
                        style={{
                          fontSize: "1.5rem",
                          background: editAvatar === emoji ? "rgba(236, 72, 153, 0.1)" : "none",
                          border: editAvatar === emoji ? "1px solid var(--color-primary)" : "1px solid transparent",
                          borderRadius: 8,
                          width: 44,
                          height: 44,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-primary" style={{ padding: "8px 16px" }} onClick={handleSave}>
                    <Check size={16} /> Save
                  </button>
                  <button className="btn btn-secondary" style={{ padding: "8px 16px" }} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 className="profile-name">{userName}</h2>
                  <button 
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                    onClick={() => {
                      setEditName(userName);
                      setEditAvatar(userAvatar);
                      setEditGender(userGender);
                      setIsEditing(true);
                    }}
                    title="Edit Details"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                  <span className="nav-badge" style={{ background: pType.color + "15", borderColor: pType.color + "30" }}>
                    Primary: {pType.emoji} {pType.title}
                  </span>
                  <span className="nav-badge" style={{ background: "rgba(0,0,0,0.02)", borderColor: "var(--border-glass)" }}>
                    Gender: {userGender === "male" ? "Male ♂️" : "Female ♀️"}
                  </span>
                  <span className="nav-badge" style={{ background: "rgba(0,0,0,0.02)", borderColor: "var(--border-glass)" }}>
                    Secondary: {sType.emoji} {sType.title}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-val">{pType.strengths.length}</div>
            <div className="stat-lbl">Core Strengths</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-val">{pType.blindSpots.length}</div>
            <div className="stat-lbl">Identified Blindspots</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-val">7 / 7</div>
            <div className="stat-lbl">Analyzed Dimensions</div>
          </div>
        </div>

        {/* Action Button Links */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => onNavigate("result")}>
            <Sparkles size={16} />
            View Full Report
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate("matching")}>
            <User size={16} />
            Find Matches
          </button>
        </div>
      </div>

      {/* Settings / Reset section */}
      <div className="glass-card" style={{ padding: 30, border: "1px solid rgba(225, 29, 72, 0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-rose)", marginBottom: 4 }}>Danger Zone</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Permanently clear your soul coordinates, personality analysis, and cached chats.
            </p>
          </div>
          <button 
            className="btn" 
            style={{ 
              background: "rgba(225, 29, 72, 0.1)", 
              color: "var(--color-rose)", 
              border: "1px solid rgba(225, 29, 72, 0.3)" 
            }}
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your personality score? This cannot be undone.")) {
                onReset();
              }
            }}
          >
            <Trash2 size={16} />
            Reset My Profile
          </button>
        </div>
      </div>
    </div>
  );
}
