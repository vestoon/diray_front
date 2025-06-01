"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { FaRedo } from "react-icons/fa"

export default function ShareRooms() {
  const { data: session, status } = useSession()

  // 개발용 임시 세션
  const mockSession = {
    user: {
      id: "dev-user-123",
      name: "테스트 사용자",
      email: "test@example.com",
    },
  }

  const currentSession = session || mockSession
  const currentStatus = session ? status : "authenticated"

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Sample tags
  const tags = [
    { id: 1, name: "행복", color: "bg-yellow-100 text-yellow-600", count: 124 },
    { id: 2, name: "슬픔", color: "bg-blue-100 text-blue-600", count: 87 },
    { id: 3, name: "일상", color: "bg-green-100 text-green-600", count: 203 },
    { id: 4, name: "여행", color: "bg-purple-100 text-purple-600", count: 56 },
    { id: 5, name: "성장", color: "bg-pink-100 text-pink-600", count: 78 },
  ]

  // Sample featured diaries
  const featuredDiaries = [
    {
      id: 1,
      title: "오늘의 작은 행복",
      excerpt: "카페에서 우연히 만난 친구와의 대화가 하루를 밝게 만들었다...",
      tags: ["행복", "일상"],
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      title: "비 오는 날의 기억",
      excerpt: "창밖으로 내리는 빗소리를 들으며 어릴 적 추억을 떠올렸다...",
      tags: ["슬픔", "회상"],
      likes: 18,
      comments: 3,
    },
    {
      id: 3,
      title: "첫 해외여행",
      excerpt: "처음으로 혼자 떠난 여행, 낯선 곳에서의 설렘과 두려움...",
      tags: ["여행", "성장"],
      likes: 32,
      comments: 7,
    },
  ]

  const refreshRecommendations = () => {
    setIsLoading(true)
    // In a real app, this would fetch new recommendations
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // 로딩 및 인증 체크 수정
  if (currentStatus === "loading") {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  if (currentStatus === "unauthenticated" && !mockSession) {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">일기 나눔방</h1>
        <button
          onClick={refreshRecommendations}
          disabled={isLoading}
          className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 disabled:opacity-50"
        >
          <FaRedo className={`${isLoading ? "animate-spin" : ""}`} />
          <span>새로운 추천</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">오늘의 추천 일기</h2>

            <div className="space-y-6">
              {featuredDiaries.map((diary) => (
                <div key={diary.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{diary.title}</h3>
                  <p className="text-gray-600 mb-3">{diary.excerpt}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {diary.tags.map((tag, idx) => (
                      <Link href={`/share/${tag}`} key={idx}>
                        <a className="bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded-full">#{tag}</a>
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">{diary.likes} 좋아요</span>
                    <span>{diary.comments} 댓글</span>
                    <Link href={`/diary/${diary.id}`}>
                      <a className="ml-auto text-pink-500 hover:text-pink-600">자세히 보기</a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">태그별 나눔방</h2>

            <div className="space-y-3">
              {tags.map((tag) => (
                <Link href={`/share/${tag.name}`} key={tag.id}>
                  <a className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <span className={`${tag.color} text-xs px-2 py-1 rounded-full mr-3`}>#{tag.name}</span>
                      <span className="text-gray-500 text-sm">{tag.count}개의 일기</span>
                    </div>
                    <span className="text-gray-400">›</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-3">나만의 일기 공유하기</h3>
            <p className="text-gray-600 mb-4">당신의 이야기를 다른 사람들과 나눠보세요.</p>
            <Link href="/write">
              <a className="inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
                일기 작성하기
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
