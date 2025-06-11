export interface EmotionData {
  mood: string
  intensity: number
}

export interface MoodColors {
  bg: string
  text: string
  emoji: string
}

export interface WeeklyTrend {
  day: string
  value: number
  mood: string
}

export interface EmotionPercentage {
  mood: string
  count: number
  percentage: number
}