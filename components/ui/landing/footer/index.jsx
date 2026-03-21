import Link from 'next/link'
import { MessageSquareHeart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='border-t border-white/10 py-16 px-6'>
        <div className='max-w-6xl mx-auto'>

            {/* Top Section */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>

                {/* Brand */}
                <div className='md:col-span-2'>
                    <Link href='/' className='flex items-center gap-2 mb-4'>
                        <MessageSquareHeart className='text-purple-400 w-5 h-5' />
                        <span className='text-sm font-medium text-white'>ReplyAI</span>
                    </Link>
                    <p className='text-sm text-zinc-500 font-light leading-relaxed max-w-xs'>
                        Deploy an AI support agent on your website in minutes. Your customers get instant answers 24/7.
                    </p>
                    {/* Status Badge */}
                    <div className='flex items-center gap-2 mt-4'>
                        <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></div>
                        <span className='text-xs text-zinc-500'>All systems operational</span>
                    </div>
                </div>

                {/* Product Links */}
                <div>
                    <h4 className='text-xs font-medium text-white uppercase tracking-wider mb-4'>Product</h4>
                    <ul className='space-y-3'>
                        <li><Link href='#features' className='text-sm text-zinc-500 hover:text-white transition-colors'>Features</Link></li>
                        <li><Link href='#how-it-works' className='text-sm text-zinc-500 hover:text-white transition-colors'>How it works</Link></li>
                        <li><Link href='#pricing' className='text-sm text-zinc-500 hover:text-white transition-colors'>Pricing</Link></li>
                        <li><Link href='/dashboard' className='text-sm text-zinc-500 hover:text-white transition-colors'>Dashboard</Link></li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h4 className='text-xs font-medium text-white uppercase tracking-wider mb-4'>Company</h4>
                    <ul className='space-y-3'>
                        <li><Link href='/login' className='text-sm text-zinc-500 hover:text-white transition-colors'>Login</Link></li>
                        <li><Link href='/signup' className='text-sm text-zinc-500 hover:text-white transition-colors'>Sign up</Link></li>
                        <li><Link href='#' className='text-sm text-zinc-500 hover:text-white transition-colors'>Privacy Policy</Link></li>
                        <li><Link href='#' className='text-sm text-zinc-500 hover:text-white transition-colors'>Terms of Service</Link></li>
                    </ul>
                </div>

            </div>

            {/* Divider */}
            <div className='border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
                <p className='text-xs text-zinc-600'>
                    &copy; 2025 ReplyAI. All rights reserved.
                </p>
                <p className='text-xs text-zinc-600'>
                    Built with Next.js, Gemini AI and Socket.io
                </p>
            </div>

        </div>
    </footer>
  )
}

export default Footer