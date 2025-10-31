# 🚀 Deployment Guide for Dominiocracy

## Prerequisites

- Node.js 18+
- A Gemini API key from https://ai.google.dev
- Git (for version control)

## Local Development

### 1. Initial Setup

```bash
cd web
npm install
```

### 2. Environment Configuration

Create a `.env.local` file:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

**Security Note**: Never commit `.env.local` to version control!

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest option for Next.js apps:

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd web
vercel
```

3. **Set Environment Variable**:
```bash
vercel env add GEMINI_API_KEY
# Enter your API key when prompted
```

4. **Redeploy**:
```bash
vercel --prod
```

**Advantages**:
- Zero configuration
- Automatic HTTPS
- Edge functions support
- Free tier available

### Option 2: Railway

1. **Sign up** at https://railway.app
2. **Create new project** from GitHub repo
3. **Add environment variable**: `GEMINI_API_KEY`
4. **Deploy** automatically on push

**Advantages**:
- Simple deployment
- PostgreSQL support (for future features)
- Good free tier

### Option 3: Docker

Create `Dockerfile` in `web/`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
cd web
docker build -t dominiocracy .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key dominiocracy
```

**Advantages**:
- Self-hosted control
- Portable deployment
- Can deploy anywhere

### Option 4: Traditional VPS (DigitalOcean, AWS, etc.)

1. **SSH into server**
2. **Install Node.js 18+**
3. **Clone repo**:
```bash
git clone your-repo-url
cd Dominiocracy/web
```

4. **Install dependencies**:
```bash
npm ci --only=production
```

5. **Set environment**:
```bash
echo "GEMINI_API_KEY=your_key" > .env.local
```

6. **Build**:
```bash
npm run build
```

7. **Use PM2 for process management**:
```bash
npm install -g pm2
pm2 start npm --name "dominiocracy" -- start
pm2 save
pm2 startup
```

8. **Set up Nginx reverse proxy** (optional):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Required:
- `GEMINI_API_KEY` - Your Google Gemini API key

Optional (for future features):
- `NODE_ENV` - Set to `production` for optimization
- `PORT` - Server port (default: 3000)

## Performance Optimization

### 1. Enable Caching

Add to `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;
```

### 2. API Rate Limiting

Consider adding rate limiting for the `/api/interpret` endpoint:

```bash
npm install express-rate-limit
```

### 3. CDN Integration

For static assets, use Vercel's built-in CDN or Cloudflare.

## Monitoring

### Error Tracking

Add Sentry:

```bash
npm install @sentry/nextjs
```

### Analytics

Add Vercel Analytics or Google Analytics for usage tracking.

## Security Checklist

- ✅ API key stored in environment variables
- ✅ No sensitive data in client-side code
- ✅ API routes are server-side only
- ⚠️ Consider adding rate limiting for API endpoint
- ⚠️ Consider adding input validation for orders
- ⚠️ Add CORS headers if needed for future features

## Scaling Considerations

### Current Limitations
- Hot-seat multiplayer only (no websockets)
- API calls to Gemini have rate limits
- No database (all state in memory)

### Future Improvements
1. **Add Redis** for session management
2. **Add WebSockets** for real-time multiplayer
3. **Add PostgreSQL** for game history/replays
4. **Implement caching** for common interpretations
5. **Add queue system** for API calls during high load

## Cost Estimates

### Gemini API
- Free tier: 15 requests/minute
- Paid: $0.50/1M characters
- Typical game: ~10 API calls, ~5KB per call
- Cost per game: ~$0.0025

### Hosting (Vercel Free Tier)
- 100GB bandwidth/month
- Serverless functions: 100GB-hrs
- Should handle ~1000 games/day easily

### Recommended Setup
- Start with Vercel free tier
- Upgrade when you hit limits
- Monitor API usage in Google AI Studio

## Troubleshooting

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### API Key Not Working
- Check `.env.local` file exists
- Restart dev server after adding env vars
- Verify key is active in Google AI Studio

### Slow API Responses
- Gemini can take 2-5 seconds per request
- This is normal for first requests
- Consider adding loading animations

## Backup & Recovery

### Save Game State
Currently, games are not persisted. To add:

1. Add localStorage for client-side save
2. Add database for server-side save
3. Implement save/load UI

### Database Schema (Future)
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  player1_id UUID,
  player2_id UUID,
  state JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## CI/CD Pipeline

Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd web && npm ci
      - run: cd web && npm run build
      - run: cd web && npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Support

For issues:
1. Check build logs
2. Verify environment variables
3. Test Gemini API key separately
4. Check browser console for errors

## Maintenance

### Regular Tasks
- Monitor API usage/costs
- Update dependencies monthly
- Check Gemini API changelog
- Backup game data (when implemented)

### Updates
```bash
npm outdated
npm update
npm audit fix
```

---

## Quick Deploy Checklist

- [ ] Clone repo
- [ ] `cd web && npm install`
- [ ] Create `.env.local` with `GEMINI_API_KEY`
- [ ] `npm run build` (verify no errors)
- [ ] Choose deployment platform
- [ ] Set environment variable on platform
- [ ] Deploy!
- [ ] Test live site
- [ ] Monitor for errors

**You're ready to go! 🚀**

