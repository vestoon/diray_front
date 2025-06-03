"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "../components/ui/button"
import { ArrowLeft, Type, PenTool, Smile, Tag, Save, Eye, EyeOff, Trash2, Download, Wand2, Calendar, Clock, MapPin, Camera, Upload, X, Edit, RotateCw, Crop, Palette, Filter, Hash, Users } from 'lucide-react'
import { RichTextEditor } from "../components/ui/rich-text-editor"

// 고급 이미지 업로드 컴포넌트
const AdvancedImageUpload = ({
  images,
  onImagesChange,
}: {
  images: Array<{ url: string; name: string; size: number }>
  onImagesChange: (images: Array<{ url: string; name: string; size: number }>) => void
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

      processFiles(files)
    },
    [images, onImagesChange],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const processFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          const newImage = {
            url: e.target.result as string,
            name: file.name,
            size: file.size,
          }
          onImagesChange([...images, newImage])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* 드래그 앤 드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-900">사진을 드래그하여 업로드하거나</p>
            <p className="text-sm text-slate-500 mt-1">JPG, PNG, GIF 파일을 지원합니다 (최대 10MB)</p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Camera className="w-4 h-4 mr-2" />
            파일 선택
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* 업로드된 이미지들 */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">업로드된 사진 ({images.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="aspect-video relative">
                  <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-full object-cover" />

                  {/* 이미지 오버레이 */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                        onClick={() => setSelectedImage(index)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900"
                        title="편집"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 이미지 정보 */}
                <div className="p-3">
                  <p className="text-sm font-medium text-slate-900 truncate">{image.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(image.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 이미지 편집 모달 (선택된 이미지가 있을 때) */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">이미지 편집</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <img
                  src={images[selectedImage].url || "/placeholder.svg"}
                  alt="편집 중인 이미지"
                  className="w-full h-64 object-contain bg-slate-50 rounded"
                />
              </div>

              {/* 편집 도구 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" size="sm">
                  <RotateCw className="w-4 h-4 mr-2" />
                  회전
                </Button>
                <Button variant="outline" size="sm">
                  <Crop className="w-4 h-4 mr-2" />
                  자르기
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  필터
                </Button>
                <Button variant="outline" size="sm">
                  <Palette className="w-4 h-4 mr-2" />
                  보정
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  취소
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">적용</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Component() {
  // 나눔방 클러스터링 관련 상태 추가
  const [showSharingRooms, setShowSharingRooms] = useState(false)
  const [userCluster, setUserCluster] = useState<string | null>(null)
  const [availableClusters, setAvailableClusters] = useState([
    {
      id: "emotional-wellness",
      name: "감정 웰빙",
      description: "감정 관리와 정신 건강에 관심이 있는 분들",
      tags: ["감정", "불안", "스트레스", "힐링"],
      memberCount: 127,
      color: "bg-purple-100 text-purple-800",
      isRecommended: true,
    },
    {
      id: "daily-life",
      name: "일상 공유",
      description: "소소한 일상과 취미를 나누는 공간",
      tags: ["일상", "취미", "음식", "여행"],
      memberCount: 89,
      color: "bg-blue-100 text-blue-800",
      isRecommended: false,
    },
    {
      id: "work-life",
      name: "직장인 모임",
      description: "직장 생활과 커리어에 대한 이야기",
      tags: ["직장", "일", "성장", "목표"],
      memberCount: 156,
      color: "bg-green-100 text-green-800",
      isRecommended: true,
    },
    {
      id: "health-fitness",
      name: "건강 관리",
      description: "운동과 건강한 라이프스타일",
      tags: ["운동", "건강", "피로", "수면"],
      memberCount: 73,
      color: "bg-orange-100 text-orange-800",
      isRecommended: false,
    },
  ])
  const [showClusterChangeAlert, setShowClusterChangeAlert] = useState(false)
  const [suggestedCluster, setSuggestedCluster] = useState<string | null>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)
  // 한 줄 일기 목록 상태 추가
  const [oneLineDiaries, setOneLineDiaries] = useState<
    Array<{
      id: string
      text: string
      timestamp: Date
      mood?: string
      tags: string[]
      isPublic: boolean
    }>
  >([
    {
      id: "1",
      text: "오늘 친구와 맛있는 커피를 마셨다",
      timestamp: new Date(),
      mood: "happy",
      tags: ["일상", "친구"],
      isPublic: true,
    },
    {
      id: "2",
      text: "새로운 프로젝트 시작이 설렌다",
      timestamp: new Date(),
      mood: "excited",
      tags: ["일", "설렘"],
      isPublic: false,
    },
    {
      id: "3",
      text: "비 오는 날씨가 우울하다",
      timestamp: new Date(),
      mood: "sad",
      tags: ["감정", "날씨"],
      isPublic: true,
    },
  ])
  const [newOneLineDiary, setNewOneLineDiary] = useState("")
  const [activeTab, setActiveTab] = useState<"text" | "handwriting">("text")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState("")
  const [images, setImages] = useState<Array<{ url: string; name: string; size: number }>>([])
  const [isPublic, setIsPublic] = useState(false)
  const [showPrivacyFilter, setShowPrivacyFilter] = useState(false)
  const [filteredContent, setFilteredContent] = useState("")
  const [showAIHelp, setShowAIHelp] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [lastCursorActivity, setLastCursorActivity] = useState(Date.now())

  // 손글씨 관련 상태
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(3)
  const [brushColor, setBrushColor] = useState("#000000")
  const [handwritingText, setHandwritingText] = useState("")
  const [isOCRProcessing, setIsOCRProcessing] = useState(false)

  const moods = [
    { emoji: "😊", label: "행복", value: "happy", color: "bg-yellow-100 text-yellow-800" },
    { emoji: "😢", label: "슬픔", value: "sad", color: "bg-blue-100 text-blue-800" },
    { emoji: "😠", label: "화남", value: "angry", color: "bg-red-100 text-red-800" },
    { emoji: "😌", label: "평온", value: "peaceful", color: "bg-green-100 text-green-800" },
    { emoji: "😴", label: "피곤", value: "tired", color: "bg-gray-100 text-gray-800" },
    { emoji: "🤗", label: "감사", value: "grateful", color: "bg-purple-100 text-purple-800" },
    { emoji: "😰", label: "불안", value: "anxious", color: "bg-orange-100 text-orange-800" },
    { emoji: "🤔", label: "생각", value: "thoughtful", color: "bg-indigo-100 text-indigo-800" },
  ]

  const emotionTags = ["기쁨", "슬픔", "분노", "불안", "설렘", "지루함", "외로움", "만족", "실망"]
  const situationTags = ["직장", "학교", "가족", "친구", "연인", "여행", "운동", "취미", "휴식"]
  const healthTags = ["두통", "피로", "긴장", "식욕 감소", "불면"]

  // 손글씨 캔버스 관련 함수들
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineWidth = brushSize
      ctx.strokeStyle = brushColor
      ctx.lineCap = "round"
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setHandwritingText("")
  }

  // OCR 기능 (실제로는 외부 API 사용)
  const performOCR = async () => {
    setIsOCRProcessing(true)

    // 실제 구현에서는 Canvas 이미지를 OCR API로 전송
    setTimeout(() => {
      const mockOCRResult =
        "오늘은 정말 좋은 하루였다. 친구들과 함께 카페에서 즐거운 시간을 보냈고, 새로운 책도 읽기 시작했다. 작은 일상의 행복을 느낄 수 있어서 감사하다."
      setHandwritingText(mockOCRResult)
      setIsOCRProcessing(false)
    }, 2000)
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    return {
      date: now.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
      time: now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const { date, time } = getCurrentDateTime()

  const filterPersonalInfo = (text: string) => {
    // 간단한 개인정보 필터링 예시
    return text
      .replace(/\d{3}-\d{4}-\d{4}/g, "***-****-****") // 전화번호
      .replace(/[가-힣]{2,3}(?=님|씨|이|가)/g, "○○○") // 이름
      .replace(/\d{4}년 \d{1,2}월 \d{1,2}일/g, "○○○○년 ○월 ○일") // 구체적인 날짜
      .replace(/[서울|부산|대구|인천|광주|대전|울산][시구군]\s*[가-힣동로길]+/g, "○○지역") // 주소
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
                <h1 className="text-lg font-semibold text-slate-900">새 일기 작성</h1>
                <p className="text-sm text-slate-500">
                  {date} {time}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSharingRooms(true)}
                className="hidden sm:flex"
              >
                <Users className="w-4 h-4 mr-2" />
                나눔방
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)} className="hidden sm:flex">
                {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {isPreview ? "편집" : "미리보기"}
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 한 줄 일기 목록 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">오늘의 한 줄 일기</h2>

          {/* 한 줄 일기 입력 */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="오늘 하루를 한 줄로 표현해보세요..."
              value={newOneLineDiary}
              onChange={(e) => setNewOneLineDiary(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyPress={(e) => {
                if (e.key === "Enter" && newOneLineDiary.trim()) {
                  setOneLineDiaries([
                    {
                      id: Date.now().toString(),
                      text: newOneLineDiary,
                      timestamp: new Date(),
                      mood: selectedMood,
                      tags: tags,
                      isPublic: isPublic,
                    },
                    ...oneLineDiaries,
                  ])
                  setNewOneLineDiary("")
                }
              }}
            />
            <Button
              onClick={() => {
                if (newOneLineDiary.trim()) {
                  setOneLineDiaries([
                    {
                      id: Date.now().toString(),
                      text: newOneLineDiary,
                      timestamp: new Date(),
                      mood: selectedMood,
                      tags: tags,
                      isPublic: isPublic,
                    },
                    ...oneLineDiaries,
                  ])
                  setNewOneLineDiary("")
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              추가
            </Button>
          </div>

          {/* 한 줄 일기 목록 */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {oneLineDiaries.map((diary) => (
              <div key={diary.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-slate-800">{diary.text}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-500">
                      {diary.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {diary.mood && <span className="text-sm">{moods.find((m) => m.value === diary.mood)?.emoji}</span>}
                    <div className="flex space-x-1">
                      {diary.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${diary.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {diary.isPublic ? "공개" : "비공개"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setContent(content + "\n\n" + diary.text)
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        {!isPreview ? (
          <div className="space-y-6">
            {/* 제목 입력 */}
            <div>
              <input
                type="text"
                placeholder="일기 제목을 입력하세요..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold text-slate-900 placeholder-slate-400 border-none outline-none bg-transparent"
              />
            </div>

            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <input
                  type="text"
                  placeholder="위치"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none outline-none placeholder-slate-400"
                />
              </div>
            </div>

            {/* 작성 모드 탭 */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab("text")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "text" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Type className="w-4 h-4" />
                <span>리치 텍스트</span>
              </button>
              <button
                onClick={() => setActiveTab("handwriting")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "handwriting"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>손글씨</span>
              </button>
            </div>

            {/* 리치 텍스트 에디터 */}
            {activeTab === "text" && (
              <div className="space-y-4">
                <RichTextEditor
                  content={content}
                  onChange={(newContent) => {
                    setContent(newContent)
                    setLastCursorActivity(Date.now())

                    // 5초간 입력이 없으면 AI 도움 제안
                    setTimeout(() => {
                      if (Date.now() - lastCursorActivity >= 4900 && newContent.length > 10 && !showAIHelp) {
                        setShowAIHelp(true)
                        setAiSuggestion("이런 일이 있었다고 적었는데 그때 기분은 어땠나요?")
                      }
                    }, 5000)
                  }}
                  placeholder="오늘 하루는 어떠셨나요? 자유롭게 작성해보세요..."
                />

                {/* AI 도움 제안 */}
                {showAIHelp && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Wand2 className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-800 mb-1">AI 도움</h4>
                        <p className="text-sm text-purple-700 mb-3">{aiSuggestion}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setContent(content + "\n\n" + aiSuggestion)
                              setShowAIHelp(false)
                            }}
                          >
                            질문 추가
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setAiSuggestion("오늘 가장 기억에 남는 순간은 언제였나요?")
                            }}
                          >
                            다른 질문
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowAIHelp(false)}>
                            닫기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 손글씨 작성 모드 */}
            {activeTab === "handwriting" && (
              <div className="space-y-4">
                {/* 손글씨 도구 */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-slate-700">굵기:</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-slate-600">{brushSize}px</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-slate-700">색상:</label>
                      <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCanvas}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      지우기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={performOCR}
                      disabled={isOCRProcessing}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isOCRProcessing ? "변환 중..." : "텍스트 변환"}
                    </Button>
                  </div>
                </div>

                {/* 손글씨 캔버스 */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-96 border border-slate-100 rounded cursor-crosshair"
                    style={{ touchAction: "none" }}
                  />
                </div>

                {/* OCR 결과 */}
                {handwritingText && (
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-blue-900">변환된 텍스트</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setContent(content + "\n\n" + handwritingText)}
                        className="text-blue-600 hover:bg-blue-100"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        텍스트에 추가
                      </Button>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{handwritingText}</p>
                  </div>
                )}
              </div>
            )}

            {/* 고급 이미지 업로드 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">사진</h3>
              <AdvancedImageUpload images={images} onImagesChange={setImages} />
            </div>

            {/* 감정 선택 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 flex items-center">
                <Smile className="w-5 h-5 mr-2 text-yellow-500" />
                오늘의 기분
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-all ${
                      selectedMood === mood.value
                        ? `border-blue-500 ${mood.color}`
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 태그 - 카테고리별로 구분 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-green-500" />
                태그
              </h3>

              {/* 태그 입력 */}
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="태그를 입력하세요..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag(newTag)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                <Button
                  onClick={() => addTag(newTag)}
                  disabled={!newTag}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  추가
                </Button>
              </div>

              {/* 카테고리별 추천 태그 */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">감정:</p>
                  <div className="flex flex-wrap gap-2">
                    {emotionTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">상황:</p>
                  <div className="flex flex-wrap gap-2">
                    {situationTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">건강:</p>
                  <div className="flex flex-wrap gap-2">
                    {healthTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 선택된 태그 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 w-4 h-4 text-blue-600 hover:text-blue-800">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 공개/비공개 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-500" />
                공개 설정
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">비공개</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">공개</span>
                  </label>
                </div>

                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {isPublic ? (
                    <div>
                      <p className="font-medium text-slate-700 mb-1">공개 일기:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>비슷한 관심사를 가진 사람들에게 추천될 수 있습니다</li>
                        <li>다른 사용자가 댓글을 달 수 있습니다</li>
                        <li>개인정보 필터링이 자동으로 적용됩니다</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-slate-700 mb-1">비공개 일기:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>오직 본인만 볼 수 있습니다</li>
                        <li>검색되지 않으며 추천되지 않습니다</li>
                        <li>개인정보 필터링 없이 자유롭게 작성 가능합니다</li>
                      </ul>
                    </div>
                  )}
                </div>

                {isPublic && (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilteredContent(filterPersonalInfo(content))
                        setShowPrivacyFilter(true)
                      }}
                      className="w-full"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      개인정보 필터링 미리보기
                    </Button>

                    {showPrivacyFilter && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-2">필터링된 내용:</h4>
                        <div className="bg-white p-3 rounded border text-sm text-slate-700 mb-3">
                          {filteredContent || "내용이 없습니다."}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => setContent(filteredContent)}>
                            필터링된 내용으로 교체
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowPrivacyFilter(false)}>
                            닫기
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 미리보기 모드 */
          <div className="bg-white rounded-lg border border-slate-200 p-8 space-y-6">
            <div className="border-b border-slate-200 pb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{title || "제목 없음"}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span>{date}</span>
                <span>{time}</span>
                {location && <span>📍 {location}</span>}
                {selectedMood && (
                  <span className="flex items-center space-x-1">
                    <span>{moods.find((m) => m.value === selectedMood)?.emoji}</span>
                    <span>{moods.find((m) => m.value === selectedMood)?.label}</span>
                  </span>
                )}
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url || "/placeholder.svg"}
                    alt={`이미지 ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content || "내용이 없습니다." }} />
            </div>

            {handwritingText && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">손글씨 내용</h3>
                <p className="text-slate-700 leading-relaxed">{handwritingText}</p>
              </div>
            )}

            {tags.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
