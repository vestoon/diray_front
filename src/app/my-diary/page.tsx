"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { Diary } from "@/types/diary"
import { diaryAPI } from "@/lib/api"
import { toast } from "sonner"
import Header from "@/components/Header"
import { Plus, Heart, MessageCircle, Calendar, Clock } from "lucide-react"

export default function MyDiaryPage() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true)
        const response = await diaryAPI.getMyDiaries()
        setDiaries(response.data)
      } catch (err) {
        console.error("일기 목록을 불러오는데 실패했습니다:", err)
        setError("일기 목록을 불러오는데 실패했습니다.")
        toast.error("일기 목록을 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiaries()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-slate-900">내 일기</h1>
          <p className="text-slate-500">나만의 소중한 기록을 확인해보세요</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <Link href="/write">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-5 h-5 mr-2" />새 일기 작성하기
            </Button>
          </Link>
        </div>

        {/* Diary List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-slate-500 py-8">
              <p>일기를 불러오는데 실패했습니다.</p>
              <p className="text-sm mt-1">잠시 후 다시 시도해주세요.</p>
            </div>
          ) : diaries.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <p>아직 작성된 일기가 없습니다.</p>
              <p className="text-sm mt-1">첫 번째 일기를 작성해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diaries.map((diary) => (
                <div
                  key={diary.id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {new Date(diary.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{diary.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{diary.comments}</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{diary.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{diary.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {new Date(diary.createdAt).toLocaleTimeString()}
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
        </div>
      </main>
    </div>
  )
} 