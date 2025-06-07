export interface Diary {
  id: number
  title: string
  content: string
  author: string
  date: string
  likes: number
  comments: number
  mood: string
  profileImage: string
}

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

export interface QuickNote {
  id: number
  content: string
  date: string
  tags: string[]
  isPublic: boolean
}

export interface OneLineDiary {
  id: string
  text: string
  timestamp: Date
  mood?: string
  tags: string[]
  isPublic: boolean
}

// 샘플 한 줄 일기 데이터
export const sampleQuickNotes: QuickNote[] = [
  {
    id: 1,
    content: "오늘 아침에 일어나서 창문을 열었더니 날씨가 정말 좋았다.",
    date: "2025-06-02 08:30",
    tags: ["기쁨", "휴식"],
    isPublic: true,
  },
  {
    id: 2,
    content: "회사에서 프로젝트 마감이 다가와서 스트레스가 심하다.",
    date: "2025-06-02 12:15",
    tags: ["불안", "직장", "긴장"],
    isPublic: false,
  },
  {
    id: 3,
    content: "점심으로 먹은 샐러드가 생각보다 맛있었다. 건강해지는 기분.",
    date: "2025-06-02 13:20",
    tags: ["만족", "식욕 감소"],
    isPublic: true,
  },
  {
    id: 4,
    content: "친구와 통화했는데 오랜만에 웃을 수 있어서 좋았다.",
    date: "2025-06-01 19:45",
    tags: ["기쁨", "친구"],
    isPublic: true,
  },
  {
    id: 5,
    content: "밤에 잠이 안 와서 책을 읽었다. 그래도 좋은 책이라 위안이 됐다.",
    date: "2025-06-01 23:10",
    tags: ["불면", "취미"],
    isPublic: false,
  },
] 