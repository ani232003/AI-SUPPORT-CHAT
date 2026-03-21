'use client'

import React, { useEffect, useState } from 'react'
import InitialForm from '@/components/ui/dashboard/initialform'

const Page = () => {
    const [isMetadataAvailable, setIsMetadataAvailable] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
useEffect(() => {
    const fetchMetadata = async () => {
        try {
            const response = await fetch('/api/auth/metadata/fetch')
            console.log('status:', response.status)
            const text = await response.text()
            console.log('raw response:', text)
            const data = JSON.parse(text)
            setIsMetadataAvailable(data.exists)
        } catch (error) {
            console.error('fetchMetadata error:', error)
        } finally {
            setIsLoading(false)
        }
    }
    fetchMetadata()
}, [])
    if (isLoading) {
        return (
            <div className='flex-1 flex items-center justify-center min-h-screen'>
                <div className='w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin' />
            </div>
        )
    }

    return (
        <div className='flex-1 flex w-full'>
            {!isMetadataAvailable ? (
                <div className='w-full flex items-center justify-center p-4 min-h-screen'>
                    <InitialForm />
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

export default Page