'use client'

import React from 'react'
import { Globe, FileText, Upload, FileUp, Trash2, Search, SlidersHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const TYPE_ICON = {
    website: <Globe className="w-3.5 h-3.5 text-indigo-400" />,
    text: <FileText className="w-3.5 h-3.5 text-violet-400" />,
    upload: <Upload className="w-3.5 h-3.5 text-emerald-400" />,
    pdf: <FileUp className="w-3.5 h-3.5 text-orange-400" />,
}

const TYPE_COLOR = {
    website: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    text: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    upload: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pdf: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

const STATUS_COLOR = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    training: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const getFriendlyName = (source) => {
    if (source.type === 'website' && source.source_url) {
        try {
            return new URL(source.source_url).hostname.replace('www.', '')
        } catch {
            return source.name
        }
    }
    return source.name
}

const KnowledgeTable = ({ sources, onSourceClick, onDelete, isLoading }) => {
    const [search, setSearch] = React.useState('')

    const filtered = (sources || []).filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='rounded-xl border border-white/5 bg-[#0A0A0F] overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between px-5 py-4 border-b border-white/5'>
                <h2 className='text-sm font-medium text-zinc-300'>Sources</h2>
                <div className='flex items-center gap-2'>
                    <div className='relative'>
                        <Search className='w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2' />
                        <Input
                            placeholder='Search sources...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='pl-8 h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-zinc-600 w-48 focus:border-indigo-500/50 focus:ring-0'
                        />
                    </div>
                    <Button variant='ghost' size='icon' className='h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5'>
                        <SlidersHorizontal className='w-3.5 h-3.5' />
                    </Button>
                </div>
            </div>

            {/* Table Header */}
            <div className='grid grid-cols-12 px-5 py-2.5 border-b border-white/5'>
                <span className='col-span-4 text-xs font-medium text-zinc-600 uppercase tracking-wider'>Name</span>
                <span className='col-span-2 text-xs font-medium text-zinc-600 uppercase tracking-wider'>Type</span>
                <span className='col-span-2 text-xs font-medium text-zinc-600 uppercase tracking-wider'>Status</span>
                <span className='col-span-2 text-xs font-medium text-zinc-600 uppercase tracking-wider'>Last Updated</span>
                <span className='col-span-2 text-xs font-medium text-zinc-600 uppercase tracking-wider text-right'>Actions</span>
            </div>

            {/* Rows */}
            {isLoading ? (
                <div className='space-y-0'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='grid grid-cols-12 px-5 py-4 border-b border-white/5 animate-pulse'>
                            <div className='col-span-4 h-3 bg-white/5 rounded w-3/4' />
                            <div className='col-span-2 h-3 bg-white/5 rounded w-1/2' />
                            <div className='col-span-2 h-3 bg-white/5 rounded w-1/2' />
                            <div className='col-span-2 h-3 bg-white/5 rounded w-1/3' />
                            <div className='col-span-2 h-3 bg-white/5 rounded w-1/4 ml-auto' />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <div className='p-3 rounded-full bg-white/5 border border-white/10 mb-3'>
                        <Globe className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className='text-sm text-zinc-500'>No sources found</p>
                    <p className='text-xs text-zinc-600 mt-1'>Add a website, text, or file to get started.</p>
                </div>
            ) : (
                filtered.map((source) => (
                    <div
                        key={source.id}
                        onClick={() => onSourceClick?.(source)}
                        className='grid grid-cols-12 px-5 py-4 border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer group'
                    >
                        {/* Name */}
                        <div className='col-span-4 flex items-center gap-2.5'>
                            <div className={`p-1.5 rounded-md border ${TYPE_COLOR[source.type] || 'bg-white/5 border-white/10'}`}>
                                {TYPE_ICON[source.type] || <FileText className="w-3.5 h-3.5 text-zinc-400" />}
                            </div>
                            <div className='flex flex-col overflow-hidden'>
                                <span className='text-sm text-zinc-300 truncate group-hover:text-white transition-colors'>
                                    {getFriendlyName(source)}
                                </span>
                                {source.source_url && (
                                    <span className='text-xs text-zinc-600 truncate'>
                                        {source.source_url}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Type */}
                        <div className='col-span-2 flex items-center'>
                            <Badge className={`text-xs border capitalize ${TYPE_COLOR[source.type] || 'bg-white/5 text-zinc-400 border-white/10'}`}>
                                {source.type || 'unknown'}
                            </Badge>
                        </div>

                        {/* Status */}
                        <div className='col-span-2 flex items-center'>
                            <Badge className={`text-xs border capitalize ${STATUS_COLOR[source.status] || 'bg-white/5 text-zinc-400 border-white/10'}`}>
                                {source.status}
                            </Badge>
                        </div>

                        {/* Last Updated */}
                        <div className='col-span-2 flex items-center'>
                            <span className='text-xs text-zinc-500'>
                                {source.last_updated ? new Date(source.last_updated).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className='col-span-2 flex items-center justify-end gap-1'>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-zinc-500 hover:text-white hover:bg-white/5"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSourceClick?.(source)
                                }}
                            >
                                View
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete?.(source.id)
                                }}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default KnowledgeTable