'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { RotateCcw, ArrowUp, Bot, Sparkles } from 'lucide-react'

const renderMarkdown = (text) => {
    if (!text) return null
    const lines = text.split('\n')
    return lines.map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
            j % 2 === 1
                ? <strong key={j} className="font-semibold text-white">{part}</strong>
                : part
        )
        const isNumbered = /^\d+\.\s/.test(line)
        const isBullet = /^[-•]\s/.test(line)

        if (isNumbered || isBullet) {
            return (
                <div key={i} className="flex gap-2.5 my-1">
                    <span className="text-zinc-600 shrink-0 text-xs mt-0.75 font-mono">
                        {isNumbered ? line.match(/^\d+/)[0] + '.' : '·'}
                    </span>
                    <span className="text-zinc-300 text-sm leading-relaxed">
                        {parts.map((p, j) => typeof p === 'string'
                            ? p.replace(/^\d+\.\s|^[-•]\s/, '')
                            : p
                        )}
                    </span>
                </div>
            )
        }
        if (line.trim() === '') return <div key={i} className="h-2" />
        return <p key={i} className="text-sm leading-relaxed text-zinc-300 my-0.5">{parts}</p>
    })
}

const ChatSimulator = ({
    messages,
    primaryColor,
    sections,
    input,
    setInput,
    handleSend,
    handleKeyDown,
    activeSection,
    isTyping,
    handleReset,
    scrollRef,
    onSectionClick
}) => {
    return (
        <div className="flex flex-col h-full min-h-0 bg-[#080809] rounded-2xl border border-white/6 overflow-hidden">

            {/* Header */}
            <div className="shrink-0 px-5 py-4 border-b border-white/6 flex items-center justify-between bg-[#080809]">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: primaryColor + '18' }}
                    >
                        <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white tracking-tight">AI Assistant</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-xs text-zinc-500">Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {activeSection && (
                        <div
                            className="text-xs px-2.5 py-1 rounded-lg font-medium tracking-wide"
                            style={{
                                backgroundColor: primaryColor + '15',
                                color: primaryColor,
                            }}
                        >
                            {activeSection.name}
                        </div>
                    )}
                    <button
                        onClick={handleReset}
                        className="p-2 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all"
                        title="Reset conversation"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Topic Pills */}
            {sections?.length > 0 && (
                <div className="shrink-0 px-5 py-3 border-b border-white/6 bg-[#080809]">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        <span className="text-[11px] text-zinc-600 font-medium mr-1.5 shrink-0 uppercase tracking-widest">
                            Topic
                        </span>
                        {sections.map((section) => {
                            const isActive = activeSection?.id === section.id
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => onSectionClick?.(section)}
                                    className="shrink-0 text-[11px] px-3 py-1.5 rounded-lg font-medium tracking-wide transition-all"
                                    style={isActive ? {
                                        backgroundColor: primaryColor + '20',
                                        color: primaryColor,
                                        outline: `1px solid ${primaryColor}40`
                                    } : {
                                        backgroundColor: 'rgba(255,255,255,0.04)',
                                        color: '#52525b',
                                    }}
                                >
                                    {section.name}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto min-h-0 px-5 py-6 space-y-5"
                style={{ scrollbarWidth: 'none' }}
            >
                {messages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: primaryColor + '12' }}
                        >
                            <Bot className="w-6 h-6" style={{ color: primaryColor + 'aa' }} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400 font-medium">How can I help?</p>
                            <p className="text-xs text-zinc-600 mt-1">Start a conversation below</p>
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.role === 'assistant' && (
                            <div
                                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                style={{ backgroundColor: primaryColor + '15' }}
                            >
                                <Bot className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                            </div>
                        )}

                        <div
                            className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm ${
                                message.role === 'user'
                                    ? 'text-white rounded-tr-sm'
                                    : 'bg-white/4 border border-white/6 rounded-tl-sm'
                            }`}
                            style={message.role === 'user'
                                ? { backgroundColor: primaryColor }
                                : {}
                            }
                        >
                            {message.role === 'assistant'
                                ? renderMarkdown(message.content)
                                : <span className="leading-relaxed">{message.content}</span>
                            }
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 justify-start">
                        <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: primaryColor + '15' }}
                        >
                            <Bot className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        </div>
                        <div className="bg-white/4 border border-white/6 px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                            {[0, 150, 300].map((delay) => (
                                <div
                                    key={delay}
                                    className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce"
                                    style={{ animationDelay: `${delay}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="shrink-0 px-4 pb-4 pt-3 border-t border-white/6 bg-[#080809]">
                <div className="flex items-end gap-2 bg-white/4 border border-white/8 rounded-xl px-4 py-3 focus-within:border-white/15 transition-colors">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-20 shrink-0"
                        style={{ backgroundColor: input.trim() ? primaryColor : 'rgba(255,255,255,0.06)' }}
                    >
                        <ArrowUp className="w-3.5 h-3.5 text-white" />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ChatSimulator