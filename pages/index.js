"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { FaGoogle, FaPencilAlt, FaBook, FaExchangeAlt } from "react-icons/fa"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-pink-600 mb-4">Diary2U</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              당신의 일상을 기록하고, 비슷한 감정을 가진 사람들과 공유해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/write">
              <a className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center text-center">
                <div className="bg-pink-100 p-4 rounded-full mb-4">
                  <FaPencilAlt className="text-pink-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">일기 작성하기</h2>
                <p className="text-gray-600">오늘의 감정과 생각을 기록해보세요.</p>
              </a>
            </Link>

            <Link href="/diaries">
              <a className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center text-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <FaBook className="text-purple-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">내 일기 목록</h2>
                <p className="text-gray-600">이전에 작성한 일기들을 확인해보세요.</p>
              </a>
            </Link>

            <Link href="/share">
              <a className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <FaExchangeAlt className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">일기 나눔방</h2>
                <p className="text-gray-600">다른 사람들의 이야기를 듣고 공감해보세요.</p>
              </a>
            </Link>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">인기 태그</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {["행복", "슬픔", "일상", "여행", "성장"].map((tag) => (
                <Link href={`/share/${tag}`} key={tag}>
                  <a className="bg-white border border-pink-200 text-pink-600 px-4 py-2 rounded-full hover:bg-pink-50 transition-colors">
                    #{tag}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleMockLogin = () => {
    // 임시 로그인 처리
    const mockSession = {
      user: {
        id: "dev-user-123",
        name: "테스트 사용자",
        email: "test@example.com",
      },
    }
    // 세션 스토리지에 임시 세션 저장
    sessionStorage.setItem("mockSession", JSON.stringify(mockSession))
    // 페이지 새로고침
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Diary2U</h1>
          <p className="text-gray-600">당신의 이야기를 기록하고 공유하세요</p>
        </div>

        <div className="mb-8">
          <Image
            src="/placeholder.svg?height=200&width=200"
            alt="Diary Illustration"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        <button
          onClick={handleMockLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow hover:shadow-md flex items-center justify-center gap-3 transition-all"
        >
          <FaGoogle className="text-red-500" />
          <span>Google로 로그인하기</span>
        </button>
      </div>
    </div>
  )
}
