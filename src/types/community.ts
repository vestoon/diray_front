import { User } from "./user"

export interface Community {
  id: number
  name: string
  description: string
  category?: "lifestyle" | "health" | "career" | "relationships" | "hobbies"
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