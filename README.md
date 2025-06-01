# Diary2U - 일기 공유 서비스

React 17과 Next.js 12를 사용한 일기 공유 서비스입니다.

## 주요 기능

- **일기 작성**: 한 줄 일기와 일반 일기 작성
- **AI 기능**: 작성 도움 질문, 개인정보 익명화, 콘텐츠 추천
- **일기 나눔방**: 태그별로 분류된 일기 공유 공간
- **감정 필터링**: 비슷한 감정 또는 반대 감정의 일기 추천
- **소셜 기능**: 댓글, 좋아요 등의 상호작용

## 기술 스택

- **Frontend**: React 17, Next.js 12 (Pages Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Google OAuth)
- **Icons**: React Icons

## 설치 및 실행

1. 의존성 설치
\`\`\`bash
npm install
\`\`\`

2. 환경변수 설정
\`\`\`bash
cp .env.local.example .env.local
# .env.local 파일을 편집하여 필요한 환경변수 설정
\`\`\`

3. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

4. 브라우저에서 http://localhost:3000 접속

## 개발 모드

현재 구글 로그인 없이도 테스트할 수 있도록 목업 세션이 설정되어 있습니다.
실제 구글 로그인을 사용하려면 환경변수를 설정하고 목업 세션 코드를 제거하세요.

## 페이지 구조

- `/` - 메인 페이지 (로그인)
- `/write` - 일기 작성 페이지
- `/diaries` - 내 일기 목록
- `/share` - 일기 나눔방 메인
- `/share/[tag]` - 태그별 나눔방
- `/diary/[id]` - 일기 상세 페이지

## 향후 개발 계획

- 백엔드 API 연동
- 실제 AI 기능 구현
- 데이터베이스 연동
- 이미지 업로드 기능
- 푸시 알림 기능
