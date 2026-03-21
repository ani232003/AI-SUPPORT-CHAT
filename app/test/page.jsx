import React from 'react'
import Script from 'next/script'

const TestEmbedPage = () => {
  // ✅ Real chatbot ID from your database
  const chatbotId = '474a9a61-a80a-4770-a0d7-3fc22735f72a'

  return (
    <div>


      <Script
        src={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js`}
        data-id={chatbotId}
        strategy="afterInteractive"
      />
    </div>
  )
}

export default TestEmbedPage