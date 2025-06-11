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

export interface AuthUser {
  email: string
  id: number
  nickname: string
  role: 'USER' | 'ADMIN'
}