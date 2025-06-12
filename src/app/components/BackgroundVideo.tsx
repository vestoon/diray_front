'use client'

export default function BackgroundVideo() {
  return (
    <>
      {/* 배경 영상 */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/video/cmbtkuuhw00363b6p2oxie10w.mp4" type="video/mp4" />
        브라우저가 영상을 지원하지 않습니다.
      </video>
      
      {/* 어두운 오버레이 (텍스트 가독성 향상) */}
      <div className="fixed inset-0 bg-black/30 z-0" />
    </>
  )
}