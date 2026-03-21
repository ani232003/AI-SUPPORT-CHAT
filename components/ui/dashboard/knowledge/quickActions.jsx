import React from 'react'
import { Button } from '@/components/ui/button'
import { Globe, Upload, File } from 'lucide-react'

const QuickActions = ({ onOpenModal }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Button
                variant='outline'
                className="cursor-pointer h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#050509] hover:bg-white/2 hover:border-indigo-500/30 transition-all hover:text-white group whitespace-normal"
                onClick={() => onOpenModal("website")}
            >
                <div className='p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors'>
                    <Globe className="w-6 h-6 text-indigo-400"/>
                </div>
                <div className='space-y-1.5 text-center w-full'>
                    <span className='text-sm font-medium block whitespace-normal'>
                        Add website
                    </span>
                    <p className='text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word'>
                        Crawl your website or specific pages to automatically keep your knowledge base in sync.
                    </p>
                </div>
            </Button>

            <Button
                variant='outline'
                className="cursor-pointer h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#050509] hover:bg-white/2 hover:border-emerald-500/30 transition-all hover:text-white group whitespace-normal"
                onClick={() => onOpenModal("upload")}
            >
                <div className='p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors'>
                    <Upload className="w-6 h-6 text-emerald-400"/>
                </div>
                <div className='space-y-1.5 text-center w-full'>
                    <span className='text-sm font-medium block whitespace-normal'>
                        Upload File
                    </span>
                    <p className='text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word'>
                        Upload CSV files to instantly train your assistant with existing documents.
                    </p>
                </div>
            </Button>

            <Button
                variant='outline'
                className="cursor-pointer h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#050509] hover:bg-white/2 hover:border-violet-500/30 transition-all hover:text-white group whitespace-normal"
                onClick={() => onOpenModal("text")}
            >
                <div className='p-3 rounded-full bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors'>
                    <File className="w-6 h-6 text-violet-400"/>
                </div>
                <div className='space-y-1.5 text-center w-full'>
                    <span className='text-sm font-medium block whitespace-normal'>
                        Manual Text
                    </span>
                    <p className='text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word'>
                        Manually copy and paste FAQs, internal notes, or policies directly into the editor for quick updates.
                    </p>
                </div>
            </Button>
        </div>
    )
}

export default QuickActions