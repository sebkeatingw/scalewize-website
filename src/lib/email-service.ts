import { Resend } from 'resend'

// Initialize Resend client only when needed
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable not set')
  }
  return new Resend(apiKey)
}

export interface InvitationEmailData {
  to: string
  organizationName: string
  inviterName: string
  inviteUrl: string
  expiresAt: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send invitation email to new team member
 */
export async function sendInvitationEmail(data: InvitationEmailData): Promise<EmailResult> {
  try {
    const { to, organizationName, inviterName, inviteUrl, expiresAt } = data

    const resend = getResendClient()
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@scalewize.ai',
      to: [to],
      subject: `You're invited to join ${organizationName} on ScaleWize AI`,
      html: generateInvitationEmailHTML({
        organizationName,
        inviterName,
        inviteUrl,
        expiresAt
      }),
      text: generateInvitationEmailText({
        organizationName,
        inviterName,
        inviteUrl,
        expiresAt
      })
    })

    if (result.error) {
      console.error('Resend API error:', result.error)
      return {
        success: false,
        error: `Email service error: ${result.error.message}`
      }
    }

    console.log('Invitation email sent successfully:', result.data?.id)
    return {
      success: true,
      messageId: result.data?.id
    }

  } catch (error) {
    console.error('Failed to send invitation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Generate HTML version of invitation email
 */
function generateInvitationEmailHTML(data: Omit<InvitationEmailData, 'to'>): string {
  const { organizationName, inviterName, inviteUrl, expiresAt } = data
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Join ${organizationName} on ScaleWize AI</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f7f4; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .expiry { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; color: #1f2937;">ScaleWize AI</h1>
          <p style="margin: 10px 0 0 0; color: #6b7280;">AI-Powered Business Solutions</p>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937; margin-top: 0;">You're Invited!</h2>
          
          <p>Hi there!</p>
          
          <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> on ScaleWize AI.</p>
          
          <p>ScaleWize AI is a powerful platform that provides AI-powered chatbots and automation tools to help your business grow.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" class="button">Accept Invitation</a>
          </div>
          
          <div class="expiry">
            <strong>⏰ This invitation expires on ${new Date(expiresAt).toLocaleDateString()}</strong>
          </div>
          
          <p>Once you accept, you'll be able to:</p>
          <ul>
            <li>Access your organization's AI chatbot</li>
            <li>Connect to business systems and databases</li>
            <li>Collaborate with your team members</li>
            <li>Use advanced AI automation tools</li>
          </ul>
          
          <p>If you have any questions, feel free to reach out to your team admin.</p>
          
          <p>Best regards,<br>The ScaleWize AI Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by ScaleWize AI. If you didn't expect this invitation, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate text version of invitation email
 */
function generateInvitationEmailText(data: Omit<InvitationEmailData, 'to'>): string {
  const { organizationName, inviterName, inviteUrl, expiresAt } = data
  
  return `
You're Invited to Join ${organizationName} on ScaleWize AI

Hi there!

${inviterName} has invited you to join ${organizationName} on ScaleWize AI.

ScaleWize AI is a powerful platform that provides AI-powered chatbots and automation tools to help your business grow.

Accept your invitation: ${inviteUrl}

This invitation expires on ${new Date(expiresAt).toLocaleDateString()}

Once you accept, you'll be able to:
- Access your organization's AI chatbot
- Connect to business systems and databases  
- Collaborate with your team members
- Use advanced AI automation tools

If you have any questions, feel free to reach out to your team admin.

Best regards,
The ScaleWize AI Team

---
This email was sent by ScaleWize AI. If you didn't expect this invitation, please ignore this email.
  `
}

/**
 * Send test email to verify email service configuration
 */
export async function sendTestEmail(to: string): Promise<EmailResult> {
  try {
    const resend = getResendClient()
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@scalewize.ai',
      to: [to],
      subject: 'ScaleWize AI - Email Service Test',
      html: '<h1>Email Service Test</h1><p>If you receive this email, your email service is working correctly!</p>',
      text: 'Email Service Test\n\nIf you receive this email, your email service is working correctly!'
    })

    if (result.error) {
      return {
        success: false,
        error: `Email service error: ${result.error.message}`
      }
    }

    return {
      success: true,
      messageId: result.data?.id
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
