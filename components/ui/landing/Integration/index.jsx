'use client'

import { Card } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

const EmbedSection = () => {
    const [copied, setCopied] = useState(false)

    const code = `<script>
  (function(w,d){
    w.ReplyAI = w.ReplyAI || {};
    var s = d.createElement('script');
    s.src = 'https://replyai.com/sdk.js';
    s.setAttribute('data-project-id', 'YOUR_PROJECT_ID');
    d.head.appendChild(s);
  })(window, document);
</script>`

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className='py-24 px-6'>
            <div className='max-w-6xl mx-auto'>

                {/* Section Header */}
                <div className='text-center mb-16'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6'>
                        <span className='text-xs text-zinc-400'>Easy Integration</span>
                    </div>
                    <h2 className='text-3xl md:text-5xl font-medium text-white tracking-tight mb-4'>
                        One snippet.
                        <br />
                        <span className='text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400'>Infinite support.</span>
                    </h2>
                    <p className='text-zinc-400 font-light max-w-xl mx-auto'>
                        Copy and paste this one script tag into your website. Your AI support agent goes live instantly.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>

                    {/* Left — Steps */}
                    <div className='space-y-6'>
                        <div className='flex items-start gap-4'>
                            <div className='w-8 h-8 rounded-full bg-purple-400/10 border border-purple-400/20 flex items-center justify-center shrink-0 mt-0.5'>
                                <span className='text-xs text-purple-400 font-medium'>1</span>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-white mb-1'>Sign up and configure</h3>
                                <p className='text-sm text-zinc-500 font-light'>Create your account and fill in your business details. Train the AI with your FAQs and tone.</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-4'>
                            <div className='w-8 h-8 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center shrink-0 mt-0.5'>
                                <span className='text-xs text-blue-400 font-medium'>2</span>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-white mb-1'>Copy your embed code</h3>
                                <p className='text-sm text-zinc-500 font-light'>Get your unique project ID and script tag from your dashboard with one click.</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-4'>
                            <div className='w-8 h-8 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center shrink-0 mt-0.5'>
                                <span className='text-xs text-green-400 font-medium'>3</span>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-white mb-1'>Paste into your website</h3>
                                <p className='text-sm text-zinc-500 font-light'>Add the script before your closing body tag. Works on any website — WordPress, Shopify, or plain HTML.</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-4'>
                            <div className='w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 mt-0.5'>
                                <span className='text-xs text-yellow-400 font-medium'>4</span>
                            </div>
                            <div>
                                <h3 className='text-sm font-medium text-white mb-1'>You are live!</h3>
                                <p className='text-sm text-zinc-500 font-light'>Your AI support widget appears on your website instantly. Start handling customer queries 24/7.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Code Block */}
                    <Card className='bg-[#0d0d14] border-white/10 overflow-hidden'>

                        {/* Code Header */}
                        <div className='flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2.5 h-2.5 rounded-full bg-red-500/70'></div>
                                <div className='w-2.5 h-2.5 rounded-full bg-yellow-500/70'></div>
                                <div className='w-2.5 h-2.5 rounded-full bg-green-500/70'></div>
                            </div>
                            <span className='text-xs text-zinc-500'>index.html</span>
                            <button
                                onClick={handleCopy}
                                className='flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors'
                            >
                                {copied ? (
                                    <>
                                        <Check className='w-3.5 h-3.5 text-green-400' />
                                        <span className='text-green-400'>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className='w-3.5 h-3.5' />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Code Content */}
                        <div className='p-6'>
                            <pre className='text-xs text-zinc-400 leading-relaxed overflow-x-auto'>
                                {`<!-- Add before </body> tag -->
`}<span className='text-blue-400'>{`<script>`}</span>{`
  `}<span className='text-purple-400'>{`(function`}</span><span className='text-white'>{`(w,d)`}</span><span className='text-purple-400'>{`{`}</span>{`
    w.`}<span className='text-green-400'>{`ReplyAI`}</span>{` = w.`}<span className='text-green-400'>{`ReplyAI`}</span>{` || {};
    var s = d.`}<span className='text-yellow-400'>{`createElement`}</span>{`(`}<span className='text-orange-400'>{`'script'`}</span>{`);
    s.src = `}<span className='text-orange-400'>{`'https://replyai.com/sdk.js'`}</span>{`;
    s.`}<span className='text-yellow-400'>{`setAttribute`}</span>{`(`}<span className='text-orange-400'>{`'data-project-id'`}</span>{`, `}<span className='text-orange-400'>{`'YOUR_PROJECT_ID'`}</span>{`);
    d.head.`}<span className='text-yellow-400'>{`appendChild`}</span>{`(s);
  `}<span className='text-purple-400'>{`})`}</span>{`(`}<span className='text-white'>{`window, document`}</span>{`);
`}<span className='text-blue-400'>{`</script>`}</span>
                            </pre>
                        </div>

                        {/* Bottom Badge */}
                        <div className='px-6 py-4 border-t border-white/10 bg-white/5 flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></div>
                            <span className='text-xs text-zinc-500'>Your widget goes live instantly after pasting</span>
                        </div>

                    </Card>

                </div>

            </div>
        </section>
    )
}

export default EmbedSection