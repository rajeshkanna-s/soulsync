import { questions } from "../data/questions";
import { personalityTypes } from "../data/personalityTypes";

export interface UserDemographics {
  name: string;
  age: number;
  gender: "male" | "female";
  bornCity: string;
  livingCity: string;
  knownLanguages: string;
  education: string;
  country: string;
  siblings: number;
  languagesStudied: string;
  parentsEducated: "yes" | "no";
  wealthStatus: "poor" | "medium" | "rich" | "millionaire" | "billionaire";
  loveFailure: "yes" | "no" | "prefer_not_to_say" | "not_applicable";
  disability: string;
}

export interface ScoreProfile {
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
  typeScores: Record<string, number>; // Distance scores (lower is closer)
  demographics?: UserDemographics;
}

export interface MatchArchetype {
  name: string;
  emoji: string;
  description: string;
  strengths: string[];
}

export interface RelationshipExercise {
  title: string;
  description: string;
  actionSteps: string[];
  duration: string;
}

export interface CompatibilityBreakdown {
  mindMatch: number;      // Openness & Conscientiousness
  emotionalFit: number;   // Emotionality & EQ
  communication: number;  // Extraversion
  lifeVision: number;     // Conscientiousness & Honesty
  relationshipStyle: number; // Conflict & Agreeableness
  overallScore: number;
  label: "Twin Souls ✨" | "Deep Connection 💞" | "Strong Potential 🌱" | "Growth Partners 🤝";
  color: string;
  insights: string[]; // Explanations on why they matched
  archetype: MatchArchetype;
  exercises: RelationshipExercise[];
}

export function calculateMatchArchetype(
  dimA: ScoreProfile["dimensions"],
  dimB: ScoreProfile["dimensions"]
): MatchArchetype {
  const avg = (key: keyof ScoreProfile["dimensions"]) => (dimA[key] + dimB[key]) / 2;
  
  // 1. Resilient Empaths: High EQ & High Agreeableness
  if (avg("eq") >= 3.7 && avg("agreeableness") >= 3.7) {
    return {
      name: "The Resilient Empaths",
      emoji: "🌸",
      description: "Deeply connected through emotional intelligence, active listening, and heart-centered support. You read each other's feelings before speaking.",
      strengths: ["Unmatched emotional support", "Deep active listening", "Gentle boundary management"]
    };
  }
  
  // 2. Safe Haven: High Agreeableness & Low Emotionality
  if (avg("agreeableness") >= 3.7 && avg("emotionality") <= 2.8) {
    return {
      name: "The Safe Haven (Calm Anchor)",
      emoji: "⚓",
      description: "A connection built on extreme psychological safety, calm emotional anchors, and deep comfort. You offer each other a quiet harbor from life's storms.",
      strengths: ["High emotional safety", "Low reactivity to stress", "Exceptional patience during tension"]
    };
  }

  // 3. Visionary Co-Pilots: High Conscientiousness & High Openness
  if (avg("conscientiousness") >= 3.7 && avg("openness") >= 3.7) {
    return {
      name: "The Visionary Co-Pilots",
      emoji: "🚀",
      description: "Driven by shared long-term planning, high ambition, and creative exploration. You challenge each other to think bigger and build a shared empire.",
      strengths: ["Goal-oriented synergy", "Shared love for learning/creativity", "Strong future planning focus"]
    };
  }

  // 4. Passionate Sparks: High Extraversion & High Emotionality
  if (avg("extraversion") >= 3.7 && avg("emotionality") >= 3.4) {
    return {
      name: "The Passionate Sparks",
      emoji: "🔥",
      description: "An intense, high-energy relationship filled with social active engagement, adventure, and emotional expressivity. Life is never boring with you two.",
      strengths: ["High energy and fun", "Intense chemical attraction", "Strong expressive support"]
    };
  }

  // 5. Independent Co-existents: Low Conflict Pursuit & High Social / Boundary Gap
  if (avg("conflict") <= 2.8 && Math.abs(dimA.extraversion - dimB.extraversion) >= 1.2) {
    return {
      name: "The Independent Co-existents",
      emoji: "🌌",
      description: "A relationship that highly respects personal sovereignty, personal space, and distinct independent interests while retaining a solid bond.",
      strengths: ["Zero codependency", "Strong individual growth", "Respect for boundary structures"]
    };
  }

  // 6. Balanced Harmony (Fallback)
  return {
    name: "The Balanced Harmony",
    emoji: "☯️",
    description: "A complementary partnership where one partner's quiet stability grounds the other's active spark, resulting in a beautifully balanced life.",
    strengths: ["Complementary skillsets", "Mutual grounding effect", "Smooth division of labor"]
  };
}

export function generateRelationalAdvice(
  dimA: ScoreProfile["dimensions"],
  dimB: ScoreProfile["dimensions"]
): RelationshipExercise[] {
  const gaps = [
    { key: "honesty", value: Math.abs(dimA.honesty - dimB.honesty) },
    { key: "emotionality", value: Math.abs(dimA.emotionality - dimB.emotionality) },
    { key: "extraversion", value: Math.abs(dimA.extraversion - dimB.extraversion) },
    { key: "agreeableness", value: Math.abs(dimA.agreeableness - dimB.agreeableness) },
    { key: "conscientiousness", value: Math.abs(dimA.conscientiousness - dimB.conscientiousness) },
    { key: "openness", value: Math.abs(dimA.openness - dimB.openness) },
    { key: "eq", value: Math.abs(dimA.eq - dimB.eq) },
    { key: "conflict", value: Math.abs(dimA.conflict - dimB.conflict) },
  ];

  // Sort gaps in descending order
  gaps.sort((a, b) => b.value - a.value);

  const exercises: RelationshipExercise[] = [];
  const addedKeys = new Set<string>();

  const addExercise = (key: string) => {
    if (addedKeys.has(key)) return;
    addedKeys.add(key);

    if (key === "conflict") {
      exercises.push({
        title: "The 20-Minute Pause Rule",
        description: "Bridges the gap between immediate-pursuit resolution and space-seeking conflict styles. This prevents feeling overwhelmed (flooded) or shut out.",
        actionSteps: [
          "When tension rises, either partner can request a '20-minute pause' using a gentle keyword.",
          "During the pause, separate into different rooms and do breathing exercises or quiet activities (no dwelling on arguments).",
          "Re-convene after exactly 20 minutes to resolve the issue with lowered heart rates."
        ],
        duration: "20 minutes per event"
      });
    } else if (key === "extraversion") {
      exercises.push({
        title: "Social Battery Alignment",
        description: "Balancing the social extrovert's outgoing nature with the introvert's need to recharge in quiet spaces.",
        actionSteps: [
          "Co-plan the upcoming week: label events as 'High Social' or 'Quiet Recharge'.",
          "Agree on an early exit strategy or a quiet corner code before entering high-social environments.",
          "Designate one weekend night as a zero-outside-interaction date night."
        ],
        duration: "10 minutes weekly planning"
      });
    } else if (key === "conscientiousness") {
      exercises.push({
        title: "The Spontaneity & Chore Swap",
        description: "Fosters appreciation for one partner's highly organized planning vs. the other partner's spontaneous flexibility.",
        actionSteps: [
          "The highly structured partner hands over one minor planning task (e.g. weekend lunch) to the spontaneous partner to decide on the fly.",
          "The spontaneous partner commits to updating one shared calendar event or checklist item 48 hours in advance.",
          "Acknowledge the effort in accommodating each other's pace without criticism."
        ],
        duration: "Ongoing (Weekly Check-in)"
      });
    } else if (key === "eq") {
      exercises.push({
        title: "Active Listening Huddle",
        description: "Develops deeper mutual validation and reduces conversational jumping to solve problems instead of listening.",
        actionSteps: [
          "Partner A shares a current stressor or feeling for 3 minutes without interruption.",
          "Partner B mirrors back what they heard starting with: 'It sounds like you felt...' without offering solutions.",
          "Switch roles and repeat, focusing entirely on empathy and reassurance."
        ],
        duration: "10 minutes"
      });
    } else if (key === "openness") {
      exercises.push({
        title: "The Novelty Lottery",
        description: "Aligns the routine-loving partner with the experience-seeking partner through mutual interest exploration.",
        actionSteps: [
          "Write 3 new activities on paper slips (1 adventurous, 1 creative, 1 cozy/simple).",
          "Draw one slip blindly every fortnight and complete it together.",
          "Share what you enjoyed and what was out of your comfort zone."
        ],
        duration: "2-3 hours bi-weekly"
      });
    } else if (key === "emotionality") {
      exercises.push({
        title: "The Anxiety/Stress Shield",
        description: "Helps prevent high emotional reactivity in one partner from triggering stress mirroring in the other.",
        actionSteps: [
          "Use a rating scale (1-10) to declare stress levels when arriving home: e.g. 'I am at an 8 today'.",
          "The less-stressed partner steps in to handle immediate logistics, acting as a 'shield' for 1 hour.",
          "Establish that a partner's stress is not a reflection of the relationship's stability."
        ],
        duration: "Daily transition periods"
      });
    } else if (key === "honesty") {
      exercises.push({
        title: "Trust Sandbox / Safe Disclosure",
        description: "Provides a zero-judgment zone for sharing hidden preferences, minor frustrations, or status worries.",
        actionSteps: [
          "Sit face-to-face and start with: 'I want to share something transparently because I trust you.'",
          "Reveal a minor vulnerability or preference (e.g., how you feel about chore delegation).",
          "The listening partner responds with a simple thank you and validation, with absolutely no retaliation."
        ],
        duration: "15 minutes"
      });
    } else if (key === "agreeableness") {
      exercises.push({
        title: "The Win-Win Tradeoff Game",
        description: "Ensures that the accommodating partner doesn't harbor silent resentment while the assertive partner gets their way.",
        actionSteps: [
          "For a pending decision (e.g. vacation or furniture), list what each partner values most.",
          "Assign a point system: Partner A gets their top choice, but Partner B gets veto power or selection of the next two decisions.",
          "Explicitly voice: 'Thank you for compromising on this, let's make sure we balance it next time.'"
        ],
        duration: "15-30 minutes when deciding"
      });
    }
  };

  // Add exercises for the top gaps
  for (const gap of gaps) {
    addExercise(gap.key);
    if (exercises.length >= 3) break;
  }

  // Fallbacks if we still don't have 3 exercises
  const allKeys = ["conflict", "extraversion", "conscientiousness", "eq", "openness", "emotionality", "honesty", "agreeableness"];
  for (const k of allKeys) {
    if (exercises.length >= 3) break;
    addExercise(k);
  }

  return exercises;
}

// Ideal coordinate profiles for each of the 8 personality types (on 1.0 - 5.0 scale)
const idealProfiles: Record<string, ScoreProfile["dimensions"]> = {
  warrior: { honesty: 3.5, emotionality: 2.5, extraversion: 4.2, agreeableness: 2.8, conscientiousness: 4.5, openness: 3.5, eq: 3.2, conflict: 4.0 },
  feeler: { honesty: 4.5, emotionality: 4.5, extraversion: 2.2, agreeableness: 4.8, conscientiousness: 2.5, openness: 4.2, eq: 4.8, conflict: 3.8 },
  thinker: { honesty: 3.8, emotionality: 2.0, extraversion: 1.8, agreeableness: 2.6, conscientiousness: 4.8, openness: 4.5, eq: 3.0, conflict: 2.5 },
  nurturer: { honesty: 4.7, emotionality: 3.8, extraversion: 2.4, agreeableness: 4.7, conscientiousness: 4.2, openness: 3.0, eq: 4.6, conflict: 2.8 },
  creator: { honesty: 4.2, emotionality: 4.0, extraversion: 3.0, agreeableness: 4.0, conscientiousness: 2.2, openness: 4.8, eq: 4.2, conflict: 3.5 },
  achiever: { honesty: 2.8, emotionality: 2.2, extraversion: 4.4, agreeableness: 2.5, conscientiousness: 4.9, openness: 3.2, eq: 3.1, conflict: 4.2 },
  dreamer: { honesty: 4.5, emotionality: 3.5, extraversion: 1.9, agreeableness: 4.5, conscientiousness: 2.8, openness: 4.6, eq: 4.5, conflict: 2.6 },
  spark: { honesty: 3.8, emotionality: 3.0, extraversion: 4.8, agreeableness: 4.2, conscientiousness: 2.1, openness: 4.4, eq: 3.5, conflict: 4.1 }
};

// Calculates the personality profile based on Likert answers (questionId -> rating 1 to 5)
export function calculateQuizResults(answers: Record<number, number>): ScoreProfile {
  const dimensionSums = {
    honesty: 0,
    emotionality: 0,
    extraversion: 0,
    agreeableness: 0,
    conscientiousness: 0,
    openness: 0,
    eq: 0,
    conflict: 0
  };

  const dimensionCounts = {
    honesty: 0,
    emotionality: 0,
    extraversion: 0,
    agreeableness: 0,
    conscientiousness: 0,
    openness: 0,
    eq: 0,
    conflict: 0
  };

  // Process answers
  questions.forEach(q => {
    const rating = answers[q.id]; // 1 to 5
    if (rating !== undefined && rating >= 1 && rating <= 5) {
      dimensionSums[q.category] += rating;
      dimensionCounts[q.category] += 1;
    }
  });

  // Calculate averages for dimensions (range 1.0 to 5.0)
  const dimensions = {
    honesty: dimensionCounts.honesty > 0 ? dimensionSums.honesty / dimensionCounts.honesty : 3.0,
    emotionality: dimensionCounts.emotionality > 0 ? dimensionSums.emotionality / dimensionCounts.emotionality : 3.0,
    extraversion: dimensionCounts.extraversion > 0 ? dimensionSums.extraversion / dimensionCounts.extraversion : 3.0,
    agreeableness: dimensionCounts.agreeableness > 0 ? dimensionSums.agreeableness / dimensionCounts.agreeableness : 3.0,
    conscientiousness: dimensionCounts.conscientiousness > 0 ? dimensionSums.conscientiousness / dimensionCounts.conscientiousness : 3.0,
    openness: dimensionCounts.openness > 0 ? dimensionSums.openness / dimensionCounts.openness : 3.0,
    eq: dimensionCounts.eq > 0 ? dimensionSums.eq / dimensionCounts.eq : 3.0,
    conflict: dimensionCounts.conflict > 0 ? dimensionSums.conflict / dimensionCounts.conflict : 3.0
  };

  // Calculate distance (Euclidean) from ideal profile for each of the 8 types
  const typeDistances: Record<string, number> = {};
  
  Object.entries(idealProfiles).forEach(([typeId, ideal]) => {
    const distanceSq = 
      Math.pow(dimensions.honesty - ideal.honesty, 2) +
      Math.pow(dimensions.emotionality - ideal.emotionality, 2) +
      Math.pow(dimensions.extraversion - ideal.extraversion, 2) +
      Math.pow(dimensions.agreeableness - ideal.agreeableness, 2) +
      Math.pow(dimensions.conscientiousness - ideal.conscientiousness, 2) +
      Math.pow(dimensions.openness - ideal.openness, 2) +
      Math.pow(dimensions.eq - ideal.eq, 2) +
      Math.pow(dimensions.conflict - ideal.conflict, 2);
    
    // Lower score is closer (better match)
    typeDistances[typeId] = Math.sqrt(distanceSq);
  });

  // Sort by closest (lowest distance)
  const sortedTypes = Object.entries(typeDistances)
    .sort((a, b) => a[1] - b[1]);

  const primaryTypeId = sortedTypes[0]?.[0] || "thinker";
  const secondaryTypeId = sortedTypes[1]?.[0] || "dreamer";

  return {
    primaryTypeId,
    secondaryTypeId,
    dimensions,
    typeScores: typeDistances
  };
}

// Computes the compatibility between two profiles based on their 8 dimension coordinates
export function calculateCompatibility(
  dimA: ScoreProfile["dimensions"],
  dimB: { honesty: number; emotionality: number; extraversion: number; agreeableness: number; conscientiousness: number; openness: number; eq: number; conflict: number }
): CompatibilityBreakdown {
  // Diff is on a scale of 0 to 4 (since values are 1.0 to 5.0)
  // Compatibility is 100 - (diff / 4) * 100
  const calcDimCompat = (valA: number, valB: number) => {
    const diff = Math.abs(valA - valB);
    const percentage = 100 - (diff / 4.0) * 100;
    return Math.max(0, Math.min(100, Math.round(percentage)));
  };

  // Base compatibility across categories
  const honestyMatch = calcDimCompat(dimA.honesty, dimB.honesty);
  const emotionalityMatch = calcDimCompat(dimA.emotionality, dimB.emotionality);
  const extraversionMatch = calcDimCompat(dimA.extraversion, dimB.extraversion);
  const agreeablenessMatch = calcDimCompat(dimA.agreeableness, dimB.agreeableness);
  const conscientiousnessMatch = calcDimCompat(dimA.conscientiousness, dimB.conscientiousness);
  const opennessMatch = calcDimCompat(dimA.openness, dimB.openness);
  const eqMatch = calcDimCompat(dimA.eq, dimB.eq);
  const conflictMatch = calcDimCompat(dimA.conflict, dimB.conflict);

  const mindMatch = Math.round((opennessMatch + conscientiousnessMatch) / 2);
  const emotionalFit = Math.round((emotionalityMatch + eqMatch) / 2);
  const communication = extraversionMatch;
  const lifeVision = Math.round((conscientiousnessMatch + honestyMatch) / 2);
  const relationshipStyle = Math.round((conflictMatch + agreeablenessMatch) / 2);

  // Raw average score
  let baseScore = Math.round(
    (honestyMatch + emotionalityMatch + extraversionMatch + agreeablenessMatch + conscientiousnessMatch + opennessMatch + eqMatch + conflictMatch) / 8
  );

  const insights: string[] = [];

  // --- Matchmaking Compatibility Rules & Adjustments ---
  
  // Rule 1: High Extraversion + High Introversion -> Complementary (+8%)
  const highExtA = dimA.extraversion >= 4.0;
  const lowExtA = dimA.extraversion <= 2.2;
  const highExtB = dimB.extraversion >= 4.0;
  const lowExtB = dimB.extraversion <= 2.2;
  if ((highExtA && lowExtB) || (lowExtA && highExtB)) {
    baseScore += 8;
    insights.push("Complementary Energies: Extraversion balances Introversion, grounding your social dynamics.");
  }

  // Rule 2: High Agreeableness + High Agreeableness -> Highly Harmonious (+10%)
  if (dimA.agreeableness >= 4.0 && dimB.agreeableness >= 4.0) {
    baseScore += 10;
    insights.push("Highly Harmonious: Both place high value on empathy, mutual support, and cooperation.");
  }

  // Rule 3: High Emotionality + High Emotionality -> Stress Vulnerability (-10%)
  if (dimA.emotionality >= 4.0 && dimB.emotionality >= 4.0) {
    baseScore -= 10;
    insights.push("Emotional Stress Mirroring: Dual high emotionality might amplify anxiety and anxiety-dependence during relationship hurdles.");
  }

  // Rule 4: High Conscientiousness + Low Conscientiousness -> Friction Potential (-8%)
  const highConA = dimA.conscientiousness >= 4.0;
  const lowConA = dimA.conscientiousness <= 2.2;
  const highConB = dimB.conscientiousness >= 4.0;
  const lowConB = dimB.conscientiousness <= 2.2;
  if ((highConA && lowConB) || (lowConA && highConB)) {
    baseScore -= 8;
    insights.push("Friction Potential: Differing levels of conscientiousness might require compromises on structure and spontaneous actions.");
  }

  // Rule 5: High EQ + High EQ -> Strong Foundation (+12%)
  if (dimA.eq >= 4.0 && dimB.eq >= 4.0) {
    baseScore += 12;
    insights.push("Exceptional Emotional Core: Dual high EQ forms a resilient foundation for long-term understanding.");
  }

  // Rule 6: High Honesty-Humility + High Honesty-Humility -> Sincere & Faithful (+12%)
  if (dimA.honesty >= 4.0 && dimB.honesty >= 4.0) {
    baseScore += 12;
    insights.push("Authentic Connection: Strong shared Honesty-Humility fosters deep trust, mutual respect, and absolute transparency.");
  }

  // Rule 7: Low Honesty-Humility warning (-12%)
  if (dimA.honesty <= 2.2 || dimB.honesty <= 2.2) {
    baseScore -= 12;
    insights.push("Vulnerable Trust: A discrepancy or low scores in Honesty-Humility requires caution around transparency and status boundaries.");
  }

  // Final score clamping
  const overallScore = Math.max(30, Math.min(99, baseScore));

  let label: CompatibilityBreakdown["label"] = "Growth Partners 🤝";
  let color = "#726c64"; // Slate

  if (overallScore >= 90) {
    label = "Twin Souls ✨";
    color = "#c27d38"; // Warm gold
  } else if (overallScore >= 75) {
    label = "Deep Connection 💞";
    color = "#ec4899"; // Pink
  } else if (overallScore >= 60) {
    label = "Strong Potential 🌱";
    color = "#059669"; // Emerald
  } else {
    label = "Growth Partners 🤝";
    color = "#c27d38";
  }

  const archetype = calculateMatchArchetype(dimA, dimB);
  const exercises = generateRelationalAdvice(dimA, dimB);

  return {
    mindMatch,
    emotionalFit,
    communication,
    lifeVision,
    relationshipStyle,
    overallScore,
    label,
    color,
    insights: insights.length > 0 ? insights : ["Stable alignment in basic values and daily habits."],
    archetype,
    exercises
  };
}

// Generates a personalized background character narrative based on demographics and scoring coordinates
export function generateBackgroundNarrative(
  demographics: UserDemographics,
  dimensions: ScoreProfile["dimensions"]
): string[] {
  const narrative: string[] = [];

  // Paragraph 1: On Identity & Geographic Adaptability
  let p1 = `As a ${demographics.age}-year-old ${demographics.gender === "male" ? "man" : "woman"} navigating life in ${demographics.livingCity}, ${demographics.country}, your developmental landscape shows unique markers. `;
  
  if (demographics.bornCity.toLowerCase().trim() !== demographics.livingCity.toLowerCase().trim()) {
    p1 += `Having migrated from your birthplace of ${demographics.bornCity} to ${demographics.livingCity}, your character has been forged in the laboratory of change. This geographic shift correlates with your score of ${dimensions.openness.toFixed(1)} on Openness to Experience, highlighting high self-reliance, tolerance for ambiguity, and adaptability in unfamiliar environments. `;
  } else {
    p1 += `Your rooted presence in ${demographics.bornCity}, remaining connected to your place of birth, has anchored your personality with a stable sense of community, tradition, and local belonging. This grounds your emotional base, allowing you to seek relational security with a strong sense of place. `;
  }

  const langCount = demographics.knownLanguages.split(",").length;
  if (langCount > 1) {
    p1 += `Speaking multiple languages (${demographics.knownLanguages}) has expanded your cognitive flexibility and empathy. Multilingual minds naturally score higher on perspective-taking, which is reflected in your high communication and emotional intelligence (EQ: ${dimensions.eq.toFixed(1)}). `;
  }
  narrative.push(p1);

  // Paragraph 2: On Family Structure & Socioeconomic Upbringing
  let p2 = `Your childhood dynamics and family environment played a major role in mapping your social blueprints. `;
  
  if (demographics.siblings === 0) {
    p2 += `Growing up as an only child, you were required to build high self-reliance and introspective depth from an early age, making you comfortable with solitude. `;
  } else if (demographics.siblings === 1) {
    p2 += `Growing up with a sibling, you engaged in early one-on-one dynamics that helped shape your sharing habits and emotional reactivity. `;
  } else {
    p2 += `Growing up in a larger household with ${demographics.siblings} siblings, your environment was a continuous negotiation space. This forced you to develop social compromises, helping shape your Agreeableness (${dimensions.agreeableness.toFixed(1)}) and Conflict Handling (${dimensions.conflict.toFixed(1)}). `;
  }

  if (demographics.parentsEducated === "yes") {
    p2 += `Having educated parents established a structured, logic-oriented framework in your early life, fostering high goal-directed Conscientiousness (${dimensions.conscientiousness.toFixed(1)}). `;
  } else {
    p2 += `Growing up with self-made or non-academic parents has instilled in you a raw, self-directed street adaptability and resilient work ethic, teaching you to pave your own pathways. `;
  }

  if (["poor", "medium"].includes(demographics.wealthStatus)) {
    p2 += `Your experience within a ${demographics.wealthStatus} economic background has cultivated deep empathy for community struggles, financial mindfulness, and a protective value on security. `;
  } else {
    p2 += `Growing up in an affluent/wealthy environment (${demographics.wealthStatus}) has given you high social confidence, early safety nets, and ease with risk-taking, though it places a unique focus on maintaining Modesty in your daily actions. `;
  }
  narrative.push(p2);

  // Paragraph 3: On Personal Vulnerabilities & Life Adjustments
  let p3 = "";
  if (demographics.loveFailure === "yes") {
    p3 += `On life experiences, having navigated heartbreak or a love failure has added layers of emotional maturity to your relational style. While it has deepened your Empathy and EQ, it has also naturally placed protective boundaries around your vulnerability, urging you to seek relationships with verified transparency (Honesty-Humility: ${dimensions.honesty.toFixed(1)}). `;
  } else if (demographics.loveFailure === "no" && demographics.age >= 16) {
    p3 += `Having walked through life without experiencing love failures or devastating heartbreak allows you to approach relationships with high emotional optimism, although it means you must intentionally practice anticipating your partner's complex vulnerability needs. `;
  }

  if (demographics.disability && demographics.disability.toLowerCase() !== "none" && demographics.disability.trim() !== "") {
    p3 += `In addition, navigating life with a disability or chronic health challenge (${demographics.disability}) has built immense emotional resilience and self-awareness. This journey frequently deepens a person's empathy for others' struggles, shifting your love language channels to value physical acts of service and quiet, validating support. `;
  }

  if (p3) {
    narrative.push(p3);
  } else {
    narrative.push(`In your journey, your specific combinations of education (${demographics.education}) and linguistic studies (${demographics.languagesStudied}) have fostered a balanced, intellectual view of human personality, preparing you for cooperative relationship synchronizations.`);
  }

  return narrative;
}
