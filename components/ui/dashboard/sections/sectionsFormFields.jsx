'use client'

import React from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, X, Trash2, AlertTriangle } from 'lucide-react'

const TONES = [
    {
        value: 'strict',
        label: 'Strict',
        description: 'Only answer if fully confident. No small talk.',
        badge: 'Fact based',
        badgeColor: 'bg-red-500/20 text-red-400 border-red-500/20',
    },
    {
        value: 'neutral',
        label: 'Neutral',
        description: 'Professional, concise, and direct.',
        badge: null,
    },
    {
        value: 'friendly',
        label: 'Friendly',
        description: 'Warm and conversational. Good for general FAQ.',
        badge: null,
    },
    {
        value: 'empathetic',
        label: 'Empathetic',
        description: 'Support-first, apologetic, and calming.',
        badge: null,
    },
]

const INITIAL_FORM = {
    name: '',
    description: '',
    tone: 'neutral',
    allowed_topics: '',
    blocked_topics: '',
    source_ids: [],
}

const CreateSectionSheet = ({ isOpen, setIsOpen, knowledgeSources, onSave, onDelete, isSaving, selectedSection }) => {
    const [form, setForm] = React.useState(INITIAL_FORM)
    const [sourcesOpen, setSourcesOpen] = React.useState(false)
    const [confirmDelete, setConfirmDelete] = React.useState(false)

    React.useEffect(() => {
        if (selectedSection) {
            setForm({
                name: selectedSection.name || '',
                description: selectedSection.description || '',
                tone: selectedSection.tone || 'neutral',
                allowed_topics: Array.isArray(selectedSection.allowed_topics)
                    ? selectedSection.allowed_topics.join(', ')
                    : selectedSection.allowed_topics || '',
                blocked_topics: Array.isArray(selectedSection.blocked_topics)
                    ? selectedSection.blocked_topics.join(', ')
                    : selectedSection.blocked_topics || '',
                source_ids: selectedSection.source_ids || [],
            })
        } else {
            setForm(INITIAL_FORM)
        }
        setSourcesOpen(false)
        setConfirmDelete(false)
    }, [selectedSection, isOpen])

    const toggleSource = (id) => {
        setForm((prev) => ({
            ...prev,
            source_ids: prev.source_ids.includes(id)
                ? prev.source_ids.filter((s) => s !== id)
                : [...prev.source_ids, id],
        }))
    }

    const removeSource = (id) => {
        setForm((prev) => ({
            ...prev,
            source_ids: prev.source_ids.filter((s) => s !== id),
        }))
    }

    const getSourceName = (id) => {
        return knowledgeSources?.find((s) => s.id === id)?.name || id
    }

    const getSourceType = (id) => {
        return knowledgeSources?.find((s) => s.id === id)?.type || ''
    }

    const handleSave = () => {
        if (!form.name.trim()) return
        onSave({
            name: form.name,
            description: form.description,
            tone: form.tone,
            allowedTopics: form.allowed_topics || null,
            blockedTopics: form.blocked_topics || null,
            sourceIds: form.source_ids,
        })
    }

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            return
        }
        if (onDelete && selectedSection) {
            onDelete(selectedSection.id)
            setIsOpen(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md bg-[#0A0A0F] border-white/10 text-zinc-100 p-0 flex flex-col overflow-y-auto [&>button]:hidden">
                <VisuallyHidden>
                    <SheetTitle>{selectedSection ? 'View Section' : 'Create Section'}</SheetTitle>
                </VisuallyHidden>

                {/* Header */}
                <div className='px-6 pt-6 pb-4 border-b border-white/5 flex items-start justify-between'>
                    <div>
                        <h2 className='text-base font-semibold text-white'>
                            {selectedSection ? 'View Section' : 'Create Section'}
                        </h2>
                        <p className='text-xs text-zinc-500 mt-0.5'>
                            {selectedSection
                                ? 'Review section configuration and data sources.'
                                : 'Configure how the AI behaves for this specific topic.'}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className='text-zinc-500 hover:text-white transition-colors mt-0.5'
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>

                {/* Form */}
                <div className='flex-1 px-6 py-5 space-y-6'>

                    {/* Section Name */}
                    <div className='space-y-2'>
                        <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Section Name</Label>
                        <Input
                            placeholder="e.g. Billing Policy"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-0"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            readOnly={!!selectedSection}
                        />
                    </div>

                    {/* Description */}
                    <div className='space-y-2'>
                        <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Description</Label>
                        <Input
                            placeholder="When should the AI use this?"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-0"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            readOnly={!!selectedSection}
                        />
                        {!selectedSection && (
                            <p className='text-xs text-zinc-600'>Used by the routing model to decide when to activate this section.</p>
                        )}
                    </div>

                    {/* Data Sources */}
                    <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                            <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Data Sources</Label>
                            <span className='text-xs text-zinc-600'>{form.source_ids.length} attached</span>
                        </div>

                        {/* Selected source tags */}
                        {form.source_ids.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {form.source_ids.map((id) => (
                                    <div
                                        key={id}
                                        className='flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300'
                                    >
                                        <span className='capitalize text-indigo-400/60'>[{getSourceType(id)}]</span>
                                        <span className='max-w-30 truncate'>{getSourceName(id)}</span>
                                        {!selectedSection && (
                                            <button
                                                onClick={() => removeSource(id)}
                                                className='text-indigo-400/50 hover:text-indigo-300 transition-colors ml-0.5'
                                            >
                                                <X className='w-3 h-3' />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {!selectedSection && (
                            <>
                                <button
                                    onClick={() => setSourcesOpen(!sourcesOpen)}
                                    className='w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-zinc-400 hover:border-white/20 transition-colors'
                                >
                                    <span>{sourcesOpen ? 'Hide sources' : 'Add knowledge sources...'}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${sourcesOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {sourcesOpen && (
                                    <div className='bg-[#0E0E14] border border-white/10 rounded-md overflow-hidden shadow-xl'>
                                        {!knowledgeSources || knowledgeSources.length === 0 ? (
                                            <p className='text-xs text-zinc-500 p-3'>No knowledge sources available</p>
                                        ) : (
                                            knowledgeSources.map((source) => (
                                                <div
                                                    key={source.id}
                                                    onClick={() => toggleSource(source.id)}
                                                    className='flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer transition-colors'
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${form.source_ids.includes(source.id) ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
                                                        {form.source_ids.includes(source.id) && (
                                                            <svg className='w-2.5 h-2.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <p className='text-xs text-zinc-300 truncate'>{source.name}</p>
                                                        <p className='text-xs text-zinc-600 capitalize'>{source.type}</p>
                                                    </div>
                                                    {form.source_ids.includes(source.id) && (
                                                        <span className='text-xs text-indigo-400'>Added</span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Tone */}
                    <div className='space-y-3'>
                        <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Tone</Label>
                        <div className='space-y-2'>
                            {TONES.map((tone) => (
                                <div
                                    key={tone.value}
                                    onClick={() => !selectedSection && setForm({ ...form, tone: tone.value })}
                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${!selectedSection ? 'cursor-pointer' : 'cursor-default'} ${form.tone === tone.value ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/5'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${form.tone === tone.value ? 'border-indigo-500' : 'border-white/20'}`}>
                                        {form.tone === tone.value && (
                                            <div className='w-2 h-2 rounded-full bg-indigo-500' />
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-sm text-zinc-200'>{tone.label}</span>
                                            {tone.badge && (
                                                <Badge className={`text-xs border ${tone.badgeColor}`}>
                                                    {tone.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className='text-xs text-zinc-500 mt-0.5'>{tone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scope Rules */}
                    <div className='space-y-3'>
                        <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Scope Rules</Label>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='space-y-1.5'>
                                <p className='text-xs text-zinc-500'>Allowed Topics</p>
                                <Input
                                    placeholder="e.g. pricing, refunds"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-0 text-xs"
                                    value={form.allowed_topics}
                                    onChange={(e) => setForm({ ...form, allowed_topics: e.target.value })}
                                    readOnly={!!selectedSection}
                                />
                            </div>
                            <div className='space-y-1.5'>
                                <p className='text-xs text-zinc-500'>Blocked Topics</p>
                                <Input
                                    placeholder="e.g. competitors"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-0 text-xs"
                                    value={form.blocked_topics}
                                    onChange={(e) => setForm({ ...form, blocked_topics: e.target.value })}
                                    readOnly={!!selectedSection}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone - only when viewing */}
                    {selectedSection && (
                        <div className='space-y-3 pt-2'>
                            <div className='h-px bg-white/5' />
                            <div className='flex items-center gap-2'>
                                <AlertTriangle className='w-3.5 h-3.5 text-red-400' />
                                <Label className='text-xs text-red-400 uppercase tracking-wider'>Danger Zone</Label>
                            </div>
                            <p className='text-xs text-zinc-600'>Deleting this section will remove all associated routing rules.</p>
                            <Button
                                variant='ghost'
                                className={`w-full border text-sm gap-2 transition-all ${confirmDelete
                                    ? 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                    : 'border-red-500/20 text-red-400 bg-red-500/5'
                                }`}
                                onClick={handleDelete}
                            >
                                <Trash2 className='w-3.5 h-3.5' />
                                {confirmDelete ? 'Click again to confirm delete' : 'Delete Section'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer - only show when creating */}
                {!selectedSection && (
                    <div className='px-6 py-4 border-t border-white/5 flex gap-3'>
                        <Button
                            variant='ghost'
                            className='flex-1 text-zinc-400 hover:text-white hover:bg-white/5'
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='flex-1 bg-white text-black hover:bg-zinc-200'
                            onClick={handleSave}
                            disabled={!form.name.trim() || isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Create Section'}
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default CreateSectionSheet