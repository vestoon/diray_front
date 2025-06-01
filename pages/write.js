"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function WriteDiary() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [diaryType, setDiaryType] = useState("oneline") // 'oneline' or 'regular'
  const [isPublic, setIsPublic] = useState(false)
  const [oneLineDiaries, setOneLineDiaries] = useState([{ id: 1, content: "", tags: [] }])
  const [regularDiary, setRegularDiary] = useState("")
  const [aiQuestion, setAiQuestion] = useState("")
  const [lastTypingTime, setLastTypingTime] = useState(Date.now())
  const [anonymizedContent, setAnonymizedContent] = useState("")
  const [recommendations, setRecommendations] = useState(null)
  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 리다이렉트 조건 수정
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  // Check for typing pause to trigger AI question
  useEffect(() => {
    if (diaryType === "regular" && regularDiary.length > 50) {
      const timer = setTimeout(() => {
        const timeSinceLastType = Date.now() - lastTypingTime
        if (timeSinceLastType > 10000) {
          // 10 seconds of no typing
          generateAiQuestion()
        }
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [regularDiary, lastTypingTime])

  const handleDiaryChange = (e) => {
    setRegularDiary(e.target.value)
    setLastTypingTime(Date.now())
  }

  const handleOneLineDiaryChange = (id, content) => {
    setOneLineDiaries((prev) => prev.map((diary) => (diary.id === id ? { ...diary, content } : diary)))
  }

  const addOneLineDiary = () => {
    setOneLineDiaries((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((d) => d.id)) + 1 : 1,
        content: "",
        tags: [],
      },
    ])
  }

  const removeOneLineDiary = (id) => {
    setOneLineDiaries((prev) => prev.filter((diary) => diary.id !== id))
  }

  const addTagToOneLiner = (id) => {
    if (!currentTag.trim()) return

    setOneLineDiaries((prev) =>
      prev.map((diary) => (diary.id === id ? { ...diary, tags: [...diary.tags, currentTag.trim()] } : diary)),
    )
    setCurrentTag("")
  }

  const removeTagFromOneLiner = (diaryId, tagToRemove) => {
    setOneLineDiaries((prev) =>
      prev.map((diary) =>
        diary.id === diaryId ? { ...diary, tags: diary.tags.filter((tag) => tag !== tagToRemove) } : diary,
      ),
    )
  }

  const generateAiQuestion = async () => {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll just set a sample question
      const questions = [
        "그때 어떤 감정이 들었나요?",
        "그 상황에서 가장 기억에 남는 것은 무엇인가요?",
        "만약 다시 그 순간으로 돌아간다면 어떻게 하고 싶나요?",
        "그 경험이 지금의 당신에게 어떤 영향을 주었나요?",
        "그때 누군가에게 도움을 청했다면 어땠을까요?",
      ]
      setAiQuestion(questions[Math.floor(Math.random() * questions.length)])
    } catch (error) {
      console.error("AI 질문 생성 중 오류 발생:", error)
    }
  }

  const anonymizeContent = async () => {
    if (!regularDiary.trim()) return

    setIsLoading(true)
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll just modify the content slightly
      const anonymized = regularDiary.replace(/이름/g, "홍길동").replace(/장소/g, "어느 곳").replace(/회사/g, "회사")

      setAnonymizedContent(anonymized)
    } catch (error) {
      console.error("내용 익명화 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendations = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll just set sample recommendations
      setRecommendations({
        feedback: "오늘 하루 많은 감정을 느끼셨네요. 특히 기쁨과 설렘이 느껴집니다.",
        movie: "어바웃 타임",
        song: "IU - 밤편지",
        book: "김영하 - 살인자의 기억법",
      })
    } catch (error) {
      console.error("추천 생성 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveDiary = async () => {
    // In a real app, this would save the diary to your backend
    alert("일기가 저장되었습니다!")
    router.push("/diaries")
  }

  // 로딩 체크도 수정
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">일기 작성하기</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setDiaryType("oneline")}
              className={`px-4 py-2 rounded-lg ${
                diaryType === "oneline" ? "bg-pink-100 text-pink-600 font-medium" : "bg-gray-100 text-gray-600"
              }`}
            >
              한 줄 일기
            </button>
            <button
              onClick={() => setDiaryType("regular")}
              className={`px-4 py-2 rounded-lg ${
                diaryType === "regular" ? "bg-pink-100 text-pink-600 font-medium" : "bg-gray-100 text-gray-600"
              }`}
            >
              일반 일기
            </button>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-gray-600">공개 설정:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              <span className="ml-2 text-sm font-medium text-gray-600">{isPublic ? "공개" : "비공개"}</span>
            </label>
          </div>
        </div>

        {diaryType === "oneline" ? (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              기억하고 싶은 순간을 간단히 기록해보세요. 나중에 일반 일기를 작성할 때 도움이 됩니다.
            </p>

            {oneLineDiaries.map((diary) => (
              <div key={diary.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <input
                    type="text"
                    value={diary.content}
                    onChange={(e) => handleOneLineDiaryChange(diary.id, e.target.value)}
                    placeholder="오늘의 한 줄 일기를 작성해보세요"
                    className="flex-1 p-2 border-b border-gray-200 focus:outline-none focus:border-pink-300"
                  />
                  <button
                    onClick={() => removeOneLineDiary(diary.id)}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {diary.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-pink-50 text-pink-600 text-sm px-2 py-1 rounded-full flex items-center"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTagFromOneLiner(diary.id, tag)}
                        className="ml-1 text-pink-400 hover:text-pink-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="태그 추가"
                    className="flex-1 p-2 text-sm border border-gray-200 rounded-l-lg focus:outline-none focus:border-pink-300"
                  />
                  <button
                    onClick={() => addTagToOneLiner(diary.id)}
                    className="bg-pink-500 text-white px-3 py-2 rounded-r-lg hover:bg-pink-600"
                  >
                    추가
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addOneLineDiary}
              className="w-full border border-dashed border-gray-300 text-gray-500 py-2 rounded-lg hover:bg-gray-50"
            >
              + 한 줄 일기 추가하기
            </button>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDiaryType("regular")}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
              >
                일반 일기 작성하기
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              오늘의 일기를 작성해보세요. 한 줄 일기를 바탕으로 더 자세한 이야기를 풀어낼 수 있습니다.
            </p>

            {oneLineDiaries.length > 0 && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">오늘의 한 줄 일기</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {oneLineDiaries.map((diary) => (
                    <li key={diary.id} className="text-gray-600">
                      {diary.content}
                      {diary.tags.length > 0 && (
                        <span className="text-sm text-gray-500 ml-2">
                          {diary.tags.map((tag) => `#${tag}`).join(" ")}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="relative">
              <textarea
                value={regularDiary}
                onChange={handleDiaryChange}
                placeholder="오늘 하루는 어땠나요? 느낀 점, 생각, 감정을 자유롭게 적어보세요."
                className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300"
              ></textarea>

              {aiQuestion && (
                <div className="absolute bottom-4 right-4 bg-pink-50 text-pink-600 p-3 rounded-lg shadow-sm max-w-xs animate-fade-in">
                  <p className="text-sm">{aiQuestion}</p>
                  <button
                    onClick={() => setAiQuestion("")}
                    className="absolute top-1 right-1 text-pink-400 hover:text-pink-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {isPublic && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">개인정보 익명화 미리보기</h3>
                <p className="text-sm text-gray-500 mb-4">
                  공개 일기는 개인정보가 익명화되어 공유됩니다. 아래 버튼을 눌러 미리보기를 확인하세요.
                </p>

                <button
                  onClick={anonymizeContent}
                  disabled={isLoading || !regularDiary.trim()}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  {isLoading ? "처리 중..." : "익명화 미리보기"}
                </button>

                {anonymizedContent && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">익명화된 내용:</h4>
                    <p className="text-gray-600">{anonymizedContent}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={getRecommendations}
                disabled={isLoading || !regularDiary.trim()}
                className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 disabled:opacity-50"
              >
                {isLoading ? "분석 중..." : "AI 분석 및 추천 받기"}
              </button>

              {recommendations && (
                <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                  <h3 className="font-medium text-pink-700 mb-2">AI 분석 결과</h3>
                  <p className="text-gray-700 mb-3">{recommendations.feedback}</p>

                  <h4 className="font-medium text-gray-700 mt-4 mb-2">오늘의 추천</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs mr-2">영화</span>
                      <span>{recommendations.movie}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs mr-2">노래</span>
                      <span>{recommendations.song}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs mr-2">책</span>
                      <span>{recommendations.book}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={saveDiary}
                disabled={!regularDiary.trim()}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                일기 저장하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
