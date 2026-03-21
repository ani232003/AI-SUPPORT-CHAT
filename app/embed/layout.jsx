import React from 'react'

const EmbedPageLayout = ({ children }) => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'transparent',
        fontFamily: 'sans-serif',
      }}
    >
      {children}
    </div>
  )
}

export default EmbedPageLayout