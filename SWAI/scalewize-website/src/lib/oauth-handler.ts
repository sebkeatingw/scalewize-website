/**
 * OAuth Handler for ScaleWize Website
 * Handles OAuth authentication for the iframe chatbot
 */

interface OAuthMessage {
  type: 'OAUTH_INITIATE';
  authUrl: string;
  userId: string;
  serverName: string;
}

interface OAuthCompleteMessage {
  type: 'OAUTH_COMPLETE';
  success: boolean;
  userId: string;
  serverName: string;
  error?: string;
}

class OAuthHandler {
  private iframeElement: HTMLIFrameElement | null = null;
  private oauthWindow: Window | null = null;
  private currentOAuthData: { userId: string; serverName: string } | null = null;

  constructor() {
    this.setupMessageListener();
  }

  /**
   * Set the iframe element that contains the chatbot
   */
  setIframe(iframe: HTMLIFrameElement) {
    this.iframeElement = iframe;
  }

  /**
   * Setup message listener for iframe communication
   */
  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Verify origin for security
      if (!this.isValidOrigin(event.origin)) {
        console.warn('OAuth Handler: Invalid origin', event.origin);
        return;
      }

      const data = event.data as OAuthMessage;

      if (data.type === 'OAUTH_INITIATE') {
        this.handleOAuthInitiate(data);
      }
    });
  }

  /**
   * Validate message origin
   */
  private isValidOrigin(origin: string): boolean {
    // Add your chatbot domain here
    const validOrigins = [
      'https://scalewize-production-chatbot-production.up.railway.app',
      'http://localhost:3000', // For development
      'http://localhost:3001', // For development
    ];

    return validOrigins.some(validOrigin => origin.startsWith(validOrigin));
  }

  /**
   * Handle OAuth initiation from iframe
   */
  private async handleOAuthInitiate(data: OAuthMessage) {
    console.log('OAuth Handler: Initiating OAuth flow', data);

    this.currentOAuthData = {
      userId: data.userId,
      serverName: data.serverName
    };

    try {
      // Open OAuth window
      this.oauthWindow = window.open(
        data.authUrl,
        'google-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!this.oauthWindow) {
        throw new Error('Failed to open OAuth window. Please allow popups for this site.');
      }

      // Monitor OAuth window
      this.monitorOAuthWindow();

      // Show user feedback
      this.showOAuthNotification('Google OAuth window opened. Please complete the authentication.');

    } catch (error) {
      console.error('OAuth Handler: Error initiating OAuth', error);
      this.notifyIframe({
        type: 'OAUTH_COMPLETE',
        success: false,
        userId: data.userId,
        serverName: data.serverName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Monitor OAuth window for completion
   */
  private monitorOAuthWindow() {
    if (!this.oauthWindow) return;

    const checkClosed = setInterval(() => {
      if (this.oauthWindow?.closed) {
        clearInterval(checkClosed);
        this.handleOAuthComplete();
      }
    }, 1000);

    // Also listen for OAuth callback completion
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'OAUTH_CALLBACK_COMPLETE') {
        clearInterval(checkClosed);
        this.handleOAuthComplete();
      }
    });
  }

  /**
   * Handle OAuth completion
   */
  private async handleOAuthComplete() {
    if (!this.currentOAuthData) return;

    console.log('OAuth Handler: OAuth flow completed');

    try {
      // Check if authentication was successful
      const response = await fetch(
        `https://mcp-servers-production-c189.up.railway.app/oauth/status/${this.currentOAuthData.userId}`
      );

      if (response.ok) {
        const status = await response.json();
        
        if (status.authenticated) {
          this.notifyIframe({
            type: 'OAUTH_COMPLETE',
            success: true,
            userId: this.currentOAuthData.userId,
            serverName: this.currentOAuthData.serverName
          });

          this.showOAuthNotification('✅ Google Drive authentication successful! You can now use Google Drive tools in the chatbot.', 'success');
        } else {
          throw new Error('Authentication failed or was cancelled');
        }
      } else {
        throw new Error('Failed to check authentication status');
      }
    } catch (error) {
      console.error('OAuth Handler: Error checking auth status', error);
      this.notifyIframe({
        type: 'OAUTH_COMPLETE',
        success: false,
        userId: this.currentOAuthData.userId,
        serverName: this.currentOAuthData.serverName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      this.showOAuthNotification('❌ Google Drive authentication failed. Please try again.', 'error');
    }

    this.currentOAuthData = null;
    this.oauthWindow = null;
  }

  /**
   * Notify iframe of OAuth completion
   */
  private notifyIframe(message: OAuthCompleteMessage) {
    if (!this.iframeElement) {
      console.warn('OAuth Handler: No iframe element set');
      return;
    }

    this.iframeElement.contentWindow?.postMessage(message, '*');
  }

  /**
   * Show notification to user
   */
  private showOAuthNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    `;

    // Set background color based on type
    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#4caf50';
        break;
      case 'error':
        notification.style.backgroundColor = '#f44336';
        break;
      default:
        notification.style.backgroundColor = '#2196f3';
    }

    notification.textContent = message;

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);

    // Add slide-out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(slideOutStyle);
  }

  /**
   * Manual OAuth initiation (for testing)
   */
  async initiateOAuth(userId: string, serverName: string = 'Google Drive') {
    try {
      const response = await fetch(`https://mcp-servers-production-c189.up.railway.app/oauth/initiate?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.auth_url) {
        this.currentOAuthData = { userId, serverName };
        this.oauthWindow = window.open(data.auth_url, 'google-oauth', 'width=600,height=700');
        this.monitorOAuthWindow();
        return true;
      } else {
        throw new Error('No authentication URL received');
      }
    } catch (error) {
      console.error('Manual OAuth initiation failed:', error);
      return false;
    }
  }
}

// Create global instance
const oauthHandler = new OAuthHandler();

// Export for use in other modules
export default oauthHandler;

// Also expose globally for direct use
declare global {
  interface Window {
    oauthHandler: OAuthHandler;
  }
}

window.oauthHandler = oauthHandler; 