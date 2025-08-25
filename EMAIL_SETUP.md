# Email Service Setup Guide

## 🚨 **Current Issue**
Invitations are being created in the database but emails are not being sent to invitees. This guide will help you set up a robust email service to fix this.

## 🔧 **Solution Overview**
We've implemented a complete email service using **Resend** (a modern, reliable email API) that will:
- Send beautiful, professional invitation emails
- Handle email failures gracefully
- Provide resend functionality for failed emails
- Include proper error handling and logging

## 📋 **Setup Steps**

### 1. **Get Resend API Key**
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (or use their test domain for development)
3. Go to API Keys section and create a new API key
4. Copy the API key (starts with `re_`)

### 2. **Configure Environment Variables**
Add these to your `.env.local` file:

```bash
# Email Service Configuration
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

**Important Notes:**
- `RESEND_API_KEY`: Your Resend API key from step 1
- `FROM_EMAIL`: Must be a verified domain in Resend (or use their test domain)

### 3. **Domain Verification (Production)**
For production use, you need to verify your domain in Resend:
1. Add your domain in Resend dashboard
2. Add the required DNS records (TXT, MX, CNAME)
3. Wait for verification (usually 5-10 minutes)
4. Update `FROM_EMAIL` to use your verified domain

### 4. **Test the Email Service**
Use the test endpoint to verify everything works:

```bash
curl -X POST https://your-domain.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 🎯 **Features Implemented**

### **Professional Email Templates**
- **HTML version**: Beautiful, responsive design with your branding
- **Text version**: Plain text fallback for email clients
- **Customizable content**: Organization name, inviter name, expiration date

### **Robust Error Handling**
- **Graceful failures**: Invitations still created even if email fails
- **Detailed logging**: Clear error messages for debugging
- **Retry capability**: Resend button in admin dashboard

### **Admin Dashboard Enhancements**
- **Resend button**: For each pending invitation
- **Success/error messages**: Clear feedback on all actions
- **Real-time updates**: Dashboard refreshes after actions

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. "RESEND_API_KEY environment variable not set"**
- Check your `.env.local` file
- Ensure the variable name is exactly `RESEND_API_KEY`
- Restart your development server after adding environment variables

#### **2. "Email service error: Unauthorized"**
- Verify your Resend API key is correct
- Check if your Resend account is active
- Ensure you haven't exceeded your plan limits

#### **3. "Email service error: Invalid from address"**
- Use a verified domain in Resend
- For development, use Resend's test domain
- Check domain verification status in Resend dashboard

#### **4. Emails not being received**
- Check spam/junk folders
- Verify recipient email address is correct
- Check Resend dashboard for delivery status
- Look at server logs for any errors

### **Debug Steps**
1. **Check server logs** for email service errors
2. **Verify environment variables** are loaded correctly
3. **Test with test email endpoint** first
4. **Check Resend dashboard** for delivery status
5. **Verify domain settings** in Resend

## 📊 **Monitoring & Analytics**

### **Resend Dashboard**
- **Delivery rates**: Track email delivery success
- **Bounce rates**: Monitor email quality
- **Open rates**: See if emails are being opened
- **Click rates**: Track invitation acceptance

### **Application Logs**
- **Email success/failure**: Detailed logging for each email
- **Error tracking**: Clear error messages for debugging
- **Performance metrics**: Email sending response times

## 🚀 **Next Steps After Setup**

1. **Test invitation flow** with a real email address
2. **Monitor email delivery** in Resend dashboard
3. **Customize email templates** if needed
4. **Set up email analytics** for better insights
5. **Configure webhooks** for real-time delivery updates

## 💡 **Best Practices**

### **Email Deliverability**
- **Use verified domains**: Improves deliverability significantly
- **Monitor bounce rates**: Keep them below 5%
- **Engage recipients**: Send relevant, valuable content
- **Respect unsubscribe**: Handle opt-outs properly

### **Security**
- **Keep API keys secure**: Never commit them to version control
- **Use environment variables**: Store sensitive data securely
- **Monitor usage**: Track API key usage and limits
- **Regular rotation**: Update API keys periodically

## 🔗 **Useful Links**

- [Resend Documentation](https://resend.com/docs)
- [Email Best Practices](https://resend.com/docs/best-practices)
- [Domain Verification Guide](https://resend.com/docs/domains)
- [API Reference](https://resend.com/docs/api-reference)

## 📞 **Support**

If you encounter issues:
1. **Check this guide** for common solutions
2. **Review server logs** for error details
3. **Test with test endpoint** to isolate issues
4. **Contact Resend support** for API-related issues
5. **Check application logs** for implementation issues

---

**After completing this setup, your invitation system will work end-to-end, sending professional emails to new team members and providing a robust user onboarding experience.**
