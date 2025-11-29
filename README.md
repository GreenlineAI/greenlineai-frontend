# GreenLine AI - Landscaping AI Receptionist Landing Page

A modern, conversion-optimized landing page for an AI receptionist service targeting landscaping and lawn care businesses. Built with Next.js 15+, TypeScript, and Tailwind CSS.

## Features

- **Fully Responsive Design** - Mobile-first approach with seamless tablet and desktop experiences
- **Conversion-Optimized** - Multiple CTAs, trust signals, and social proof throughout
- **Modern Tech Stack** - Next.js 15+, TypeScript, Tailwind CSS, Framer Motion
- **Performance Focused** - Optimized for Core Web Vitals and fast loading
- **SEO Ready** - Proper meta tags, semantic HTML, and schema.org markup ready
- **Accessible** - WCAG 2.1 AA compliant with keyboard navigation and screen reader support

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Form Handling:** React Hook Form (ready for integration)
- **Utilities:** clsx, tailwind-merge

## Project Structure

```
greenline-ai/
├── app/
│   ├── globals.css          # Tailwind imports and custom styles
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main landing page
├── components/
│   ├── animations/           # Framer Motion animation components
│   │   ├── FadeIn.tsx
│   │   └── StaggerContainer.tsx
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── Header.tsx            # Navigation header
│   ├── Hero.tsx              # Hero section
│   ├── ProblemSolution.tsx   # Problem/Solution section
│   ├── HowItWorks.tsx        # Process timeline
│   ├── Features.tsx          # Features grid
│   ├── Testimonials.tsx      # Customer testimonials
│   ├── Demo.tsx              # Demo call section
│   ├── Pricing.tsx           # Pricing tiers
│   ├── FAQ.tsx               # FAQ accordion
│   ├── FinalCTA.tsx          # Final call-to-action
│   └── Footer.tsx            # Footer with links
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd greenline-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_DEMO_PHONE="+15551234567"
NEXT_PUBLIC_FORM_ENDPOINT="https://api.web3forms.com/submit"
NEXT_PUBLIC_FORM_ACCESS_KEY="your-access-key"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-username/demo"
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Page Sections

1. **Navigation Header** - Fixed header with smooth scroll navigation
2. **Hero Section** - Compelling headline with dual CTAs and stats
3. **Problem/Solution** - Side-by-side comparison of pain points vs. solutions
4. **How It Works** - 3-step process timeline
5. **Features Grid** - 9 key features with icons
6. **Testimonials** - Customer success stories
7. **Demo Section** - Live demo phone number with suggested questions
8. **Pricing** - Two-tier pricing with ROI calculator
9. **FAQ** - Accordion-style frequently asked questions
10. **Final CTA** - Strong closing call-to-action
11. **Footer** - Company info, links, and contact details

## Customization

### Colors

The color scheme uses a custom Tailwind theme defined in [app/globals.css](app/globals.css):

- **Primary (Green):** Emerald shades representing landscaping/growth
- **Accent (Yellow/Amber):** For CTAs and highlights
- **Slate/Gray:** For text and backgrounds

To customize colors, edit the CSS custom properties in `globals.css`.

### Content

All content is contained within the component files in the `components/` directory. Update the text, stats, testimonials, and other content directly in each component.

### Images

Add images to the `public/` directory and reference them in components. Remember to:
- Use Next.js `<Image>` component for optimization
- Provide alt text for accessibility
- Optimize images before uploading (WebP format recommended)

## Form Integration

The landing page is ready for form integration using Web3Forms or similar services:

1. Sign up for a form service (e.g., [Web3Forms](https://web3forms.com))
2. Get your access key
3. Update `NEXT_PUBLIC_FORM_ENDPOINT` and `NEXT_PUBLIC_FORM_ACCESS_KEY` in `.env.local`
4. Form submissions will be sent to your configured endpoint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Docker container

See [Next.js deployment docs](https://nextjs.org/docs/deployment) for more options.

## Performance

The site is optimized for performance:
- Server-side rendering for fast initial load
- Image optimization with Next.js Image component
- Font optimization with next/font
- Code splitting and lazy loading
- Minimal JavaScript bundle size

Target metrics:
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

## Accessibility

The site follows WCAG 2.1 AA guidelines:
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- Proper color contrast ratios
- Focus indicators
- ARIA labels where needed

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

This project is proprietary and confidential.

## Support

For questions or issues, please contact the development team or open an issue in the repository.

## Roadmap

Future enhancements:
- [ ] Contact form with validation
- [ ] Video testimonials
- [ ] Interactive ROI calculator
- [ ] Exit intent popup
- [ ] Chat widget integration
- [ ] A/B testing setup
- [ ] Analytics integration (GA4, Mixpanel)
- [ ] Blog section
- [ ] Case studies page

## Contributing

Please follow the existing code style and structure. Run the linter before committing:

```bash
npm run lint
```

Ensure TypeScript compiles without errors:

```bash
npm run build
```
