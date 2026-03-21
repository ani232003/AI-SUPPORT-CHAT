"use client"

import React, { useEffect } from 'react'
import { BookOpen, Bot, LayoutDashboard, Layers, MessageSquare, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const SIDEBAR_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
    { label: "Sections", href: "/dashboard/sections", icon: Layers },
    { label: "Chatbot", href: "/dashboard/chatbot", icon: Bot },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
]

const Sidebar = () => {
    const pathname = usePathname()
    const [metadata, setMetadata] = React.useState()
    const [email, setEmail] = React.useState()
    const [isLoading, setIsLoading] = React.useState(true)

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [metaRes, sessionRes] = await Promise.all([
                    fetch('/api/auth/metadata/fetch'),
                    fetch('/api/auth/me')
                ])

                const meta = await metaRes.json()      // fix: parse json
                const session = await sessionRes.json() // fix: parse json

                setMetadata(meta)                      // fix: set state
                setEmail(session?.email)               // fix: set state
            } catch (err) {
                console.error('fetch error:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMetadata()
    }, [])

    return (
        <aside className='w-64 border-r border-white/5 bg-[#050509] flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex'>
            <div className='h-16 flex items-center px-6 border-b border-white/5'>
                <Link href={"/"} className='flex items-center gap-2'>
                    <div className='w-5 h-5 bg-white rounded-sm flex items-center justify-center'>
                        <div className='w-2.5 h-2.5 bg-black rounded-[1px]' />
                    </div>
                    <span className='text-sm font-medium tracking-tight text-white/90'>
                        ReplyAI
                    </span>
                </Link>
            </div>
            <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
                {SIDEBAR_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className='p-4 border-t border-white/5'>
                <div className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group'>
                    <div className='w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10'>
                        <span className='text-xs text-zinc-400 group-hover:text-white'>
                            {metadata?.data?.business_name?.slice(0,2).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className='flex flex-col overflow-hidden'>
                        <span className='text-sm font-medium text-zinc-300 truncate group-hover:text-white'>
                            {isLoading ? "Loading..." : `${metadata?.data?.business_name || 'User'}'s Workspace`} {/* fix: removed duplicate line */}
                        </span>
                        <span className='text-xs text-zinc-500 truncate'>
                            {email || ''}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar