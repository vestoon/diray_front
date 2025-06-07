import api from './axios';
import { AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { 
  ApiResponse, 
  DiaryApi, 
  OneLineDiaryApi, 
  CommunityApi,
  CreateDiaryRequest,
  UpdateDiaryRequest,
  CreateOneLineDiaryRequest,
  UpdateOneLineDiaryRequest,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  DiaryResponse,
  CommunityResponse
} from '@/types/api';

// 제네릭 타입을 사용한 타입 안전성 향상
export const getData = async <T>(
  endpoint: string, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(endpoint, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async <T>(
  endpoint: string, 
  data: unknown, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

export const updateData = async <T>(
  endpoint: string, 
  data: unknown, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.put<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }y
};

export const patchData = async <T>(
  endpoint: string, 
  data: unknown, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.patch<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error patching data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async <T>(
  endpoint: string, 
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete<ApiResponse<T>>(endpoint, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};

// 파일 업로드 전용 함수
export const uploadFile = async <T>(
  endpoint: string, 
  file: File | FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<ApiResponse<T>> => {
  try {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    const response = await api.post<ApiResponse<T>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading file to ${endpoint}:`, error);
    throw error;
  }
};

// 쿼리 파라미터가 있는 GET 요청
export const getDataWithParams = async <T>(
  endpoint: string,
  params: Record<string, string | number | boolean>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(endpoint, {
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint} with params:`, params, error);
    throw error;
  }
};

// 여러 요청을 동시에 처리
export const getBatchData = async <T>(
  endpoints: string[]
): Promise<ApiResponse<T>[]> => {
  try {
    const requests = endpoints.map(endpoint => api.get<ApiResponse<T>>(endpoint));
    const responses = await Promise.all(requests);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Error fetching batch data:', error);
    throw error;
  }
};

// Diary API 함수들
export const diaryAPI: DiaryApi = {
  // 새로운 일기 생성
  createDiary: (diaryData: CreateDiaryRequest) => 
    postData<DiaryResponse>('/diaries', diaryData),
  
  // ID로 일기 조회
  getDiary: (id: string) => 
    getData<DiaryResponse>(`/diaries/${id}`),
  
  // 로그인한 사용자의 모든 일기 조회
  getMyDiaries: () => 
    getData<DiaryResponse[]>('/diaries/my'),
  
  // 기존 일기 수정
  updateDiary: (id: string, diaryData: UpdateDiaryRequest) => 
    updateData<DiaryResponse>(`/diaries/${id}`, diaryData),
  
  // 일기 삭제
  deleteDiary: (id: string) => 
    deleteData<void>(`/diaries/${id}`),
  
  // 특정 감정의 일기 조회
  getDiariesByEmotion: (emotion: string) => 
    getData<DiaryResponse[]>(`/diaries/emotion/${emotion}`),
  
  // 특정 태그의 일기 조회
  getDiariesByTags: (tags: string[]) => 
    getDataWithParams<DiaryResponse[]>('/diaries/tags', { tags: tags.join(',') }),
  
  // 특정 기간의 일기 조회
  getDiariesByPeriod: (start: string, end: string) => 
    getDataWithParams<DiaryResponse[]>('/diaries/period', { start, end }),
  
  // 특정 분석 상태의 일기 전체 조회
  getDiariesByAnalysisStatus: (status: string) => 
    getData<DiaryResponse[]>(`/diaries/analysis-status/${status}`),
  
  // 로그인한 사용자의 특정 분석 상태 일기 조회
  getMyDiariesByAnalysisStatus: (status: string) => 
    getData<DiaryResponse[]>(`/diaries/my/analysis-status/${status}`),
};

// One Line Diary API 함수들
export const oneLineDiaryAPI: OneLineDiaryApi = {
  // 한 줄 일기 생성
  createOneLineDiary: (diaryData: CreateOneLineDiaryRequest) => 
    postData<DiaryResponse>('/one-line-diaries', diaryData),
  
  // 특정 한 줄 일기 조회
  getOneLineDiary: (id: string) => 
    getData<DiaryResponse>(`/one-line-diaries/${id}`),
  
  // 한 줄 일기 수정
  updateOneLineDiary: (id: string, diaryData: UpdateOneLineDiaryRequest) => 
    updateData<DiaryResponse>(`/one-line-diaries/${id}`, diaryData),
  
  // 한 줄 일기 삭제
  deleteOneLineDiary: (id: string) => 
    deleteData<void>(`/one-line-diaries/${id}`),
  
  // 로그인한 사용자의 일기 목록 조회
  getMyOneLineDiaries: () => 
    getData<DiaryResponse[]>('/one-line-diaries/user'),
  
  // 감정별 한 줄 일기 조회
  getOneLineDiariesByEmotion: (emotion: string) => 
    getData<DiaryResponse[]>(`/one-line-diaries/emotion/${emotion}`),
  
  // 태그별 한 줄 일기 조회
  getOneLineDiariesByTags: (tags: string[]) => 
    getDataWithParams<DiaryResponse[]>('/one-line-diaries/tags', { tags: tags.join(',') }),
  
  // 기간별 한 줄 일기 조회
  getOneLineDiariesByPeriod: (start: string, end: string) => 
    getDataWithParams<DiaryResponse[]>('/one-line-diaries/period', { start, end }),
  
  // 분석 상태별 일기 전체 조회
  getOneLineDiariesByAnalysisStatus: (status: string) => 
    getData<DiaryResponse[]>(`/one-line-diaries/analysis-status/${status}`),
  
  // 내 일기 중 분석 상태별 조회
  getMyOneLineDiariesByAnalysisStatus: (status: string) => 
    getData<DiaryResponse[]>(`/one-line-diaries/my/analysis-status/${status}`),
};

// Community API 함수들
export const communityAPI: CommunityApi = {
  // 커뮤니티 생성
  createCommunity: (communityData: CreateCommunityRequest) => 
    postData<CommunityResponse>('/communities', communityData),
  
  // 특정 커뮤니티 조회
  getCommunity: (id: string) => 
    getData<CommunityResponse>(`/communities/${id}`),
  
  // 커뮤니티 수정
  updateCommunity: (id: string, communityData: UpdateCommunityRequest) => 
    updateData<CommunityResponse>(`/communities/${id}`, communityData),
  
  // 커뮤니티 삭제
  deleteCommunity: (id: string) => 
    deleteData<void>(`/communities/${id}`),
  
  // 기본 커뮤니티 목록 조회
  getDefaultCommunities: () => 
    getData<CommunityResponse[]>('/communities/default'),
  
  // 감정 테마별 커뮤니티 조회
  getCommunitiesByEmotionTheme: (emotionTheme: string) => 
    getData<CommunityResponse[]>(`/communities/emotion-theme/${emotionTheme}`),
  
  // 커뮤니티 검색
  searchCommunities: (keyword?: string, emotionTheme?: string) => {
    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;
    if (emotionTheme) params.emotionTheme = emotionTheme;
    return getDataWithParams<CommunityResponse[]>('/communities/search', params);
  },
  
  // 로그인한 사용자의 커뮤니티 목록 조회
  getMyCommunities: () => 
    getData<CommunityResponse[]>('/communities/my'),
  
  // 커뮤니티 가입
  joinCommunity: (id: string) => 
    postData<void>(`/communities/${id}/join`, {}),
  
  // 커뮤니티 탈퇴
  leaveCommunity: (id: string) => 
    postData<void>(`/communities/${id}/leave`, {}),
};

// Auth API 타입 정의
interface AuthResponse {
  email: string;
  id: number;
  nickname: string;
  role: string;
  createdAt: string;
}

// Auth API 함수들
export const authAPI = {
  // 구글 로그인 리다이렉트
  googleLogin: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },
  
  // 현재 로그인된 사용자 정보 조회
  getCurrentUser: () => 
    getData<AuthResponse>('/auth/me', { withCredentials: true }),
};