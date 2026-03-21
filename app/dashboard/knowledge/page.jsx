'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import QuickActions from '@/components/ui/dashboard/knowledge/quickActions'
import AddKnowledgeModal from '@/components/ui/dashboard/knowledge/addKnowledgeModal'
import KnowledgeTable from '@/components/ui/dashboard/knowledge/knowldgetable'
import SourceDetailsSheet from '@/components/ui/dashboard/knowledge/sourcedetailssheet'

const Page = () => {
    const [defaultTab, setDefaultTab] = React.useState('website')
    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [knowledgeSources, setKnowledgeSources] = React.useState([])
    const [knowledgeStoringLoader, setKnowledgeStoringLoader] = React.useState(false)
    const [knowledgeSourcesLoader, setKnowledgeSourcesLoader] = React.useState(true)
    const [selectedSource, setSelectedSource] = React.useState(null)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)

    const openModal = (tab) => {
        setDefaultTab(tab)
        setIsAddOpen(true)
    }

    const handleImportSource = async (data) => {
        setKnowledgeStoringLoader(true)
        try {
            let response
            if (data.type === 'upload' && data.file) {
                const formData = new FormData()
                formData.append('file', data.file)
                formData.append('type', data.type)
                response = await fetch("/api/knowledge/store", {
                    method: "POST",
                    body: formData,
                })
            } else {
                response = await fetch("/api/knowledge/store", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
            }
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Failed to import source')
            const res = await fetch("/api/knowledge/fetch")
            const newData = await res.json()
            setKnowledgeSources(newData.data)
            setIsAddOpen(false)
        } catch (error) {
            console.error("Error importing source:", error)
        } finally {
            setKnowledgeStoringLoader(false)
        }
    }

    const handleSourceClick = (source) => {
        setSelectedSource(source)
        setIsSheetOpen(true)
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch('/api/knowledge/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            if (response.ok) {
                setKnowledgeSources((prev) => prev.filter((s) => s.id !== id))
                setIsSheetOpen(false)
            }
        } catch (error) {
            console.error('Error deleting source:', error)
        }
    }

    useEffect(() => {
        const fetchKnowledgeSources = async () => {
            try {
                const res = await fetch("/api/knowledge/fetch")
                const data = await res.json()
                setKnowledgeSources(data.data)
            } catch (error) {
                console.error("Error fetching sources:", error)
            } finally {
                setKnowledgeSourcesLoader(false)
            }
        }
        fetchKnowledgeSources()
    }, [])

    return (
        <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h1 className='text-2xl font-semibold text-white tracking-tight'>Knowledge Base</h1>
                    <p className='text-sm text-zinc-400 mt-1'>Manage your website sources, documents, and uploads here.</p>
                </div>
                <Button onClick={() => openModal('website')} className="bg-white text-black hover:bg-zinc-200 cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" /> Add Knowledge
                </Button>
            </div>
            <QuickActions onOpenModal={openModal} />

            <KnowledgeTable
                sources={knowledgeSources}
                onSourceClick={handleSourceClick}
                onDelete={handleDelete}
                isLoading={knowledgeSourcesLoader}
            />

            <AddKnowledgeModal
                isOpen={isAddOpen}
                setIsOpen={setIsAddOpen}
                defaultTab={defaultTab}
                setDefaultTab={setDefaultTab}
                onImport={handleImportSource}
                isLoading={knowledgeStoringLoader}
                existingSources={knowledgeSources}
            />

            <SourceDetailsSheet
                isOpen={isSheetOpen}
                setIsOpen={setIsSheetOpen}
                selectedSource={selectedSource}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default Page