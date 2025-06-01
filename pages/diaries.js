"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { FaSearch, FaCalendarAlt, FaTag } from "react-icons/fa"

export default function DiaryList() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState("")
  const [filterDate, setFilterDate] = useState("")

  // Sample diaries
  const diaries = [
    {
      id: 1,
      title: "오늘의 작은 행복",
      excerpt: "카페에서 우연히 만난 친구와의 대화가 하루를 밝게 만들었다...",
      date: "2023-05-15",
      tags: ["행복", "일상", "만남"],
      isPublic: true,
    },
    {
      id: 2,
      title: "비 오는 날의 기억",
      excerpt: "창밖으로 내리는 빗소리를 들으며 어릴 적 추억을 떠올렸다...",
      date: "2023-05-10",
      tags: ["슬픔", "회상", "비"],
      isPublic: false,
    },
    {
      id: 3,
      title: "첫 해외여행",
      excerpt: "처음으로 혼자 떠난 여행, 낯선 곳에서의 설렘과 두려움...",
      date: "2023-05-05",
      tags: ["여행", "성장", "경험"],
      isPublic: true,
    },
    {
      id: 4,
      title: "새로운 취미 시작",
      excerpt: "오랫동안 관심 있던 수채화를 배우기 시작했다. 처음이라 서툴지만...",
      date: "2023-05-01",
      tags: ["취미", "도전", "성장"],
      isPublic: false,
    },
    {
      id: 5,
      title: "가족 모임",
      excerpt: "오랜만에 가족들이 모두 모였다. 함께 식사하고 이야기 나누는 시간...",
      date: "2023-04-25",
      tags: ["가족", "행복", "일상"],
      isPublic: false,
    },
  ]

  // Filter diaries based on search term, tag, and date
  const filteredDiaries = diaries.filter((diary) => {
    const matchesSearch =
      searchTerm === "" ||
      diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diary.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = filterTag === "" || diary.tags.includes(filterTag)

    const matchesDate = filterDate === "" || diary.date === filterDate

    return matchesSearch && matchesTag && matchesDate
  })

  // Get unique tags from all diaries
  const allTags = [...new Set(diaries.flatMap((diary) => diary.tags))]

  // Get unique dates from all diaries
  const allDates = [...new Set(diaries.map((diary) => diary.date))]

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  if (status === "unauthenticated") {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">내 일기 목록</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="일기 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 bg-white"
              >
                <option value="">모든 태그</option>
                {allTags.map((tag, idx) => (
                  <option key={idx} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 bg-white"
              >
                <option value="">모든 날짜</option>
                {allDates.map((date, idx) => (
                  <option key={idx} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {filteredDiaries.length > 0 ? (
          <div className="space-y-4">
            {filteredDiaries.map((diary) => (
              <Link href={`/diary/${diary.id}`} key={diary.id}>
                <a className="block border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-800">{diary.title}</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">{diary.date}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          diary.isPublic ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {diary.isPublic ? "공개" : "비공개"}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{diary.excerpt}</p>

                  <div className="flex flex-wrap gap-2">
                    {diary.tags.map((tag, idx) => (
                      <span key={idx} className="bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link href="/write">
          <a className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600">새 일기 작성하기</a>
        </Link>
      </div>
    </div>
  )
}
