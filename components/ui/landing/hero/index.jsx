import React from 'react'
import Link from 'next/link'

const Hero = () => {
    return (
        <section className='relative pt-32 md:pt-48 md:pb-32 px-6 overflow-hidden'>
            <div className='max-w-4xl mx-auto text-center relative z-20'>

                {/* Badge */}
                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float'>
                    <div className='w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse'></div>
                    <span className='text-xs text-zinc-400 font-light'>AI Powered Customer Support Platform</span>
                </div>

                {/* Heading */}
                <h1 className='text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]'>
                    Human friendly Support
                    <br />
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400'>AI Chatbot</span>
                </h1>

                {/* Subheading */}
                <p className='text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-10'>
                    Deploy an AI support agent on your website in minutes. Your customers get instant answers 24/7 — and when AI needs help, a real agent steps in seamlessly.
                </p>

                {/* CTA Buttons */}
                <div className='flex items-center justify-center gap-4'>
                    <Link href="/signup" className='bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors'>
                        Start for free
                    </Link>
                    <button className='flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group'>
                        <div className='w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center'>
                            <div className='w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-purple-400 ml-0.5'></div>
                        </div>
                        <span className='text-sm text-zinc-400 group-hover:text-white transition-colors'>Watch Demo</span>
                    </button>
                </div>
            </div>
            {/* Floating Chat Visualization */}
            <div className='relative mt-16 max-w-md mx-auto'>

                {/* Glow */}
                <div className='absolute -inset-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-2xl'></div>

                {/* Chat Window */}
                <div className='relative rounded-2xl border border-white/10 bg-[#0d0d14] overflow-hidden animate-float'>

                    {/* Chat Header */}
                    <div className='flex items-center gap-2 px-4 py-3 border-b border-white/10'>
                        <div className='w-2 h-2 rounded-full bg-green-400'></div>
                        <p className='text-xs font-medium text-zinc-300'>ReplyAI Support</p>
                    </div>

                    {/* Messages Area */}
                    <div className='p-5 space-y-4 min-h-[280px]'>

                        {/* AI Message */}
                        <div className='flex items-start gap-3'>
                            <div className='w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400/20 flex items-center justify-center flex-shrink-0'>
                                <span className='text-xs text-purple-300'>AI</span>
                            </div>
                            <div className='bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[75%]'>
                                <p className='text-sm text-zinc-300'>Hi there, How can I help you today?</p>
                            </div>
                        </div>

                        {/* Quick Reply Buttons */}
                        <div className='flex items-center gap-2 ml-11'>
                            <button className='px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 hover:bg-white/10 transition-colors'>
                                FAQ
                            </button>
                            <button className='px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 hover:bg-white/10 transition-colors'>
                                Pricing
                            </button>
                            <button className='px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 hover:bg-white/10 transition-colors'>
                                Support
                            </button>
                        </div>

                        {/* Customer Message */}
                        <div className='flex justify-end items-center gap-3'>
                            <div className='bg-white/8 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]'>
                                <p className='text-sm text-zinc-300'>I need some information about ReplyAI</p>
                            </div>
                            <div className='w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0'>
                                <span className='text-xs text-zinc-300'>U</span>
                            </div>
                        </div>

                        {/* Typing Indicator */}
                        <div className='flex items-start gap-3'>
                            <div className='w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400/20 flex items-center justify-center flex-shrink-0'>
                                <span className='text-xs text-purple-300'>AI</span>
                            </div>
                            <div className='bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3'>
                                <div className='flex gap-1 items-center'>
                                    <div className='w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce' style={{ animationDelay: '0ms' }}></div>
                                    <div className='w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce' style={{ animationDelay: '150ms' }}></div>
                                    <div className='w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce' style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Input Bar */}
                    <div className='px-4 py-3 border-t border-white/10 flex items-center gap-3'>
                        <div className='flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2'>
                            <p className='text-xs text-zinc-600'>Type a message...</p>
                        </div>
                        <div className='w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center cursor-pointer hover:bg-purple-400 transition-colors flex-shrink-0'>
                            <svg className='w-3.5 h-3.5 text-white rotate-90' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M2 21l21-9L2 3v7l15 2-15 2v7z' />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Hero