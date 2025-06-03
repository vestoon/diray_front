"use client"

import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Chrome } from "lucide-react"

export default function Component() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    const timer = setInterval(() => setTime(new Date()), 1000)

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(timer)
    }
  }, [])

  const hashtags = [
    "#오늘의",
    "#내가",
    "#내일의",
    "#너에게",
    "#우리의",
    "#이야기를",
    "#서로",
    "#나누며",
    "#기록하는",
    "#순간들",
    "#소중한",
    "#추억",
    "#감정",
    "#생각",
    "#일상",
    "#꿈",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-neutral-900 text-white relative overflow-hidden font-sans">
      {/* 3D Floating Elements */}
      <div className="absolute inset-0">
        {/* Large rounded rectangles */}
        <div className="absolute top-20 left-10 w-32 h-64 bg-gradient-to-br from-neutral-700/15 to-zinc-600/15 rounded-3xl blur-sm animate-float-1 transform rotate-12" />
        <div className="absolute top-40 right-20 w-48 h-24 bg-gradient-to-br from-stone-700/10 to-zinc-600/10 rounded-3xl blur-sm animate-float-2 transform -rotate-6" />
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-neutral-600/15 to-stone-700/15 rounded-full blur-sm animate-float-3" />
        <div className="absolute bottom-20 right-32 w-56 h-28 bg-gradient-to-br from-zinc-700/10 to-neutral-600/10 rounded-3xl blur-sm animate-float-4 transform rotate-3" />
        <div className="absolute top-1/2 left-1/4 w-20 h-80 bg-gradient-to-br from-stone-600/15 to-zinc-700/15 rounded-3xl blur-sm animate-float-5 transform rotate-45" />
        <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-gradient-to-br from-zinc-600/15 to-stone-700/15 rounded-full blur-sm animate-float-6" />

        {/* Medium elements */}
        <div className="absolute top-60 left-1/2 w-24 h-48 bg-gradient-to-br from-neutral-700/10 to-zinc-600/10 rounded-2xl blur-sm animate-float-7 transform -rotate-12" />
        <div className="absolute bottom-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-stone-600/15 to-neutral-700/15 rounded-full blur-sm animate-float-8" />

        {/* Small accent elements */}
        <div className="absolute top-1/4 left-3/4 w-16 h-32 bg-gradient-to-br from-zinc-600/15 to-stone-700/15 rounded-2xl blur-sm animate-float-9 transform rotate-30" />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-neutral-700/10 to-zinc-600/10 rounded-full blur-sm animate-float-10" />
      </div>

      {/* Moving hashtags */}
      <div className="absolute inset-0 overflow-hidden">
        {hashtags.map((tag, index) => (
          <div
            key={tag}
            className="absolute text-neutral-400/20 text-sm font-mono animate-hashtag-float"
            style={{
              left: `${(index * 23 + 10) % 90}%`,
              top: `${(index * 17 + 15) % 80}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${8 + (index % 4)}s`,
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-start p-6 md:p-8 lg:p-12">
          <div className="space-y-1">
            <div className="text-sm text-neutral-500 font-mono tracking-wider">
              {time.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
            <div className="text-xl font-mono text-neutral-400 tracking-wider">
              {time.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-8 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="mb-16">
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] mb-8">
                <span className="block bg-gradient-to-r from-neutral-200 via-white to-stone-200 bg-clip-text text-transparent">
                  Daily
                </span>
                <span className="block bg-gradient-to-r from-stone-300 via-neutral-200 to-zinc-300 bg-clip-text text-transparent">
                  Letter
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-neutral-300 font-semibold leading-relaxed mb-4">
                오늘의 네가 내일의 너에게 보내는
              </p>
              <p className="text-lg md:text-xl text-neutral-500 font-semibold">시간과 감정을 담은 편지</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-6 items-center max-w-sm mx-auto">
              {/* Google Login Button */}
              <Button className="w-full bg-white text-zinc-800 hover:bg-neutral-100 border-0 px-8 py-6 text-lg font-medium group shadow-2xl hover:shadow-white/10 transition-all duration-500 rounded-2xl">
                <Chrome className="w-5 h-5 mr-3 text-zinc-700" />
                Google로 시작하기
              </Button>

              <p className="text-sm text-neutral-500 mt-2">모든 개인정보는 철저히 보호됩니다</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 lg:p-12 text-center">
          <div className="text-sm text-neutral-600 font-light">
            <p>매일 조금씩, 나와의 대화</p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;900&display=swap');
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(15px) rotate(-3deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(20px) rotate(6deg); }
        }
        
        @keyframes float-5 {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-30px) rotate(48deg); }
        }
        
        @keyframes float-6 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(18px) scale(0.95); }
        }
        
        @keyframes float-7 {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-9deg); }
        }
        
        @keyframes float-8 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(22px) scale(1.1); }
        }
        
        @keyframes float-9 {
          0%, 100% { transform: translateY(0px) rotate(30deg); }
          50% { transform: translateY(-18px) rotate(33deg); }
        }
        
        @keyframes float-10 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(12px) scale(0.9); }
        }
        
        @keyframes hashtag-float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-10px) translateX(5px) rotate(1deg); opacity: 0.3; }
          50% { transform: translateY(-5px) translateX(-3px) rotate(-1deg); opacity: 0.2; }
          75% { transform: translateY(-15px) translateX(8px) rotate(2deg); opacity: 0.3; }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
        }
        
        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 12s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 9s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 11s ease-in-out infinite; }
        .animate-float-6 { animation: float-6 7s ease-in-out infinite; }
        .animate-float-7 { animation: float-7 13s ease-in-out infinite; }
        .animate-float-8 { animation: float-8 6s ease-in-out infinite; }
        .animate-float-9 { animation: float-9 14s ease-in-out infinite; }
        .animate-float-10 { animation: float-10 8.5s ease-in-out infinite; }
        
        .animate-hashtag-float {
          animation: hashtag-float ease-in-out infinite;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  )
}
