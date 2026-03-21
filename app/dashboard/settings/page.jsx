'use client'

import React, { useState, useEffect } from 'react'
import TeamSection from '@/components/ui/dashboard/settings/TeamSection'

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'German',
  'Arabic', 'Portuguese', 'Chinese', 'Japanese', 'Korean',
  'Italian', 'Russian', 'Turkish', 'Dutch', 'Polish'
]

const TIMEZONES = [
  'UTC (GMT+0)', 'GMT-12:00', 'GMT-11:00', 'GMT-10:00', 'GMT-9:00',
  'GMT-8:00 (PST)', 'GMT-7:00 (MST)', 'GMT-6:00 (CST)', 'GMT-5:00 (EST)',
  'GMT-4:00', 'GMT-3:00', 'GMT-2:00', 'GMT-1:00',
  'GMT+1:00 (CET)', 'GMT+2:00 (EET)', 'GMT+3:00 (Moscow)',
  'GMT+4:00', 'GMT+4:30 (Kabul)', 'GMT+5:00', 'GMT+5:30 (IST)',
  'GMT+5:45 (Nepal)', 'GMT+6:00', 'GMT+6:30', 'GMT+7:00',
  'GMT+8:00 (CST)', 'GMT+9:00 (JST)', 'GMT+9:30 (ACST)',
  'GMT+10:00 (AEST)', 'GMT+11:00', 'GMT+12:00 (NZST)',
]

const selectClass = `w-full bg-zinc-800/70 border border-zinc-800 rounded-lg text-sm text-zinc-300
  focus:outline-none focus:border-zinc-600 transition-all py-2.5 px-3.5 cursor-pointer
  appearance-none`

const SettingPage = () => {
  const [organization, setOrganization] = useState(null)
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('UTC (GMT+0)')

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch('/api/organization/fetch')
        const data = await response.json()
        setOrganization(data)
        if (data?.language) setLanguage(data.language)
        if (data?.timezone) setTimezone(data.timezone)
      } catch (error) {
        console.error('Error fetching organization:', error)
      }
    }
    fetchOrganization()
  }, [])

  return (
    <div className='px-6 py-8 md:px-10 md:py-10 max-w-3xl space-y-3'>

      {/* Title */}
      <div className='mb-6'>
        <h1 className='text-xl font-semibold text-white'>Settings</h1>
        <p className='text-sm text-zinc-500 mt-0.5'>Manage workspace preferences, security, and billing.</p>
      </div>

      {/* Workspace Settings */}
      <div className='rounded-xl border border-zinc-800/60 bg-zinc-900/40'>
        <div className='px-5 py-4 border-b border-zinc-800/60'>
          <p className='text-sm font-semibold text-white'>Workspace Settings</p>
          <p className='text-xs text-zinc-500 mt-0.5'>General settings for your organization. (Read Only)</p>
        </div>
        <div className='px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4'>

          {/* Workspace Name - read only */}
          <div>
            <p className='text-xs text-zinc-500 mb-1.5'>Workspace Name</p>
            <div className='px-3.5 py-2.5 rounded-lg bg-zinc-800/70 border border-zinc-800/60 text-sm text-zinc-300'>
              {organization?.business_name || organization?.name || <span className='text-zinc-600'>—</span>}
            </div>
          </div>

          {/* Primary Website - read only */}
          <div>
            <p className='text-xs text-zinc-500 mb-1.5'>Primary Website</p>
            <div className='px-3.5 py-2.5 rounded-lg bg-zinc-800/70 border border-zinc-800/60 text-sm text-zinc-300'>
              {organization?.website || <span className='text-zinc-600'>—</span>}
            </div>
          </div>

          {/* Language selector */}
          <div>
            <p className='text-xs text-zinc-500 mb-1.5'>Default Language</p>
            <div className='relative'>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className={selectClass}
                style={{ backgroundColor: 'rgb(39 39 42 / 0.7)' }}
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                  <path d='M2 4L6 8L10 4' stroke='#71717a' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
              </div>
            </div>
          </div>

          {/* Timezone selector */}
          <div>
            <p className='text-xs text-zinc-500 mb-1.5'>Timezone</p>
            <div className='relative'>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className={selectClass}
                style={{ backgroundColor: 'rgb(39 39 42 / 0.7)' }}
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2'>
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                  <path d='M2 4L6 8L10 4' stroke='#71717a' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Team Members */}
      <div className='rounded-xl border border-zinc-800/60 bg-zinc-900/40'>
        <div className='px-5 py-4 border-b border-zinc-800/60'>
          <p className='text-sm font-semibold text-white'>Team Members</p>
          <p className='text-xs text-zinc-500 mt-0.5'>Manage your team and their access.</p>
        </div>
        <div className='px-5 py-5'>
          <TeamSection />
        </div>
      </div>

    </div>
  )
}

export default SettingPage