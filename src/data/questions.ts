export interface LikertQuestion {
  id: number;
  category: "honesty" | "emotionality" | "extraversion" | "agreeableness" | "conscientiousness" | "openness" | "eq" | "conflict";
  categoryLabel: string;
  statement: string;
}

export const questions: LikertQuestion[] = [
  // --- HONESTY-HUMILITY (H) ---
  {
    id: 1,
    category: "honesty",
    categoryLabel: "Honesty-Humility",
    statement: "I would never flatter or deceive someone to get what I want, even if it could help me achieve an important goal."
  },
  {
    id: 2,
    category: "honesty",
    categoryLabel: "Honesty-Humility",
    statement: "I place little value on having expensive luxury items, high social status, or showing off wealth."
  },
  {
    id: 3,
    category: "honesty",
    categoryLabel: "Honesty-Humility",
    statement: "I consider myself an ordinary person and do not feel entitled to special privileges or treatment compared to others."
  },

  // --- EMOTIONALITY (E) ---
  {
    id: 4,
    category: "emotionality",
    categoryLabel: "Emotionality & Sentimentality",
    statement: "I tend to feel anxious, worry about potential problems, and need emotional reassurance from others when stressed."
  },
  {
    id: 5,
    category: "emotionality",
    categoryLabel: "Emotionality & Sentimentality",
    statement: "I form very deep, sentimental attachments to people and feel strong empathy for others' emotional pain."
  },
  {
    id: 6,
    category: "emotionality",
    categoryLabel: "Emotionality & Sentimentality",
    statement: "I rely heavily on sharing my concerns with family or partners to get through difficult emotional moments."
  },

  // --- EXTRAVERSION (X) ---
  {
    id: 7,
    category: "extraversion",
    categoryLabel: "Extraversion & Energy",
    statement: "I feel confident leading groups, speaking in public, and being the center of attention in social settings."
  },
  {
    id: 8,
    category: "extraversion",
    categoryLabel: "Extraversion & Energy",
    statement: "I genuinely enjoy social gatherings, parties, and meeting new people rather than spending time alone."
  },
  {
    id: 9,
    category: "extraversion",
    categoryLabel: "Extraversion & Energy",
    statement: "I am generally an energetic, cheerful, and optimistic person who brings positive enthusiasm to groups."
  },

  // --- AGREEABLENESS (A) ---
  {
    id: 10,
    category: "agreeableness",
    categoryLabel: "Agreeableness & Patience",
    statement: "I am quick to forgive others when they treat me poorly, and I rarely hold grudges."
  },
  {
    id: 11,
    category: "agreeableness",
    categoryLabel: "Agreeableness & Patience",
    statement: "I have a gentle, patient temperament and rarely lose my temper or judge others harshly."
  },
  {
    id: 12,
    category: "agreeableness",
    categoryLabel: "Agreeableness & Patience",
    statement: "I am willing to compromise and adapt my plans to keep the peace, even if I strongly disagree."
  },

  // --- CONSCIENTIOUSNESS (C) ---
  {
    id: 13,
    category: "conscientiousness",
    categoryLabel: "Conscientiousness & Order",
    statement: "I keep my surroundings tidy and prefer a highly planned, structured approach to my day."
  },
  {
    id: 14,
    category: "conscientiousness",
    categoryLabel: "Conscientiousness & Order",
    statement: "I am extremely hardworking, pay close attention to details, and strive for error-free results."
  },
  {
    id: 15,
    category: "conscientiousness",
    categoryLabel: "Conscientiousness & Order",
    statement: "I always think through the consequences and make careful, deliberate choices rather than acting on impulse."
  },

  // --- OPENNESS TO EXPERIENCE (O) ---
  {
    id: 16,
    category: "openness",
    categoryLabel: "Openness & Curiosity",
    statement: "I am deeply moved by art, music, literature, and natural beauty."
  },
  {
    id: 17,
    category: "openness",
    categoryLabel: "Openness & Curiosity",
    statement: "I am intellectually curious and enjoy learning about complex, abstract, or scientific concepts."
  },
  {
    id: 18,
    category: "openness",
    categoryLabel: "Openness & Curiosity",
    statement: "I have a vivid imagination, love creative brainstorming, and often challenge traditional norms."
  },

  // --- EMOTIONAL INTELLIGENCE (EQ) ---
  {
    id: 19,
    category: "eq",
    categoryLabel: "Emotional Intelligence",
    statement: "I practice active listening, easily perceive non-verbal cues, and naturally validate others' feelings."
  },
  {
    id: 20,
    category: "eq",
    categoryLabel: "Emotional Intelligence",
    statement: "I have high self-awareness and find it simple to name, explain, and take responsibility for my emotions."
  },
  {
    id: 21,
    category: "eq",
    categoryLabel: "Emotional Intelligence",
    statement: "I am fully comfortable sharing my deepest vulnerabilities, fears, and emotional needs with a partner."
  },

  // --- CONFLICT RESOLUTION (CR) ---
  {
    id: 22,
    category: "conflict",
    categoryLabel: "Conflict Resolution",
    statement: "I prefer to talk about my emotions immediately during a conflict rather than retreating or walking away."
  },
  {
    id: 23,
    category: "conflict",
    categoryLabel: "Conflict Resolution",
    statement: "I avoid stonewalling, cold shoulders, or becoming defensive when a partner points out a flaw in my behavior."
  },
  {
    id: 24,
    category: "conflict",
    categoryLabel: "Conflict Resolution",
    statement: "During a disagreement, I focus on resolving the underlying issue constructively rather than criticizing the person."
  }
];
