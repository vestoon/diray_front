"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Tag,
  Lock,
  Globe,
  X,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Edit,
  Trash2,
  Heart,
  Shield,
  Info,
} from "lucide-react"

// 태그 데이터
const tagCategories = {
  감정: ["기쁨", "슬픔", "분노", "불안", "설렘", "지루함", "외로움", "만족", "실망"],
  상황: ["직장", "학교", "가족", "친구", "연인", "여행", "운동", "취미", "휴식"],
  건강: ["두통", "피로", "긴장", "식욕 감소", "불면"],
}

// 태그 색상 매핑
const tagColors = {
  감정: {
    기쁨: "bg-yellow-100 text-yellow-800 border-yellow-200",
    슬픔: "bg-blue-100 text-blue-800 border-blue-200",
    분노: "bg-red-100 text-red-800 border-red-200",
    불안: "bg-orange-100 text-orange-800 border-orange-200",
    설렘: "bg-pink-100 text-pink-800 border-pink-200",
    지루함: "bg-gray-100 text-gray-800 border-gray-200",
    외로움: "bg-indigo-100 text-indigo-800 border-indigo-200",
    만족: "bg-green-100 text-green-800 border-green-200",
    실망: "bg-purple-100 text-purple-800 border-purple-200",
  },
  상황: {
    직장: "bg-slate-100 text-slate-800 border-slate-200",
    학교: "bg-emerald-100 text-emerald-800 border-emerald-200",
    가족: "bg-amber-100 text-amber-800 border-amber-200",
    친구: "bg-cyan-100 text-cyan-800 border-cyan-200",
    연인: "bg-rose-100 text-rose-800 border-rose-200",
    여행: "bg-sky-100 text-sky-800 border-sky-200",
    운동: "bg-lime-100 text-lime-800 border-lime-200",
    취미: "bg-violet-100 text-violet-800 border-violet-200",
    휴식: "bg-teal-100 text-teal-800 border-teal-200",
  },
  건강: {
    두통: "bg-red-100 text-red-800 border-red-200",
    피로: "bg-amber-100 text-amber-800 border-amber-200",
    긴장: "bg-orange-100 text-orange-800 border-orange-200",
    "식욕 감소": "bg-yellow-100 text-yellow-800 border-yellow-200",
    불면: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
}

// 이모지 매핑
const emojiMap = {
  기쁨: "😊",
  슬픔: "😢",
  분노: "😠",
  불안: "😰",
  설렘: "🤗",
  지루함: "😴",
  외로움: "🥺",
  만족: "😌",
  실망: "😞",
  직장: "💼",
  학교: "🏫",
  가족: "👨‍👩‍👧‍👦",
  친구: "👯",
  연인: "💑",
  여행: "✈️",
  운동: "🏃",
  취미: "🎨",
  휴식: "🛌",
  두통: "🤕",
  피로: "😫",
  긴장: "😬",
  "식욕 감소": "🍽️",
  불면: "🌙",
}

// 샘플 한 줄 일기 데이터
const sampleQuickNotes = [
  {
    id: 1,
    content: "오늘 아침에 일어나서 창문을 열었더니 날씨가 정말 좋았다.",
    date: "2025-06-02 08:30",
    tags: ["기쁨", "휴식"],
    isPublic: true,
  },
  {
    id: 2,
    content: "회사에서 프로젝트 마감이 다가와서 스트레스가 심하다.",
    date: "2025-06-02 12:15",
    tags: ["불안", "직장", "긴장"],
    isPublic: false,
  },
  {
    id: 3,
    content: "점심으로 먹은 샐러드가 생각보다 맛있었다. 건강해지는 기분.",
    date: "2025-06-02 13:20",
    tags: ["만족", "식욕 감소"],
    isPublic: true,
  },
  {
    id: 4,
    content: "친구와 통화했는데 오랜만에 웃을 수 있어서 좋았다.",
    date: "2025-06-01 19:45",
    tags: ["기쁨", "친구"],
    isPublic: true,
  },
  {
    id: 5,
    content: "밤에 잠이 안 와서 책을 읽었다. 그래도 좋은 책이라 위안이 됐다.",
    date: "2025-06-01 23:10",
    tags: ["불면", "취미"],
    isPublic: false,
  },
]

// AI 질문 목록
const aiQuestions = [
  "그때 기분이 어땠나요?",
  "그 상황에서 가장 인상 깊었던 점은 무엇인가요?",
  "그 경험이 당신에게 어떤 의미가 있나요?",
  "비슷한 상황을 또 겪게 된다면 어떻게 대처하고 싶나요?",
  "그 일이 당신의 하루에 어떤 영향을 미쳤나요?",
  "그때 다른 선택을 했다면 어떻게 달라졌을까요?",
  "그 경험에서 배운 점이 있다면 무엇인가요?",
  "그 순간을 한 단어로 표현한다면 무엇일까요?",
  "그 일이 일어난 이유가 무엇이라고 생각하나요?",
  "그 경험을 통해 자신에 대해 새롭게 알게 된 점이 있나요?",
]

export default function Component() {
  const [quickNote, setQuickNote] = useState("")
  const [quickNotes, setQuickNotes] = useState(sampleQuickNotes)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)
  const [showPrivacyPreview, setShowPrivacyPreview] = useState(false)
  const [privacyFilteredText, setPrivacyFilteredText] = useState("")
  const [showAiQuestion, setShowAiQuestion] = useState(false)
  const [currentAiQuestion, setCurrentAiQuestion] = useState("")
  const [cursorIdleTime, setCursorIdleTime] = useState(0)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [activeTagCategory, setActiveTagCategory] = useState<keyof typeof tagCategories>("감정")

  const quickNoteInputRef = useRef<HTMLTextAreaElement>(null)
  const cursorIdleTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 개인정보 필터링 함수 (실제로는 AI 모델이 처리)
  const filterPersonalInfo = (text: string) => {
    // 간단한 예시 필터링 (실제로는 더 복잡한 AI 모델 사용)
    const filtered = text
      .replace(/[가-힣]{2,3}\s?사장님/g, "◯◯◯ 사장님")
      .replace(/[가-힣]{2,3}\s?부장/g, "◯◯◯ 부장")
      .replace(/[가-힣]{2,3}\s?과장/g, "◯◯◯ 과장")
      .replace(/[가-힣]{2,3}\s?대리/g, "◯◯◯ 대리")
      .replace(/[가-힣]{2,3}\s?선생님/g, "◯◯◯ 선생님")
      .replace(/[가-힣]{2,3}\s?교수님/g, "◯◯◯ 교수님")
      .replace(/[가-힣]{2,3}\s?팀장/g, "◯◯◯ 팀장")
      .replace(/010-\d{4}-\d{4}/g, "010-****-****")
      .replace(/01\d-\d{3,4}-\d{4}/g, "01*-****-****")
      .replace(/[가-힣]{2,4}구\s[가-힣]{2,3}동/g, "◯◯구 ◯◯동")
      .replace(/[가-힣]{2,3}병원/g, "◯◯병원")
      .replace(/[가-힣]{2,3}회사/g, "◯◯회사")
      .replace(/[가-힣]{2,3}학교/g, "◯◯학교")

    return filtered
  }

  // 한 줄 일기 추가
  const addQuickNote = () => {
    if (!quickNote.trim()) return

    const newNote = {
      id: Date.now(),
      content: quickNote,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      tags: selectedTags,
      isPublic,
    }

    if (isEditing) {
      setQuickNotes(quickNotes.map((note) => (note.id === isEditing ? { ...note, ...newNote, id: isEditing } : note)))
      setIsEditing(null)
    } else {
      setQuickNotes([newNote, ...quickNotes])
    }

    setQuickNote("")
    setSelectedTags([])
    setShowTagSelector(false)
  }

  // 한 줄 일기 삭제
  const deleteQuickNote = (id: number) => {
    setQuickNotes(quickNotes.filter((note) => note.id !== id))
  }

  // 한 줄 일기 수정
  const editQuickNote = (note: (typeof quickNotes)[0]) => {
    setQuickNote(note.content)
    setSelectedTags(note.tags)
    setIsPublic(note.isPublic)
    setIsEditing(note.id)
    if (quickNoteInputRef.current) {
      quickNoteInputRef.current.focus()
    }
  }

  // 태그 토글
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // 개인정보 필터링 미리보기
  useEffect(() => {
    if (showPrivacyPreview && quickNote) {
      setPrivacyFilteredText(filterPersonalInfo(quickNote))
    }
  }, [quickNote, showPrivacyPreview])

  // 커서 유휴 시간 감지 및 AI 질문 표시
  useEffect(() => {
    const resetIdleTimer = () => {
      if (cursorIdleTimerRef.current) {
        clearInterval(cursorIdleTimerRef.current)
      }
      setCursorIdleTime(0)
      setShowAiQuestion(false)

      cursorIdleTimerRef.current = setInterval(() => {
        setCursorIdleTime((prev) => {
          // 5초 이상 커서가 움직이지 않으면 AI 질문 표시
          if (prev >= 5 && !showAiQuestion && quickNote.length > 10) {
            const randomQuestion = aiQuestions[Math.floor(Math.random() * aiQuestions.length)]
            setCurrentAiQuestion(randomQuestion)
            setShowAiQuestion(true)
            if (cursorIdleTimerRef.current) {
              clearInterval(cursorIdleTimerRef.current)
            }
          }
          return prev + 1
        })
      }, 1000)
    }

    const handleActivity = () => {
      resetIdleTimer()
    }

    document.addEventListener("mousemove", handleActivity)
    document.addEventListener("keypress", handleActivity)
    document.addEventListener("click", handleActivity)

    resetIdleTimer()

    return () => {
      if (cursorIdleTimerRef.current) {
        clearInterval(cursorIdleTimerRef.current)
      }
      document.removeEventListener("mousemove", handleActivity)
      document.removeEventListener("keypress", handleActivity)
      document.removeEventListener("click", handleActivity)
    }
  }, [quickNote, showAiQuestion])

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "방금 전"
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`

    return dateString.split(" ")[0]
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">일기 작성</h1>
                <p className="text-sm text-slate-500">
                  {new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrivacyPreview(!showPrivacyPreview)}
                className="hidden sm:flex"
              >
                {showPrivacyPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPrivacyPreview ? "원본 보기" : "필터링 미리보기"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 한 줄 일기 입력 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">오늘의 한 줄 일기</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                    isPublic
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  {isPublic ? (
                    <>
                      <Globe className="w-3 h-3 mr-1" />
                      공개
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      비공개
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 한 줄 일기 입력 영역 */}
            <div className="relative">
              <textarea
                ref={quickNoteInputRef}
                value={showPrivacyPreview ? privacyFilteredText : quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="오늘 있었던 일을 간단히 기록해보세요..."
                className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                disabled={showPrivacyPreview}
              />

              {/* AI 질문 표시 */}
              {showAiQuestion && (
                <div className="absolute bottom-3 right-3 max-w-[80%] bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 mb-1">AI 질문</p>
                      <p className="text-sm text-slate-700">{currentAiQuestion}</p>
                    </div>
                    <button onClick={() => setShowAiQuestion(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => {
                        setQuickNote(quickNote + "\n" + currentAiQuestion + " ")
                        setShowAiQuestion(false)
                        if (quickNoteInputRef.current) {
                          quickNoteInputRef.current.focus()
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      질문 추가하기
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 개인정보 필터링 알림 */}
            {isPublic && !showPrivacyPreview && (
              <div className="flex items-center space-x-2 text-xs text-amber-600">
                <AlertCircle className="w-3 h-3" />
                <span>
                  공개 설정 시 개인정보가 자동으로 필터링됩니다.{" "}
                  <button
                    onClick={() => setShowPrivacyPreview(true)}
                    className="underline font-medium hover:text-amber-800"
                  >
                    미리보기
                  </button>
                </span>
              </div>
            )}

            {/* 태그 선택 영역 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">태그 선택</span>
                </div>
                <button
                  onClick={() => setShowTagSelector(!showTagSelector)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  {showTagSelector ? "접기" : "태그 더 보기"}
                  <ChevronRight className={`w-3 h-3 ml-1 transition-transform ${showTagSelector ? "rotate-90" : ""}`} />
                </button>
              </div>

              {/* 선택된 태그 표시 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.length > 0 ? (
                  selectedTags.map((tag) => {
                    const category = Object.entries(tagCategories).find(([_, tags]) => tags.includes(tag))?.[0] as
                      | keyof typeof tagColors
                      | undefined
                    const colorClass = category
                      ? tagColors[category][tag as keyof (typeof tagColors)[typeof category]]
                      : ""

                    return (
                      <span
                        key={tag}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}
                      >
                        {emojiMap[tag as keyof typeof emojiMap]} {tag}
                        <button onClick={() => toggleTag(tag)} className="ml-1 text-slate-500 hover:text-slate-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )
                  })
                ) : (
                  <span className="text-xs text-slate-500">선택된 태그가 없습니다</span>
                )}
              </div>

              {/* 태그 선택기 */}
              {showTagSelector && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-3">
                  <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
                    {Object.keys(tagCategories).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveTagCategory(category as keyof typeof tagCategories)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          activeTagCategory === category
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tagCategories[activeTagCategory].map((tag) => {
                      const isSelected = selectedTags.includes(tag)
                      const colorClass =
                        tagColors[activeTagCategory][tag as keyof (typeof tagColors)[typeof activeTagCategory]]

                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            isSelected ? colorClass : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {emojiMap[tag as keyof typeof emojiMap]} {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <Button onClick={addQuickNote} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "수정하기" : "저장하기"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 한 줄 일기 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">내 한 줄 일기 목록</h2>

          <div className="space-y-4">
            {quickNotes.length > 0 ? (
              quickNotes.map((note) => (
                <div
                  key={note.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">{formatDate(note.date)}</span>
                      {note.isPublic ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Globe className="w-3 h-3 mr-1" />
                          공개
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          <Lock className="w-3 h-3 mr-1" />
                          비공개
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editQuickNote(note)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuickNote(note.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-800 mb-3">
                    {note.isPublic ? filterPersonalInfo(note.content) : note.content}
                  </p>

                  {/* 태그 표시 */}
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => {
                      const category = Object.entries(tagCategories).find(([_, tags]) => tags.includes(tag))?.[0] as
                        | keyof typeof tagColors
                        | undefined
                      const colorClass = category
                        ? tagColors[category][tag as keyof (typeof tagColors)[typeof category]]
                        : ""

                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
                        >
                          {emojiMap[tag as keyof typeof emojiMap]} {tag}
                        </span>
                      )
                    })}
                  </div>

                  {/* 공개 일기일 경우 상호작용 표시 */}
                  {note.isPublic && (
                    <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-100">
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors text-xs">
                        <Heart className="w-3 h-3" />
                        <span>5</span>
                      </button>
                      <button className="flex items-center space-x-1 text-slate-500 hover:text-blue-500 transition-colors text-xs">
                        <MessageSquare className="w-3 h-3" />
                        <span>2</span>
                      </button>
                      {note.isPublic && (
                        <div className="flex items-center space-x-1 text-xs text-slate-500 ml-auto">
                          <Shield className="w-3 h-3" />
                          <span>개인정보 보호됨</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                  <Info className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-600">아직 작성된 한 줄 일기가 없습니다.</p>
                <p className="text-slate-500 text-sm mt-1">위에서 첫 번째 일기를 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
