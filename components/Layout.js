"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { FaUser, FaSignOutAlt } from "react-icons/fa"

function Layout({ children }) {
  const { data: session, status } = useSession()
  const isAuthenticated = !!session

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 세션 스토리지에서 임시 세션 제거
    sessionStorage.removeItem("mockSession")
    // 페이지 새로고침
    window.location.reload()
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-pink-600">Diary2U</a>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/write">
                  <a className="text-gray-600 hover:text-pink-600">일기 작성</a>
                </Link>
                <Link href="/diaries">
                  <a className="text-gray-600 hover:text-pink-600">내 일기</a>
                </Link>
                <Link href="/share">
                  <a className="text-gray-600 hover:text-pink-600">나눔방</a>
                </Link>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    <FaUser />
                  </div>
                  <span className="ml-2 hidden md:inline text-sm text-gray-700">{session.user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-pink-600 flex items-center">
                  <FaSignOutAlt className="md:mr-1" />
                  <span className="hidden md:inline text-sm">로그아웃</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
      <footer className="bg-gray-100 text-center py-4">
        <p className="text-gray-500">© 2024 Diary2U</p>
      </footer>
    </div>
  )
}

export default Layout
