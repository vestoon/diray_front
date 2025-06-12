// 클러스터링 결과
export interface UserClusteringResult {
  user_id: number
  result: any
}

// 감정 회상 요청
export interface RecallSummariesRequest {
  userId: number
  text: string
}

// 감정 회상 결과
export interface RecallSummariesResponse {
  recallSummaries: Record<string, string>
}

// 감정 유사/반대 추천 일기 요약
export interface DiarySummary {
  user_id: number
  diary_id: number
  summary: string
  created_at: string
}

// 감정 유사/반대 추천 응답
export interface EmotionBasedRecommendationsResponse {
  similar_users: DiarySummary[]
  opposite_users: DiarySummary[]
}