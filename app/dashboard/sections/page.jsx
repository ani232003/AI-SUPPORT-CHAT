'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Layers, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import CreateSectionSheet from '@/components/ui/dashboard/sections/sectionsFormFields'

const TONE_COLOR = {
    strict: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    friendly: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    empathetic: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
}

const STATUS_COLOR = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    disabled: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

const Sections = () => {
    const [sections, setSections] = React.useState([])
    const [isLoadingSections, setIsLoadingSections] = React.useState(true)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [selectedSection, setSelectedSection] = React.useState(null)
    const [knowledgeSources, setKnowledgeSources] = React.useState([])
    const [isSaving, setIsSaving] = React.useState(false)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionsRes = await fetch('/api/sections/fetch')
                if (sectionsRes.ok) {
                    const sectionsData = await sectionsRes.json()
                    setSections(sectionsData.data || [])
                }
            } catch (error) {
                console.error('Error fetching sections:', error)
            }
            try {
                const sourcesRes = await fetch('/api/knowledge/fetch')
                if (sourcesRes.ok) {
                    const sourcesData = await sourcesRes.json()
                    setKnowledgeSources(sourcesData.data || [])
                }
            } catch (error) {
                console.error('Error fetching knowledge sources:', error)
            } finally {
                setIsLoadingSections(false)
            }
        }
        fetchData()
    }, [])

    const handleCreateSection = () => {
        setSelectedSection(null)
        setIsSheetOpen(true)
    }

    const handleViewSection = (section) => {
        setSelectedSection(section)
        setIsSheetOpen(true)
    }

    const handleSave = async (formData) => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/sections/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (response.ok) {
                const res = await fetch('/api/sections/fetch')
                const data = await res.json()
                setSections(data.data || [])
                setIsSheetOpen(false)
            }
        } catch (error) {
            console.error('Error saving section:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await fetch('/api/sections/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            setSections((prev) => prev.filter((s) => s.id !== id))
        } catch (error) {
            console.error('Error deleting section:', error)
        }
    }

    const getSourceCount = (section) => {
        return section.source_ids?.length || 0
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className='text-2xl font-semibold text-white tracking-tight'>Sections</h1>
                    <p className='text-zinc-400 mt-1 text-sm'>Define behavior and tone for different topics</p>
                </div>
                <Button onClick={handleCreateSection} className="bg-white text-black hover:bg-zinc-200 cursor-pointer gap-2">
                    <Plus className="w-4 h-4" />
                    Create Section
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-white/5 overflow-hidden bg-[#0A0A0E]">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-3 bg-white/2 border-b border-white/5">
                    <div className="col-span-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</div>
                    <div className="col-span-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Sources</div>
                    <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tone</div>
                    <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</div>
                    <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</div>
                </div>

                {/* Loading */}
                {isLoadingSections ? (
                    <div>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="grid grid-cols-12 px-6 py-4 border-b border-white/5 animate-pulse items-center">
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white/5" />
                                    <div className="h-3 bg-white/5 rounded w-24" />
                                </div>
                                <div className="col-span-3"><div className="h-3 bg-white/5 rounded w-16" /></div>
                                <div className="col-span-2"><div className="h-5 bg-white/5 rounded-full w-16" /></div>
                                <div className="col-span-2"><div className="h-5 bg-white/5 rounded-full w-14" /></div>
                                <div className="col-span-2 flex justify-end">
                                    <div className="w-7 h-7 bg-white/5 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className='p-4 rounded-full bg-white/5 border border-white/10 mb-4'>
                            <Layers className="w-6 h-6 text-zinc-600" />
                        </div>
                        <p className='text-sm text-zinc-400 font-medium'>No sections yet</p>
                        <p className='text-xs text-zinc-600 mt-1'>
                            Get started by{' '}
                            <button
                                onClick={handleCreateSection}
                                className='text-zinc-400 underline underline-offset-2 hover:text-white transition-colors'
                            >
                                creating your first section
                            </button>
                        </p>
                    </div>
                ) : (
                    <div>
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                className={`grid grid-cols-12 px-6 py-4 items-center hover:bg-white/2 transition-colors ${index !== sections.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                {/* Name */}
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className='p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0'>
                                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                    </div>
                                    <button
                                        onClick={() => handleViewSection(section)}
                                        className='text-sm font-medium text-zinc-200 hover:text-white underline underline-offset-2 decoration-zinc-600 hover:decoration-zinc-400 transition-colors text-left'
                                    >
                                        {section.name}
                                    </button>
                                </div>

                                {/* Sources */}
                                <div className="col-span-3">
                                    {getSourceCount(section) > 0 ? (
                                        <span className='text-sm'>
                                            <span className='text-white font-medium'>{getSourceCount(section)}</span>
                                            <span className='text-zinc-600'> source{getSourceCount(section) > 1 ? 's' : ''}</span>
                                        </span>
                                    ) : (
                                        <span className='text-xs text-zinc-600'>No sources</span>
                                    )}
                                </div>

                                {/* Tone */}
                                <div className="col-span-2">
                                    {section.tone && (
                                        <Badge className={`text-xs border capitalize ${TONE_COLOR[section.tone] || 'bg-white/5 text-zinc-400 border-white/10'}`}>
                                            {section.tone}
                                        </Badge>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <Badge className={`text-xs border capitalize ${STATUS_COLOR[section.status] || 'bg-white/5 text-zinc-400 border-white/10'}`}>
                                        {section.status}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex items-center justify-end">
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='w-8 h-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
                                        onClick={() => handleDelete(section.id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateSectionSheet
                isOpen={isSheetOpen}
                setIsOpen={setIsSheetOpen}
                knowledgeSources={knowledgeSources}
                onSave={handleSave}
                onDelete={handleDelete}
                isSaving={isSaving}
                selectedSection={selectedSection}
            />
        </div>
    )
}

export default Sections