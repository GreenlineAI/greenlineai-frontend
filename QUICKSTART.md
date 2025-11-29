# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local and update with your values:
# - NEXT_PUBLIC_DEMO_PHONE: Your demo phone number
# - NEXT_PUBLIC_CALENDLY_URL: Your Calendly booking link
# - NEXT_PUBLIC_FORM_ENDPOINT: Your form submission endpoint (optional)
# - NEXT_PUBLIC_FORM_ACCESS_KEY: Your form access key (optional)
```

### Step 3: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Customize Content
Edit these files to customize your landing page:

1. **Company name & branding:**
   - `components/Header.tsx` - Logo and company name
   - `components/Footer.tsx` - Footer branding

2. **Hero section:**
   - `components/Hero.tsx` - Main headline, subheadline, and stats

3. **Testimonials:**
   - `components/Testimonials.tsx` - Customer quotes and info

4. **Pricing:**
   - `components/Pricing.tsx` - Pricing tiers and features

5. **FAQ:**
   - `components/FAQ.tsx` - Questions and answers

### Step 5: Add Your Images
Place your images in the `public/` folder:
- Logo: `public/logo.png`
- Hero image: `public/hero.png`
- Open Graph image: `public/og-image.jpg`

Then update components to use them:
```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Company Logo"
  width={200}
  height={60}
/>
```

### Step 6: Build for Production
```bash
# Build the production version
npm run build

# Test the production build locally
npm start
```

## 📱 Testing Checklist

- [ ] Test on mobile device (or browser dev tools)
- [ ] Click all navigation links
- [ ] Test "Book Demo" buttons
- [ ] Click phone numbers (should open phone app on mobile)
- [ ] Test FAQ accordion (click to expand/collapse)
- [ ] Scroll through all sections
- [ ] Check responsive design at different screen sizes

## 🚢 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Vercel Dashboard
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure environment variables
6. Deploy

## 🎨 Color Customization

Edit `app/globals.css` to change colors:

```css
/* Primary color (Green) */
--color-primary-500: #10b981;  /* Main green */
--color-primary-600: #059669;  /* Darker green */

/* Accent color (Amber) */
--color-accent-500: #f59e0b;   /* Main amber */
--color-accent-600: #d97706;   /* Darker amber */
```

## 🔧 Common Customizations

### Change Phone Number
Update in `.env.local`:
```env
NEXT_PUBLIC_DEMO_PHONE="+1-555-123-4567"
```

### Change Calendly Link
Update in `.env.local`:
```env
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-username/30min"
```

### Add Google Analytics
1. Get your GA4 measurement ID
2. Add to `app/layout.tsx`:
```tsx
import Script from 'next/script'

// In the <head> section:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Update Meta Tags
Edit `app/layout.tsx` - update the `metadata` export:
```tsx
export const metadata: Metadata = {
  title: "Your Title",
  description: "Your description",
  // ... other meta tags
}
```

## ⚡ Performance Tips

1. **Optimize Images:**
   - Use WebP format
   - Compress before uploading
   - Use appropriate sizes (don't use 4K images for thumbnails)

2. **Add metadataBase:**
   In `app/layout.tsx`, add:
   ```tsx
   export const metadata: Metadata = {
     metadataBase: new URL('https://yourdomain.com'),
     // ... rest of metadata
   }
   ```

3. **Enable Compression:**
   Vercel does this automatically, but for other platforms:
   ```js
   // next.config.ts
   const nextConfig = {
     compress: true,
   }
   ```

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

**Build errors:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**TypeScript errors:**
```bash
# Check for errors
npx tsc --noEmit
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## 🆘 Need Help?

Check out:
1. [README.md](README.md) - Full documentation
2. [IMPLEMENTATION.md](IMPLEMENTATION.md) - Technical details
3. Component files - Inline comments explain functionality

---

**Happy coding! 🎉**
