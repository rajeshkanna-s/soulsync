export interface PersonalityType {
  id: string;
  title: string;
  icon: string;
  emoji: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  emotionalStyle: string;
  communicationStyle: string;
  color: string; // Hex or HSL color for customized gradients
}

export const personalityTypes: Record<string, PersonalityType> = {
  warrior: {
    id: "warrior",
    title: "The Warrior",
    icon: "Flame",
    emoji: "🔥",
    description: "Bold, decisive, and goal-driven. You lead from the front, taking charge of situations and turning obstacles into opportunities. You live with intense passion and purpose.",
    strengths: ["Unwavering resilience in adversity", "Strong decision-making skills", "Highly action-oriented and protective"],
    blindSpots: ["Can be impatient or blunt", "Difficulty displaying vulnerability"],
    emotionalStyle: "Passionate and direct. You feel things with high intensity and prefer action over dwelling on feelings.",
    communicationStyle: "Direct, concise, and results-oriented. You speak your mind clearly and value honesty above all.",
    color: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)"
  },
  feeler: {
    id: "feeler",
    title: "The Feeler",
    icon: "Waves",
    emoji: "🌊",
    description: "Deeply emotional, empathetic, and sensitive to the energy around you. You connect with others on a profound level, sensing their unexpressed feelings and offering deep comfort.",
    strengths: ["Exceptional emotional intelligence", "Deep empathy and compassion", "Incredibly supportive listener"],
    blindSpots: ["Can easily absorb others' stress", "Tends to avoid conflict even when necessary"],
    emotionalStyle: "Rich and deeply felt. You experience a wide spectrum of emotions and value emotional authenticity.",
    communicationStyle: "Warm, supportive, and listening-focused. You seek harmony and check in on how others are feeling.",
    color: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
  },
  thinker: {
    id: "thinker",
    title: "The Thinker",
    icon: "Brain",
    emoji: "🧠",
    description: "Logical, analytical, and calm under pressure. You seek truth, structure, and clarity, processing life through a rational lens to find elegant solutions to complex problems.",
    strengths: ["Exceptional logic and problem-solving", "Maintains composure in crises", "Highly objective and fair"],
    blindSpots: ["Can seem emotionally distant or overly detached", "Overanalyzing simple situations"],
    emotionalStyle: "Reserved and intellectualized. You prefer to understand your emotions logically before expressing them.",
    communicationStyle: "Precise, structured, and objective. You explain ideas methodically and prefer data over speculation.",
    color: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
  },
  nurturer: {
    id: "nurturer",
    title: "The Nurturer",
    icon: "Flower2",
    emoji: "🌸",
    description: "Caring, selfless, and a natural caretaker. You create warm, safe spaces wherever you go, prioritizing the well-being and growth of others and holding communities together.",
    strengths: ["Generous and deeply supportive", "Creates absolute psychological safety", "Incredibly loyal and consistent"],
    blindSpots: ["Tends to neglect own needs", "May enable others by over-helping"],
    emotionalStyle: "Warm, steady, and protective. You feel happiest when those around you are safe, happy, and cared for.",
    communicationStyle: "Encouraging, cooperative, and gentle. You focus on building trust and making others feel valued.",
    color: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
  },
  creator: {
    id: "creator",
    title: "The Creator",
    icon: "Palette",
    emoji: "🎨",
    description: "Creative, expressive, and original. You see beauty and meaning where others see ordinary life. You express your soul through art, ideas, and unique perspectives.",
    strengths: ["Out-of-the-box creative thinking", "Aesthetic sensibility and originality", "High appreciation for authenticity"],
    blindSpots: ["Can be disorganized or moody", "Easily discouraged by routine or mundane tasks"],
    emotionalStyle: "Fluctuating and deeply expressive. Your emotions are the catalyst for your inspiration and creation.",
    communicationStyle: "Rich, vivid, and metaphorical. You tell stories, use symbols, and share your vision enthusiastically.",
    color: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
  },
  achiever: {
    id: "achiever",
    title: "The Achiever",
    icon: "Mountain",
    emoji: "🏔️",
    description: "Ambitious, structured, and growth-oriented. You are constantly striving to reach new heights, setting milestones and tracking progress. You inspire others to lift their standards.",
    strengths: ["Highly disciplined and organized", "Strong drive to improve and grow", "Excellent execution and leadership"],
    blindSpots: ["Can become a workaholic", "Deep fear of failure or appearing weak"],
    emotionalStyle: "Controlled and goal-driven. You channel emotional energy into productivity and self-improvement.",
    communicationStyle: "Task-oriented, professional, and motivating. You focus on action items, progress, and goals.",
    color: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  },
  dreamer: {
    id: "dreamer",
    title: "The Dreamer",
    icon: "Moon",
    emoji: "🌙",
    description: "Idealistic, spiritual, and introspective. You live in a world of deep thoughts, imagining what could be rather than what is. You seek the deeper spiritual meaning in every event.",
    strengths: ["Strong intuitive guidance", "Vibrant, rich inner world", "Deep sense of hope and higher purpose"],
    blindSpots: ["Can get detached from practical details", "Disappointment when reality falls short of ideals"],
    emotionalStyle: "Introspective and spiritual. You process feelings quietly, looking for lessons and synchronicities.",
    communicationStyle: "Thoughtful, philosophical, and poetic. You ask deep questions and prefer meaningful dialogue over small talk.",
    color: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
  },
  spark: {
    id: "spark",
    title: "The Spark",
    icon: "Zap",
    emoji: "⚡",
    description: "Energetic, highly social, and spontaneous. You light up every room you enter, spreading joy and excitement. You thrive on connection, novelty, and living in the present moment.",
    strengths: ["Radiant enthusiasm and charm", "Highly adaptable and spontaneous", "Excellent builder of social networks"],
    blindSpots: ["Can be easily distracted", "Dislikes routine, structure, or quiet planning"],
    emotionalStyle: "Upbeat, positive, and expressive. You focus on joy, excitement, and quick transitions from sadness.",
    communicationStyle: "Animated, engaging, and collaborative. You tell jokes, keep things light, and connect people together.",
    color: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)"
  }
};
