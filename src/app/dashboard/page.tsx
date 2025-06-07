"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import Link from 'next/link'
import { Diary, EmotionData, MoodColors, WeeklyTrend, EmotionPercentage } from "@/types/diary"

import {
  Edit3,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  Search,
  Bell,
  User,
  BarChart2,
  Clock,
  BookOpen,
} from "lucide-react"

export default function Component() {
  const [time, setTime] = useState(new Date())
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  // 나눔방 최신 일기
  const myGroupEntries: Diary[] = [
    {
      id: 1,
      title: "오늘 하루도 감사한 마음으로",
      content:
        "아침에 일어나서 창문을 열었을 때 들어온 따뜻한 햇살이 너무 좋았다. 작은 것에도 감사할 수 있는 마음을 가지게 되어서 행복하다. 오늘은 특히 동네 카페에서 만난 강아지가 너무 귀여웠다. 주인분이 쓰다듬게 해주셔서 기분이 좋았다.",
      author: "김민수",
      date: "2025-06-02",
      likes: 12,
      comments: 3,
      mood: "happy",
      profileImage: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      title: "새로운 도전을 시작하며",
      content:
        "오늘부터 새로운 프로젝트를 시작했다. 처음에는 두렵고 걱정이 많았지만, 한 걸음씩 나아가다 보면 분명 좋은 결과가 있을 거라 믿는다. 팀원들도 좋은 분들이라 든든하다. 특히 리더님이 많이 도와주셔서 감사한 마음이다.",
      author: "이지은",
      date: "2025-06-01",
      likes: 8,
      comments: 5,
      mood: "excited",
      profileImage: "/placeholder.svg?height=32&width=32",
    },
  ]

  // 추천 일기
  const recommendedEntries: Diary[] = [
    {
      id: 3,
      title: "혼자만의 시간이 주는 평온함",
      content:
        "카페에서 혼자 앉아 책을 읽으며 보낸 오후. 누구의 시선도 신경 쓰지 않고 온전히 나만의 시간을 가질 수 있어서 좋았다. 가끔은 이렇게 혼자만의 시간이 필요한 것 같다. 오늘 읽은 책은 '소크라테스의 변명'인데, 정말 많은 생각을 하게 만들었다.",
      author: "박서연",
      date: "Today",
      likes: 24,
      comments: 7,
      mood: "peaceful",
      profileImage: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      title: "친구와의 소중한 대화",
      content:
        "오랜만에 만난 친구와 진솔한 이야기를 나누었다. 서로의 고민을 들어주고 위로해주는 시간이 얼마나 소중한지 다시 한번 느꼈다. 특히 친구가 최근에 겪은 어려움에 대해 이야기하면서 내가 얼마나 많은 것들에 감사해야 하는지 깨달았다.",
      author: "최현우",
      date: "Yesterday",
      likes: 18,
      comments: 4,
      mood: "grateful",
      profileImage: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Daily Letter</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-4">
                Today
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors">
                My Journal
              </a>
              <Link href="/communities" className="text-slate-600 hover:text-slate-800 transition-colors">
                나눔방
              </Link>
              <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors flex items-center">
                More <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">2</span>
              </a>
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-slate-500">
                {time.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <Button variant="ghost" size="sm">
                  Log Out
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="bg-blue-50 text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                  Today
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  My Journal
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 block px-3 py-2 rounded-md text-base font-medium"
                >
                  나눔방
                </a>
                <a
                  href="#"
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                >
                  More
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">2</span>
                </a>
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-slate-500">
                    {time.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start px-3">
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Today</h1>
          <p className="text-slate-600 text-sm sm:text-base">오늘 하루를 기록하고 나눠보세요</p>
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
            {/* 내 나눔방 최신 일기 */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  <span className="hidden sm:inline">내 나눔방 최신 일기</span>
                  <span className="sm:hidden">나눔방</span>
                </h2>
                <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
                  More
                </Button>
              </div>
              <div className="space-y-4">
                {myGroupEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                          <img
                            src={entry.profileImage || "/placeholder.svg"}
                            alt={entry.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm sm:text-base">{entry.author}</p>
                          <p className="text-xs sm:text-sm text-slate-500">{entry.date}</p>
                        </div>
                      </div>
                      <span className="text-lg">
                        {moodColors[entry.mood as keyof typeof moodColors]?.emoji || "😊"}
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
            </section>

            {/* 추천 일기 */}
            <section>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  추천 일기
                </h2>
                <Button variant="ghost" size="sm" className="text-green-600 text-sm">
                  More
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {entry.date}
                      </span>
                      <span className="text-lg">
                        {moodColors[entry.mood as keyof typeof moodColors]?.emoji || "😊"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">{entry.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{entry.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full overflow-hidden">
                          <img
                            src={entry.profileImage || "/placeholder.svg"}
                            alt={entry.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-slate-600">{entry.author}</span>
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
