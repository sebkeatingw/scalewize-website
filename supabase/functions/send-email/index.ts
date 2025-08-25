import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

// Email configuration
const EMAIL_CONFIG = {
  from: {
    email: "admin@scalewize.ai",
    name: "ScaleWize AI"
  },
  replyTo: "support@scalewize.ai",
  smtp: {
    hostname: Deno.env.get("SMTP_HOST") || "smtp.gmail.com",
    port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
    username: Deno.env.get("SMTP_USER") || "",
    password: Deno.env.get("SMTP_PASS") || "",
    secure: Deno.env.get("SMTP_SECURE") === "true"
  }
}

// Email templates
const EMAIL_TEMPLATES = {
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
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); padding: 40px 30px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .tagline { color: rgba(255, 255, 255, 0.9); font-size: 16px; }
          .content { padding: 40px 30px; }
          .invitation-title { color: #2d3748; font-size: 24px; margin-bottom: 20px; text-align: center; }
          .invitation-text { color: #4a5568; font-size: 16px; margin-bottom: 20px; line-height: 1.7; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; text-align: center; }
          .details { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; margin-bottom: 0; }
          .detail-label { font-weight: 600; color: #4a5568; }
          .detail-value { color: #2d3748; }
          .expiry-warning { background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .expiry-warning strong { color: #c53030; }
          .footer { background: #f7fafc; padding: 30px; text-align: center; color: #718096; font-size: 14px; }
          @media (max-width: 600px) { .container { margin: 10px; border-radius: 8px; } .header, .content { padding: 20px; } .detail-row { flex-direction: column; } }
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
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); padding: 40px 30px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .tagline { color: rgba(255, 255, 255, 0.9); font-size: 16px; }
          .content { padding: 40px 30px; }
          .welcome-title { color: #2d3748; font-size: 24px; margin-bottom: 20px; text-align: center; }
          .welcome-text { color: #4a5568; font-size: 16px; margin-bottom: 20px; line-height: 1.7; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #595F39 0%, #6B7357 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; text-align: center; }
          .features { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature-item { display: flex; align-items: center; margin-bottom: 15px; }
          .feature-item:last-child { margin-bottom: 0; }
          .feature-icon { background: #595F39; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; }
          .footer { background: #f7fafc; padding: 30px; text-align: center; color: #718096; font-size: 14px; }
          @media (max-width: 600px) { .container { margin: 10px; border-radius: 8px; } .header, .content { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ScaleWize AI</div>
            <div class="tagline">Simplifying AI for businesses</div>
          </div>
          <div class="content">
            <h1 class="welcome-title">Welcome to ScaleWize AI!</h1>
            <p class="welcome-text">
              Congratulations! You're now a member of <strong>{{organizationName}}</strong> on ScaleWize AI. 
              You have access to powerful AI tools that will help streamline your business operations.
            </p>
            <a href="{{dashboardUrl}}" class="cta-button">Go to Dashboard</a>
            <div class="features">
              <h3 style="margin-bottom: 15px; color: #2d3748;">What you can do now:</h3>
              <div class="feature-item">
                <div class="feature-icon">🤖</div>
                <span>Access AI-powered chatbots for customer support</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <span>View analytics and performance insights</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">⚡</div>
                <span>Automate business processes with AI</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">👥</div>
                <span>Collaborate with your team members</span>
              </div>
            </div>
            <p class="welcome-text">
              If you have any questions or need help getting started, don't hesitate to reach out to your team administrator.
            </p>
          </div>
          <div class="footer">
            <p>Welcome to the future of business automation!</p>
            <p>ScaleWize AI - Simplifying AI for businesses</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to ScaleWize AI!
      
      Congratulations! You're now a member of {{organizationName}} on ScaleWize AI. 
      You have access to powerful AI tools that will help streamline your business operations.
      
      Go to Dashboard: {{dashboardUrl}}
      
      What you can do now:
      🤖 Access AI-powered chatbots for customer support
      📊 View analytics and performance insights
      ⚡ Automate business processes with AI
      👥 Collaborate with your team members
      
      If you have any questions or need help getting started, don't hesitate to reach out to your team administrator.
      
      ---
      ScaleWize AI - Simplifying AI for businesses
    `
  }
}

// Helper function to replace template variables
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }
  return result
}

// Helper function to send email via SMTP
async function sendEmailViaSMTP(to: string, subject: string, html: string, text: string): Promise<string> {
  const client = new SmtpClient()
  
  try {
    // Connect to SMTP server
    if (EMAIL_CONFIG.smtp.secure) {
      await client.connectTLS({
        hostname: EMAIL_CONFIG.smtp.hostname,
        port: EMAIL_CONFIG.smtp.port,
        username: EMAIL_CONFIG.smtp.username,
        password: EMAIL_CONFIG.smtp.password,
      })
    } else {
      await client.connect({
        hostname: EMAIL_CONFIG.smtp.hostname,
        port: EMAIL_CONFIG.smtp.port,
        username: EMAIL_CONFIG.smtp.username,
        password: EMAIL_CONFIG.smtp.password,
      })
    }

    // Send email
    const messageId = await client.send({
      from: `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.email}>`,
      to: to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: subject,
      content: text,
      html: html,
    })

    await client.close()
    return messageId
  } catch (error) {
    await client.close()
    throw error
  }
}

// Main handler
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }

  try {
    const { type, to, subject, html, text, metadata } = await req.json()
    
    // Validate required fields
    if (!to || !type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: to, type' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      )
    }

    let finalSubject: string
    let finalHtml: string
    let finalText: string

    // Process email based on type
    switch (type) {
      case 'invitation':
        if (!metadata?.organizationName || !metadata?.inviterName || !metadata?.inviteUrl || !metadata?.expiresAt) {
          return new Response(
            JSON.stringify({ success: false, error: 'Missing invitation metadata' }),
            { 
              status: 400, 
              headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              } 
            }
          )
        }
        
        finalSubject = replaceTemplateVariables(EMAIL_TEMPLATES.invitation.subject, {
          organizationName: metadata.organizationName
        })
        finalHtml = replaceTemplateVariables(EMAIL_TEMPLATES.invitation.html, {
          organizationName: metadata.organizationName,
          inviterName: metadata.inviterName,
          inviteUrl: metadata.inviteUrl,
          expiresAt: metadata.expiresAt
        })
        finalText = replaceTemplateVariables(EMAIL_TEMPLATES.invitation.text, {
          organizationName: metadata.organizationName,
          inviterName: metadata.inviterName,
          inviteUrl: metadata.inviteUrl,
          expiresAt: metadata.expiresAt
        })
        break

      case 'welcome':
        if (!metadata?.organizationName || !metadata?.dashboardUrl) {
          return new Response(
            JSON.stringify({ success: false, error: 'Missing welcome metadata' }),
            { 
              status: 400, 
              headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              } 
            }
          )
        }
        
        finalSubject = replaceTemplateVariables(EMAIL_TEMPLATES.welcome.subject, {
          organizationName: metadata.organizationName
        })
        finalHtml = replaceTemplateVariables(EMAIL_TEMPLATES.welcome.html, {
          organizationName: metadata.organizationName,
          dashboardUrl: metadata.dashboardUrl
        })
        finalText = replaceTemplateVariables(EMAIL_TEMPLATES.welcome.text, {
          organizationName: metadata.organizationName,
          dashboardUrl: metadata.dashboardUrl
        })
        break

      default:
        // Custom email - use provided subject, html, and text
        finalSubject = subject || 'Message from ScaleWize AI'
        finalHtml = html || '<p>You have a message from ScaleWize AI</p>'
        finalText = text || 'You have a message from ScaleWize AI'
    }

    // Send email via SMTP
    const messageId = await sendEmailViaSMTP(to, finalSubject, finalHtml, finalText)

    // Log success (you can add database logging here)
    console.log('Email sent successfully:', {
      to,
      subject: finalSubject,
      type,
      messageId,
      timestamp: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: messageId,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )

  } catch (error) {
    console.error('Email sending failed:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }
})
