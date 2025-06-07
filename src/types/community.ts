export interface User {
  id: string
  name: string
  email: string
  tags: string[]
  joinedCommunities: string[]
  createdAt: string
  lastActive: string
}

export interface Community {
  id: string
  name: string
  description: string
  category: "lifestyle" | "health" | "career" | "relationships" | "hobbies"
  tags: string[]
  memberCount: number
  activeMembers: number
  todayPosts: number
  weeklyGrowth: number
  recentActivity: string
  isJoined: boolean
  isOwner: boolean
  color: string
  createdAt: string
  diaries: string[]
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