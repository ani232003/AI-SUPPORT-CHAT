'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Globe, FileText, Upload, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const TRIGGER_CLASS = "hover:text-zinc-300 hover:bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0"

const AddKnowledgeModal = ({ isOpen, setIsOpen, defaultTab, setDefaultTab, onImport, isLoading, existingSources }) => {

    const [error, setError] = React.useState(null)
    const [websiteURL, setWebsiteURL] = React.useState('')
    const [docsTitle, setDocsTitle] = React.useState('')
    const [docsContent, setDocsContent] = React.useState('')
    const [uploadFile, setUploadFile] = React.useState(null)

    const validateURL = (url) => {
        try {
            const parsed = new URL(url)
            return parsed.protocol === "http:" || parsed.protocol === "https:"
        } catch {
            return false
        }
    }

    const handleImportWrapper = async () => {
        setError(null)
        const data = { type: defaultTab }

        if (defaultTab === 'website') {
            if (!websiteURL) {
                setError("Please enter a valid URL.")
                return
            }
            if (!validateURL(websiteURL)) {
                setError("Please enter a valid URL. (e.g. https://example.com)")
                return
            }
            const normalizedURL = websiteURL.trim().toLowerCase()
           const exists = existingSources.some(source => source?.url === normalizedURL)
            if (exists) {
                setError("This website has already been added as a knowledge source.")
                return
            }
            data.url = normalizedURL
        }

        if (defaultTab === 'text') {
            if (!docsTitle.trim()) {
                setError("Please enter a title.")
                return
            }
            if (!docsContent.trim()) {
                setError("Please enter some content.")
                return
            }
            data.title = docsTitle.trim()
            data.content = docsContent.trim()
        }

        if (defaultTab === 'upload') {
            if (!uploadFile) {
                setError("Please upload a file.")
                return
            }
            data.file = uploadFile
        }

        await onImport(data)

        setWebsiteURL('')
        setDocsTitle('')
        setDocsContent('')
        setUploadFile(null)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) setError(null)
        }}>
            <DialogContent className="sm:max-w-150 bg-[#0E0E12] border-white/10 text-zinc-100 p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-lg font-semibold">Add Knowledge Source</DialogTitle>
                    <DialogDescription className="text-sm text-zinc-400 mt-1 mb-4">Choose a content type to train your assistant.</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="website" value={defaultTab} onValueChange={(value) => {
                    setDefaultTab(value)
                    setError(null)
                }} className="w-full">
                    <div className='px-6 border-b border-white/5'>
                        <TabsList className="bg-transparent h-auto p-0 gap-6">
                            <TabsTrigger value="website" className={TRIGGER_CLASS}>Website</TabsTrigger>
                            <TabsTrigger value="text" className={TRIGGER_CLASS}>Q&A / Text</TabsTrigger>
                            <TabsTrigger value="upload" className={TRIGGER_CLASS}>File Upload</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className='p-6 min-h-50 space-y-4'>
                        {error && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 py-2">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Website Tab */}
                        <TabsContent value="website" className="mt-0 space-y-4 animate-in fade-in duration-300">
                            <div className='flex items-start gap-3 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200'>
                                <div className='p-2 rounded-md bg-indigo-500/20 border border-indigo-500/30 shrink-0'>
                                    <Globe className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-indigo-200'>Crawl your website</p>
                                    <p className='text-xs text-indigo-300/70 leading-relaxed mt-0.5'>We&apos;ll automatically scan and extract content from your pages to keep your assistant up to date.</p>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Website URL <span className='text-indigo-400'>*</span></Label>
                                <Input
                                    placeholder="https://example.com"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-0 transition-colors"
                                    value={websiteURL}
                                    onChange={(e) => {
                                        setWebsiteURL(e.target.value)
                                        if (error) setError(null)
                                    }}
                                />
                                <p className='text-xs text-zinc-600'>Enter the root URL to crawl all pages, or a specific page URL.</p>
                            </div>
                        </TabsContent>

                        {/* Q&A / Text Tab */}
                        <TabsContent value="text" className="mt-0 space-y-4 animate-in fade-in duration-300">
                            <div className='flex items-start gap-3 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-200'>
                                <div className='p-2 rounded-md bg-violet-500/20 border border-violet-500/30 shrink-0'>
                                    <FileText className="w-4 h-4 text-violet-400" />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-violet-200'>Paste raw text or Q&A</p>
                                    <p className='text-xs text-violet-300/70 leading-relaxed mt-0.5'>Add FAQs, policies, or internal notes directly. Great for content that isn&apos;t publicly available online.</p>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Title <span className='text-indigo-400'>*</span></Label>
                                <Input
                                    placeholder="e.g. Refund Policy"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-0 transition-colors"
                                    value={docsTitle}
                                    onChange={(e) => setDocsTitle(e.target.value)}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className='text-xs text-zinc-400 uppercase tracking-wider'>Content <span className='text-indigo-400'>*</span></Label>
                                <textarea
                                    placeholder="Paste your content here..."
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none transition-colors resize-none"
                                    value={docsContent}
                                    onChange={(e) => setDocsContent(e.target.value)}
                                />
                            </div>
                        </TabsContent>

                        {/* File Upload Tab */}
                        <TabsContent value="upload" className="mt-0 space-y-4 animate-in fade-in duration-300">
                            <div className='flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200'>
                                <div className='p-2 rounded-md bg-emerald-500/20 border border-emerald-500/30 shrink-0'>
                                    <Upload className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-emerald-200'>Upload a file</p>
                                    <p className='text-xs text-emerald-300/70 leading-relaxed mt-0.5'>Upload CSV or text files to instantly train your assistant with existing documents.</p>
                                </div>
                            </div>
                            <div
                                className='border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all'
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <div className='p-3 rounded-full bg-white/5 border border-white/10'>
                                    <Upload className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className='text-center'>
                                    <p className='text-sm text-zinc-300 font-medium'>{uploadFile ? uploadFile.name : 'Click to upload a file'}</p>
                                    <p className='text-xs text-zinc-600 mt-1'>CSV, TXT, or PDF up to 10MB</p>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".csv,.txt,.pdf"
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                />
                            </div>
                        </TabsContent>
                    </div>

                    <div className='p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3'>
                        <Button variant="ghost" onClick={() => setIsOpen(false)} className="cursor-pointer text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-md">
                            Cancel
                        </Button>
                        <Button
                            className={`bg-white min-w-27.5 text-black hover:bg-zinc-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleImportWrapper}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                "Import Source"
                            )}
                        </Button>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AddKnowledgeModal