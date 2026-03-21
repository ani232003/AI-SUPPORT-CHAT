'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Paintbrush, MessageSquare, Save } from 'lucide-react'

const PRESET_COLORS = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#ef4444',
    '#ffffff',
]

const AppearanceConfig = ({ primaryColor, setPrimaryColor, welcomeMessage, setWelcomeMessage, handleSave, isSaving, hasChanges }) => {
    return (
        <div className='space-y-4'>

            {/* Header */}
            <div>
                <h2 className='text-sm font-semibold text-zinc-200'>Appearance</h2>
                <p className='text-xs text-zinc-500 mt-0.5'>Customize how your chatbot looks and feels.</p>
            </div>

            {/* Primary Color */}
            <Card className='border-white/5 bg-[#0A0A0E]'>
                <CardContent className='p-4 space-y-3'>
                    <div className='flex items-center gap-2'>
                        <Paintbrush className='w-3.5 h-3.5 text-zinc-500' />
                        <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Primary Color</Label>
                    </div>

                    {/* Preset colors */}
                    <div className='flex items-center gap-2 flex-wrap'>
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => setPrimaryColor(color)}
                                className='w-6 h-6 rounded-full border-2 transition-all'
                                style={{
                                    backgroundColor: color,
                                    borderColor: primaryColor === color ? 'white' : 'transparent',
                                    transform: primaryColor === color ? 'scale(1.2)' : 'scale(1)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Custom color input */}
                    <div className='flex items-center gap-3'>
                        <div
                            className='w-8 h-8 rounded-lg border border-white/10 shrink-0'
                            style={{ backgroundColor: primaryColor }}
                        />
                        <div className='flex items-center gap-2 flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2'>
                            <input
                                type='color'
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className='w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0'
                            />
                            <input
                                type='text'
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className='flex-1 bg-transparent text-xs text-zinc-300 focus:outline-none font-mono'
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Welcome Message */}
            <Card className='border-white/5 bg-[#0A0A0E]'>
                <CardContent className='p-4 space-y-3'>
                    <div className='flex items-center gap-2'>
                        <MessageSquare className='w-3.5 h-3.5 text-zinc-500' />
                        <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Welcome Message</Label>
                    </div>
                    <textarea
                        placeholder="Hello! How can I assist you today?"
                        rows={3}
                        className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none transition-colors resize-none'
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                    />
                    <p className='text-xs text-zinc-600'>This is the first message your users will see.</p>
                </CardContent>
            </Card>

            {/* Save Button */}
            {hasChanges && (
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className='w-full bg-white text-black hover:bg-zinc-200 gap-2'
                >
                    <Save className='w-3.5 h-3.5' />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            )}
        </div>
    )
}

export default AppearanceConfig