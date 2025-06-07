"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import {
  Activity,
  ArrowLeft,
  Clock,
  Crown,
  MessageCircle,
  Plus,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import { User, Community } from "@/types/community"

export default function CommunitiesPage() {
  const [currentUser] = useState<User>({
    id: "user-1",
    name: "홍길동",
    email: "hong@example.com",
    tags: ["건강", "운동", "요리", "독서"],
    joinedCommunities: ["emotional-wellness"],
    createdAt: "2024-01-01",
    lastActive: "2024-03-20"
  })

  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomDescription, setNewRoomDescription] = useState("")
  const [newRoomTags, setNewRoomTags] = useState<string[]>([])
  const [newRoomCategory, setNewRoomCategory] = useState<Community["category"]>("lifestyle")
  const [showCommunityAlert, setShowCommunityAlert] = useState(false)
  const [pendingCommunity, setPendingCommunity] = useState<Community | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])

  const demoCommunityData: Community[] = [
    {
      id: "emotional-wellness",
      name: "감정 나눔방",
      description: "일상의 감정을 나누고 위로받는 공간",
      category: "relationships",
      tags: ["감정", "일상", "위로", "힐링"],
      memberCount: 128,
      activeMembers: 45,
      todayPosts: 12,
      weeklyGrowth: 15,
      recentActivity: "2시간 전 활동",
      isJoined: true,
      isOwner: false,
      color: "bg-blue-100 text-blue-700",
      createdAt: "2024-01-01",
      diaries: ["diary-1", "diary-2", "diary-3"]
    },
    {
      id: "work-life",
      name: "직장인 커뮤니티",
      description: "직장 생활의 이야기를 나누는 공간",
      category: "career",
      tags: ["직장", "커리어", "성장", "일상"],
      memberCount: 256,
      activeMembers: 89,
      todayPosts: 23,
      weeklyGrowth: 25,
      recentActivity: "1시간 전 활동",
      isJoined: false,
      isOwner: false,
      color: "bg-green-100 text-green-700",
      createdAt: "2024-01-15",
      diaries: ["diary-4", "diary-5"]
    },
    {
      id: "health-fitness",
      name: "건강한 라이프스타일",
      description: "건강한 생활습관을 공유하는 공간",
      category: "health",
      tags: ["건강", "운동", "식단", "웰빙"],
      memberCount: 512,
      activeMembers: 167,
      todayPosts: 45,
      weeklyGrowth: 35,
      recentActivity: "30분 전 활동",
      isJoined: false,
      isOwner: false,
      color: "bg-purple-100 text-purple-700",
      createdAt: "2024-02-01",
      diaries: ["diary-6", "diary-7", "diary-8"]
    }
  ]

  const calculateMatchScore = (community: Community) => {
    const commonTags = community.tags.filter((tag) => currentUser.tags.includes(tag))
    return Math.round((commonTags.length / Math.max(community.tags.length, currentUser.tags.length)) * 100)
  }

  const getRecommendedCommunities = () => {
    return demoCommunityData
      .map((community) => ({
        ...community,
        matchScore: calculateMatchScore(community),
      }))
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  }

  const getTrendingCommunities = () => {
    return demoCommunityData
      .filter((community) => !community.isJoined)
      .sort((a, b) => b.memberCount - a.memberCount)
  }

  const handleJoinCommunity = (community: Community) => {
    if (currentUser.joinedCommunities.length > 0 && !currentUser.joinedCommunities.includes(community.id)) {
      setPendingCommunity(community)
      setShowCommunityAlert(true)
    } else {
      setCommunities((prev) =>
        prev.map((c) => (c.id === community.id ? { ...c, isJoined: true, memberCount: c.memberCount + 1 } : c)),
      )
    }
  }

  const confirmCommunityChange = () => {
    if (pendingCommunity) {
      setCommunities((prev) =>
        prev.map((c) => {
          if (c.id === pendingCommunity.id) {
            return { ...c, isJoined: true, memberCount: c.memberCount + 1 }
          }
          return c
        }),
      )
    }
    setShowCommunityAlert(false)
    setPendingCommunity(null)
  }

  const handleCreateRoom = () => {
    if (newRoomName && newRoomDescription) {
      const newCommunity: Community = {
        id: `custom-${Date.now()}`,
        name: newRoomName,
        description: newRoomDescription,
        category: newRoomCategory,
        tags: newRoomTags,
        memberCount: 1,
        activeMembers: 1,
        todayPosts: 0,
        weeklyGrowth: 0,
        recentActivity: "방금 전 활동",
        isJoined: true,
        isOwner: true,
        color: "bg-blue-100 text-blue-700",
        createdAt: new Date().toISOString(),
        diaries: []
      }

      setCommunities((prev) => [newCommunity, ...prev])
      setShowCreateRoom(false)
      setNewRoomName("")
      setNewRoomDescription("")
      setNewRoomTags([])
      setNewRoomCategory("lifestyle")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">나눔방</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">내 정보</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500">참여 중인 나눔방</div>
                  <p className="text-2xl font-bold text-blue-600">{currentUser.joinedCommunities.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">참여 중인 나눔방</h2>
                <span className="text-sm text-slate-500">{communities.filter((c) => c.isJoined).length}개 참여 중</span>
              </div>

              {communities.filter((c) => c.isJoined).length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">참여 중인 나눔방이 없습니다</h3>
                  <p className="text-slate-500 mb-6">관심 있는 나눔방에 참여해보세요</p>
                  <Button onClick={() => setShowCreateRoom(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    새 나눔방 만들기
                  </Button>
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
                              {community.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
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
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 추천 나눔방 */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">추천 나눔방</h2>
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
                          {community.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
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
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 트렌딩 나눔방 */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">트렌딩 나눔방</h2>
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
          </div>
        </div>
      </div>

      {/* 나눔방 생성 모달 */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-slate-900">새 나눔방 만들기</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateRoom(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">나눔방 이름</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="나눔방 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">설명</label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="나눔방에 대한 설명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "lifestyle", name: "라이프스타일" },
                    { id: "health", name: "건강" },
                    { id: "career", name: "커리어" },
                    { id: "relationships", name: "관계" },
                    { id: "hobbies", name: "취미" },
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setNewRoomCategory(category.id as Community["category"])}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-colors ${
                        newRoomCategory === category.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-900">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">태그</label>
                <div className="flex flex-wrap gap-2">
                  {newRoomTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                    >
                      #{tag}
                      <button
                        onClick={() => setNewRoomTags((prev) => prev.filter((t) => t !== tag))}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="px-2 py-1 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="태그 입력 후 엔터"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        setNewRoomTags((prev) => [...prev, e.currentTarget.value])
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateRoom(false)}>
                취소
              </Button>
              <Button onClick={handleCreateRoom} className="bg-blue-600 hover:bg-blue-700 text-white">
                만들기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 나눔방 변경 확인 모달 */}
      {showCommunityAlert && pendingCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-2">나눔방을 변경하시겠습니까?</h3>
              <p className="text-sm text-slate-600 mb-4">
                현재 <strong>&quot;{pendingCommunity.name}&quot;</strong>에 참여하려고 합니다. 기존 나눔방에서 나가고 새로운
                나눔방에 참여하시겠습니까?
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700 font-medium mb-2">
                  <strong>새 나눔방 정보:</strong>
                </p>
                <p className="text-sm text-blue-700 mt-1">{pendingCommunity.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {pendingCommunity.tags.slice(0, 3).map((tag) => (
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
      )}
    </div>
  )
}
