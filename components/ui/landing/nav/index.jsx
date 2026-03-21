import React from 'react'
import Link from 'next/link'
import { MessageSquareHeart } from 'lucide-react'
import { cookies } from 'next/headers'

const Navbar = async () => {
    const cookieStore = await cookies()
    const session = cookieStore.get('session_user')
    const user = session ? JSON.parse(session.value) : null

  return (
    <nav className='fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-sm border-b border-white/5 bg-[#050509]/50'>
        <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
            
            {/* Logo */}
            <Link href="/" className='flex items-center gap-2'>
                <MessageSquareHeart className="text-purple-400 w-5 h-5" />
                <span className='text-sm font-medium tracking-tight text-white/90'>ReplyAI</span>
            </Link>

            {/* Middle Links */}
            <div className='hidden md:flex items-center gap-8 text-sm font-light text-zinc-400'>
                <Link href="#features" className='hover:text-white transition-colors'>Features</Link>
                <Link href="#how-it-works" className='hover:text-white transition-colors'>How it works</Link>
                <Link href="#pricing" className='hover:text-white transition-colors'>Pricing</Link>
            </div>

            {/* Right Side Buttons */}
            <div className='flex items-center gap-3'>
                {user ? (
                    <Link 
                        href="/dashboard" 
                        className='text-sm bg-purple-600 text-white px-4 py-1.5 rounded-full font-medium hover:bg-purple-500 transition-colors animate-bounce'
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href="/api/auth" className='text-sm text-zinc-400 hover:text-white transition-colors'>
                            Login
                        </Link>
                        <Link href="/api/auth" className='text-sm bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-zinc-200 transition-colors'>
                            Get Started
                        </Link>
                    </>
                )}
            </div>

        </div>
    </nav>
  )
}

export default Navbar