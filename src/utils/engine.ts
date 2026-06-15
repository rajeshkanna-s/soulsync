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

  return {
    mindMatch,
    emotionalFit,
    communication,
    lifeVision,
    relationshipStyle,
    overallScore,
    label,
    color,
    insights: insights.length > 0 ? insights : ["Stable alignment in basic values and daily habits."]
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
