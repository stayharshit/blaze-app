# Deployment Guide for Simple Todos Blaze

This guide will help you deploy the Meteor application to Railway.

## Prerequisites

1. A GitHub account
2. A Railway account (sign up at https://railway.app)
3. Docker installed locally (for testing)

## Railway Deployment Steps

### 1. Push Your Code to GitHub

First, make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Add Docker configuration for Railway deployment"
git push origin main
```

### 2. Create a Railway Account

1. Go to https://railway.app
2. Sign up with your GitHub account
3. Railway offers a free tier with $5 credit per month

### 3. Create a New Project on Railway

1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your repository (`simple-todos-blaze`)
4. Railway will automatically detect the Dockerfile

### 4. Add MongoDB Service

Railway doesn't provide MongoDB by default, so you have two options:

#### Option A: Use MongoDB Atlas (Recommended - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account (M0 cluster is free forever)
3. Create a new cluster
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. In Railway, go to your service → Variables
6. Add environment variable: `MONGO_URL` with your MongoDB Atlas connection string

#### Option B: Add MongoDB Plugin on Railway

1. In your Railway project, click "New"
2. Select "Database" → "MongoDB"
3. Railway will automatically create a MongoDB instance
4. The `MONGO_URL` environment variable will be automatically set

### 5. Configure Environment Variables

In Railway, go to your service → Variables and add:

- `MONGO_URL`: Your MongoDB connection string (automatically set if using Railway MongoDB)
- `ROOT_URL`: Your app URL (e.g., `https://your-app-name.up.railway.app`)
- `PORT`: Railway sets this automatically, but you can override if needed

### 6. Deploy

1. Railway will automatically build and deploy when you push to your main branch
2. You can also trigger a manual deploy from the Railway dashboard
3. Wait for the build to complete (usually 5-10 minutes for first build)

### 7. Access Your Application

1. Once deployed, Railway will provide a URL like `https://your-app-name.up.railway.app`
2. Click on the URL to access your application
3. Use the default credentials:
   - Username: `meteorite`
   - Password: `password`

## Local Testing with Docker

Before deploying, you can test the Docker setup locally:

```bash
# Build the Docker image
docker build -t simple-todos-blaze .

# Run with docker-compose (includes MongoDB)
docker-compose up

# Or run manually with MongoDB
docker run -p 3000:3000 \
  -e MONGO_URL=mongodb://host.docker.internal:27017/meteor \
  -e ROOT_URL=http://localhost:3000 \
  simple-todos-blaze
```

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure `.dockerignore` is properly configured
- Check Railway build logs for specific errors

### Application Won't Start

- Verify `MONGO_URL` is set correctly
- Check that `ROOT_URL` matches your Railway domain
- Review application logs in Railway dashboard

### Database Connection Issues

- Ensure MongoDB is accessible from Railway (if using external MongoDB)
- Check MongoDB connection string format
- Verify network access rules in MongoDB Atlas (if using Atlas)

## Railway Free Tier Limits

- $5 credit per month
- 500 hours of usage
- 512 MB RAM per service
- 1 GB storage

For production use, consider upgrading to a paid plan.

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Meteor Deployment Guide](https://guide.meteor.com/deployment.html)
- [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/pricing)
