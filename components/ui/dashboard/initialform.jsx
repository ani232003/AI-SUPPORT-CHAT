'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Building2, ChevronLeft, ChevronRight, Globe, Link, Sparkle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const STEPS = [
    {
        id: 'name',
        label: 'Business Name',
        question: 'What is the name of your business?',
        description: 'This will be the identity of your AI assistant.',
        icon: Building2,
        placeholder: 'e.g. Acme Corp',
        type: 'text',
        field: 'businessName',
    },
    {
        id: 'website',
        label: 'Website URL',
        question: 'What is your website URL?',
        description: 'We will use this to train your AI assistant.',
        icon: Globe,
        placeholder: 'e.g. https://acme.com',
        type: 'url',
        field: 'websiteUrl',
    },
    {
        id: 'links',
        label: 'External Links',
        question: 'Any external links to include?',
        description: 'Docs, help pages, or any other useful links.',
        icon: Link,
        placeholder: 'e.g. https://docs.acme.com',
        type: 'text',
        field: 'externalLinks',
    },
]

const InitialForm = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        businessName: '',
        websiteUrl: '',
        externalLinks: '',
    })

    const inputRef = useRef(null)
    const router = useRouter()

    const stepData = STEPS[currentStep]
    const Icon = stepData.icon

    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 300)
    }, [currentStep])

    const handleBack = () => {
        if (currentStep > 0) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep((prev) => prev - 1)
                setIsAnimating(false)
            }, 300)
        }
    }

    const handleKeyDown = (e) => {
        if (STEPS[currentStep].type === 'textarea') {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault()
                handleNext()
            }
            return
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleNext()
        }
    }

    const handleNext = () => {
        if (!isStepValid) return
        if (currentStep < STEPS.length - 1) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep((prev) => prev + 1)
                setIsAnimating(false)
            }, 300)
        } else {
            handleSubmit()
        }
    }

const handleSubmit = async () => {
    try {
        setIsSubmitting(true)
        console.log('submitting:', formData)

        const response = await fetch('/api/auth/metadata/store', { // fix: correct path
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businessName: formData.businessName,
                businessWebsite: formData.websiteUrl,
                externalLinks: formData.externalLinks,
            }),
        })

        console.log('response status:', response.status)
        const data = await response.json()
        console.log('response data:', data)

        if (!response.ok) throw new Error('Failed to store metadata')

        router.push('/dashboard')
    } catch (error) {
        console.error('submit error:', error)
    } finally {
        setIsSubmitting(false)
    }
}

   const isStepValid = currentStep === 2 || (formData[stepData.field] && formData[stepData.field].trim() !== '')

    return (
        <div className='w-full max-w-xl mx-auto min-h-screen flex flex-col justify-center px-6'>
            <div className='fixed top-0 left-0 w-full h-1 bg-white/5'>
                <div className='h-full bg-indigo-500 transition-all duration-500' style={{ width: `${(currentStep + 1) * 100 / STEPS.length}%` }} />
            </div>

            <div className='fixed top-6 right-6 md:top-8 md:right-8 text-xs font-medium text-zinc-600 uppercase'>
                Setup your account
            </div>

            {isSubmitting ? (
                <div className='flex flex-col items-center justify-center text-center animate-in fade-in duration-700'>
                    <div className='relative mb-8'>
                        <div className='absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse' />
                        <div className='relative w-16 h-16 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20'>
                            <Sparkle className='w-8 h-8 text-white animate-bounce' size={32} />
                        </div>
                    </div>
                    <h2 className='text-2xl font-medium text-white mb-2'>
                        Storing your organization info...
                    </h2>
                    <p className='text-zinc-500'>Scanning {formData.websiteUrl}...</p>
                </div>
            ) : (
                <div className={`flex flex-col gap-6 transition-all duration-300 ease-in-out transform ${isAnimating ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0"}`}>

                    <div className='flex items-center gap-3'>
                        {currentStep > 0 && (
                            <Button variant="ghost" size="icon" onClick={handleBack} className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-full -ml-2 w-8 h-8">
                                <ChevronLeft className='w-4 h-4' size={16} />
                            </Button>
                        )}
                        <span className='text-xs font-medium text-indigo-400 uppercase flex items-center gap-2'>
                            <span className='w-2 h-2 rounded-full bg-indigo-400/30' />
                            step {currentStep + 1} of {STEPS.length}
                        </span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center'>
                            <Icon className='w-5 h-5 text-indigo-400' />
                        </div>
                        <p className='text-sm text-zinc-500'>{stepData.description}</p>
                    </div>

                    <h2 className='text-3xl font-semibold text-white'>
                        {stepData.question}
                    </h2>

                    <input
                        ref={inputRef}
                        type={stepData.type}
                        placeholder={stepData.placeholder}
                        value={formData[stepData.field]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [stepData.field]: e.target.value }))}
                        onKeyDown={handleKeyDown}
                        className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors'
                    />

                    <div className='flex justify-end'>
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid}
                            className='bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 text-white px-6 py-2 rounded-xl flex items-center gap-2'
                        >
                            {currentStep === STEPS.length - 1 ? 'Finish' : 'Continue'}
                            <ChevronRight className='w-4 h-4' size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InitialForm