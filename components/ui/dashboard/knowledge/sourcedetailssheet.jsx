'use client'

import React from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, FileText, Upload, FileUp, Trash2 } from 'lucide-react'

const TYPE_ICON = {
    website: <Globe className="w-4 h-4 text-indigo-400" />,
    text: <FileText className="w-4 h-4 text-violet-400" />,
    upload: <Upload className="w-4 h-4 text-emerald-400" />,
    pdf: <FileUp className="w-4 h-4 text-orange-400" />,
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

const SourceDetailsSheet = ({ isOpen, setIsOpen, selectedSource }) => {
    if (!selectedSource) return null

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md bg-[#0A0A0F] border-white/10 text-zinc-100 p-0 flex flex-col">

                <VisuallyHidden>
                    <SheetTitle>{getFriendlyName(selectedSource)}</SheetTitle>
                </VisuallyHidden>

                {/* Header */}
                <div className='px-6 pt-6 pb-4 border-b border-white/5'>
                    <div className='flex items-center gap-2 mb-1'>
                        {TYPE_ICON[selectedSource.type] || <Globe className="w-4 h-4 text-zinc-400" />}
                        <span className='text-sm font-semibold text-white'>{getFriendlyName(selectedSource)}</span>
                    </div>
                    <p className='text-xs text-zinc-500'>{selectedSource.source_url || selectedSource.name}</p>
                </div>

                {/* Status + Date */}
                <div className='px-6 py-3 flex items-center gap-3 border-b border-white/5'>
                    <Badge className={`text-xs border capitalize ${STATUS_COLOR[selectedSource.status] || 'bg-white/5 text-zinc-400 border-white/10'}`}>
                        {selectedSource.status}
                    </Badge>
                    <span className='text-xs text-zinc-500'>
                        Updated {selectedSource.last_updated ? new Date(selectedSource.last_updated).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                    </span>
                </div>

                {/* Content Preview */}
                <div className='flex-1 px-6 py-5 overflow-y-auto'>
                    {selectedSource.content ? (
                        <div className='space-y-3'>
                            <p className='text-xs font-medium text-zinc-500 uppercase tracking-wider'>Content Preview</p>
                            <p className='text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap'>
                                {selectedSource.content.slice(0, 2000)}
                                {selectedSource.content.length > 2000 && (
                                    <span className='text-zinc-600'> ... (truncated)</span>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-full text-center py-16'>
                            <p className='text-sm text-zinc-500'>No content available</p>
                            <p className='text-xs text-zinc-600 mt-1'>Content may still be processing.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='px-6 py-4 border-t border-white/5'>
                    <Button
                        variant='ghost'
                        className='w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20'
                        onClick={() => setIsOpen(false)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect Source
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default SourceDetailsSheet