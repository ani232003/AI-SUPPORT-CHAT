'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Code, Copy, Check, ExternalLink } from 'lucide-react'

const EmbedCodeConfig = ({ chatbotId }) => {
    const [copied, setCopied] = React.useState(false)

    const embedCode = `<script
  src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js"
  data-id="${chatbotId || 'YOUR_CHATBOT_ID'}"
  async>
</script>`

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className='space-y-4'>

            {/* Header */}
            <div>
                <h2 className='text-sm font-semibold text-zinc-200'>Embed on your website</h2>
                <p className='text-xs text-zinc-500 mt-0.5'>Copy and paste this code into your website to deploy your chatbot.</p>
            </div>

            <Card className='border-white/5 bg-[#0A0A0E]'>
                <CardContent className='p-4 space-y-3'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Code className='w-3.5 h-3.5 text-zinc-500' />
                            <span className='text-xs text-zinc-400 uppercase tracking-wider'>Embed Code</span>
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={handleCopy}
                            className='h-7 px-2 text-xs text-zinc-500 hover:text-white hover:bg-white/5 gap-1.5'
                        >
                            {copied ? (
                                <>
                                    <Check className='w-3 h-3 text-emerald-400' />
                                    <span className='text-emerald-400'>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className='w-3 h-3' />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Code block */}
                    <div className='bg-black/40 border border-white/5 rounded-lg p-3 overflow-x-auto'>
                        <pre className='text-xs text-zinc-400 font-mono whitespace-pre'>
                            {embedCode}
                        </pre>
                    </div>

                    <p className='text-xs text-zinc-600'>
                        Paste this code before the closing <code className='text-zinc-400'>&lt;/body&gt;</code> tag of your website.
                    </p>
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card className='border-white/5 bg-[#0A0A0E]'>
                <CardContent className='p-4 space-y-3'>
                    <p className='text-xs text-zinc-400 font-medium uppercase tracking-wider'>How to install</p>
                    <div className='space-y-2.5'>
                        {[
                            'Copy the embed code above',
                            "Open your website's HTML file",
                            'Paste the code before the closing </body> tag',
                            'Save and deploy your website',
                        ].map((step, i) => (
                            <div key={i} className='flex items-start gap-3'>
                                <div className='w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5'>
                                    <span className='text-xs text-indigo-400 font-medium'>{i + 1}</span>
                                </div>
                                <p className='text-xs text-zinc-500 leading-relaxed'>{step}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Docs link */}
            <button className='w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2'>
                <ExternalLink className='w-3.5 h-3.5' />
                View full documentation
            </button>

        </div>
    )
}

export default EmbedCodeConfig