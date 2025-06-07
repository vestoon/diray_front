import { Diary } from './diary';
import { Community } from './clustering';

// API 응답 기본 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 일기 관련 API 타입
export interface CreateDiaryRequest {
  title: string;
  content: string;
  mood: string;
  tags?: string[];
}

export interface UpdateDiaryRequest extends Partial<CreateDiaryRequest> {
  id: string;
}

export interface DiaryResponse extends Diary {}

// 한 줄 일기 관련 API 타입
export interface CreateOneLineDiaryRequest {
  content: string;
  mood: string;
  tags?: string[];
}

export interface UpdateOneLineDiaryRequest extends Partial<CreateOneLineDiaryRequest> {
  id: string;
}

// 커뮤니티 관련 API 타입
export interface CreateCommunityRequest {
  name: string;
  description: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdateCommunityRequest extends Partial<CreateCommunityRequest> {
  id: string;
}

export interface CommunityResponse extends Community {}

// API 함수 타입
export interface DiaryApi {
  createDiary: (diaryData: CreateDiaryRequest) => Promise<ApiResponse<DiaryResponse>>;
  getDiary: (id: string) => Promise<ApiResponse<DiaryResponse>>;
  getMyDiaries: () => Promise<ApiResponse<DiaryResponse[]>>;
  updateDiary: (id: string, diaryData: UpdateDiaryRequest) => Promise<ApiResponse<DiaryResponse>>;
  deleteDiary: (id: string) => Promise<ApiResponse<void>>;
  getDiariesByEmotion: (emotion: string) => Promise<ApiResponse<DiaryResponse[]>>;
  getDiariesByTags: (tags: string[]) => Promise<ApiResponse<DiaryResponse[]>>;
  getDiariesByPeriod: (start: string, end: string) => Promise<ApiResponse<DiaryResponse[]>>;
  getDiariesByAnalysisStatus: (status: string) => Promise<ApiResponse<DiaryResponse[]>>;
  getMyDiariesByAnalysisStatus: (status: string) => Promise<ApiResponse<DiaryResponse[]>>;
}

export interface OneLineDiaryApi {
  createOneLineDiary: (diaryData: CreateOneLineDiaryRequest) => Promise<ApiResponse<DiaryResponse>>;
  getOneLineDiary: (id: string) => Promise<ApiResponse<DiaryResponse>>;
  updateOneLineDiary: (id: string, diaryData: UpdateOneLineDiaryRequest) => Promise<ApiResponse<DiaryResponse>>;
  deleteOneLineDiary: (id: string) => Promise<ApiResponse<void>>;
  getMyOneLineDiaries: () => Promise<ApiResponse<DiaryResponse[]>>;
  getOneLineDiariesByEmotion: (emotion: string) => Promise<ApiResponse<DiaryResponse[]>>;
  getOneLineDiariesByTags: (tags: string[]) => Promise<ApiResponse<DiaryResponse[]>>;
  getOneLineDiariesByPeriod: (start: string, end: string) => Promise<ApiResponse<DiaryResponse[]>>;
  getOneLineDiariesByAnalysisStatus: (status: string) => Promise<ApiResponse<DiaryResponse[]>>;
  getMyOneLineDiariesByAnalysisStatus: (status: string) => Promise<ApiResponse<DiaryResponse[]>>;
}

export interface CommunityApi {
  createCommunity: (communityData: CreateCommunityRequest) => Promise<ApiResponse<CommunityResponse>>;
  getCommunity: (id: string) => Promise<ApiResponse<CommunityResponse>>;
  updateCommunity: (id: string, communityData: UpdateCommunityRequest) => Promise<ApiResponse<CommunityResponse>>;
  deleteCommunity: (id: string) => Promise<ApiResponse<void>>;
  getDefaultCommunities: () => Promise<ApiResponse<CommunityResponse[]>>;
  getCommunitiesByEmotionTheme: (emotionTheme: string) => Promise<ApiResponse<CommunityResponse[]>>;
  searchCommunities: (keyword?: string, emotionTheme?: string) => Promise<ApiResponse<CommunityResponse[]>>;
  getMyCommunities: () => Promise<ApiResponse<CommunityResponse[]>>;
  joinCommunity: (id: string) => Promise<ApiResponse<void>>;
  leaveCommunity: (id: string) => Promise<ApiResponse<void>>;
} 