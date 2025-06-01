"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { FaEdit, FaTrash, FaArrowLeft, FaHeart } from "react-icons/fa"

export default function DiaryDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState("")

  // Sample diary data (in a real app, this would be fetched from an API)
  const diary = {
    id: 1,
    title: "오늘의 작은 행복",
    content:
      "카페에서 우연히 만난 친구와의 대화가 하루를 밝게 만들었다. 오랜만에 만난 친구였지만, 마치 어제 만난 것처럼 대화가 자연스럽게 이어졌다. 서로의 근황을 나누고, 앞으로의 계획에 대해 이야기하며 시간 가는 줄 몰랐다. 이런 우연한 만남이 가끔은 필요한 것 같다.\n\n집으로 돌아오는 길에 좋아하는 노래를 들으며 오늘 하루를 돌아봤다. 작은 일상의 행복이 쌓여 큰 행복이 되는 것 같다. 내일도 오늘처럼 좋은 하루가 되길 바란다.",
    author: "행복한하루",
    authorId: "user123",
    date: "2023-05-15",
    tags: ["행복", "일상", "만남"],
    isPublic: true,
    likes: 24,
    aiAnalysis: {
      feedback:
        "오늘 하루 작은 만남에서 큰 행복을 느끼셨네요. 일상의 소소한 행복을 소중히 여기는 모습이 보기 좋습니다.",
      recommendations: [
        { type: "영화", title: "어바웃 타임", description: "소소한 일상의 행복을 다룬 영화" },
        { type: "노래", title: "IU - 밤편지", description: "따뜻한 감성의 노래" },
        { type: "책", title: "김영하 - 살인자의 기억법", description: "인간 관계에 대한 깊은 통찰" },
      ],
    },
    comments: [
      {
        id: 1,
        author: "구름위에",
        authorId: "user456",
        content: "정말 공감돼요! 저도 비슷한 경험이 있어요.",
        date: "2023-05-15",
        likes: 3,
      },
      {
        id: 2,
        author: "별빛달빛",
        authorId: "user789",
        content: "우연한 만남이 주는 기쁨이 크죠. 좋은 하루 보내세요!",
        date: "2023-05-16",
        likes: 5,
      },
      {
        id: 3,
        author: "행복찾기",
        authorId: "user101",
        content: "작은 행복이 모여 큰 행복이 되는 것 같아요. 글을 읽으며 저도 행복해졌어요.",
        date: "2023-05-17",
        likes: 2,
      },
    ],
  }

  // 개발용 임시 세션
  const mockSession = {
    user: {
      id: "dev-user-123",
      name: "테스트 사용자",
      email: "test@example.com",
    },
  }

  const currentSession = session || mockSession
  const currentStatus = session ? status : "authenticated"

  // isAuthor 체크도 수정
  const isAuthor = currentSession?.user?.id === diary?.authorId

  const handleLike = () => {
    setLiked(!liked)
    // In a real app, this would call an API to update the like count
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    // In a real app, this would call an API to add the comment
    alert("댓글이 등록되었습니다!")
    setComment("")
  }

  const handleDelete = () => {
    if (confirm("정말로 이 일기를 삭제하시겠습니까?")) {
      // In a real app, this would call an API to delete the diary
      router.push("/diaries")
    }
  }

  if (currentStatus === "loading" || !id) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  if (currentStatus === "unauthenticated" && !mockSession) {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/diaries">
          <a className="flex items-center text-gray-600 hover:text-pink-600">
            <FaArrowLeft className="mr-2" />
            <span>일기 목록으로</span>
          </a>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{diary.title}</h1>
              <div className="flex items-center text-sm text-gray-500">
                <span>{diary.date}</span>
                <span className="mx-2">•</span>
                <span>{diary.author}</span>
                <span className="mx-2">•</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    diary.isPublic ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {diary.isPublic ? "공개" : "비공개"}
                </span>
              </div>
            </div>

            {isAuthor && (
              <div className="flex space-x-2">
                <Link href={`/edit/${diary.id}`}>
                  <a className="p-2 text-gray-500 hover:text-pink-500">
                    <FaEdit />
                  </a>
                </Link>
                <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-500">
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {diary.tags.map((tag, idx) => (
              <Link href={`/share/${tag}`} key={idx}>
                <a className="bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded-full">#{tag}</a>
              </Link>
            ))}
          </div>
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-line">{diary.content}</p>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${
                  liked ? "text-pink-500" : "text-gray-500"
                } hover:text-pink-500`}
              >
                <FaHeart className={liked ? "fill-current" : ""} />
                <span>{diary.likes + (liked ? 1 : 0)}</span>
              </button>
              <span className="text-gray-500">{diary.comments.length} 댓글</span>
            </div>
          </div>

          {diary.aiAnalysis && (
            <div className="bg-pink-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-pink-700 mb-2">AI 분석 결과</h3>
              <p className="text-gray-700 mb-3">{diary.aiAnalysis.feedback}</p>

              <h4 className="font-medium text-gray-700 mb-2">추천 콘텐츠</h4>
              <div className="space-y-2">
                {diary.aiAnalysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs mr-2">{rec.type}</span>
                    <span className="font-medium mr-2">{rec.title}</span>
                    <span className="text-sm text-gray-500">{rec.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">댓글 ({diary.comments.length})</h3>

            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 작성해보세요..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 resize-none"
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50"
                >
                  댓글 작성
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {diary.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                        {comment.author.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{comment.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700 ml-11">{comment.content}</p>
                  <div className="flex items-center mt-2 ml-11">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-pink-500 text-sm">
                      <FaHeart />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
