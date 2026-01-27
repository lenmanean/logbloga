# Next.js Simple Setup Guide

## Overview

This guide walks you through setting up a Next.js project from scratch for a simple landing page or single-page application. Next.js is a React framework that provides excellent developer experience and production-ready features out of the box.

**Current Version**: Next.js 15+ (as of January 2025)
**Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

## Prerequisites

- Node.js 18.17 or later installed
- npm, yarn, pnpm, or bun package manager
- A code editor (VS Code recommended)
- Basic familiarity with terminal/command line

## Step 1: Install Node.js

If you don't have Node.js installed:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Step 2: Create Next.js Project

### Option A: Using create-next-app (Recommended)

Open your terminal and run:

```bash
npx create-next-app@latest my-app
```

You'll be prompted with several questions:

1. **Would you like to use TypeScript?** → Yes (recommended)
2. **Would you like to use ESLint?** → Yes
3. **Would you like to use Tailwind CSS?** → Yes (recommended for styling)
4. **Would you like to use `src/` directory?** → No (simpler for beginners)
5. **Would you like to use App Router?** → Yes (this is the default and recommended)
6. **Would you like to customize the default import alias?** → No

### Option B: Manual Setup

If you prefer more control:

```bash
mkdir my-app
cd my-app
npm init -y
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node @types/react-dom
```

## Step 3: Project Structure

After creation, your project should look like this:

```
my-app/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── public/             # Static files
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript config
```

## Step 4: Understanding Key Files

### `app/layout.tsx`
The root layout that wraps all pages:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### `app/page.tsx`
Your home page component:

```typescript
export default function Home() {
  return (
    <main>
      <h1>Welcome to My App</h1>
    </main>
  )
}
```

## Step 5: Run Development Server

Navigate to your project directory and start the dev server:

```bash
cd my-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your Next.js app running!

**Hot Reload**: Any changes you make to files will automatically refresh in the browser.

## Step 6: Create Your First Page

1. Open `app/page.tsx`
2. Replace the content with:

```typescript
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to My SaaS
      </h1>
      <p className="text-lg text-gray-600">
        This is my landing page!
      </p>
    </main>
  )
}
```

Save the file and see it update automatically in your browser.

## Step 7: Add a New Page

Create a new route by adding a folder:

1. Create `app/about/page.tsx`:

```typescript
export default function About() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p>Learn more about our product.</p>
    </main>
  )
}
```

2. Visit [http://localhost:3000/about](http://localhost:3000/about) to see your new page.

## Step 8: Styling with Tailwind CSS

Tailwind CSS is already configured. Use utility classes:

```typescript
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Styled with Tailwind!
</div>
```

**Common Tailwind Classes**:
- `p-4` = padding
- `m-4` = margin
- `text-xl` = text size
- `font-bold` = bold text
- `bg-blue-500` = background color
- `rounded-lg` = rounded corners

## Step 9: Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets there!

Access in your code:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Step 10: Build for Production

Test your production build:

```bash
npm run build
npm start
```

This creates an optimized production build and serves it locally.

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Next Steps

1. **Set up Git**: Initialize a repository and commit your code
2. **Add Stripe**: Follow the Stripe setup guide
3. **Deploy to Vercel**: Follow the Vercel deployment guide

## Troubleshooting

### Port Already in Use
If port 3000 is taken:
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors
Clear cache and reinstall:
```bash
rm -rf .next node_modules
npm install
```

### TypeScript Errors
Ensure all types are installed:
```bash
npm install -D @types/react @types/node @types/react-dom
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## AI Assistance Tips

**Using ChatGPT**:
- Ask for explanations of Next.js concepts
- Get help debugging errors
- Generate component code examples

**Using Cursor**:
- Auto-complete Next.js patterns
- Generate API routes
- Refactor components

---

**You're all set!** Your Next.js project is ready. Move on to the Vercel deployment guide to get it online.
