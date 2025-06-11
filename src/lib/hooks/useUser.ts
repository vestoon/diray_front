import { useState, useEffect } from "react"
import { User } from "@/types/diary"
import { authAPI } from "@/lib/api"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const response = await authAPI.getCurrentUser()
        setUser(response.data)
      } catch (err) {
        console.error("사용자 정보를 불러오는데 실패했습니다:", err)
        setError("사용자 정보를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading, error }
} 
