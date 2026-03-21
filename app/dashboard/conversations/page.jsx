'use client'

import React, { useEffect, useState } from 'react'
import { MessageCircle, Clock, ChevronRight, User, Bot, Search } from 'lucide-react'

const ConversationsPage = () => {
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetch('/api/conversation/fetch')
            .then(r => r.json())
            .then(data => {
                if (data.success) setConversations(data.data)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const filtered = conversations.filter(c => {
        const firstMsg = c.messages?.[0]?.content || ''
        return firstMsg.toLowerCase().includes(search.toLowerCase())
    })

    const formatTime = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = now - date
        const mins = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)
        if (mins < 60) return `${mins}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    const getPreview = (conv) => {
        const lastMsg = conv.messages?.[conv.messages.length - 1]
        return lastMsg?.content?.slice(0, 60) + (lastMsg?.content?.length > 60 ? '...' : '') || 'No messages'
    }

    return (
        <div className='flex h-screen bg-[#09090b] text-white overflow-hidden'>

            {/* Left Panel — Conversation List */}
            <div className='w-80 shrink-0 border-r border-white/5 flex flex-col'>

                {/* Header */}
                <div className='px-5 py-5 border-b border-white/5'>
                    <h1 className='text-base font-semibold text-white tracking-tight'>Conversations</h1>
                    <p className='text-xs text-zinc-500 mt-0.5'>{conversations.length} total</p>
                </div>

                {/* Search */}
                <div className='px-4 py-3 border-b border-white/5'>
                    <div className='flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2'>
                        <Search className='w-3.5 h-3.5 text-zinc-500 shrink-0' />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder='Search conversations...'
                            className='bg-transparent text-xs text-white placeholder:text-zinc-600 outline-none w-full'
                        />
                    </div>
                </div>

                {/* List */}
                <div className='flex-1 overflow-y-auto'>
                    {loading ? (
                        <div className='space-y-0'>
                            {[1,2,3,4].map(i => (
                                <div key={i} className='px-4 py-4 border-b border-white/5 animate-pulse'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-8 h-8 rounded-full bg-white/5 shrink-0' />
                                        <div className='flex-1 space-y-2'>
                                            <div className='h-2.5 bg-white/5 rounded w-1/2' />
                                            <div className='h-2 bg-white/5 rounded w-3/4' />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
                            <div className='p-3 rounded-full bg-white/5 border border-white/10 mb-3'>
                                <MessageCircle className='w-5 h-5 text-zinc-600' />
                            </div>
                            <p className='text-sm text-zinc-500'>No conversations yet</p>
                            <p className='text-xs text-zinc-600 mt-1'>Conversations from your widget will appear here.</p>
                        </div>
                    ) : (
                        filtered.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setSelected(conv)}
                                className={`px-4 py-4 border-b border-white/5 cursor-pointer transition-colors ${selected?.id === conv.id ? 'bg-white/5' : 'hover:bg-white/2'}`}
                            >
                                <div className='flex items-start gap-3'>
                                    <div className='w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5'>
                                        <User className='w-3.5 h-3.5 text-indigo-400' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between gap-2 mb-1'>
                                            <span className='text-xs font-medium text-zinc-300 truncate'>
                                                {conv.name || 'Visitor'}
                                            </span>
                                            <span className='text-[10px] text-zinc-600 shrink-0 flex items-center gap-1'>
                                                <Clock className='w-2.5 h-2.5' />
                                                {formatTime(conv.created_at)}
                                            </span>
                                        </div>
                                        <p className='text-xs text-zinc-500 truncate'>{getPreview(conv)}</p>
                                        <div className='flex items-center gap-2 mt-1.5'>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${conv.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                                {conv.status}
                                            </span>
                                            <span className='text-[10px] text-zinc-600'>{conv.messages?.length || 0} messages</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel — Message View */}
            <div className='flex-1 flex flex-col'>
                {selected ? (
                    <>
                        {/* Conversation Header */}
                        <div className='px-6 py-4 border-b border-white/5 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center'>
                                    <User className='w-3.5 h-3.5 text-indigo-400' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-white'>{selected.name || 'Visitor'}</p>
                                    <p className='text-xs text-zinc-500'>{new Date(selected.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${selected.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                {selected.status}
                            </span>
                        </div>

                        {/* Messages */}
                        <div className='flex-1 overflow-y-auto px-6 py-6 space-y-4'>
                            {selected.messages?.map((msg, i) => (
                                <div key={i} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-white/5 border border-white/10'}`}>
                                        {msg.role === 'user'
                                            ? <User className='w-3 h-3 text-indigo-400' />
                                            : <Bot className='w-3 h-3 text-zinc-400' />
                                        }
                                    </div>
                                    <div className={`max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-[#141414] border border-white/6 text-zinc-300 rounded-bl-sm'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='flex-1 flex flex-col items-center justify-center text-center px-8'>
                        <div className='p-4 rounded-2xl bg-white/5 border border-white/10 mb-4'>
                            <MessageCircle className='w-8 h-8 text-zinc-600' />
                        </div>
                        <p className='text-sm font-medium text-zinc-400'>Select a conversation</p>
                        <p className='text-xs text-zinc-600 mt-1'>Click on a conversation from the left to view messages</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConversationsPage