'use client'

import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useRef, Suspense } from 'react'

const EmbedPage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [config, setConfig] = useState(null)
  const [business, setBusiness] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [configError, setConfigError] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!token) return
    fetch(`/api/widget/config?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setConfig(data.config)
          setBusiness(data.business)
          setMessages([{
            role: 'assistant',
            text: data.config?.welcome_message || 'Hello! How can I assist you today?',
          }])
        } else {
          setConfigError(data.error || 'Failed to load widget.')
        }
      })
      .catch(() => setConfigError('Network error loading widget.'))
  }, [token])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: text }
          ],
          metadata: { business_name: business?.business_name || 'Support' },
          activeSection: null,
          widgetId: token,
          conversationId: conversationId
        }),
      })
      const data = await res.json()
      if (data.conversationId) setConversationId(data.conversationId)
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: data.message || data.reply || 'Sorry, something went wrong.',
      }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: 'Connection error. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (configError) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#09090b', color:'#71717a', fontSize:'13px', fontFamily:'sans-serif' }}>
        {configError}
      </div>
    )
  }

  if (!config) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#09090b' }}>
        <div style={{ width:'20px', height:'20px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.08)', borderTopColor:'#6366f1', animation:'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const accentColor = config.color || '#6366f1'

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#09090b', color:'#f5f5f5', fontFamily:'"Inter", sans-serif', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:`${accentColor}22`, border:`1px solid ${accentColor}44`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill={accentColor}/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:600, color:'#f5f5f5', lineHeight:1.2 }}>AI Assistant</div>
            <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'2px' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px #22c55e' }} />
              <span style={{ fontSize:'11px', color:'#71717a' }}>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => { setMessages([{ role:'assistant', text: config?.welcome_message || 'Hello! How can I assist you today?' }]); setConversationId(null) }}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#71717a', padding:'4px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center' }}
          title="Reset chat"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-end', gap:'8px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width:'26px', height:'26px', borderRadius:'6px', background:`${accentColor}22`, border:`1px solid ${accentColor}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill={accentColor}/>
                </svg>
              </div>
            )}
            <div style={{
              maxWidth:'78%', padding:'9px 13px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              fontSize:'13px', lineHeight:'1.6',
              background: msg.role === 'user' ? accentColor : '#141414',
              color: msg.role === 'user' ? '#fff' : '#d4d4d4',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:'flex', alignItems:'flex-end', gap:'8px' }}>
            <div style={{ width:'26px', height:'26px', borderRadius:'6px', background:`${accentColor}22`, border:`1px solid ${accentColor}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill={accentColor}/>
              </svg>
            </div>
            <div style={{ padding:'12px 16px', borderRadius:'14px 14px 14px 4px', background:'#141414', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'4px' }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <span key={i} style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#71717a', display:'inline-block', animation:`blink 1.2s infinite ${delay}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding:'12px 16px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#141414', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'8px 8px 8px 14px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            rows={1}
            style={{ flex:1, background:'none', border:'none', outline:'none', color:'#f5f5f5', fontSize:'13px', fontFamily:'inherit', lineHeight:'1.5', resize:'none', padding:0 }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{ width:'30px', height:'30px', borderRadius:'8px', border:'none', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', background: !input.trim() || loading ? 'rgba(255,255,255,0.05)' : accentColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"/>
              <polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #09090b; }
        textarea::placeholder { color: #52525b; }
      `}</style>
    </div>
  )
}

const EmbedPageWrapper = () => (
  <Suspense fallback={
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#09090b' }}>
      <div style={{ width:'20px', height:'20px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.08)', borderTopColor:'#6366f1', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  }>
    <EmbedPage />
  </Suspense>
)

export default EmbedPageWrapper