"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { FaHeart, FaComment, FaArrowLeft } from "react-icons/fa"

export default function TagRoom() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { tag } = router.query
  const [filterType, setFilterType] = useState("similar") // 'similar' or 'opposite'

  // Sample diaries
  const diaries = [
    {
      id: 1,
      title: "오늘의 작은 행복",
      content:
        "카페에서 우연히 만난 친구와의 대화가 하루를 밝게 만들었다. 오랜만에 만난 친구였지만, 마치 어제 만난 것처럼 대화가 자연스럽게 이어졌다. 서로의 근황을 나누고, 앞으로의 계획에 대해 이야기하며 시간 가는 줄 몰랐다. 이런 우연한 만남이 가끔은 필요한 것 같다.",
      author: "행복한하루",
      date: "2023-05-15",
      tags: ["행복", "일상", "만남"],
      likes: 24,
      comments: [
        { id: 1, author: "구름위에", content: "정말 공감돼요! 저도 비슷한 경험이 있어요.", date: "2023-05-15" },
        {
          id: 2,
          author: "별빛달빛",
          content: "우연한 만남이 주는 기쁨이 크죠. 좋은 하루 보내세요!",
          date: "2023-05-16",
        },
      ],
    },
    {
      id: 2,
      title: "비 오는 날의 기억",
      content:
        "창밖으로 내리는 빗소리를 들으며 어릴 적 추억을 떠올렸다. 비가 오면 항상 창가에 앉아 책을 읽던 그 시절이 그립다. 지금은 바쁘다는 핑계로 그런 여유를 잘 갖지 못하는 것 같다. 오늘은 오랜만에 따뜻한 차 한 잔과 함께 좋아하는 책을 펼쳐봐야겠다.",
      author: "비오는날",
      date: "2023-05-10",
      tags: ["슬픔", "회상", "비"],
      likes: 18,
      comments: [
        { id: 3, author: "책벌레", content: "비 오는 날 책 읽기 정말 좋죠. 저도 그 기분 알아요.", date: "2023-05-10" },
      ],
    },
    {
      id: 3,
      title: "첫 해외여행",
      content:
        "처음으로 혼자 떠난 여행, 낯선 곳에서의 설렘과 두려움이 공존했다. 언어도 잘 통하지 않고, 길도 헤매기 일쑤였지만, 그 과정에서 만난 사람들과 경험한 일들이 지금은 소중한 추억이 되었다. 앞으로도 더 많은 곳을 여행하며 다양한 경험을 쌓고 싶다.",
      author: "여행자",
      date: "2023-05-05",
      tags: ["여행", "성장", "경험"],
      likes: 32,
      comments: [
        {
          id: 4,
          author: "세계일주",
          content: "첫 여행의 설렘이 느껴지는 글이네요. 다음 여행은 어디로 계획 중이신가요?",
          date: "2023-05-06",
        },
        {
          id: 5,
          author: "배낭여행",
          content: "혼자 여행하는 용기가 대단해요! 저도 용기내서 도전해봐야겠어요.",
          date: "2023-05-07",
        },
      ],
    },
  ]

  const filteredDiaries = diaries.filter(
    (diary) => diary.tags.includes(tag) || (filterType === "opposite" && !diary.tags.includes(tag)),
  )

  if (status === "loading" || !tag) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  if (status === "unauthenticated") {
    router.push("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/share">
          <a className="flex items-center text-gray-600 hover:text-pink-600">
            <FaArrowLeft className="mr-2" />
            <span>나눔방 목록으로</span>
          </a>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-pink-600 mb-2">#{tag} 나눔방</h1>
          <p className="text-gray-600">{tag} 태그와 관련된 일기들을 모아봤어요. 공감하고 소통해보세요.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">일기 목록</h2>

          <div className="flex">
            <button
              onClick={() => setFilterType("similar")}
              className={`px-3 py-1 rounded-l-lg ${
                filterType === "similar" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              비슷한 감정
            </button>
            <button
              onClick={() => setFilterType("opposite")}
              className={`px-3 py-1 rounded-r-lg ${
                filterType === "opposite" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
              }`}
            >
              다른 감정
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {filteredDiaries.length > 0 ? (
            filteredDiaries.map((diary) => (
              <div key={diary.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {diary.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">{diary.author}</p>
                    <p className="text-xs text-gray-500">{diary.date}</p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-800 mb-2">{diary.title}</h3>
                <p className="text-gray-600 mb-4">{diary.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {diary.tags.map((tag, idx) => (
                    <Link href={`/share/${tag}`} key={idx}>
                      <a className="bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded-full">#{tag}</a>
                    </Link>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-pink-500">
                      <FaHeart />
                      <span>{diary.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                      <FaComment />
                      <span>{diary.comments.length}</span>
                    </button>
                  </div>

                  <Link href={`/diary/${diary.id}`}>
                    <a className="text-pink-500 hover:text-pink-600 text-sm">자세히 보기</a>
                  </Link>
                </div>

                {diary.comments.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">댓글</h4>
                    <div className="space-y-3">
                      {diary.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-sm text-gray-700">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                      ))}
                      {diary.comments.length > 2 && (
                        <Link href={`/diary/${diary.id}`}>
                          <a className="text-sm text-pink-500 hover:text-pink-600">댓글 더보기...</a>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">해당 태그의 일기가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
