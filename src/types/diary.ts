export interface User {
  id: number
  email: string
  name?: string
  nickname?: string
  profileImage?: string
  tags?: string[]
  joinedCommunities?: number[]
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