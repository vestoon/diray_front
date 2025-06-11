"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { Diary } from "@/types/diary"
import { diaryAPI } from "@/lib/api"
import { toast } from "sonner"
import Header from "@/components/Header"
import { Plus, Heart, MessageCircle, Calendar, Clock } from "lucide-react"
import UserInfoCard from "@/components/UserInfoCard"
import { useUser } from "@/lib/context/UserContext"
import { mockCurrentUserDiaries } from "@/mock/diary"

export default function MyDiaryPage() {
  const { user: currentUser, isLoading: isUserLoading } = useUser()
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) return
    const fetchDiaries = async () => {
      try {
        setIsLoading(true)
        const response = await diaryAPI.getMyDiaries()
        setDiaries(response.data)
      } catch (err) {
        setError("일기 목록을 불러오는데 실패했습니다. 임시 데이터를 표시합니다.")
        setDiaries(mockCurrentUserDiaries)
        toast.error("일기 목록을 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDiaries()
  }, [currentUser])

  // 유저 정보 로딩 중
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 로그인하지 않은 경우
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-lg">로그인이 필요합니다.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserInfoCard user={currentUser} />

        {/* 타이틀 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">내 일기</h1>
          <p className="text-slate-500">나만의 소중한 기록을 확인해보세요</p>
        </div>

        {/* 새 일기 작성 버튼 */}
        <div className="mb-8 flex justify-end">
          <Link href="/write">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-5 h-5 mr-2" />새 일기 작성하기
            </Button>
          </Link>
        </div>

        {/* 일기 리스트 */}
        <section>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : diaries.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <p>아직 작성된 일기가 없습니다.</p>
              <p className="text-sm mt-1">첫 번째 일기를 작성해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {diaries.map((diary) => (
                <div
                  key={diary.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {new Date(diary.createdAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{diary.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-slate-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{diary.comments}</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{diary.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{diary.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {new Date(diary.createdAt).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <Link
                      href={`/diary/${diary.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      자세히 보기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}