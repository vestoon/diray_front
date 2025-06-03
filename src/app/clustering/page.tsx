"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import {
  X,
  Users,
  Plus,
  Star,
  AlertTriangle,
  Search,
  MessageCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  Target,
  Settings,
  Bell,
  Heart,
  Share2,
  MoreHorizontal,
  Crown,
  Activity,
  Calendar,
  ArrowLeft,
} from "lucide-react"

interface User {
  id: string
  name: string
  avatar: string
  tags: string[]
  joinedClusters: string[]
  recentActivity: string
}

interface Cluster {
  id: string
  name: string
  description: string
  tags: string[]
  memberCount: number
  color: string
  isRecommended: boolean
  recentActivity: string
  matchScore?: number
  createdAt: Date
  isJoined: boolean
  isOwner: boolean
  category: "emotion" | "lifestyle" | "work" | "health" | "hobby"
  activeMembers: number
  todayPosts: number
  weeklyGrowth: number
}

interface Post {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: Date
  likes: number
  comments: number
  tags: string[]
  clusterId: string
}

export default function SharingRoomsPage() {
  // 현재 사용자 데이터
  const [currentUser] = useState<User>({
    id: "user1",
    name: "김일기",
    avatar: "/placeholder.svg?height=40&width=40&text=김",
    tags: ["감정", "직장", "스트레스", "성장", "일상"],
    joinedClusters: ["emotional-wellness"],
    recentActivity: "2시간 전 활동",
  })

  const [activeTab, setActiveTab] = useState<"my-rooms" | "recommended" | "all" | "trending">("my-rooms")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomDescription, setNewRoomDescription] = useState("")
  const [newRoomTags, setNewRoomTags] = useState<string[]>([])
  const [newRoomCategory, setNewRoomCategory] = useState<Cluster["category"]>("lifestyle")
  const [showClusterAlert, setShowClusterAlert] = useState(false)
  const [pendingCluster, setPendingCluster] = useState<Cluster | null>(null)
  const [clusters, setClusters] = useState<Cluster[]>([])

  // 데모 데이터
  const demoClusterData: Cluster[] = [
    {
      id: "emotional-wellness",
      name: "감정 웰빙 모임",
      description: "감정 관리와 정신 건강에 관심이 있는 분들이 모여 서로의 경험을 나누고 위로받는 공간입니다.",
      tags: ["감정", "불안", "스트레스", "힐링", "명상", "치유"],
      memberCount: 127,
      color: "bg-purple-100 text-purple-800",
      isRecommended: true,
      recentActivity: "방금 전",
      createdAt: new Date("2024-01-15"),
      isJoined: true,
      isOwner: false,
      category: "emotion",
      activeMembers: 23,
      todayPosts: 8,
      weeklyGrowth: 12,
    },
    {
      id: "daily-life",
      name: "소소한 일상 나눔",
      description: "평범한 하루하루의 소중함을 발견하고 나누는 따뜻한 커뮤니티입니다.",
      tags: ["일상", "취미", "음식", "여행", "반려동물", "독서"],
      memberCount: 89,
      color: "bg-blue-100 text-blue-800",
      isRecommended: false,
      recentActivity: "5분 전",
      createdAt: new Date("2024-02-01"),
      isJoined: false,
      isOwner: false,
      category: "lifestyle",
      activeMembers: 15,
      todayPosts: 12,
      weeklyGrowth: 8,
    },
    {
      id: "work-life",
      name: "직장인 성장 클럽",
      description: "직장 생활의 고민을 나누고 함께 성장해나가는 직장인들의 모임입니다.",
      tags: ["직장", "일", "성장", "목표", "커리어", "동기부여"],
      memberCount: 156,
      color: "bg-green-100 text-green-800",
      isRecommended: true,
      recentActivity: "10분 전",
      createdAt: new Date("2024-01-20"),
      isJoined: false,
      isOwner: false,
      category: "work",
      activeMembers: 31,
      todayPosts: 15,
      weeklyGrowth: 18,
    },
    {
      id: "health-fitness",
      name: "건강한 라이프",
      description: "운동, 식단, 수면 등 건강한 생활습관을 만들어가는 사람들의 공간입니다.",
      tags: ["운동", "건강", "피로", "수면", "식단", "요가"],
      memberCount: 73,
      color: "bg-orange-100 text-orange-800",
      isRecommended: false,
      recentActivity: "1시간 전",
      createdAt: new Date("2024-02-10"),
      isJoined: false,
      isOwner: false,
      category: "health",
      activeMembers: 18,
      todayPosts: 6,
      weeklyGrowth: 5,
    },
    {
      id: "creative-minds",
      name: "창작자들의 아지트",
      description: "글쓰기, 그림, 음악 등 창작 활동을 하는 분들이 영감을 나누는 곳입니다.",
      tags: ["창작", "글쓰기", "그림", "음악", "영감", "예술"],
      memberCount: 45,
      color: "bg-pink-100 text-pink-800",
      isRecommended: true,
      recentActivity: "30분 전",
      createdAt: new Date("2024-02-15"),
      isJoined: false,
      isOwner: false,
      category: "hobby",
      activeMembers: 12,
      todayPosts: 4,
      weeklyGrowth: 22,
    },
    {
      id: "student-life",
      name: "학생 라이프",
      description: "학업, 진로, 인간관계 등 학생들의 고민을 함께 나누는 공간입니다.",
      tags: ["학교", "공부", "시험", "진로", "친구", "스트레스"],
      memberCount: 92,
      color: "bg-indigo-100 text-indigo-800",
      isRecommended: false,
      recentActivity: "2시간 전",
      createdAt: new Date("2024-01-25"),
      isJoined: false,
      isOwner: false,
      category: "lifestyle",
      activeMembers: 20,
      todayPosts: 9,
      weeklyGrowth: 15,
    },
  ]

  const demoPosts: Post[] = [
    {
      id: "post1",
      author: "힐링러버",
      avatar: "/placeholder.svg?height=32&width=32&text=힐",
      content: "오늘 명상을 처음 해봤는데 마음이 정말 평온해졌어요. 5분이라도 꾸준히 해보려고 합니다.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      likes: 12,
      comments: 3,
      tags: ["명상", "힐링"],
      clusterId: "emotional-wellness",
    },
    {
      id: "post2",
      author: "직장인김씨",
      avatar: "/placeholder.svg?height=32&width=32&text=김",
      content: "팀 프로젝트가 성공적으로 마무리되었습니다! 함께 고생한 동료들에게 감사해요.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      likes: 8,
      comments: 5,
      tags: ["성취", "감사"],
      clusterId: "work-life",
    },
    {
      id: "post3",
      author: "운동매니아",
      avatar: "/placeholder.svg?height=32&width=32&text=운",
      content: "새벽 러닝 3주차! 체력이 늘어나는 게 느껴져서 기분이 좋네요 💪",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      likes: 15,
      comments: 7,
      tags: ["운동", "성장"],
      clusterId: "health-fitness",
    },
  ]

  const categories = [
    { id: "all", name: "전체", icon: Users },
    { id: "emotion", name: "감정", icon: Heart },
    { id: "lifestyle", name: "라이프스타일", icon: Star },
    { id: "work", name: "직장/학업", icon: Target },
    { id: "health", name: "건강", icon: Activity },
    { id: "hobby", name: "취미", icon: Sparkles },
  ]

  // 매칭 점수 계산
  const calculateMatchScore = (cluster: Cluster) => {
    const commonTags = cluster.tags.filter((tag) => currentUser.tags.includes(tag))
    return Math.round((commonTags.length / Math.max(cluster.tags.length, currentUser.tags.length)) * 100)
  }

  // 추천 클러스터 정렬
  const getRecommendedClusters = () => {
    return demoClusterData
      .map((cluster) => ({
        ...cluster,
        matchScore: calculateMatchScore(cluster),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4)
  }

  // 트렌딩 클러스터 (성장률 기준)
  const getTrendingClusters = () => {
    return demoClusterData
      .filter((cluster) => !cluster.isJoined)
      .sort((a, b) => b.weeklyGrowth - a.weeklyGrowth)
      .slice(0, 6)
  }

  // 필터링된 클러스터
  const getFilteredClusters = () => {
    let filtered = demoClusterData

    if (selectedCategory !== "all") {
      filtered = filtered.filter((cluster) => cluster.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (cluster) =>
          cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cluster.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cluster.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    return filtered
  }

  // 클러스터 참여
  const handleJoinCluster = (cluster: Cluster) => {
    if (currentUser.joinedClusters.length > 0 && !currentUser.joinedClusters.includes(cluster.id)) {
      setPendingCluster(cluster)
      setShowClusterAlert(true)
    } else {
      // 직접 참여
      setClusters((prev) =>
        prev.map((c) => (c.id === cluster.id ? { ...c, isJoined: true, memberCount: c.memberCount + 1 } : c)),
      )
    }
  }

  // 클러스터 변경 확인
  const confirmClusterChange = () => {
    if (pendingCluster) {
      setClusters((prev) =>
        prev.map((c) => {
          if (c.id === pendingCluster.id) {
            return { ...c, isJoined: true, memberCount: c.memberCount + 1 }
          }
          if (c.isJoined) {
            return { ...c, isJoined: false, memberCount: c.memberCount - 1 }
          }
          return c
        }),
      )
      setShowClusterAlert(false)
      setPendingCluster(null)
    }
  }

  // 새 나눔방 생성
  const handleCreateRoom = () => {
    if (newRoomName && newRoomDescription) {
      const newCluster: Cluster = {
        id: `custom-${Date.now()}`,
        name: newRoomName,
        description: newRoomDescription,
        tags: newRoomTags,
        memberCount: 1,
        color: "bg-blue-100 text-blue-800",
        isRecommended: false,
        recentActivity: "방금 전",
        createdAt: new Date(),
        isJoined: true,
        isOwner: true,
        category: newRoomCategory,
        activeMembers: 1,
        todayPosts: 0,
        weeklyGrowth: 0,
      }

      setClusters((prev) => [newCluster, ...prev])
      setShowCreateRoom(false)
      setNewRoomName("")
      setNewRoomDescription("")
      setNewRoomTags([])
      setActiveTab("my-rooms")
    }
  }

  useEffect(() => {
    setClusters(demoClusterData)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">나눔방</h1>
                <p className="text-sm text-slate-500">비슷한 관심사를 가진 사람들과 소통해보세요</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowCreateRoom(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />새 나눔방
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 사용자 정보 카드 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-lg font-medium text-slate-900">{currentUser.name}</h2>
                <p className="text-sm text-slate-500">{currentUser.recentActivity}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">참여 중인 나눔방</p>
                <p className="text-2xl font-bold text-blue-600">{currentUser.joinedClusters.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">내 관심 태그</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentUser.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                  {currentUser.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      +{currentUser.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 bg-white rounded-lg border border-slate-200 p-1 mb-8">
          <button
            onClick={() => setActiveTab("my-rooms")}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "my-rooms"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />내 나눔방
          </button>
          <button
            onClick={() => setActiveTab("recommended")}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "recommended"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            추천
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "trending"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            트렌딩
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Search className="w-4 h-4 mr-2" />
            전체 둘러보기
          </button>
        </div>

        {/* 검색 및 필터 (전체 둘러보기 탭에서만) */}
        {activeTab === "all" && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="나눔방 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* 컨텐츠 */}
        <div className="space-y-8">
          {/* 내 나눔방 */}
          {activeTab === "my-rooms" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">참여 중인 나눔방</h2>
                <span className="text-sm text-slate-500">{clusters.filter((c) => c.isJoined).length}개 참여 중</span>
              </div>

              {clusters.filter((c) => c.isJoined).length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">아직 참여한 나눔방이 없어요</h3>
                  <p className="text-slate-500 mb-6">관심사에 맞는 나눔방을 찾아 참여해보세요</p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      onClick={() => setActiveTab("recommended")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      추천 나눔방 보기
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateRoom(true)}>
                      <Plus className="w-4 h-4 mr-2" />새 나눔방 만들기
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {clusters
                    .filter((c) => c.isJoined)
                    .map((cluster) => (
                      <div key={cluster.id} className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{cluster.name}</h3>
                              {cluster.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                              <span className={`px-2 py-1 rounded-full text-xs ${cluster.color}`}>
                                {cluster.memberCount}명
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{cluster.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {cluster.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="flex items-center">
                                <Activity className="w-3 h-3 mr-1" />
                                활성 멤버 {cluster.activeMembers}명
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                오늘 {cluster.todayPosts}개 글
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            입장하기
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 추천 나눔방 */}
          {activeTab === "recommended" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">당신을 위한 추천</h2>
                <span className="text-sm text-slate-500">태그 기반 매칭</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getRecommendedClusters().map((cluster) => (
                  <div
                    key={cluster.id}
                    className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-900">{cluster.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${cluster.color}`}>
                            {cluster.memberCount}명
                          </span>
                          {cluster.matchScore && cluster.matchScore > 60 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <Star className="w-3 h-3 inline mr-1" />
                              {cluster.matchScore}% 매칭
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{cluster.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {cluster.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 rounded text-xs ${
                                currentUser.tags.includes(tag)
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {cluster.recentActivity}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            주간 +{cluster.weeklyGrowth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinCluster(cluster)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      참여하기
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 트렌딩 나눔방 */}
          {activeTab === "trending" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">지금 뜨는 나눔방</h2>
                <span className="text-sm text-slate-500">성장률 기준</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTrendingClusters().map((cluster, index) => (
                  <div key={cluster.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-slate-900">{cluster.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${cluster.color}`}>{cluster.memberCount}명</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{cluster.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                        주간 +{cluster.weeklyGrowth}%
                      </span>
                      <span className="flex items-center">
                        <Activity className="w-3 h-3 mr-1" />
                        활성 {cluster.activeMembers}명
                      </span>
                    </div>
                    <Button
                      onClick={() => handleJoinCluster(cluster)}
                      variant="outline"
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      참여하기
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 전체 둘러보기 */}
          {activeTab === "all" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">모든 나눔방</h2>
                <span className="text-sm text-slate-500">{getFilteredClusters().length}개 나눔방</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredClusters().map((cluster) => (
                  <div key={cluster.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-slate-900">{cluster.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${cluster.color}`}>
                            {cluster.memberCount}명
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{cluster.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cluster.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {cluster.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          +{cluster.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {cluster.createdAt.toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Activity className="w-3 h-3 mr-1" />
                        활발한 활동
                      </span>
                    </div>
                    <Button
                      onClick={() => handleJoinCluster(cluster)}
                      variant={cluster.isJoined ? "outline" : "default"}
                      className={`w-full ${
                        cluster.isJoined
                          ? "text-slate-600 border-slate-200"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {cluster.isJoined ? "참여 중" : "참여하기"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 최근 활동 피드 */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">최근 활동</h2>
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
            {demoPosts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex items-start space-x-3">
                  <img src={post.avatar || "/placeholder.svg"} alt={post.author} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-900">{post.author}</span>
                      <span className="text-sm text-slate-500">
                        {clusters.find((c) => c.id === post.clusterId)?.name}
                      </span>
                      <span className="text-sm text-slate-400">
                        {Math.floor((Date.now() - post.timestamp.getTime()) / (1000 * 60))}분 전
                      </span>
                    </div>
                    <p className="text-slate-700 mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <button className="flex items-center space-x-1 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-500">
                        <Share2 className="w-4 h-4" />
                        <span>공유</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 클러스터 변경 확인 모달 */}
      {showClusterAlert && pendingCluster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-slate-900 mb-2">나눔방을 변경하시겠습니까?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  현재 <strong>"{pendingCluster.name}"</strong>에 참여하려고 합니다. 기존 나눔방에서 나가고 새로운
                  나눔방에 참여하시겠습니까?
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>새 나눔방 정보:</strong>
                  </p>
                  <p className="text-sm text-blue-700 mt-1">{pendingCluster.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pendingCluster.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={confirmClusterChange} className="bg-blue-600 hover:bg-blue-700 text-white">
                    변경하기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowClusterAlert(false)
                      setPendingCluster(null)
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 새 나눔방 만들기 모달 */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">새 나눔방 만들기</h3>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">나눔방 이름</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="예: 직장인 힐링 모임"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">카테고리</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(1).map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setNewRoomCategory(category.id as Cluster["category"])}
                        className={`flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-colors ${
                          newRoomCategory === category.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">설명</label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  placeholder="나눔방에 대한 간단한 설명을 작성해주세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">관련 태그</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentUser.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (!newRoomTags.includes(tag)) {
                          setNewRoomTags([...newRoomTags, tag])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        newRoomTags.includes(tag)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                {newRoomTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newRoomTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => setNewRoomTags(newRoomTags.filter((t) => t !== tag))}
                          className="ml-2 w-4 h-4 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowCreateRoom(false)}>
                  취소
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName || !newRoomDescription}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  만들기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
