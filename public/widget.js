(function () {
  try {
    var script = document.currentScript;
    if (!script) return;

    var widgetId = script.getAttribute('data-id');
    if (!widgetId) {
      console.error('Reply AI: data-id not found');
      return;
    }

    // ── Styles ──────────────────────────────────────────────────────────────
    var style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

      #reply-ai-root * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'DM Sans', sans-serif;
      }

      #reply-ai-root {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
      }

      /* ── Panel ── */
      #reply-ai-panel {
        width: 360px;
        height: 520px;
        background: #0d0d0d;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
        opacity: 0;
        transform: translateY(16px) scale(0.97);
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
      }

      #reply-ai-panel.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      /* ── Panel Header ── */
      #reply-ai-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: #141414;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        flex-shrink: 0;
      }

      #reply-ai-header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      #reply-ai-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 16px;
      }

      #reply-ai-header-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      #reply-ai-name {
        color: #f5f5f5;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }

      #reply-ai-status {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: #6b7280;
      }

      #reply-ai-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 6px #22c55e;
        animation: reply-pulse 2s infinite;
      }

      @keyframes reply-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      #reply-ai-close-btn {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background: rgba(255,255,255,0.05);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
        font-size: 16px;
        line-height: 1;
        transition: background 0.15s, color 0.15s;
      }

      #reply-ai-close-btn:hover {
        background: rgba(255,255,255,0.1);
        color: #f5f5f5;
      }

      /* ── Chat Area (iframe) ── */
      #reply-ai-iframe {
        flex: 1;
        width: 100%;
        border: none;
        background: #0d0d0d;
      }

      /* ── FAB ── */
      #reply-ai-fab {
        width: 52px;
        height: 52px;
        border-radius: 16px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        flex-shrink: 0;
      }

      #reply-ai-fab:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(99,102,241,0.5);
      }

      #reply-ai-fab:active {
        transform: scale(0.95);
      }

      #reply-ai-fab svg {
        width: 22px;
        height: 22px;
        fill: white;
        transition: opacity 0.2s;
      }

      #reply-ai-fab .icon-close {
        display: none;
      }

      #reply-ai-fab.open .icon-chat {
        display: none;
      }

      #reply-ai-fab.open .icon-close {
        display: block;
      }

      /* ── Notification badge ── */
      #reply-ai-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ef4444;
        border: 2px solid #0d0d0d;
        display: none;
      }

      #reply-ai-fab-wrap {
        position: relative;
      }
    `;
    document.head.appendChild(style);

    // ── DOM ──────────────────────────────────────────────────────────────────
    var root = document.createElement('div');
    root.id = 'reply-ai-root';

    // Panel
    var panel = document.createElement('div');
    panel.id = 'reply-ai-panel';

    // Header
    var header = document.createElement('div');
    header.id = 'reply-ai-header';

    var headerLeft = document.createElement('div');
    headerLeft.id = 'reply-ai-header-left';

    var avatar = document.createElement('div');
    avatar.id = 'reply-ai-avatar';
    avatar.textContent = '🤖';

    var headerInfo = document.createElement('div');
    headerInfo.id = 'reply-ai-header-info';

    var name = document.createElement('div');
    name.id = 'reply-ai-name';
    name.textContent = 'Support';

    var status = document.createElement('div');
    status.id = 'reply-ai-status';

    var dot = document.createElement('div');
    dot.id = 'reply-ai-status-dot';

    var statusText = document.createElement('span');
    statusText.textContent = 'Online';

    status.appendChild(dot);
    status.appendChild(statusText);
    headerInfo.appendChild(name);
    headerInfo.appendChild(status);
    headerLeft.appendChild(avatar);
    headerLeft.appendChild(headerInfo);

    var closeBtn = document.createElement('button');
    closeBtn.id = 'reply-ai-close-btn';
    closeBtn.innerHTML = '&#x2715;';
    closeBtn.title = 'Close';

    header.appendChild(headerLeft);
    header.appendChild(closeBtn);

    // Iframe
    var iframe = document.createElement('iframe');
    iframe.id = 'reply-ai-iframe';
    iframe.title = 'Support Chat';
    iframe.setAttribute('allowtransparency', 'true');

    panel.appendChild(header);
    panel.appendChild(iframe);

    // FAB
    var fabWrap = document.createElement('div');
    fabWrap.id = 'reply-ai-fab-wrap';

    var fab = document.createElement('button');
    fab.id = 'reply-ai-fab';
    fab.title = 'Chat with us';
    fab.innerHTML = `
      <svg class="icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6l-2 2V4h16v10z"/>
      </svg>
      <svg class="icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    `;

    var badge = document.createElement('div');
    badge.id = 'reply-ai-badge';

    fabWrap.appendChild(fab);
    fabWrap.appendChild(badge);

    root.appendChild(panel);
    root.appendChild(fabWrap);
    document.body.appendChild(root);

    // ── State ────────────────────────────────────────────────────────────────
    var isOpen = false;
    var loaded = false;
    var baseUrl = script.src.replace('/widget.js', '');

    function openWidget() {
      isOpen = true;
      panel.classList.add('open');
      fab.classList.add('open');
      badge.style.display = 'none';

      if (!loaded) {
        loaded = true;
        fetch(baseUrl + '/api/widget/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ widgetId: widgetId }),
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.success) {
              iframe.src = baseUrl + '/embed?token=' + data.sessionId;
            } else {
              iframe.src = baseUrl + '/embed?token=' + widgetId;
            }
          })
          .catch(function () {
            iframe.src = baseUrl + '/embed?token=' + widgetId;
          });
      }
    }

    function closeWidget() {
      isOpen = false;
      panel.classList.remove('open');
      fab.classList.remove('open');
    }

    fab.addEventListener('click', function () {
      isOpen ? closeWidget() : openWidget();
    });

    closeBtn.addEventListener('click', closeWidget);

    // Optional: show badge after 3s to draw attention
    setTimeout(function () {
      if (!isOpen) badge.style.display = 'block';
    }, 3000);

  } catch (e) {
    console.error('Reply AI widget error:', e);
  }
})();