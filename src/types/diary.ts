import { User } from "./user"

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