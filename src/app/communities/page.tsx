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
  Heart,
  MoreHorizontal,
  Crown,
  Activity,
  Calendar,
} from "lucide-react"
import { User, Community } from "@/types/diary"
import Header from "@/components/Header"
import { communityAPI } from "@/lib/api"

export default function SharingRoomsPage() {
  // 현재 사용자 데이터
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    email: "hong@example.com",
    nickname: "홍길동",
    role: "USER"
  })

  const [activeTab, setActiveTab] = useState<"my-rooms" | "recommended" | "all" | "trending">("my-rooms")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomDescription, setNewRoomDescription] = useState("")
  const [newRoomTags, setNewRoomTags] = useState<string[]>([])
  const [newRoomCategory, setNewRoomCategory] = useState<Community["category"]>("lifestyle")
  const [showCommunityAlert, setShowCommunityAlert] = useState(false)
  const [pendingCommunity, setPendingCommunity] = useState<Community | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API 호출 함수들
  const fetchCommunities = async () => {
    try {
      setIsLoading(true)
      const response = await communityAPI.getDefaultCommunities()
      setCommunities(response.data)
    } catch (err) {
      setError("커뮤니티 목록을 불러오는데 실패했습니다.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinCommunity = async (community: Community) => {
    try {
      if (currentUser.joinedCommunities?.length > 0 && !currentUser.joinedCommunities.includes(community.id.toString())) {
        setPendingCommunity(community)
        setShowCommunityAlert(true)
      } else {
        await communityAPI.joinCommunity(community.id, { joinCode: "" })
        setCommunities(prev => 
          prev.map(c => c.id === community.id ? { ...c, isJoined: true } : c)
        )
      }
    } catch (err) {
      console.error(err)
      setError("커뮤니티 참여에 실패했습니다.")
    }
  }

  const confirmCommunityChange = async () => {
    if (pendingCommunity) {
      try {
        await communityAPI.joinCommunity(pendingCommunity.id, { joinCode: "" })
        setCommunities(prev =>
          prev.map(c => {
            if (c.id === pendingCommunity.id) {
              return { ...c, isJoined: true }
            }
            if (c.isJoined) {
              return { ...c, isJoined: false }
            }
            return c
          })
        )
        setShowCommunityAlert(false)
        setPendingCommunity(null)
      } catch (err) {
        console.error(err)
        setError("커뮤니티 변경에 실패했습니다.")
      }
    }
  }

  const handleCreateRoom = async () => {
    if (newRoomName && newRoomDescription) {
      try {
        const newCommunity: CreateCommunityRequest = {
          name: newRoomName,
          description: newRoomDescription,
          tags: newRoomTags,
          category: newRoomCategory
        }
        const response = await communityAPI.createCommunity(newCommunity)
        setCommunities(prev => [response.data, ...prev])
        setShowCreateRoom(false)
        setNewRoomName("")
        setNewRoomDescription("")
        setNewRoomTags([])
        setActiveTab("my-rooms")
      } catch (err) {
        console.error(err)
        setError("커뮤니티 생성에 실패했습니다.")
      }
    }
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  const categories = [
    { id: "all", name: "전체", icon: Users },
    { id: "emotion", name: "감정", icon: Heart },
    { id: "lifestyle", name: "라이프스타일", icon: Star },
    { id: "work", name: "직장/학업", icon: Target },
    { id: "health", name: "건강", icon: Activity },
    { id: "hobby", name: "취미", icon: Sparkles },
  ]

  // 매칭 점수 계산
  const calculateMatchScore = (community: Community) => {
    const commonTags = community.tags?.filter((tag) => currentUser.tags?.includes(tag)) || []
    return Math.round((commonTags.length / Math.max(community.tags?.length || 0, currentUser.tags?.length || 0)) * 100)
  }

  // 추천 클러스터 정렬
  const getRecommendedCommunities = () => {
    return communities
      .map((community) => ({
        ...community,
        matchScore: calculateMatchScore(community),
      }))
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  }

  // 트렌딩 클러스터 (성장률 기준)
  const getTrendingCommunities = () => {
    return communities
      .filter((community) => !community.isJoined)
      .sort((a, b) => b.memberCount - a.memberCount)
  }

  // 필터링된 클러스터
  const getFilteredCommunities = () => {
    let filtered = communities

    if (selectedCategory !== "all") {
      filtered = filtered.filter((community) => community.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filtered
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-slate-900">나눔방</h1>
          <p className="text-slate-500">비슷한 관심사를 가진 사람들과 소통해보세요</p>
        </div>

        {/* 사용자 정보 카드 수정 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-lg font-medium text-slate-600">
                  {currentUser.nickname?.[0] || currentUser.email[0]}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-medium text-slate-900">{currentUser.nickname || currentUser.email}</h2>
                <p className="text-sm text-slate-500">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">참여 중인 나눔방</p>
                <p className="text-2xl font-bold text-blue-600">{currentUser.joinedCommunities?.length || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">내 관심 태그</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentUser.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                  {currentUser.tags && currentUser.tags.length > 3 && (
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
                <span className="text-sm text-slate-500">{communities.filter((c) => c.isJoined).length}개 참여 중</span>
              </div>

              {communities.filter((c) => c.isJoined).length === 0 ? (
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
                  {communities
                    .filter((c) => c.isJoined)
                    .map((community) => (
                      <div key={community.id} className="bg-white rounded-lg border border-slate-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{community.name}</h3>
                              {community.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                              <span className={`px-2 py-1 rounded-full text-xs ${community.color}`}>
                                {community.memberCount}명
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{community.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {community.tags?.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="flex items-center">
                                <Activity className="w-3 h-3 mr-1" />
                                활성 멤버 {community.activeMembers}명
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                오늘 {community.todayPosts}개 글
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
                {getRecommendedCommunities().map((community) => (
                  <div
                    key={community.id}
                    className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-900">{community.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${community.color}`}>
                            {community.memberCount}명
                          </span>
                          {community.matchScore && community.matchScore > 60 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <Star className="w-3 h-3 inline mr-1" />
                              {community.matchScore}% 매칭
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{community.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {community.tags?.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 rounded text-xs ${
                                currentUser.tags?.includes(tag)
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
                            {community.recentActivity}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            주간 +{community.weeklyGrowth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinCommunity(community)}
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
                {getTrendingCommunities().map((community, index) => (
                  <div key={community.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-slate-900">{community.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${community.color}`}>{community.memberCount}명</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{community.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                        주간 +{community.weeklyGrowth}%
                      </span>
                      <span className="flex items-center">
                        <Activity className="w-3 h-3 mr-1" />
                        활성 {community.activeMembers}명
                      </span>
                    </div>
                    <Button
                      onClick={() => handleJoinCommunity(community)}
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
                <span className="text-sm text-slate-500">{getFilteredCommunities().length}개 나눔방</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredCommunities().map((community) => (
                  <div key={community.id} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-slate-900">{community.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${community.color}`}>
                            {community.memberCount}명
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{community.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {community.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {community.tags && community.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          +{community.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {community.createdAt.toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Activity className="w-3 h-3 mr-1" />
                        활발한 활동
                      </span>
                    </div>
                    <Button
                      onClick={() => handleJoinCommunity(community)}
                      variant={community.isJoined ? "outline" : "default"}
                      className={`w-full ${
                        community.isJoined
                          ? "text-slate-600 border-slate-200"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {community.isJoined ? "참여 중" : "참여하기"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 최근 활동 피드 */}
        {/* <div className="mt-12">
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
        </div> */}
      </main>

      {/* 클러스터 변경 확인 모달 */}
      {showCommunityAlert && pendingCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-slate-900 mb-2">나눔방을 변경하시겠습니까?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  현재 <strong>"{pendingCommunity.name}"</strong>에 참여하려고 합니다. 기존 나눔방에서 나가고 새로운
                  나눔방에 참여하시겠습니까?
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>새 나눔방 정보:</strong>
                  </p>
                  <p className="text-sm text-blue-700 mt-1">{pendingCommunity.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pendingCommunity.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={confirmCommunityChange} className="bg-blue-600 hover:bg-blue-700 text-white">
                    변경하기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCommunityAlert(false)
                      setPendingCommunity(null)
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
                        onClick={() => setNewRoomCategory(category.id as Community["category"])}
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
                  {currentUser.tags?.map((tag) => (
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
