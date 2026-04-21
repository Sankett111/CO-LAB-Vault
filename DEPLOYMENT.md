# Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
2. **Vercel Account** (Free tier available)
3. **GitHub Account** (to connect your repository)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with read/write permissions
5. Get your connection string

## Step 2: Deploy to Vercel

1. **Connect your GitHub repository to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables in Vercel:**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add the following variables:

```
MONGO_CONNECTION_URL=mongodb+srv://username:password@cluster.mongodb.net/colab-vault?retryWrites=true&w=majority
APP_BASE_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

3. **Optional Email Configuration:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

## Step 3: Deploy

1. Vercel will automatically deploy your application
2. Your app will be available at: `https://your-app-name.vercel.app`

## Features

- ✅ File upload and storage in MongoDB
- ✅ File sharing via email
- ✅ Secure file downloads
- ✅ Responsive design
- ✅ Serverless deployment

## File Storage

Files are now stored directly in the MongoDB database as binary data, making the application fully serverless and compatible with Vercel's architecture.

## Troubleshooting

- If you get database connection errors, check your MongoDB Atlas connection string
- Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Vercel
- Check Vercel function logs for any errors

