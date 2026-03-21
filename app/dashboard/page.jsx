'use client'

import React, { useEffect, useState } from 'react'
import { BookOpen, Layers, MessageCircle, Bot, ArrowRight, Plus, Code } from 'lucide-react'
import Link from 'next/link'

const DashboardPage = () => {
    const [stats, setStats] = useState({ knowledge: 0, sections: 0, conversations: 0 })
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Fetch user
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(data => setUser(data.user))
            .catch(console.error)

        // Fetch stats
        Promise.all([
            fetch('/api/knowledge/fetch').then(r => r.json()),
            fetch('/api/sections/fetch').then(r => r.json()),
            fetch('/api/conversation/fetch').then(r => r.json()),
        ]).then(([knowledge, section, conversation]) => {
            setStats({
                knowledge: knowledge.data?.length || 0,
                sections: section.data?.length || 0,
                conversations: conversation.data?.length || 0,
            })
        }).catch(console.error)
        .finally(() => setLoading(false))
    }, [])

    const statCards = [
        {
            label: 'Knowledge Sources',
            value: stats.knowledge,
            icon: <BookOpen className='w-4 h-4 text-indigo-400' />,
            bg: 'bg-indigo-500/10 border-indigo-500/20',
            href: '/dashboard/knowledge',
        },
        {
            label: 'Sections',
            value: stats.sections,
            icon: <Layers className='w-4 h-4 text-violet-400' />,
            bg: 'bg-violet-500/10 border-violet-500/20',
            href: '/dashboard/sections',
        },
        {
            label: 'Conversations',
            value: stats.conversations,
            icon: <MessageCircle className='w-4 h-4 text-emerald-400' />,
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            href: '/dashboard/conversations',
        },
    ]

    const quickActions = [
        {
            title: 'Add Knowledge',
            description: 'Train your bot with websites, text or PDFs',
            icon: <BookOpen className='w-4 h-4 text-indigo-400' />,
            href: '/dashboard/knowledge',
            color: 'border-indigo-500/20 hover:border-indigo-500/40',
        },
        {
            title: 'Create Section',
            description: 'Set topic rules and tone for your chatbot',
            icon: <Layers className='w-4 h-4 text-violet-400' />,
            href: '/dashboard/sections',
            color: 'border-violet-500/20 hover:border-violet-500/40',
        },
        {
            title: 'Customize Chatbot',
            description: 'Change colors, welcome message and get embed code',
            icon: <Bot className='w-4 h-4 text-blue-400' />,
            href: '/dashboard/chatbot',
            color: 'border-blue-500/20 hover:border-blue-500/40',
        },
        {
            title: 'View Conversations',
            description: 'See all visitor conversations from your widget',
            icon: <MessageCircle className='w-4 h-4 text-emerald-400' />,
            href: '/dashboard/conversations',
            color: 'border-emerald-500/20 hover:border-emerald-500/40',
        },
    ]

    return (
        <div className='p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500'>

            {/* Header */}
            <div>
                <h1 className='text-2xl font-semibold text-white tracking-tight'>
                    Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
                </h1>
                <p className='text-sm text-zinc-400 mt-1'>Here&apos;s an overview of your AI support setup.</p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {statCards.map((card) => (
                    <Link key={card.label} href={card.href}>
                        <div className={`rounded-xl border ${card.bg} p-5 hover:bg-white/3 transition-colors cursor-pointer`}>
                            <div className='flex items-center justify-between mb-3'>
                                <div className={`p-2 rounded-lg border ${card.bg}`}>
                                    {card.icon}
                                </div>
                                <ArrowRight className='w-4 h-4 text-zinc-600' />
                            </div>
                            <div className='text-2xl font-semibold text-white mb-1'>
                                {loading ? <div className='h-7 w-8 bg-white/5 rounded animate-pulse' /> : card.value}
                            </div>
                            <p className='text-xs text-zinc-500'>{card.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className='text-sm font-medium text-zinc-300 mb-4'>Quick Actions</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {quickActions.map((action) => (
                        <Link key={action.title} href={action.href}>
                            <div className={`rounded-xl border bg-white/2 ${action.color} p-5 transition-all cursor-pointer group`}>
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-start gap-3'>
                                        <div className='p-2 rounded-lg bg-white/5 border border-white/10 mt-0.5'>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium text-white group-hover:text-white transition-colors'>{action.title}</p>
                                            <p className='text-xs text-zinc-500 mt-0.5'>{action.description}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className='w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors mt-1 shrink-0' />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Embed Code Banner */}
            <div className='rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-6 flex items-center justify-between gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20'>
                        <Code className='w-5 h-5 text-indigo-400' />
                    </div>
                    <div>
                        <p className='text-sm font-medium text-white'>Ready to embed?</p>
                        <p className='text-xs text-zinc-500 mt-0.5'>Get your embed code and add your chatbot to any website in seconds.</p>
                    </div>
                </div>
                <Link href='/dashboard/chatbot'>
                    <button className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shrink-0'>
                        <Plus className='w-3.5 h-3.5' />
                        Get Embed Code
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default DashboardPage