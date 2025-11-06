# Deployment Guide for purga.knit

This guide will help you deploy the purga.knit e-commerce website to production.

## Prerequisites

- All environment variables configured
- Database migrations applied to Supabase
- Stripe account configured
- Domain name (optional but recommended)

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   In Vercel dashboard, go to Settings → Environment Variables and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)
   - `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables in Netlify dashboard
   - Deploy

### Option 3: Self-Hosted (Node.js Server)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Set up PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "purgaknit" -- start
   pm2 save
   pm2 startup
   ```

3. **Set up Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

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

4. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Post-Deployment Checklist

### Database Setup

1. **Run Migrations**
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Run the migration

2. **Set up Initial Data**
   - Add categories: Clothing, Accessories
   - Add sizes as needed
   - Add initial products

### Stripe Configuration

1. **Webhook Setup**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy webhook signing secret
   - Add to environment variables as `STRIPE_WEBHOOK_SECRET`

2. **Create Webhook Handler**
   Create `app/api/webhooks/stripe/route.ts`:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { stripe } from '@/lib/stripe/server'
   import { createServiceClient } from '@/lib/supabase/server'

   export async function POST(request: NextRequest) {
     const body = await request.text()
     const signature = request.headers.get('stripe-signature')!

     let event
     try {
       event = stripe.webhooks.constructEvent(
         body,
         signature,
         process.env.STRIPE_WEBHOOK_SECRET!
       )
     } catch (err: any) {
       return NextResponse.json({ error: err.message }, { status: 400 })
     }

     const supabase = await createServiceClient()

     switch (event.type) {
       case 'checkout.session.completed':
         const session = event.data.object
         await supabase
           .from('purgaknit_orders')
           .update({ status: 'paid' })
           .eq('stripe_payment_intent_id', session.id)
         break
     }

     return NextResponse.json({ received: true })
   }
   ```

### Supabase Configuration

1. **Enable Email Auth**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Email provider
   - Configure email templates

2. **Set up Row Level Security**
   - RLS policies are included in the migration
   - Verify policies are active in Supabase Dashboard

3. **Storage Setup (if needed)**
   - Create storage bucket for product images
   - Set up public access policies

### SEO Configuration

1. **Update sitemap.ts**
   - Change `baseUrl` to your production domain

2. **Update robots.ts**
   - Change `baseUrl` to your production domain

3. **Verify Meta Tags**
   - Check all pages have proper meta tags
   - Test Open Graph tags with [ogp.me](https://ogp.me/)

### Performance Optimization

1. **Image Optimization**
   - Ensure product images are optimized
   - Use Next.js Image component for all images
   - Consider using a CDN for images

2. **Caching**
   - Configure caching headers in your hosting platform
   - Use Next.js ISR for product pages if needed

### Security Checklist

- [ ] All environment variables are set
- [ ] HTTPS is enabled
- [ ] Stripe webhook secret is configured
- [ ] Supabase RLS policies are active
- [ ] API routes are protected
- [ ] Admin routes require authentication
- [ ] CORS is properly configured

### Monitoring

1. **Set up Error Tracking**
   - Consider using Sentry or similar service
   - Monitor API errors

2. **Analytics**
   - Set up Google Analytics or similar
   - Track conversion events

3. **Uptime Monitoring**
   - Use services like UptimeRobot or Pingdom
   - Set up alerts for downtime

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify Supabase credentials
   - Check network connectivity
   - Verify RLS policies

2. **Stripe Payment Issues**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Review Stripe dashboard logs

3. **Build Errors**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Image Loading Issues**
   - Verify image URLs are correct
   - Check Next.js image configuration
   - Verify remote patterns in next.config.ts

## Support

For deployment issues, contact:
- Email: info@purga.knit
- Instagram: @purga.knit

