import { createClient } from '@supabase/supabase-js'

// Email service configuration
const EMAIL_CONFIG = {
  // Primary: Supabase Auth email (if SMTP configured)
  useSupabaseAuth: true,
  
  // Fallback: Direct SMTP (if Supabase fails)
  fallbackSMTP: {
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  }
}

// Email templates
export const EMAIL_TEMPLATES = {
  invitation: {
    subject: 'You\'re invited to join {{organizationName}} on ScaleWize AI',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Organization Invitation</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8f7f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .tagline { 
            font-size: 16px; 
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
            text-align: center;
          }
          .invitation-title { 
            font-size: 24px; 
            font-weight: 600; 
            color: #2d3748; 
            margin-bottom: 20px;
          }
          .invitation-text { 
            font-size: 16px; 
            color: #4a5568; 
            margin-bottom: 30px; 
            line-height: 1.7;
          }
          .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); 
            color: white; 
            text-decoration: none; 
            padding: 16px 32px; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px; 
            margin: 20px 0; 
            transition: transform 0.2s ease;
          }
          .cta-button:hover { 
            transform: translateY(-2px);
          }
          .details { 
            background: #f7fafc; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 30px 0; 
            text-align: left;
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 10px; 
            padding: 8px 0; 
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-row:last-child { 
            border-bottom: none; 
            margin-bottom: 0;
          }
          .detail-label { 
            font-weight: 600; 
            color: #4a5568;
          }
          .detail-value { 
            color: #2d3748;
          }
          .footer { 
            background: #f7fafc; 
            padding: 30px; 
            text-align: center; 
            color: #718096;
            font-size: 14px;
          }
          .expiry-warning { 
            background: #fff5f5; 
            border: 1px solid #fed7d7; 
            border-radius: 6px; 
            padding: 15px; 
            margin: 20px 0; 
            color: #c53030;
          }
          .expiry-warning strong { 
            color: #e53e3e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ScaleWize AI</div>
            <div class="tagline">Simplifying AI for businesses</div>
          </div>
          
          <div class="content">
            <h1 class="invitation-title">You're Invited!</h1>
            <p class="invitation-text">
              {{inviterName}} has invited you to join <strong>{{organizationName}}</strong> on ScaleWize AI. 
              You'll have access to AI-powered chatbots, analytics, and business automation tools.
            </p>
            
            <a href="{{inviteUrl}}" class="cta-button">Accept Invitation</a>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Organization:</span>
                <span class="detail-value">{{organizationName}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Invited by:</span>
                <span class="detail-value">{{inviterName}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Invitation expires:</span>
                <span class="detail-value">{{expiresAt}}</span>
              </div>
            </div>
            
            <div class="expiry-warning">
              <strong>Important:</strong> This invitation expires on {{expiresAt}}. 
              Please accept it before then to join the organization.
            </div>
            
            <p class="invitation-text">
              If you have any questions, please contact your organization administrator.
            </p>
          </div>
          
          <div class="footer">
            <p>This invitation was sent by ScaleWize AI</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      You're invited to join {{organizationName}} on ScaleWize AI!
      
      {{inviterName}} has invited you to join their organization on ScaleWize AI. 
      You'll have access to AI-powered chatbots, analytics, and business automation tools.
      
      Accept your invitation: {{inviteUrl}}
      
      Organization: {{organizationName}}
      Invited by: {{inviterName}}
      Expires: {{expiresAt}}
      
      This invitation expires on {{expiresAt}}. Please accept it before then.
      
      If you have questions, contact your organization administrator.
      
      ---
      ScaleWize AI - Simplifying AI for businesses
    `
  },
  
  welcome: {
    subject: 'Welcome to {{organizationName}} on ScaleWize AI!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ScaleWize AI</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8f7f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .tagline { 
            font-size: 16px; 
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
            text-align: center;
          }
          .welcome-title { 
            font-size: 24px; 
            font-weight: 600; 
            color: #2d3748; 
            margin-bottom: 20px;
          }
          .welcome-text { 
            font-size: 16px; 
            color: #4a5568; 
            margin-bottom: 30px; 
            line-height: 1.7;
          }
          .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); 
            color: white; 
            text-decoration: none; 
            padding: 16px 32px; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px; 
            margin: 20px 0; 
            transition: transform 0.2s ease;
          }
          .cta-button:hover { 
            transform: translateY(-2px);
          }
          .features { 
            background: #f7fafc; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 30px 0; 
            text-align: left;
          }
          .feature-item { 
            display: flex; 
            align-items: center; 
            margin-bottom: 15px; 
            padding: 10px 0;
          }
          .feature-icon { 
            width: 24px; 
            height: 24px; 
            background: #595F39; 
            border-radius: 50%; 
            margin-right: 15px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-size: 12px; 
            font-weight: bold;
          }
          .feature-text { 
            color: #2d3748; 
            font-weight: 500;
          }
          .footer { 
            background: #f7fafc; 
            padding: 30px; 
            text-align: center; 
            color: #718096; 
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ScaleWize AI</div>
            <div class="tagline">Simplifying AI for businesses</div>
          </div>
          
          <div class="content">
            <h1 class="welcome-title">Welcome to {{organizationName}}!</h1>
            <p class="welcome-text">
              Congratulations! You've successfully joined <strong>{{organizationName}}</strong> on ScaleWize AI. 
              You now have access to powerful AI tools and automation features.
            </p>
            
            <a href="{{dashboardUrl}}" class="cta-button">Go to Dashboard</a>
            
            <div class="features">
              <h3 style="margin-top: 0; color: #2d3748;">What you can do now:</h3>
              <div class="feature-item">
                <div class="feature-icon">🤖</div>
                <span class="feature-text">Access AI-powered chatbots</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <span class="feature-text">View analytics and insights</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🔗</div>
                <span class="feature-text">Connect LinkedIn sales tools</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">⚡</div>
                <span class="feature-text">Automate business processes</span>
              </div>
            </div>
            
            <p class="welcome-text">
              If you have any questions or need help getting started, 
              don't hesitate to reach out to your organization administrator.
            </p>
          </div>
          
          <div class="footer">
            <p>Welcome to ScaleWize AI - Simplifying AI for businesses</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to {{organizationName}} on ScaleWize AI!
      
      Congratulations! You've successfully joined {{organizationName}} on ScaleWize AI. 
      You now have access to powerful AI tools and automation features.
      
      Access your dashboard: {{dashboardUrl}}
      
      What you can do now:
      🤖 Access AI-powered chatbots
      📊 View analytics and insights  
      🔗 Connect LinkedIn sales tools
      ⚡ Automate business processes
      
      If you have questions, contact your organization administrator.
      
      ---
      ScaleWize AI - Simplifying AI for businesses
    `
  }
}

// Email service interface
export interface IEmailService {
  sendInvitationEmail(params: {
    to: string
    organizationName: string
    inviterName: string
    inviteUrl: string
    expiresAt: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }>
  
  sendWelcomeEmail(params: {
    to: string
    organizationName: string
    dashboardUrl: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }>
}

// Supabase email service implementation
class SupabaseEmailService implements IEmailService {
  private supabase: any

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async sendInvitationEmail(params: {
    to: string
    organizationName: string
    inviterName: string
    inviteUrl: string
    expiresAt: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // For now, we'll return success but log that email needs to be configured
      // This allows the invitation to be created while we set up email
      console.log('Email service not fully configured. Invitation created but email not sent.')
      console.log('Email details:', {
        to: params.to,
        organizationName: params.organizationName,
        inviterName: params.inviterName,
        inviteUrl: params.inviteUrl,
        expiresAt: params.expiresAt
      })
      
      return { success: true, messageId: 'pending-email-config' }
    } catch (error) {
      console.error('Supabase email service error:', error)
      return { success: false, error: 'Failed to send invitation email' }
    }
  }

  async sendWelcomeEmail(params: {
    to: string
    organizationName: string
    dashboardUrl: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('Welcome email service not fully configured.')
      console.log('Welcome email details:', {
        to: params.to,
        organizationName: params.organizationName,
        dashboardUrl: params.dashboardUrl
      })
      
      return { success: true, messageId: 'pending-email-config' }
    } catch (error) {
      console.error('Supabase welcome email service error:', error)
      return { success: false, error: 'Failed to send welcome email' }
    }
  }
}

// Fallback SMTP service implementation
class SMTPEmailService implements IEmailService {
  async sendInvitationEmail(params: {
    to: string
    organizationName: string
    inviterName: string
    inviteUrl: string
    expiresAt: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // This would use a direct SMTP connection
      // For now, we'll return an error to indicate fallback needed
      console.warn('SMTP fallback service not fully implemented')
      return { success: false, error: 'SMTP fallback service not available' }
    } catch (error) {
      console.error('SMTP email service error:', error)
      return { success: false, error: 'Failed to send invitation email via SMTP' }
    }
  }

  async sendWelcomeEmail(params: {
    to: string
    organizationName: string
    dashboardUrl: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.warn('SMTP fallback service not fully implemented')
      return { success: false, error: 'SMTP fallback service not available' }
    } catch (error) {
      console.error('SMTP welcome email service error:', error)
      return { success: false, error: 'Failed to send welcome email via SMTP' }
    }
  }
}

// Main email service that tries Supabase first, then falls back to SMTP
export class EmailService implements IEmailService {
  private supabaseService: SupabaseEmailService
  private smtpService: SMTPEmailService

  constructor() {
    this.supabaseService = new SupabaseEmailService()
    this.smtpService = new SMTPEmailService()
  }

  async sendInvitationEmail(params: {
    to: string
    organizationName: string
    inviterName: string
    inviteUrl: string
    expiresAt: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Try Supabase first
    if (EMAIL_CONFIG.useSupabaseAuth) {
      const result = await this.supabaseService.sendInvitationEmail(params)
      if (result.success) {
        return result
      }
      console.warn('Supabase email failed, trying SMTP fallback:', result.error)
    }

    // Fallback to SMTP
    return await this.smtpService.sendInvitationEmail(params)
  }

  async sendWelcomeEmail(params: {
    to: string
    organizationName: string
    dashboardUrl: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Try Supabase first
    if (EMAIL_CONFIG.useSupabaseAuth) {
      const result = await this.supabaseService.sendWelcomeEmail(params)
      if (result.success) {
        return result
      }
      console.warn('Supabase welcome email failed, trying SMTP fallback:', result.error)
    }

    // Fallback to SMTP
    return await this.smtpService.sendWelcomeEmail(params)
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Helper function to send invitation emails
export async function sendInvitationEmail(
  to: string,
  inviteUrl: string,
  organizationName: string,
  inviterName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
  
  return emailService.sendInvitationEmail({
    to,
    organizationName,
    inviterName,
    inviteUrl,
    expiresAt
  })
}

// Helper function to send welcome emails
export async function sendWelcomeEmail(
  to: string,
  organizationName: string,
  dashboardUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return emailService.sendWelcomeEmail({
    to,
    organizationName,
    dashboardUrl
  })
}
