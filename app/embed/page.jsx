// Save this as: app/dashboard/embed/page.js
// Dashboard page where users can copy their embed code

'use client';

import { useState, useEffect } from 'react';

export default function EmbedCodePage() {
    const [embedData, setEmbedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch('/api/chatbot/embed-code')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEmbedData(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load embed code:', err);
                setLoading(false);
            });
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-zinc-400">Loading...</div>
            </div>
        );
    }

    if (!embedData) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-red-400">Failed to load embed code</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Chatbot Embed Code</h1>
                <p className="text-zinc-400 mb-8">
                    Copy and paste this code into your website to add the AI chatbot
                </p>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Your Chatbot ID</h2>
                        <button
                            onClick={() => copyToClipboard(embedData.chatbotId)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
                        >
                            {copied ? 'Copied!' : 'Copy ID'}
                        </button>
                    </div>
                    <code className="block bg-zinc-950 p-4 rounded text-sm text-green-400 border border-zinc-800">
                        {embedData.chatbotId}
                    </code>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Embed Code (Iframe)</h2>
                        <button
                            onClick={() => copyToClipboard(embedData.embedCode)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
                        >
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>
                    <pre className="bg-zinc-950 p-4 rounded text-xs text-zinc-300 overflow-x-auto border border-zinc-800">
                        {embedData.embedCode}
                    </pre>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Direct Iframe URL</h2>
                        <button
                            onClick={() => copyToClipboard(embedData.iframeUrl)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
                        >
                            {copied ? 'Copied!' : 'Copy URL'}
                        </button>
                    </div>
                    <code className="block bg-zinc-950 p-4 rounded text-sm text-blue-400 border border-zinc-800 break-all">
                        {embedData.iframeUrl}
                    </code>
                </div>

                <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2 text-blue-400">📘 How to Use</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
                        <li>Copy the embed code above</li>
                        <li>Paste it into your website&apos;s HTML, just before the closing &lt;/body&gt; tag</li>
                        <li>The chatbot will appear on the bottom-right of your site</li>
                        <li>Make sure your website domain is allowed in your chatbot settings</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}