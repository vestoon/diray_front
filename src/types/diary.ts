export interface User {
  id: number
  email: string
  name?: string
  nickname?: string
  profileImage?: string
  tags?: string[]
  joinedCommunities?: string[]
  createdAt?: string
  lastActive?: string
  role?: string
}

export interface Diary {
  id: number
  title: string
  content: string
  primaryEmotion: string
  secondaryEmotions: string[]
  tags: Record<string, string>
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user: User
  likes?: number
  comments?: number
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
  id: number
  content: string
  primaryEmotion: string
  secondaryEmotions: string[]
  tags: Record<string, string>
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user: User
}

export interface Community {
  id: number
  name: string
  description: string
  category?: "lifestyle" | "health" | "career" | "relationships" | "hobbies" // 지워야 함
  tags?: string[]
  isPrivate: boolean
  memberCount: number
  activeMembers?: number
  todayPosts?: number
  weeklyGrowth?: number
  recentActivity?: string
  isJoined?: boolean
  isOwner?: boolean
  color?: string
  createdAt: string
  updatedAt: string
  creator: User
  diaries?: string[]
}

export interface Post {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: Date
  likes: number
  comments: number
  tags: string[]
  communityId: string
}

export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR'
  message: string
  data: T
}

export interface CreateDiaryRequest {
  title: string
  content: string
  primaryEmotion: string
  secondaryEmotions: string[]
  tags: Record<string, string>
  isPublic: boolean
}

export interface UpdateDiaryRequest {
  title: string
  content: string
  primaryEmotion: string
  secondaryEmotions: string[]
  tags: Record<string, string>
  isPublic: boolean
}

export interface CreateOneLineDiaryRequest {
  content: string
  primaryEmotion: string
  secondaryEmotions: string[]
  tags: Record<string, string>
  isPublic: boolean
}

export interface UpdateOneLineDiaryRequest {
  content: string
  primaryEmotion: string
  secondaryEmotions: string[]
  tags: Record<string, string>
  isPublic: boolean
}

export interface CreateCommunityRequest {
  name: string
  description: string
  isPrivate: boolean
  category?: "lifestyle" | "health" | "career" | "relationships" | "hobbies"
  tags?: string[]
}

export interface JoinCommunityRequest {
  joinCode: string
}

// 인증 관련 타입
export interface AuthUser {
  email: string;
  id: number;
  nickname: string;
  role: 'USER' | 'ADMIN';
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