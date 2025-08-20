import React, { useEffect, useRef, useState } from 'react';
import oauthHandler from '../lib/oauth-handler';

interface ChatbotWithOAuthProps {
  chatbotUrl: string;
  userId: string;
  className?: string;
  style?: React.CSSProperties;
}

const ChatbotWithOAuth: React.FC<ChatbotWithOAuthProps> = ({
  chatbotUrl,
  userId,
  className = '',
  style = {}
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isOAuthReady, setIsOAuthReady] = useState(false);

  useEffect(() => {
    // Set the iframe reference in the OAuth handler
    if (iframeRef.current) {
      oauthHandler.setIframe(iframeRef.current);
      setIsOAuthReady(true);
    }
  }, []);

  // Listen for OAuth messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (!isValidOrigin(event.origin)) {
        console.warn('ChatbotWithOAuth: Invalid origin', event.origin);
        return;
      }

      const data = event.data;

      if (data.type === 'OAUTH_INITIATE') {
        console.log('ChatbotWithOAuth: Received OAuth initiation request', data);
        // The OAuth handler will automatically handle this
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const isValidOrigin = (origin: string): boolean => {
    // Add your chatbot domain here
    const validOrigins = [
      'https://scalewize-production-chatbot-production.up.railway.app',
      'http://localhost:3000', // For development
      'http://localhost:3001', // For development
    ];

    return validOrigins.some(validOrigin => origin.startsWith(validOrigin));
  };

  const handleManualOAuth = async () => {
    try {
      const success = await oauthHandler.initiateOAuth(userId, 'Google Drive');
      if (success) {
        console.log('Manual OAuth initiation successful');
      } else {
        console.error('Manual OAuth initiation failed');
      }
    } catch (error) {
      console.error('Error initiating manual OAuth:', error);
    }
  };

  return (
    <div className={`chatbot-with-oauth ${className}`} style={style}>
      {/* OAuth Status Bar */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        fontSize: '12px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          🔐 OAuth Handler: {isOAuthReady ? '✅ Ready' : '⏳ Loading...'}
        </span>
        <button
          onClick={handleManualOAuth}
          style={{
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer'
          }}
          title="Manually initiate Google Drive OAuth"
        >
          🔐 Manual OAuth
        </button>
      </div>

      {/* Chatbot Iframe */}
      <iframe
        ref={iframeRef}
        src={chatbotUrl}
        style={{
          width: '100%',
          height: '600px',
          border: 'none',
          borderRadius: '0 0 8px 8px'
        }}
        title="ScaleWize AI Chatbot"
        allow="microphone; camera; geolocation"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />

      {/* OAuth Instructions */}
      <div style={{
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: '#e3f2fd',
        border: '1px solid #bbdefb',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#1976d2'
      }}>
        <strong>💡 Google Drive Integration:</strong>
        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
          <li>When you use Google Drive tools in the chatbot, OAuth will be handled automatically</li>
          <li>You can also manually initiate OAuth using the button above</li>
          <li>Authentication status will be shown in notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatbotWithOAuth; 