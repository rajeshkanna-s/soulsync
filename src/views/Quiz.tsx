import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, User, Sparkles, BookOpen, Users, HeartHandshake } from "lucide-react";
import { questions } from "../data/questions";
import { UserDemographics } from "../utils/engine";
import { indianCities } from "../data/indianCities";

interface QuizProps {
  onComplete: (answers: Record<number, number>, demographics: UserDemographics) => void;
  onNavigate: (view: string) => void;
  defaultDemographics?: UserDemographics | null;
}

const likertOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];

const LANGUAGES_LIST = [
  "English",
  "Tamil",
  "Malayalam",
  "Hindi",
  "Telugu",
  "Kannada",
  "Bengali",
  "Gujarati",
  "Marathi",
  "Odia",
  "Punjabi",
  "Urdu",
  "Assamese",
  "Sanskrit",
  "French",
  "German",
  "Spanish",
  "Mandarin",
  "Japanese"
];

export default function Quiz({ 
  onComplete, 
  onNavigate, 
  defaultDemographics
}: QuizProps) {
  // -1 represents Onboarding Screen, 0+ represents question index
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  // Onboarding Wizard steps (1 to 4)
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showError, setShowError] = useState(false);

  // Country-City choices database
  const countryCityData: Record<string, string[]> = {
    "India": [...indianCities, "Other"],
    "United States": ["New York", "Los Angeles", "Chicago", "San Francisco", "Boston", "Seattle", "Austin", "Miami", "Other"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Leeds", "Bristol", "Other"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Other"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Other"],
    "Singapore": ["Singapore", "Other"],
    "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg", "Other"],
    "Other": ["Other"]
  };

  const getInitialCountry = () => {
    const defaultCountry = defaultDemographics?.country || "";
    if (defaultCountry && countryCityData[defaultCountry]) {
      return defaultCountry;
    }
    return defaultCountry ? "Other" : "";
  };

  const getInitialCustomCountry = () => {
    const defaultCountry = defaultDemographics?.country || "";
    if (defaultCountry && !countryCityData[defaultCountry]) {
      return defaultCountry;
    }
    return "";
  };

  const getInitialBornCity = () => {
    const defaultCity = defaultDemographics?.bornCity || "";
    const country = getInitialCountry();
    if (country && country !== "Other" && countryCityData[country]?.includes(defaultCity)) {
      return defaultCity;
    }
    return defaultCity ? "Other" : "";
  };

  const getInitialCustomBornCity = () => {
    const defaultCity = defaultDemographics?.bornCity || "";
    const country = getInitialCountry();
    if (country === "Other" || !countryCityData[country]?.includes(defaultCity)) {
      return defaultCity;
    }
    return "";
  };

  const getInitialLivingCity = () => {
    const defaultCity = defaultDemographics?.livingCity || "";
    const country = getInitialCountry();
    if (country && country !== "Other" && countryCityData[country]?.includes(defaultCity)) {
      return defaultCity;
    }
    return defaultCity ? "Other" : "";
  };

  const getInitialCustomLivingCity = () => {
    const defaultCity = defaultDemographics?.livingCity || "";
    const country = getInitialCountry();
    if (country === "Other" || !countryCityData[country]?.includes(defaultCity)) {
      return defaultCity;
    }
    return "";
  };

  // Demographic form state
  const [name, setName] = useState(defaultDemographics?.name || "");
  const [age, setAge] = useState<number>(defaultDemographics?.age || 22);
  const [gender, setGender] = useState<"male" | "female" | "">(defaultDemographics?.gender || "");
  
  const [selectedCountry, setSelectedCountry] = useState<string>(getInitialCountry());
  const [customCountry, setCustomCountry] = useState<string>(getInitialCustomCountry());

  const [selectedBornCity, setSelectedBornCity] = useState<string>(getInitialBornCity());
  const [customBornCity, setCustomBornCity] = useState<string>(getInitialCustomBornCity());

  const [selectedLivingCity, setSelectedLivingCity] = useState<string>(getInitialLivingCity());
  const [customLivingCity, setCustomLivingCity] = useState<string>(getInitialCustomLivingCity());

  const [knownLanguages, setKnownLanguages] = useState(defaultDemographics?.knownLanguages || "");
  const [education, setEducation] = useState(defaultDemographics?.education || "");
  const [siblings, setSiblings] = useState<number>(defaultDemographics?.siblings ?? 0);
  const [languagesStudied, setLanguagesStudied] = useState(defaultDemographics?.languagesStudied || "");
  const [parentsEducated, setParentsEducated] = useState<"yes" | "no">(defaultDemographics?.parentsEducated || "yes");
  const [wealthStatus, setWealthStatus] = useState<UserDemographics["wealthStatus"]>(defaultDemographics?.wealthStatus || "medium");
  const [loveFailure, setLoveFailure] = useState<UserDemographics["loveFailure"]>(defaultDemographics?.loveFailure || "no");
  
  const [hasDisability, setHasDisability] = useState<boolean>(
    defaultDemographics?.disability ? defaultDemographics.disability !== "none" : false
  );
  const [disabilityDetail, setDisabilityDetail] = useState<string>(
    defaultDemographics?.disability && defaultDemographics.disability !== "none" ? defaultDemographics.disability : ""
  );

  const [selectedKnownLang, setSelectedKnownLang] = useState<string>(() => {
    const initial = defaultDemographics?.knownLanguages || "";
    if (initial && LANGUAGES_LIST.includes(initial)) {
      return initial;
    }
    return initial ? "Other" : "";
  });

  const [selectedStudyLang, setSelectedStudyLang] = useState<string>(() => {
    const initial = defaultDemographics?.languagesStudied || "";
    if (initial && LANGUAGES_LIST.includes(initial)) {
      return initial;
    }
    return initial ? "Other" : "";
  });

  const currentQuestion = questions[currentIdx];
  const selectedRating = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelectRating = (rating: number) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: rating
    };
    setAnswers(updatedAnswers);

    if (currentIdx < questions.length - 1) {
      // Auto-advance to next question
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 200);
    } else {
      // Final question: auto-submit quiz results after selection
      setTimeout(() => {
        const finalCountry = selectedCountry === "Other" ? customCountry.trim() : selectedCountry;
        const finalBornCity = (selectedCountry === "Other" || selectedBornCity === "Other") ? customBornCity.trim() : selectedBornCity;
        const finalLivingCity = (selectedCountry === "Other" || selectedLivingCity === "Other") ? customLivingCity.trim() : selectedLivingCity;

        const finalDemographics: UserDemographics = {
          name: name.trim(),
          age,
          gender: gender as "male" | "female",
          bornCity: finalBornCity,
          livingCity: finalLivingCity,
          knownLanguages: knownLanguages.trim(),
          education,
          country: finalCountry,
          siblings,
          languagesStudied: languagesStudied.trim(),
          parentsEducated,
          wealthStatus,
          loveFailure: age >= 16 ? loveFailure : "not_applicable",
          disability: hasDisability && disabilityDetail.trim() ? disabilityDetail.trim() : "none"
        };
        onComplete(updatedAnswers, finalDemographics);
      }, 200);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    } else if (currentIdx === 0) {
      setCurrentIdx(-1);
      setOnboardingStep(4);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length >= questions.length) {
      const finalCountry = selectedCountry === "Other" ? customCountry.trim() : selectedCountry;
      const finalBornCity = (selectedCountry === "Other" || selectedBornCity === "Other") ? customBornCity.trim() : selectedBornCity;
      const finalLivingCity = (selectedCountry === "Other" || selectedLivingCity === "Other") ? customLivingCity.trim() : selectedLivingCity;

      const finalDemographics: UserDemographics = {
        name: name.trim(),
        age,
        gender: gender as "male" | "female",
        bornCity: finalBornCity,
        livingCity: finalLivingCity,
        knownLanguages: knownLanguages.trim(),
        education,
        country: finalCountry,
        siblings,
        languagesStudied: languagesStudied.trim(),
        parentsEducated,
        wealthStatus,
        loveFailure: age >= 16 ? loveFailure : "not_applicable",
        disability: hasDisability && disabilityDetail.trim() ? disabilityDetail.trim() : "none"
      };
      onComplete(answers, finalDemographics);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const isCountryValid = selectedCountry === "Other" ? !!customCountry.trim() : !!selectedCountry;
      const isBornCityValid = (selectedCountry === "Other" || selectedBornCity === "Other") ? !!customBornCity.trim() : !!selectedBornCity;
      const isLivingCityValid = (selectedCountry === "Other" || selectedLivingCity === "Other") ? !!customLivingCity.trim() : !!selectedLivingCity;
      return !!(name.trim() && age > 0 && gender && isCountryValid && isBornCityValid && isLivingCityValid);
    }
    if (step === 2) {
      return !!(education && knownLanguages.trim() && languagesStudied.trim());
    }
    if (step === 3) {
      return siblings >= 0 && !!wealthStatus;
    }
    if (step === 4) {
      if (hasDisability && !disabilityDetail.trim()) return false;
      return true;
    }
    return false;
  };

  const handleNextStep = () => {
    if (validateStep(onboardingStep)) {
      setShowError(false);
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowError(true);
    }
  };

  const handlePrevStep = () => {
    setShowError(false);
    setOnboardingStep(prev => Math.max(1, prev - 1));
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      setShowError(false);
      setCurrentIdx(0);
    } else {
      setShowError(true);
    }
  };

  const isQuizComplete = Object.keys(answers).length >= questions.length;
  const progressPercentage = currentIdx >= 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;
  const answeredCount = Object.keys(answers).length;

  // Render Onboarding Screen Wizard
  if (currentIdx === -1) {
    return (
      <div className="container quiz-section animate-fade-in" style={{ maxWidth: 550 }}>
        <div className="glass-card quiz-card" style={{ padding: "40px 30px" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Sparkles size={32} color="var(--color-primary)" style={{ marginBottom: 12 }} />
            <h2 style={{ fontSize: "1.6rem" }}>Background & Origin Details</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
              Step {onboardingStep} of 4: Upbringing and demographics shape our emotional blueprints.
            </p>
            
            {/* Step indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  style={{ 
                    width: 32, 
                    height: 6, 
                    borderRadius: 99, 
                    background: onboardingStep >= s ? "var(--color-primary)" : "rgba(0,0,0,0.06)",
                    transition: "all 0.3s"
                  }}
                />
              ))}
            </div>
          </div>

          {showError && (
            <div className="glass-card" style={{ padding: "10px 16px", marginBottom: 20, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--color-rose)", fontSize: "0.85rem", fontWeight: 600 }}>
              * Please fill out all required fields before proceeding.
            </div>
          )}

          {/* STEP 1: IDENTITY & ORIGINS */}
          {onboardingStep === 1 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: "1.1rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <User size={18} color="var(--color-primary)" />
                Personal Profile & Origins
              </h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="user-name">First Name</label>
                <input
                  type="text"
                  id="user-name"
                  className="form-input"
                  placeholder="e.g. Rajesh"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="user-age">Age</label>
                  <input
                    type="number"
                    id="user-age"
                    className="form-input"
                    min="1"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="user-country">Country</label>
                  <select
                    id="user-country"
                    className="form-input"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setCustomCountry("");
                      setSelectedBornCity("");
                      setCustomBornCity("");
                      setSelectedLivingCity("");
                      setCustomLivingCity("");
                    }}
                    style={{ background: "#ffffff", appearance: "auto" }}
                  >
                    <option value="">-- Select Country --</option>
                    {Object.keys(countryCityData).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  
                  {selectedCountry === "Other" && (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter country name"
                      style={{ marginTop: 8 }}
                      required
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {selectedCountry && (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="born-city">Born City</label>
                    {selectedCountry !== "Other" ? (
                      <>
                        <select
                          id="born-city"
                          className="form-input"
                          value={selectedBornCity}
                          onChange={(e) => {
                            setSelectedBornCity(e.target.value);
                            setCustomBornCity("");
                          }}
                          style={{ background: "#ffffff", appearance: "auto" }}
                        >
                          <option value="">-- Select Born City --</option>
                          {countryCityData[selectedCountry]?.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {selectedBornCity === "Other" && (
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Enter born city name"
                            style={{ marginTop: 8 }}
                            required
                            value={customBornCity}
                            onChange={(e) => setCustomBornCity(e.target.value)}
                          />
                        )}
                      </>
                    ) : (
                      <input
                        type="text"
                        id="born-city"
                        className="form-input"
                        placeholder="e.g. Madurai"
                        required
                        value={customBornCity}
                        onChange={(e) => setCustomBornCity(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="living-city">Living City</label>
                    {selectedCountry !== "Other" ? (
                      <>
                        <select
                          id="living-city"
                          className="form-input"
                          value={selectedLivingCity}
                          onChange={(e) => {
                            setSelectedLivingCity(e.target.value);
                            setCustomLivingCity("");
                          }}
                          style={{ background: "#ffffff", appearance: "auto" }}
                        >
                          <option value="">-- Select Living City --</option>
                          {countryCityData[selectedCountry]?.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {selectedLivingCity === "Other" && (
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Enter living city name"
                            style={{ marginTop: 8 }}
                            required
                            value={customLivingCity}
                            onChange={(e) => setCustomLivingCity(e.target.value)}
                          />
                        )}
                      </>
                    ) : (
                      <input
                        type="text"
                        id="living-city"
                        className="form-input"
                        placeholder="e.g. Chennai"
                        required
                        value={customLivingCity}
                        onChange={(e) => setCustomLivingCity(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Biological Gender</label>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <button
                    type="button"
                    className={`gender-toggle-btn ${gender === "female" ? "active" : ""}`}
                    onClick={() => setGender("female")}
                    style={{ display: "flex", padding: "12px", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <span>♀️ Female</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`gender-toggle-btn ${gender === "male" ? "active" : ""}`}
                    onClick={() => setGender("male")}
                    style={{ display: "flex", padding: "12px", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <span>♂️ Male</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Next Step
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION & LANGUAGE */}
          {onboardingStep === 2 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: "1.1rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={18} color="var(--color-primary)" />
                Education & Languages
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="user-edu">Completed Education Level</label>
                <select 
                  id="user-edu" 
                  className="form-input"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  style={{ background: "#ffffff", appearance: "auto" }}
                >
                  <option value="">-- Select Education --</option>
                  <option value="High School">High School / Secondary</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate / Ph.D.">Doctorate / Ph.D.</option>
                  <option value="Self-educated">Self-educated / Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="known-lang">Languages You Speak</label>
                <select
                  id="known-lang"
                  className="form-input"
                  value={selectedKnownLang}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedKnownLang(val);
                    if (val !== "Other") {
                      setKnownLanguages(val);
                    } else {
                      setKnownLanguages("");
                    }
                  }}
                  style={{ background: "#ffffff", appearance: "auto" }}
                >
                  <option value="">-- Select Language --</option>
                  {LANGUAGES_LIST.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                
                {selectedKnownLang === "Other" && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter language name"
                    style={{ marginTop: 8 }}
                    required
                    value={knownLanguages}
                    onChange={(e) => setKnownLanguages(e.target.value)}
                  />
                )}
              </div>

              <div className="form-group" style={{ marginTop: 24 }}>
                <label className="form-label" htmlFor="study-lang">Languages Studied / Formally Learnt</label>
                <select
                  id="study-lang"
                  className="form-input"
                  value={selectedStudyLang}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedStudyLang(val);
                    if (val !== "Other") {
                      setLanguagesStudied(val);
                    } else {
                      setLanguagesStudied("");
                    }
                  }}
                  style={{ background: "#ffffff", appearance: "auto" }}
                >
                  <option value="">-- Select Language --</option>
                  {LANGUAGES_LIST.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                
                {selectedStudyLang === "Other" && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter studied language name"
                    style={{ marginTop: 8 }}
                    required
                    value={languagesStudied}
                    onChange={(e) => setLanguagesStudied(e.target.value)}
                  />
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Next Step
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FAMILY & WEALTH STATUS */}
          {onboardingStep === 3 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: "1.1rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} color="var(--color-primary)" />
                Family Structure & Economic Standing
              </h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="user-siblings">No. of Siblings</label>
                  <input
                    type="number"
                    id="user-siblings"
                    className="form-input"
                    min="0"
                    max="20"
                    required
                    value={siblings}
                    onChange={(e) => setSiblings(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Are Parents Educated?</label>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button
                      type="button"
                      className={`gender-toggle-btn ${parentsEducated === "yes" ? "active" : ""}`}
                      onClick={() => setParentsEducated("yes")}
                      style={{ padding: "10px" }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`gender-toggle-btn ${parentsEducated === "no" ? "active" : ""}`}
                      onClick={() => setParentsEducated("no")}
                      style={{ padding: "10px" }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Socioeconomic Standing</label>
                <div className="form-grid-2" style={{ gap: 10, marginTop: 6 }}>
                  {(["poor", "medium", "rich", "millionaire", "billionaire"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`gender-toggle-btn ${wealthStatus === status ? "active" : ""}`}
                      onClick={() => setWealthStatus(status)}
                      style={{ textTransform: "capitalize", padding: "12px 6px" }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Next Step
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LIFE EXPERIENCES & HEALTH */}
          {onboardingStep === 4 && (
            <form onSubmit={handleStartQuiz} className="animate-fade-in">
              <h3 style={{ fontSize: "1.1rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <HeartHandshake size={18} color="var(--color-primary)" />
                Life Experiences & Variance
              </h3>

              {/* Conditional Love Failure Field based on age (only asked if age >= 16) */}
              {age >= 16 ? (
                <div className="form-group">
                  <label className="form-label">Have you ever experienced a Love Failure / Heartbreak?</label>
                  <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    {(["yes", "no", "prefer_not_to_say"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`gender-toggle-btn ${loveFailure === opt ? "active" : ""}`}
                        onClick={() => setLoveFailure(opt)}
                        style={{ textTransform: "capitalize", padding: "10px 4px", fontSize: "0.85rem" }}
                      >
                        {opt.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass-card" style={{ padding: 14, marginBottom: 20, fontSize: "0.85rem", color: "var(--text-muted)", background: "rgba(0,0,0,0.01)" }}>
                  ℹ️ Under-age settings applied. Romantic heartbreak diagnostic bypass is active.
                </div>
              )}

              {/* Disability Field */}
              <div className="form-group">
                <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Do you have any biological or physical disabilities?</span>
                  <input
                    type="checkbox"
                    id="disability-toggle"
                    checked={hasDisability}
                    onChange={(e) => {
                      setHasDisability(e.target.checked);
                      if (!e.target.checked) setDisabilityDetail("");
                    }}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                </label>
                
                {hasDisability && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Describe your disability (e.g. Visual Impairment, Hearing)"
                    style={{ marginTop: 8 }}
                    required={hasDisability}
                    value={disabilityDetail}
                    onChange={(e) => setDisabilityDetail(e.target.value)}
                  />
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button type="submit" className="btn btn-accent btn-glow">
                  Initialize Personality Engine
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    );
  }

  // Render Likert Quiz Statements (unchanged, advances as usual)
  return (
    <div className="container quiz-section animate-fade-in">
      {/* Progress Meta */}
      <div className="quiz-progress-container">
        <div className="quiz-progress-meta">
          <span>{currentQuestion.categoryLabel}</span>
          <span>
            Statement {currentIdx + 1} of {questions.length} ({answeredCount} answered)
          </span>
        </div>
        <div className="quiz-progress-bar-bg">
          <div 
            className="quiz-progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Likert Question Card */}
      <div className="glass-card quiz-card" style={{ padding: "50px 40px", textAlign: "center" }}>
        <span className="quiz-category-tag">
          {currentQuestion.category}
        </span>
        
        <h2 className="quiz-question-text" style={{ fontSize: "1.6rem", minHeight: 80, lineHeight: 1.5 }}>
          "{currentQuestion.statement}"
        </h2>
        
        {/* Likert 1-5 rating scale */}
        <div style={{ margin: "40px 0" }}>
          {/* Numbers Circles */}
          <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 450, margin: "0 auto", gap: 10 }}>
            {likertOptions.map((opt) => {
              const isSelected = selectedRating === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`btn ${isSelected ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => handleSelectRating(opt.value)}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    padding: 0,
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    border: isSelected ? "none" : "1px solid var(--border-glass)",
                    transition: "all 0.2s"
                  }}
                  title={opt.label}
                >
                  {opt.value}
                </button>
              );
            })}
          </div>

          {/* Label Anchors */}
          <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 450, margin: "14px auto 0", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
            <span>Strongly Disagree</span>
            <span>Neutral</span>
            <span>Strongly Agree</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="quiz-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            className="btn btn-secondary"
            onClick={handleNext}
            disabled={selectedRating === undefined}
            style={{ 
              opacity: selectedRating === undefined ? 0.4 : 1, 
              cursor: selectedRating === undefined ? "not-allowed" : "pointer" 
            }}
          >
            Next
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className="btn btn-accent btn-glow"
            onClick={handleSubmit}
            disabled={!isQuizComplete}
            style={{ 
              opacity: !isQuizComplete ? 0.5 : 1, 
              cursor: !isQuizComplete ? "not-allowed" : "pointer" 
            }}
          >
            Compute My Soul Matrix
            <CheckCircle2 size={16} />
          </button>
        )}
      </div>

      {/* Cancel quiz */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button 
          style={{ 
            background: "none", 
            border: "none", 
            color: "var(--text-muted)", 
            cursor: "pointer", 
            fontSize: "0.9rem",
            textDecoration: "underline" 
          }}
          onClick={() => onNavigate("home")}
        >
          Cancel quiz and return Home
        </button>
      </div>
    </div>
  );
}
