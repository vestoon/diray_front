import api from './axios'
import { 
  ApiResponse 
} from '@/types/api'
import { 
  Diary, 
  OneLineDiary, 
  CreateDiaryRequest,
  UpdateDiaryRequest,
  CreateOneLineDiaryRequest,
  UpdateOneLineDiaryRequest
} from '@/types/diary'
import { 
  Community,
  CreateCommunityRequest,
  JoinCommunityRequest,
  UpdateCommunityRequest, // 추가
} from '@/types/community'
import { AuthUser } from '@/types/user'
import {
  UserClusteringResult,
  RecallSummariesResponse,
  EmotionBasedRecommendationsResponse,
  RecallSummariesRequest
} from '@/types/analysis'

// Diary API
export const diaryAPI = {
  // 새로운 일기 생성
  createDiary: async (data: CreateDiaryRequest): Promise<ApiResponse<Diary>> => {
    const response = await api.post<ApiResponse<Diary>>('/diaries', data)
    return response.data
  },

  // ID로 일기 조회
  getDiary: async (id: number): Promise<ApiResponse<Diary>> => {
    const response = await api.get<ApiResponse<Diary>>(`/diaries/${id}`)
    return response.data
  },

  // 기존 일기 수정
  updateDiary: async (id: number, data: UpdateDiaryRequest): Promise<ApiResponse<Diary>> => {
    const response = await api.put<ApiResponse<Diary>>(`/diaries/${id}`, data)
    return response.data
  },

  // 일기 삭제
  deleteDiary: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/diaries/${id}`)
    return response.data
  },

  // 로그인한 사용자의 모든 일기 조회
  getMyDiaries: async (): Promise<ApiResponse<Diary[]>> => {
    const response = await api.get<ApiResponse<Diary[]>>('/diaries/my')
    return response.data
  },

  // 특정 기간의 일기 조회
  getDiariesByPeriod: async (startDate: string, endDate: string): Promise<ApiResponse<Diary[]>> => {
    const response = await api.get<ApiResponse<Diary[]>>('/diaries/period', {
      params: { start: startDate, end: endDate }
    })
    return response.data
  },

  // 특정 감정의 일기 조회
  getDiariesByEmotion: async (emotion: string): Promise<ApiResponse<Diary[]>> => {
    const response = await api.get<ApiResponse<Diary[]>>(`/diaries/emotion/${emotion}`)
    return response.data
  },

  // 특정 태그의 일기 조회
  getDiariesByTags: async (tags: string[]): Promise<ApiResponse<Diary[]>> => {
    const response = await api.get<ApiResponse<Diary[]>>('/diaries/tags', {
      params: { tags }
    })
    return response.data
  },
    // 특정 분석 상태의 일기 전체 조회
  getDiariesByAnalysisStatus: async (status: string): Promise<ApiResponse<Diary[]>> => {
    const response = await api.get<ApiResponse<Diary[]>>(`/diaries/analysis-status/${status}`)
    return response.data
  },
  
  // 로그인한 사용자의 특정 분석 상태 일기 조회
  getMyDiariesByAnalysisStatus: async (status: string): Promise<ApiResponse<Diary[]>> => {
    const response = await api.get<ApiResponse<Diary[]>>(`/diaries/my/analysis-status/${status}`)
    return response.data
  },
}

// One Line Diary API
export const oneLineDiaryAPI = {
  // 한 줄 일기 생성
  createOneLineDiary: async (data: CreateOneLineDiaryRequest): Promise<ApiResponse<OneLineDiary>> => {
    const response = await api.post<ApiResponse<OneLineDiary>>('/one-line-diaries', data)
    return response.data
  },

  // 특정 한 줄 일기 조회
  getOneLineDiary: async (id: number): Promise<ApiResponse<OneLineDiary>> => {
    const response = await api.get<ApiResponse<OneLineDiary>>(`/one-line-diaries/${id}`)
    return response.data
  },

  // 한 줄 일기 수정
  updateOneLineDiary: async (id: number, data: UpdateOneLineDiaryRequest): Promise<ApiResponse<OneLineDiary>> => {
    const response = await api.put<ApiResponse<OneLineDiary>>(`/one-line-diaries/${id}`, data)
    return response.data
  },

  // 한 줄 일기 삭제
  deleteOneLineDiary: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/one-line-diaries/${id}`)
    return response.data
  },

  // 로그인한 사용자의 일기 목록 조회
  getMyOneLineDiaries: async (): Promise<ApiResponse<OneLineDiary[]>> => {
    const response = await api.get<ApiResponse<OneLineDiary[]>>('/one-line-diaries/user')
    return response.data
  },

  // 기간별 한 줄 일기 조회
  getOneLineDiariesByPeriod: async (startDate: string, endDate: string): Promise<ApiResponse<OneLineDiary[]>> => {
    const response = await api.get<ApiResponse<OneLineDiary[]>>('/one-line-diaries/period', {
      params: { start: startDate, end: endDate }
    })
    return response.data
  },

  // 감정별 한 줄 일기 조회
  getOneLineDiariesByEmotion: async (emotion: string): Promise<ApiResponse<OneLineDiary[]>> => {
    const response = await api.get<ApiResponse<OneLineDiary[]>>(`/one-line-diaries/emotion/${emotion}`)
    return response.data
  },

  // 태그별 한 줄 일기 조회
  getOneLineDiariesByTags: async (tags: string[]): Promise<ApiResponse<OneLineDiary[]>> => {
    const response = await api.get<ApiResponse<OneLineDiary[]>>('/one-line-diaries/tags', {
      params: { tags }
    })
    return response.data
  },

  // 분석 상태별 한 줄 일기 전체 조회
  getOneLineDiariesByAnalysisStatus: async (status: string): Promise<ApiResponse<OneLineDiary[]>> => {
    const response = await api.get<ApiResponse<OneLineDiary[]>>(`/one-line-diaries/analysis-status/${status}`)
    return response.data
  },

  // 내 한 줄 일기 중 분석 상태별 조회
  getMyOneLineDiariesByAnalysisStatus: async (status: string): Promise<ApiResponse<OneLineDiary[]>> => {
    const response = await api.get<ApiResponse<OneLineDiary[]>>(`/one-line-diaries/my/analysis-status/${status}`)
    return response.data
  },
}

// Community API
export const communityAPI = {
  // 커뮤니티 생성
  createCommunity: async (data: CreateCommunityRequest): Promise<ApiResponse<Community>> => {
    const response = await api.post<ApiResponse<Community>>('/communities', data)
    return response.data
  },

  // 특정 커뮤니티 조회
  getCommunity: async (id: number): Promise<ApiResponse<Community>> => {
    const response = await api.get<ApiResponse<Community>>(`/communities/${id}`)
    return response.data
  },

  // 기본 커뮤니티 목록 조회
  getDefaultCommunities: async (): Promise<ApiResponse<Community[]>> => {
    const response = await api.get<ApiResponse<Community[]>>('/communities/default')
    return response.data
  },

  // 로그인한 사용자의 커뮤니티 목록 조회
  getMyCommunities: async (): Promise<ApiResponse<Community[]>> => {
    const response = await api.get<ApiResponse<Community[]>>('/communities/my')
    return response.data
  },

  // 커뮤니티 가입
  joinCommunity: async (id: number, data: JoinCommunityRequest): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`/communities/${id}/join`, data)
    return response.data
  },

  // 커뮤니티 탈퇴
  leaveCommunity: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`/communities/${id}/leave`)
    return response.data
  },

  // 커뮤니티 수정
  updateCommunity: async (id: number, data: UpdateCommunityRequest): Promise<ApiResponse<Community>> => {
    const response = await api.put<ApiResponse<Community>>(`/communities/${id}`, data)
    return response.data
  },

  // 커뮤니티 삭제
  deleteCommunity: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/communities/${id}`)
    return response.data
  },

  // 감정 테마별 커뮤니티 조회
  getCommunitiesByEmotionTheme: async (emotionTheme: string): Promise<ApiResponse<Community[]>> => {
    const response = await api.get<ApiResponse<Community[]>>(`/communities/emotion-theme/${emotionTheme}`)
    return response.data
  },
}

// 인증 관련 API
export const authAPI = {
  // 구글 로그인 리다이렉트
  googleLogin: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },

  // 현재 로그인된 사용자 정보 조회
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/auth/me');
    return response.data;
  }
}

// 감정/추천/회상 관련 API
export const analysisAPI = {
  //사용자 ID 기반 클러스터링 요청 (로그 확인용, 쓸일 없음)
  requestUserClustering: async (userId: number): Promise<ApiResponse<UserClusteringResult>> => {
    const response = await api.get<ApiResponse<UserClusteringResult>>(`/analysis/cluster/${userId}`)
    return response.data
  },

   //일기 텍스트 기반 과거 데이터 기반 감정 회상 요청
  requestRecallByText: async (data: RecallSummariesRequest): Promise<ApiResponse<RecallSummariesResponse>> => {
    const response = await api.post<ApiResponse<RecallSummariesResponse>>('/analysis/recall', data)
    return response.data
  },

  //사용자 ID 기반 감정 유사/반대 일기 추천 (각각 TOP 3개씩 리턴)
  getEmotionBasedRecommendations: async (userId: number): Promise<ApiResponse<EmotionBasedRecommendationsResponse>> => {
    const response = await api.get<ApiResponse<EmotionBasedRecommendationsResponse>>(`/analysis/recommend/${userId}`)
    return response.data
  },
}