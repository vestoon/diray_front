"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { Diary, Community } from "@/types/diary"
import { diaryAPI, communityAPI } from "@/lib/api"
import { toast } from "sonner"
import Header from "@/components/Header"
import { Plus, Heart, MessageCircle, Calendar, Clock, Users, ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

// 임시 커뮤니티 데이터
const TEMP_COMMUNITY: Community = {
  id: 1,
  name: "행복한 일상",
  description: "일상의 작은 행복을 나누는 공간입니다.",
  isPrivate: false,
  memberCount: 128,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: {
    id: 1,
    email: "creator@example.com"
  }
}

// 임시 일기 데이터
const TEMP_DIARIES: Diary[] = [
  {
    id: 1,
    title: "오늘의 작은 기쁨",
    content: "오늘 아침 일어나서 창가에 앉아 커피를 마시며 햇살을 느꼈어요. 작은 일상이지만 행복했던 순간이었습니다.",
    primaryEmotion: "행복",
    secondaryEmotions: ["평온", "감사"],
    tags: { "날씨": "맑음", "활동": "아침" },
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 1,
      email: "user1@example.com"
    }
  },
  {
    id: 2,
    title: "새로운 취미",
    content: "요즘 그림 그리기를 시작했어요. 처음이라 서툴지만, 하나씩 배워나가는 과정이 즐겁습니다.",
    primaryEmotion: "기대",
    secondaryEmotions: ["설렘", "도전"],
    tags: { "취미": "그림", "감정": "긍정" },
    isPublic: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 2,
      email: "user2@example.com"
    }
  }
]

export default function CommunityPage() {
  const params = useParams()
  const router = useRouter()
  const [community, setCommunity] = useState<Community>(TEMP_COMMUNITY)
  const [diaries, setDiaries] = useState<Diary[]>(TEMP_DIARIES)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setIsLoading(true)
        // 커뮤니티 정보 조회
        const communityResponse = await communityAPI.getCommunity(Number(params.id))
        if (communityResponse.status === "SUCCESS") {
          setCommunity(communityResponse.data)
        }

        // 커뮤니티의 일기 목록 조회
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        const endDate = new Date().toISOString()
        const diariesResponse = await diaryAPI.getDiariesByPeriod(startDate, endDate)
        if (diariesResponse.status === "SUCCESS") {
          setDiaries(diariesResponse.data)
        }
      } catch (err) {
        console.error("커뮤니티 정보를 불러오는데 실패했습니다:", err)
        setError("커뮤니티 정보를 불러오는데 실패했습니다.")
        toast.error("커뮤니티 정보를 불러오는데 실패했습니다.")
        // 임시 데이터 사용
        setCommunity(TEMP_COMMUNITY)
        setDiaries(TEMP_DIARIES)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunityData()
  }, [params.id])

  const handleJoinCommunity = async () => {
    try {
      const response = await communityAPI.joinCommunity(community.id, { joinCode: "" })
      if (response.status === "SUCCESS") {
        toast.success("커뮤니티에 가입되었습니다.")
        // 커뮤니티 정보 새로고침
        const communityResponse = await communityAPI.getCommunity(community.id)
        if (communityResponse.status === "SUCCESS") {
          setCommunity(communityResponse.data)
        }
      }
    } catch (err) {
      console.error("커뮤니티 가입에 실패했습니다:", err)
      toast.error("커뮤니티 가입에 실패했습니다.")
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
          </Button>
        </div>

        {/* Community Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{community.name}</h1>
              <p className="text-slate-500 mt-1">{community.description}</p>
            </div>
            <div className="flex items-center space-x-2 text-slate-500">
              <Users className="w-5 h-5" />
              <span>{community.memberCount}명의 멤버</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleJoinCommunity}
            >
              가입하기
            </Button>
            <Button variant="outline" className="border-slate-200">
              공유하기
            </Button>
          </div>
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
              <p className="text-sm mt-1">임시 데이터를 표시합니다.</p>
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
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {diary.user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {diary.user.email.split('@')[0]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">0</span>
                      </button>
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">0</span>
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