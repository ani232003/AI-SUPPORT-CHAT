"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ScrollArea } from '@/components/ui/scroll-area'

const ChatSimulator = dynamic(() => import('@/components/ui/dashboard/chatbot/chatSimulator'), {
  loading: () => <p className='text-zinc-400 text-center mt-10'>Loading Chat Simulator...</p>,
  ssr: false
})

const ApperanceConfig = dynamic(() => import('@/components/ui/dashboard/chatbot/appearanceConfig'), {
  loading: () => <p className='text-zinc-400 text-center mt-10'>Loading Appearance Config...</p>,
  ssr: false
})

const EmbedCodeConfig = dynamic(() => import('@/components/ui/dashboard/chatbot/embedCodeConfig'), {
  loading: () => <p className='text-zinc-400 text-center mt-10'>Loading Embed Code...</p>,
  ssr: false
})

const Page = () => {
  const [metadata, setMetadata] = useState(null)
  const [chatbotId, setChatbotId] = useState(undefined)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [input, setInput] = useState('')
  const [creating, setCreating] = useState(false)
  const [creationError, setCreationError] = useState(null)
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
      const fetchOrCreateData = async () => {
        try {
          // Try fetch existing metadata
          let response = await fetch('/api/chatbot/metadata/fetch')
          let data = await response.json()

          if (!data?.id) {
                      // If no metadata, create new chatbot metadata
                      const createRes = await fetch('/api/chatbot/init', { method: 'POST' })
                      if (createRes.ok) {
                        const createData = await createRes.json()
                        if (createData.chatbotId) {
                                        setChatbotId(createData.chatbotId) // Set chatbotId state after creation
                          // Fetch again metadata after creation
                          response = await fetch('/api/chatbot/metadata/fetch')
                          data = await response.json()
                        }
                      }
                    }

                    setMetadata(data)
                              if(data?.id) setChatbotId(data.id) // Also update chatbotId after fetch

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
          console.error('Error fetching or creating metadata:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchOrCreateData()
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

  const handleCreateChatbot = async () => {
    setCreating(true)
    setCreationError(null)
    try {
      const res = await fetch('/api/chatbot/init', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to create chatbot')
      const data = await res.json()
      setChatbotId(data.chatbotId)
        
      // Set states from returned metadata, avoid redundant fetch
      if (data.metadata) {
        setMetadata(data.metadata)
        setPrimaryColor(data.metadata.color || '#4f46e5')
        setWelcomeMessage(data.metadata.welcome_message || 'Hello! How can I assist you today?')
        setMessages([{ role: 'assistant', content: data.metadata.welcome_message || 'Hello! How can I assist you today?' }])
      }
    } catch (error) {
      setCreationError(error.message)
    } finally {
      setCreating(false)
    }
  }

  if (loading || creating) {
    return <div className='min-h-screen flex items-center justify-center'>
      <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
    </div>
  }

  if (!metadata?.id) {
    return (
      <div className='p-6 md:p-8 max-w-400 mx-auto space-y-8'>
        <div className='p-6 bg-zinc-900 border border-zinc-700 rounded-lg'>
          <h2 className='text-lg font-bold text-white mb-2'>Welcome to Chatbot!</h2>
          <p className='text-zinc-400 mb-4'>Get started by creating your chatbot.</p>
          <button
            onClick={handleCreateChatbot}
            disabled={creating}
            className='bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded'
          >
            {creating ? 'Creating Chatbot...' : 'Create Chatbot'}
          </button>
          {creationError && <p className='text-red-500 mt-2'>{creationError}</p>}
        </div>
      </div>
    )
  }

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
                        {!metadata?.id && (
                          <div className='p-6 bg-zinc-900 border border-zinc-700 rounded-lg'>
                            <h2 className='text-lg font-bold text-white mb-2'>Welcome to Chatbot!</h2>
                            <p className='text-zinc-400 mb-4'>Get started by creating your chatbot.</p>
                            <button
                              onClick={handleCreateChatbot}
                              disabled={creating}
                              className='bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded'
                            >
                              {creating ? 'Creating Chatbot...' : 'Create Chatbot'}
                            </button>
                            {creationError && <p className='text-red-500 mt-2'>{creationError}</p>}
                          </div>
                        )}

              <ApperanceConfig

                primaryColor={primaryColor}
                setPrimaryColor={setPrimaryColor}
                welcomeMessage={welcomeMessage}
                setWelcomeMessage={setWelcomeMessage}
                handleSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />
              <EmbedCodeConfig chatbotId={chatbotId} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Page