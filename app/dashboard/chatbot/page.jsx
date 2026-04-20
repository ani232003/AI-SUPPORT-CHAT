"use client"

import React, { useEffect, useState } from 'react'
import ChatSimulator from '@/components/ui/dashboard/chatbot/chatSimulator'
import { ScrollArea } from '@/components/ui/scroll-area'
import ApperanceConfig from '@/components/ui/dashboard/chatbot/appearanceConfig'
import EmbedCodeConfig from '@/components/ui/dashboard/chatbot/embedCodeConfig'

const Page = () => {
  const [metadata, setMetadata] = useState(null)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [input, setInput] = useState('')
  const [activeSection, setActiveSection] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const scrollViewportRef = React.useRef(null)

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (welcomeMessage) {
      setMessages([{ role: 'assistant', content: welcomeMessage }])
    }
  }, [welcomeMessage])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/chatbot/metadata/fetch')
        const data = await response.json()
        setMetadata(data)

        if (data) {
          setPrimaryColor(data.color || "#4f46e5")
          setWelcomeMessage(data.welcome_message || "Hello! How can I assist you today?")
          setMessages([{ role: 'assistant', content: data.welcome_message || "Hello! How can I assist you today?" }])
        }

        const sectionsRes = await fetch("/api/sections/fetch")
        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json()
          setSections(sectionsData.data || [])
        }

      } catch (error) {
        console.error('Error fetching metadata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return
    const currentSection = sections.find((s) => s.name === activeSection?.name)
    const sourceIds = currentSection?.source_ids || []
    const userMsg = { role: 'user', content: input.trim(), sections: activeSection }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat/test', { // fix: removed /test
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          sections,
          metadata: metadata?.data || metadata, // fix: unwrap data
          activeSection,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]) // fix: data.message not data.answer
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsTyping(false) // fix: moved to finally so it always runs
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    setMessages([{ role: 'assistant', content: welcomeMessage || "Hello! How can I assist you today?" }])
    setActiveSection(null)
    setInput('')
  }

  const handleSectionClick = async (section) => {
    setActiveSection(section)
    const userMsg = { role: 'user', content: `I want to talk about ${section.name}` }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          sections,
          metadata: metadata?.data || metadata,
          activeSection: section,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch (error) {
      console.error('Section click error:', error)
    } finally {
      setIsTyping(false)
    }
  }
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/chatbot/metadata/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: metadata?.id,
          color: primaryColor,
          welcome_message: welcomeMessage
        })
      })
      if (res.ok) {
        const data = await res.json()
        setMetadata(data.data)
      } else {
        console.error('Failed to save metadata')
      }
    } catch (error) {
      console.error('Error saving metadata:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = metadata ? (primaryColor !== metadata.color || welcomeMessage !== metadata.welcome_message) : false

  return (
    <div className='p-6 md:p-8 space-y-8 max-w-400 mx-auto animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-hidden flex flex-col'>
      <div className='flex justify-between items-center shrink-0'>
        <div>
          <h1 className='text-2xl font-semibold text-white tracking-tight'>
            Chatbot Playground
          </h1>
          <p className='text-sm text-zinc-400 mt-1'>
            Test your assistant, customize appearance, and deploy it to your website with ease.
          </p>
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0'>
        <div className='lg:col-span-7 flex flex-col h-full min-h-0 space-y-4'>
          <ChatSimulator
            messages={messages}
            primaryColor={primaryColor}
            sections={sections}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
            activeSection={activeSection}
            isTyping={isTyping}
            handleReset={handleReset}
            scrollRef={scrollViewportRef}
            onSectionClick={handleSectionClick} // fix: pass handleSectionClick
          />
        </div>
        <div className='lg:col-span-5 h-full min-h-0 overflow-hidden flex flex-col'>
          <ScrollArea className="h-full pr-4">
            <div className='space-y-6 pb-8'>
              <ApperanceConfig

                primaryColor={primaryColor}
                setPrimaryColor={setPrimaryColor}
                welcomeMessage={welcomeMessage}
                setWelcomeMessage={setWelcomeMessage}
                handleSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />
              <EmbedCodeConfig chatbotId={metadata?.id} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Page