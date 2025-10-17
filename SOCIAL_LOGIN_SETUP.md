# Social Login Setup Guide

This guide will help you set up OAuth applications for Google, GitHub, Facebook, and Twitter to enable social login in Atlas Earth Hub.

## 🌟 Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a New Project** or select existing project
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://atlas-earth-hub.vercel.app/api/auth/callback/google` (production)
5. **Copy Client ID and Client Secret** to your environment variables

## 🐙 GitHub OAuth Setup

1. **Go to GitHub Developer Settings**: https://github.com/settings/developers
2. **Click "New OAuth App"**
3. **Fill in application details**:
   - Application name: "Atlas Earth Hub"
   - Homepage URL: `https://atlas-earth-hub.vercel.app`
   - Authorization callback URL: `https://atlas-earth-hub.vercel.app/api/auth/callback/github`
   - For development, also add: `http://localhost:3000/api/auth/callback/github`
4. **Generate Client Secret**
5. **Copy Client ID and Client Secret** to your environment variables

## 📘 Facebook OAuth Setup

1. **Go to Facebook Developers**: https://developers.facebook.com/
2. **Create a New App**
3. **Add Facebook Login Product**
4. **Configure OAuth Redirect URIs**:
   - Go to Facebook Login > Settings
   - Add Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook` (development)
     - `https://atlas-earth-hub.vercel.app/api/auth/callback/facebook` (production)
5. **Get App ID and App Secret** from App Settings > Basic
6. **Copy App ID and App Secret** to your environment variables

## 🐦 Twitter OAuth Setup

1. **Go to Twitter Developer Portal**: https://developer.twitter.com/
2. **Create a New Project/App**
3. **Enable OAuth 2.0**
4. **Set Callback URLs**:
   - `http://localhost:3000/api/auth/callback/twitter` (development)
   - `https://atlas-earth-hub.vercel.app/api/auth/callback/twitter` (production)
5. **Copy Client ID and Client Secret** to your environment variables

## Environment Variables

Add these to your `.env.local` file (development) and Vercel environment variables (production):

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Twitter OAuth
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

## Testing

1. **Start your development server**: `npm run dev`
2. **Go to**: http://localhost:3000/auth/signin
3. **Test each social login option**
4. **Verify user accounts are created correctly**

## Production Deployment

1. **Set up each OAuth app for production domain**
2. **Add environment variables in Vercel dashboard**
3. **Test social login on live site**
4. **Monitor for any callback URL issues**

## Troubleshooting

- **"Redirect URI Mismatch"**: Check that callback URLs match exactly
- **"App Not Approved"**: Some providers require app review for production
- **"Invalid Client"**: Verify Client ID and Secret are correct
- **"Scope Issues"**: Ensure you're requesting appropriate permissions

## Security Notes

- Never commit OAuth secrets to version control
- Use different OAuth apps for development and production
- Regularly rotate client secrets
- Monitor OAuth app usage in provider dashboards