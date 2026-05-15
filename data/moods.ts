export const moods = [
  {
    name: "Love",
    emoji: "❤️",
  },
  {
    name: "Emotional",
    emoji: "🥺",
  },
  {
    name: "Mass",
    emoji: "🔥",
  },
  {
    name: "Thriller",
    emoji: "🕵️",
  },
  {
    name: "Action",
    emoji: "⚔️",
  },
  {
    name: "Feel Good",
    emoji: "☕",
  },
  {
    name: "Comedy",
    emoji: "😂",
  },
  {
    name: "Dark",
    emoji: "🌑",
  },
  {
    name: "Motivational",
    emoji: "💪",
  },
  {
    name: "Family",
    emoji: "👨‍👩‍👧",
  },
  {
    name: "Sci-Fi",
    emoji: "🚀",
  },
  {
    name: "Mind Bending",
    emoji: "🧠",
  },
]

export const getMoodEmoji = (moodName: string): string => {
  const mood = moods.find(m => m.name === moodName)
  return mood?.emoji || ""
}
