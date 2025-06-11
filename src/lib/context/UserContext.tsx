"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/diary'
import { authAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock user data for development
const mockUser: User = {
  id: 40,
  email: "user@example.com",
  nickname: "테스트",
  profileImage: "https://www.gravatar.com/avatar/1?d=identicon",
  role: "USER"
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // TODO: 실제 API 연동 시 아래 주석을 해제하고 mockUser 관련 코드를 제거하세요
        // const response = await authAPI.getCurrentUser()
        // if (!response.data) {
        //   router.push('/')
        //   return
        // }
        // setUser(response.data)

        // Mock user data for development
        setUser(mockUser)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // TODO: 실제 API 연동 시 아래 주석을 해제하세요
        // router.push('/')
        setUser(mockUser)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 