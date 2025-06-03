"use client"

import { useRef, useEffect, useState } from "react"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Quote, Code, Link } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export const RichTextEditor = ({ content, onChange, placeholder = "내용을 입력하세요..." }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEmpty, setIsEmpty] = useState(content === "")
  const isInitialMount = useRef(true)

  // 초기 마운트 시에만 innerHTML 설정
  useEffect(() => {
    if (isInitialMount.current && editorRef.current) {
      isInitialMount.current = false
      editorRef.current.innerHTML = content
    }
  }, [content])

  // 내용이 비어있는지 확인
  useEffect(() => {
    if (editorRef.current) {
      const editorContent = editorRef.current.innerHTML
      setIsEmpty(editorContent === "" || editorContent === "<br>")
    }
  }, [content])

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      checkIfEmpty()
    }
  }

  const insertLink = () => {
    const url = prompt("링크 URL을 입력하세요:")
    if (url) {
      formatText("createLink", url)
    }
  }

  const checkIfEmpty = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.innerHTML
      setIsEmpty(editorContent === "" || editorContent === "<br>")
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      checkIfEmpty()
    }
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-1 p-3 bg-slate-50 border-b border-slate-200">
        {/* 텍스트 포맷팅 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText("bold")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="굵게"
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText("italic")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="기울임"
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText("underline")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="밑줄"
            type="button"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-slate-300"></div>

        {/* 정렬 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText("justifyLeft")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="왼쪽 정렬"
            type="button"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText("justifyCenter")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="가운데 정렬"
            type="button"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText("justifyRight")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="오른쪽 정렬"
            type="button"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-slate-300"></div>

        {/* 리스트 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText("insertUnorderedList")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="불릿 리스트"
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText("insertOrderedList")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="번호 리스트"
            type="button"
          >
            <span className="text-sm font-bold">1.</span>
          </button>
        </div>

        <div className="w-px h-6 bg-slate-300"></div>

        {/* 기타 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText("formatBlock", "blockquote")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="인용구"
            type="button"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText("formatBlock", "pre")}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="코드"
            type="button"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={insertLink}
            className="p-2 rounded hover:bg-slate-200 transition-colors"
            title="링크"
            type="button"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-slate-300"></div>

        {/* 색상 */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            onChange={(e) => formatText("foreColor", e.target.value)}
            className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
            title="텍스트 색상"
          />
          <input
            type="color"
            onChange={(e) => formatText("hiliteColor", e.target.value)}
            className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
            title="배경 색상"
          />
        </div>
      </div>

      {/* 에디터 */}
      <div className="relative min-h-[300px]">
        {isEmpty && (
          <div className="absolute top-4 left-4 text-slate-400 pointer-events-none">{placeholder}</div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="min-h-[300px] p-4 outline-none prose prose-slate max-w-none"
          style={{ wordBreak: "break-word" }}
        />
      </div>
    </div>
  )
}
