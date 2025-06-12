import { Diary } from "@/types/diary"

// 유저의 현재 일기 mock 데이터
export const mockCurrentUserDiaries: Diary[] = [
  {
    id: 1,
    title: "오늘 하루도 감사한 마음으로",
    content: "아침에 일어나서 창문을 열었을 때 들어온 따뜻한 햇살이 너무 좋았다. 작은 것에도 감사할 수 있는 마음을 가지게 되어서 행복하다. 오늘은 특히 동네 카페에서 만난 강아지가 너무 귀여웠다. 주인분이 쓰다듬게 해주셔서 기분이 좋았다.",
    primaryEmotion: "happy",
    secondaryEmotions: ["grateful", "peaceful"],
    tags: { "감사": "gratitude", "휴식": "rest" },
    isPublic: true,
    createdAt: "2025-06-02T08:30:00Z",
    updatedAt: "2025-06-02T08:30:00Z",
    user: {
      id: 1,
      email: "user1@example.com",
      nickname: "김민수",
      profileImage: "https://www.gravatar.com/avatar/1?d=identicon",
      role: "USER"
    },
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    title: "새로운 도전을 시작하며",
    content: "오늘부터 새로운 프로젝트를 시작했다. 처음에는 두렵고 걱정이 많았지만, 한 걸음씩 나아가다 보면 분명 좋은 결과가 있을 거라 믿는다. 팀원들도 좋은 분들이라 든든하다. 특히 리더님이 많이 도와주셔서 감사한 마음이다.",
    primaryEmotion: "excited",
    secondaryEmotions: ["nervous", "hopeful"],
    tags: { "도전": "challenge", "성장": "growth" },
    isPublic: true,
    createdAt: "2025-06-01T10:15:00Z",
    updatedAt: "2025-06-01T10:15:00Z",
    user: {
      id: 2,
      email: "user2@example.com",
      nickname: "이지은",
      profileImage: "https://www.gravatar.com/avatar/2?d=identicon",
      role: "USER"
    },
    likes: 8,
    comments: 5
  },
  {
    id: 40,
    title: "오늘의 소중한 8일차",
    content: `어느덧 소위지은 8일차에 도달했습니다. 이제 이집 쉐이크, 점심 식단, 간식 쉐이크, 저녁 탄수화물 제한식의 코스입니다. 3일째 정체기가 찾아왔습니다. 6일에 5.5키로 빠졌는데, 그럼만도 합니다. 오늘은 운동 강도를 조금 더 높였습니다. 근력 운동과 추가적으로 30분 인터벌로 12km/h까지 올렸습니다. 점심 빠지기는 모양새라 기분이 좋습니다.

요리도 먹을 수 있는 것들 중 제한하여 소량 요리합니다.`,
    primaryEmotion: "happy", // 임시
    secondaryEmotions: ["motivated", "thankful"], // 임시
    tags: { "기쁨": "joy", "여행": "travel", "운동": "exercise", "낙망": "discouraged", "감사": "gratitude" },
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 17,
      email: "user17@example.com",
      nickname: "최정혁",
      profileImage: "/basic.jpeg?height=40&width=40",
      role: "USER"
    },
    likes: 17,
    comments: 3
  }
]

// 유저에게 추천하는 일기 mock 데이터
export const mockRecommendedDiaries: Diary[] = [
  {
    id: 3,
    title: "혼자만의 시간이 주는 평온함",
    content: "카페에서 혼자 앉아 책을 읽으며 보낸 오후. 누구의 시선도 신경 쓰지 않고 온전히 나만의 시간을 가질 수 있어서 좋았다. 가끔은 이렇게 혼자만의 시간이 필요한 것 같다. 오늘 읽은 책은 '소크라테스의 변명'인데, 정말 많은 생각을 하게 만들었다.",
    primaryEmotion: "peaceful",
    secondaryEmotions: ["contemplative", "relaxed"],
    tags: { "독서": "reading", "휴식": "rest" },
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 3,
      email: "user3@example.com",
      nickname: "박서연",
      profileImage: "https://www.gravatar.com/avatar/3?d=identicon",
      role: "USER"
    },
    likes: 24,
    comments: 7
  },
  {
    id: 4,
    title: "친구와의 소중한 대화",
    content: "오랜만에 만난 친구와 진솔한 이야기를 나누었다. 서로의 고민을 들어주고 위로해주는 시간이 얼마나 소중한지 다시 한번 느꼈다. 특히 친구가 최근에 겪은 어려움에 대해 이야기하면서 내가 얼마나 많은 것들에 감사해야 하는지 깨달았다.",
    primaryEmotion: "grateful",
    secondaryEmotions: ["connected", "reflective"],
    tags: { "친구": "friendship", "감사": "gratitude" },
    isPublic: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 어제
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 4,
      email: "user4@example.com",
      nickname: "최현우",
      profileImage: "https://www.gravatar.com/avatar/4?d=identicon",
      role: "USER"
    },
    likes: 18,
    comments: 4
  }
]