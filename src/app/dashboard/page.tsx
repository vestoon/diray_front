"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import Link from 'next/link'
import { Diary } from "@/types/diary"
import { EmotionData, MoodColors, WeeklyTrend, EmotionPercentage } from "@/types/emotion"
import { diaryAPI, communityAPI } from "@/lib/api"
import { toast } from "sonner"
import Header from "@/components/Header"
import UserInfoCard from "@/components/UserInfoCard"
import { useUser } from "@/lib/context/UserContext"
import { mockCurrentUserDiaries, mockRecommendedDiaries } from "@/mock/diary"

import {
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Clock,
  BookOpen,
  Home,
  Search,
  Bell
} from "lucide-react"

export default function Component() {
  const { user: currentUser, isLoading: isUserLoading } = useUser()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [groupEntries, setGroupEntries] = useState<Diary[]>([])
  const [recommendedEntries, setRecommendedEntries] = useState<Diary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 감정 데이터 (실제 앱에서는 API에서 가져올 것)
  const emotionData: Record<string, EmotionData> = {
    "2025-06-01": { mood: "happy", intensity: 0.8 },
    "2025-06-02": { mood: "happy", intensity: 0.9 },
    "2025-06-03": { mood: "neutral", intensity: 0.5 },
    "2025-06-04": { mood: "sad", intensity: 0.6 },
    "2025-06-05": { mood: "happy", intensity: 0.7 },
    "2025-06-06": { mood: "angry", intensity: 0.8 },
    "2025-06-07": { mood: "happy", intensity: 0.9 },
    "2025-06-08": { mood: "neutral", intensity: 0.4 },
    "2025-06-09": { mood: "happy", intensity: 0.7 },
    "2025-06-10": { mood: "sad", intensity: 0.5 },
    "2025-06-11": { mood: "neutral", intensity: 0.6 },
    "2025-06-12": { mood: "happy", intensity: 0.8 },
    "2025-06-13": { mood: "happy", intensity: 0.9 },
    "2025-06-14": { mood: "neutral", intensity: 0.5 },
    "2025-06-15": { mood: "sad", intensity: 0.4 },
    "2025-06-16": { mood: "angry", intensity: 0.7 },
    "2025-06-17": { mood: "happy", intensity: 0.8 },
    "2025-06-18": { mood: "happy", intensity: 0.9 },
    "2025-06-19": { mood: "neutral", intensity: 0.6 },
    "2025-06-20": { mood: "sad", intensity: 0.5 },
    "2025-06-21": { mood: "happy", intensity: 0.7 },
    "2025-06-22": { mood: "happy", intensity: 0.8 },
    "2025-06-23": { mood: "neutral", intensity: 0.5 },
    "2025-06-24": { mood: "sad", intensity: 0.6 },
    "2025-06-25": { mood: "happy", intensity: 0.9 },
    "2025-06-26": { mood: "angry", intensity: 0.7 },
    "2025-06-27": { mood: "happy", intensity: 0.8 },
    "2025-06-28": { mood: "neutral", intensity: 0.6 },
    "2025-06-29": { mood: "happy", intensity: 0.7 },
    "2025-06-30": { mood: "sad", intensity: 0.5 },
  }

  // 감정별 색상 및 이모지
  const moodColors: Record<string, MoodColors> = {
    happy: { bg: "bg-yellow-400", text: "text-yellow-500", emoji: "😊" },
    sad: { bg: "bg-blue-400", text: "text-blue-500", emoji: "😢" },
    angry: { bg: "bg-red-400", text: "text-red-500", emoji: "😠" },
    neutral: { bg: "bg-gray-400", text: "text-gray-500", emoji: "😐" },
  }

  // 감정 통계 계산
  const emotionStats = Object.values(emotionData).reduce(
    (acc, { mood }) => {
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // 감정 분포 퍼센트 계산
  const totalDays = Object.keys(emotionData).length
  const emotionPercentages: EmotionPercentage[] = Object.entries(emotionStats).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count / totalDays) * 100),
  }))

  // 주간 감정 추세 데이터
  const weeklyTrend: WeeklyTrend[] = [
    { day: "월", value: 0.8, mood: "happy" },
    { day: "화", value: 0.6, mood: "neutral" },
    { day: "수", value: 0.4, mood: "sad" },
    { day: "목", value: 0.5, mood: "neutral" },
    { day: "금", value: 0.7, mood: "happy" },
    { day: "토", value: 0.9, mood: "happy" },
    { day: "일", value: 0.8, mood: "happy" },
  ]

  // 캘린더 관련 함수들
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const days = []

    // 요일 헤더
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
    const weekdayHeader = weekdays.map((day) => (
      <div key={`header-${day}`} className="text-center text-xs font-medium text-slate-500 py-2">
        {day}
      </div>
    ))

    // 이전 달의 날짜들 (비어있는 셀)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-1 border border-transparent">
          <div className="h-8 w-8"></div>
        </div>,
      )
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const emotion = emotionData[date]
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

      days.push(
        <div key={`day-${day}`} className={`p-1 relative ${isToday ? "bg-blue-50 rounded-lg" : ""}`}>
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium 
            ${isToday ? "bg-blue-100 text-blue-800" : "text-slate-700"}`}
          >
            {day}
          </div>
          {emotion && (
            <div
              className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${
                moodColors[emotion.mood as keyof typeof moodColors].bg
              }`}
              style={{ opacity: emotion.intensity }}
            ></div>
          )}
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {weekdayHeader}
        {days}
      </div>
    )
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  useEffect(() => {
    const fetchGroupEntries = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 1. 사용자의 커뮤니티 목록 가져오기
        const communitiesResponse = await communityAPI.getMyCommunities()
        const communities = communitiesResponse.data

        if (!communities || communities.length === 0) {
          setGroupEntries([])
        } else {
          // 2. 각 커뮤니티의 일기 ID 목록 수집
          const allDiaryIds = communities.flatMap(community => community.diaries || [])

          // 3. 각 일기 ID로 일기 상세 정보 가져오기
          const diaryPromises = allDiaryIds.map(id => diaryAPI.getDiary(Number(id)))
          const diaryResponses = await Promise.all(diaryPromises)
          
          // 4. 날짜순으로 정렬하고 최신 3개만 선택
          const sortedEntries = diaryResponses
            .map(response => response.data)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3)

          setGroupEntries(sortedEntries)
        }
      } catch (err) {
        console.error('그룹 일기 데이터를 불러오는데 실패했습니다:', err)
        setError('데이터를 불러오는데 실패했습니다. 임시 데이터를 표시합니다.')
        setGroupEntries(mockCurrentUserDiaries)
        toast.error('데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchRecommendedEntries = async () => {
      try {
        // 실제 API 호출 예시 (실제 API가 있다면)
        // const response = await diaryAPI.getRecommendedDiaries()
        // setRecommendedEntries(response.data)
        // 임시로 성공 시 mock 데이터 사용
        setRecommendedEntries(mockRecommendedDiaries)
      } catch (err) {
        setRecommendedEntries(mockRecommendedDiaries)
      }
    }

    fetchGroupEntries()
    fetchRecommendedEntries()
  }, [])

  // 랜더링 방식 변경: 유저 정보 로딩 및 미로그인 처리
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-lg">로그인이 필요합니다.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserInfoCard user={currentUser} />
        
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
          <p className="text-slate-500">오늘의 감정과 활동을 확인해보세요</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <Link href="/write">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-5 h-5 mr-2" />새 일기 작성하기
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* 오늘의 한 줄 */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                오늘의 한 줄
              </h3>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <textarea
                  placeholder="오늘 하루를 한 줄로 표현해보세요..."
                  className="w-full text-sm text-slate-600 placeholder-slate-400 border-none outline-none resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    저장
                  </Button>
                </div>
              </div>
            </section>

            {/* 내 나눔방 최신 일기 */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  <span className="hidden sm:inline">내 나눔방 최신 일기</span>
                  <span className="sm:hidden">나눔방</span>
                </h2>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                  {error}
                </div>
              )}
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                            <img
                              src={entry.user.profileImage || `https://www.gravatar.com/avatar/${entry.user.id}?d=identicon`}
                              alt={entry.user.nickname || entry.user.email}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm sm:text-base">
                              {entry.user.nickname || entry.user.email}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500">
                              {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg">
                          {moodColors[entry.primaryEmotion as keyof typeof moodColors]?.emoji || "😊"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">{entry.title}</h3>
                      <p className="text-slate-600 mb-4 line-clamp-2 text-sm sm:text-base">{entry.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>{entry.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{entry.comments}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 추천 일기 */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  추천 일기
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedEntries.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 p-4 text-center text-slate-500">
                    추천 일기가 없습니다.
                  </div>
                )}
                {recommendedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-lg">
                        {moodColors[entry.primaryEmotion as keyof typeof moodColors]?.emoji || "😊"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">{entry.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{entry.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full overflow-hidden">
                          <img
                            src={entry.user.profileImage || `https://www.gravatar.com/avatar/${entry.user.id}?d=identicon`}
                            alt={entry.user.nickname || entry.user.email}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-slate-600">{entry.user.nickname || entry.user.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{entry.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{entry.comments}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 감정 캘린더 */}
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                  감정 캘린더
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevMonth}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700">{formatMonth(currentMonth)}</span>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {renderCalendar()}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-xs text-slate-600">행복</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-xs text-slate-600">슬픔</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-xs text-slate-600">화남</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-slate-600">중립</span>
                </div>
              </div>
            </section>

            {/* 감정 통계 */}
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                감정 통계
              </h3>
              <div className="space-y-4">
                {/* 감정 분포 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-slate-700">감정 분포</h4>
                    <span className="text-xs text-slate-500">지난 30일</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                    {emotionPercentages.map((item, index) => (
                      <div
                        key={index}
                        className={`${moodColors[item.mood as keyof typeof moodColors].bg}`}
                        style={{ width: `${item.percentage}%` }}
                        title={`${item.mood}: ${item.percentage}%`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {emotionPercentages.map((item, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${moodColors[item.mood as keyof typeof moodColors].bg}`}
                        ></div>
                        <span className="text-xs text-slate-600">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 주간 감정 추세 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-slate-700">주간 감정 추세</h4>
                    <span className="text-xs text-slate-500">이번 주</span>
                  </div>
                  <div className="flex items-end justify-between h-24 px-2">
                    {weeklyTrend.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-1.5 rounded-t-sm ${moodColors[day.mood as keyof typeof moodColors].bg}`}
                          style={{ height: `${day.value * 100}%`, opacity: 0.8 }}
                        ></div>
                        <span className="text-xs text-slate-500 mt-1">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 최근 감정 기록 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-slate-700">최근 감정 기록</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">😊</span>
                        <span className="text-xs text-slate-700">행복했어요</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>오늘</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">😌</span>
                        <span className="text-xs text-slate-700">평온했어요</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>어제</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">😢</span>
                        <span className="text-xs text-slate-700">슬펐어요</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>2일 전</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center space-y-1 p-2 text-blue-600">
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">홈</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-slate-400">
            <Search className="w-5 h-5" />
            <span className="text-xs">검색</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-slate-400">
            <Plus className="w-5 h-5" />
            <span className="text-xs">작성</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-slate-400">
            <Users className="w-5 h-5" />
            <span className="text-xs">나눔방</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-2 text-slate-400 relative">
            <Bell className="w-5 h-5" />
            <span className="text-xs">알림</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}
