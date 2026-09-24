# AgricHub Africa — Deployment Guide

## Overview

AgricHub Africa uses a modern cloud-based deployment architecture designed for scalability, reliability, and continuous delivery.

---

# Technology Stack

## Backend

- Python 3.13+
- Django
- Django REST Framework
- PostgreSQL
- Gunicorn
- WhiteNoise

Hosted on:

**Render**

---

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS

Hosted on:

**Vercel**

---

## Mobile

- React Native
- Expo

Deployment:

- Android APK
- Google Play Store (Future)
- Apple App Store (Future)

---

## Database

Database Engine:

- PostgreSQL

Hosted on:

- Render PostgreSQL

---

# Environment Variables

Backend

```
SECRET_KEY
DEBUG
ALLOWED_HOSTS
DATABASE_URL
CLOUDINARY_URL
ACCESS_TOKEN_LIFETIME
REFRESH_TOKEN_LIFETIME
```

Frontend

```
VITE_API_BASE_URL
```

---

# Deployment Workflow

## Backend

1. Push code to GitHub.
2. Render automatically detects changes.
3. Install dependencies.
4. Run migrations.
5. Collect static files.
6. Restart Gunicorn.
7. Application becomes available.

---

## Frontend

1. Push code to GitHub.
2. Vercel automatically builds the project.
3. Static assets are optimized.
4. Application is deployed globally.

---

# Continuous Deployment

AgricHub uses Git-based Continuous Deployment.

```
Developer
      │
      ▼
GitHub Repository
      │
 ┌────┴────┐
 ▼         ▼
Render   Vercel
      │
      ▼
Production
```

Every successful push to the **main** branch automatically deploys the latest version of the application.

---

# Deployment Checklist

Before every production deployment:

- All tests pass.
- Database migrations are ready.
- Environment variables are configured.
- Build succeeds locally.
- API endpoints are verified.
- Frontend builds successfully.
- Mobile compatibility is confirmed.

---

# Future Infrastructure

As AgricHub scales, the platform may migrate to a more distributed architecture including:

- Docker
- Kubernetes
- Nginx
- Redis
- Celery
- Object Storage
- CDN
- Load Balancers
- Monitoring & Logging
- Automated Backups

---

# Deployment Goal

Provide a secure, highly available, and scalable infrastructure capable of supporting millions of users while ensuring reliable updates with minimal downtime.