# Next.js Interview Questions

## Table of Contents
1. [App Router vs Pages Router](#1-app-router-vs-pages-router)
2. [Server Components vs Client Components](#2-server-components-vs-client-components)
3. [SSR vs SSG](#3-ssr-vs-ssg)
4. [Incremental Static Regeneration (ISR)](#4-incremental-static-regeneration-isr)
5. [API Routes & Route Handlers](#5-api-routes--route-handlers)
6. [Data Fetching Patterns](#6-data-fetching-patterns)
7. [Middleware](#7-middleware)
8. [Dynamic Routing & Catch-all Routes](#8-dynamic-routing--catch-all-routes)
9. [Image Optimization](#9-image-optimization)
10. [Font Optimization](#10-font-optimization)
11. [Metadata API & SEO](#11-metadata-api--seo)
12. [Loading UI & Streaming](#12-loading-ui--streaming)
13. [Error Handling](#13-error-handling)
14. [Parallel Routes](#14-parallel-routes)
15. [Intercepting Routes](#15-intercepting-routes)
16. [Server Actions](#16-server-actions)
17. [Caching Architecture](#17-caching-architecture)
18. [Layouts & Nested Layouts](#18-layouts--nested-layouts)
19. [Route Groups](#19-route-groups)
20. [Authentication Patterns](#20-authentication-patterns)
21. [Internationalization (i18n)](#21-internationalization-i18n)
22. [Environment Variables](#22-environment-variables)
23. [Deployment Options](#23-deployment-options)
24. [Performance Optimization](#24-performance-optimization)
25. [Testing Next.js Applications](#25-testing-nextjs-applications)
26. [Edge Runtime vs Node.js Runtime](#26-edge-runtime-vs-nodejs-runtime)
27. [Revalidation Strategies](#27-revalidation-strategies)
28. [Turbopack](#28-turbopack)
29. [Client-side Navigation & Prefetching](#29-client-side-navigation--prefetching)
30. [Integration with State Management](#30-integration-with-state-management)

---

## 1. App Router vs Pages Router

**Difficulty:** Medium

**Answer:**
The Pages Router (the original Next.js router) uses the file system based on the `pages` directory, where each file maps to a route, and routing is strictly determined by file names. The App Router (introduced in Next.js 13) uses the `app` directory and a new paradigm based on React Server Components, nested layouts, and specific file conventions (like `page.tsx`, `layout.tsx`, `loading.tsx`). It offers better performance, streaming support, and more granular caching out of the box.

**Example:**
```tsx
// Pages Router: pages/about.tsx
export default function About() {
  return <h1>About Page</h1>
}

// App Router: app/about/page.tsx
export default function About() {
  return <h1>About Page</h1>
}
```

**Follow-up questions interviewers might ask:**
- How do you migrate incrementally from the Pages to App router?
- What are the major performance benefits of the App Router?

---

## 2. Server Components vs Client Components

**Difficulty:** Easy

**Answer:**
Server Components are the default in the App Router. They render on the server, sending only HTML and no JavaScript to the client, reducing bundle size. Client Components render on both the server (for initial SSR) and the client (hydration). They are used when you need interactivity, state, or browser APIs. You mark them using the `'use client'` directive at the top of the file.

**Example:**
```tsx
// Server Component (Default)
export default async function Dashboard() {
  const data = await db.query('SELECT * FROM users');
  return <UserList data={data} />;
}

// Client Component
'use client'
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Follow-up questions interviewers might ask:**
- Can you import a Server Component into a Client Component?
- How do you pass data between Server and Client Components?

---

## 3. SSR vs SSG

**Difficulty:** Easy

**Answer:**
Server-Side Rendering (SSR) generates the HTML for a page on each request. It ensures users always see the latest data but adds server processing time to every request. Static Site Generation (SSG) generates the HTML at build time. The static page is cached and served to all users instantly via a CDN, offering better performance but potentially stale data until the next build or revalidation.

**Example:**
```tsx
// App Router SSR equivalent (no cache)
export default async function Page() {
  const res = await fetch('https://api.example.com/data', { cache: 'no-store' });
  const data = await res.json();
  return <div>{data.title}</div>;
}

// App Router SSG equivalent (default behavior)
export default async function StaticPage() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return <div>{data.title}</div>;
}
```

**Follow-up questions interviewers might ask:**
- Which rendering strategy would you use for a personalized user dashboard?
- How does Next.js handle dynamic routes in SSG?

---

## 4. Incremental Static Regeneration (ISR)

**Difficulty:** Medium

**Answer:**
ISR allows you to update static pages after you've built your site, without needing to rebuild the entire application. Next.js can regenerate specific pages in the background based on a defined time interval or on-demand. This provides the performance benefits of SSG while ensuring data stays relatively fresh.

**Example:**
```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // revalidate every hour

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return <article>{post.content}</article>;
}
```

**Follow-up questions interviewers might ask:**
- How does background regeneration actually work under the hood?
- What happens if the background regeneration fails?

---

## 5. API Routes & Route Handlers

**Difficulty:** Medium

**Answer:**
In the Pages router, API routes were created in `pages/api`. In the App Router, they are replaced by Route Handlers, created using `route.ts` files. Route Handlers allow you to create custom request handlers for a given route using standard Web Request and Response APIs.

**Example:**
```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';
  return NextResponse.json({ message: `Hello, ${name}!` });
}
```

**Follow-up questions interviewers might ask:**
- How do you handle POST requests in a Route Handler?
- Can a route handler share the same route segment as a page?

---

## 6. Data Fetching Patterns

**Difficulty:** Medium

**Answer:**
The App Router simplifies data fetching by relying on the native `fetch` API, which Next.js extends to support caching and revalidation out of the box. You can fetch data directly in Server Components using async/await. Next.js automatically dedupes multiple fetch requests for the same data within a single render pass.

**Example:**
```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{data.name}</main>;
}
```

**Follow-up questions interviewers might ask:**
- How do you fetch data that relies on cookies or headers?
- What happens if you need to fetch data in a Client Component?

---

## 7. Middleware

**Difficulty:** Medium

**Answer:**
Middleware runs before a request is completed, allowing you to modify the response by rewriting, redirecting, modifying request or response headers, or responding directly. It sits at the root of the project (typically `middleware.ts`) and is often used for authentication, geolocation, or A/B testing. It runs on the Edge Runtime.

**Example:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

**Follow-up questions interviewers might ask:**
- Why does Middleware only run on the Edge runtime?
- How can you bypass middleware for static assets?

---

## 8. Dynamic Routing & Catch-all Routes

**Difficulty:** Easy

**Answer:**
Dynamic routes are created by wrapping a folder name in square brackets (e.g., `[id]`). Catch-all routes use an ellipsis inside brackets (e.g., `[...slug]`) to match subsequent segments. Optional catch-all routes use double brackets (e.g., `[[...slug]]`).

**Example:**
```tsx
// app/shop/[...slug]/page.tsx
export default function Shop({ params }: { params: { slug: string[] } }) {
  // visiting /shop/clothes/tops gives params.slug = ['clothes', 'tops']
  return <div>Category: {params.slug.join('/')}</div>;
}
```

**Follow-up questions interviewers might ask:**
- What's the difference between `[...slug]` and `[[...slug]]`?
- How do you statically generate dynamic routes in the App Router?

---

## 9. Image Optimization

**Difficulty:** Medium

**Answer:**
Next.js provides the `next/image` component which automatically optimizes images. It prevents Layout Shift (CLS) by requiring dimensions, automatically resizes images for different devices, serves modern formats like WebP or AVIF, and lazy-loads images by default as they enter the viewport.

**Example:**
```tsx
import Image from 'next/image'
import profilePic from './me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="Picture of the author"
      width={500}
      height={500}
      placeholder="blur"
    />
  )
}
```

**Follow-up questions interviewers might ask:**
- How do you optimize images hosted on an external domain?
- What does the `priority` prop do on the Image component?

---

## 10. Font Optimization

**Difficulty:** Easy

**Answer:**
Next.js provides `next/font` to automatically optimize your fonts (including custom fonts and Google Fonts) and remove external network requests for improved privacy and performance. It downloads font files at build time and self-hosts them, meaning no layout shifts (zero CLS) due to font loading.

**Example:**
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

**Follow-up questions interviewers might ask:**
- How does `next/font` prevent layout shift?
- How do you load a local font file?

---

## 11. Metadata API & SEO

**Difficulty:** Medium

**Answer:**
The App Router uses a Metadata API that can be defined by exporting a `metadata` object or a `generateMetadata` function from a `page.tsx` or `layout.tsx`. Next.js will automatically inject the corresponding `<meta>` tags into the `<head>` of your HTML document, which is vital for SEO and social sharing.

**Example:**
```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Store',
  description: 'Buy cool things',
}

export default function Page() {
  return <h1>Store Front</h1>
}
```

**Follow-up questions interviewers might ask:**
- How do you generate dynamic metadata based on route parameters?
- How do you handle Open Graph (OG) image generation in Next.js?

---

## 12. Loading UI & Streaming

**Difficulty:** Medium

**Answer:**
The `loading.tsx` file creates an instant loading state using React Suspense. While the server component is fetching data, Next.js immediately streams the loading UI to the client. Once the data resolves, the fully rendered content is streamed in, replacing the loading UI.

**Example:**
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <p>Loading dashboard data...</p>
}

// app/dashboard/page.tsx
export default async function Dashboard() {
  const data = await fetchSlowData();
  return <div>{data}</div>
}
```

**Follow-up questions interviewers might ask:**
- Can you use Suspense boundaries manually within a page?
- How does streaming improve Time to First Byte (TTFB)?

---

## 13. Error Handling

**Difficulty:** Medium

**Answer:**
The `error.tsx` convention allows you to handle runtime errors gracefully. It automatically wraps a route segment and its nested children in a React Error Boundary. It must be a Client Component. You can provide a fallback UI and a mechanism to attempt recovery.

**Example:**
```tsx
// app/dashboard/error.tsx
'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

**Follow-up questions interviewers might ask:**
- What happens if an error occurs in the root layout?
- Can `error.tsx` catch errors that occur on the server?

---

## 14. Parallel Routes

**Difficulty:** Hard

**Answer:**
Parallel Routing allows you to simultaneously or conditionally render one or more pages in the same layout. They are defined using named slots (e.g., `@analytics`, `@team`). This is useful for building complex dashboards where multiple independent sections of a page fetch data and load independently.

**Example:**
```tsx
// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics, // from @analytics
  team,      // from @team
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

**Follow-up questions interviewers might ask:**
- What is `default.tsx` and when do you need it with parallel routes?
- How do parallel routes interact with loading and error boundaries?

---

## 15. Intercepting Routes

**Difficulty:** Hard

**Answer:**
Intercepting routes allow you to load a route from another part of your application within the current layout, without losing context. They use `(..)` conventions similar to relative paths. A common use case is a photo gallery where clicking a photo opens a modal over the gallery, but hard refreshing the page loads the photo on its own dedicated route.

**Example:**
```text
app/
  feed/
    page.tsx
  photo/
    [id]/
      page.tsx
  (..)photo/      <-- Intercepts /photo/[id] when navigating from within the app
    [id]/
      page.tsx    <-- Renders a modal instead
```

**Follow-up questions interviewers might ask:**
- How would you structure an intercepting route for a sibling segment vs a layout segment?
- Why are intercepting routes frequently combined with parallel routes?

---

## 16. Server Actions

**Difficulty:** Medium

**Answer:**
Server Actions are asynchronous functions that execute on the server. They provide a built-in way to handle form submissions and data mutations directly from Server or Client Components without manually creating an API endpoint. You define them using the `'use server'` directive.

**Example:**
```tsx
// app/actions.ts
'use shell'
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  await db.insert({ title });
  revalidatePath('/posts');
}

// app/page.tsx
import { createPost } from './actions'

export default function Page() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

**Follow-up questions interviewers might ask:**
- How do you handle validation errors with Server Actions?
- How does `useFormStatus` work in conjunction with Server Actions?

---

## 17. Caching Architecture

**Difficulty:** Hard

**Answer:**
Next.js App Router has four primary layers of caching:
1. **Request Memoization**: Dedupes multiple identical `fetch` calls during a single React render pass.
2. **Data Cache**: Stores responses from `fetch` persistently across requests and deployments (unless revalidated).
3. **Full Route Cache**: Automatically statically renders and caches the HTML and React Server Components payload at build time.
4. **Router Cache**: An in-memory client-side cache that stores the React Server Components payload for prefetched and visited routes to enable instant navigation.

**Example:**
```tsx
// fetch is cached in the Data Cache and Request Memoization by default
const res = await fetch('https://api.example.com/data');
```

**Follow-up questions interviewers might ask:**
- How do you opt out of the Data Cache for a specific fetch request?
- How long does the client-side Router Cache persist?

---

## 18. Layouts & Nested Layouts

**Difficulty:** Easy

**Answer:**
Layouts are UI that is shared between multiple routes. On navigation, layouts preserve state, remain interactive, and do not re-render. You define them in `layout.tsx` files. Layouts can be nested; a route segment's layout will wrap the layouts and pages of its child segments.

**Example:**
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <nav>Sidebar</nav>
      <main>{children}</main>
    </section>
  )
}
```

**Follow-up questions interviewers might ask:**
- What's the difference between a Layout and a Template (`template.tsx`)?
- Where must the root HTML and body tags reside?

---

## 19. Route Groups

**Difficulty:** Easy

**Answer:**
Route Groups allow you to organize your file system into logical groups without affecting the URL structure. You create a route group by wrapping a folder name in parentheses, like `(marketing)`. This is highly useful for applying different layouts to different segments of the site that share the same URL hierarchy root.

**Example:**
```text
app/
  (marketing)/
    layout.tsx
    about/page.tsx   -> URL: /about
    contact/page.tsx -> URL: /contact
  (app)/
    layout.tsx
    dashboard/page.tsx -> URL: /dashboard
```

**Follow-up questions interviewers might ask:**
- Can two route groups have the same child route path?
- Why use Route Groups instead of just putting layouts inside child directories?

---

## 20. Authentication Patterns

**Difficulty:** Medium

**Answer:**
Authentication in Next.js is typically handled via middleware for route protection, combined with Server Actions for login/logout functionality. Libraries like NextAuth.js (Auth.js) are widely used to abstract OAuth, session management, and JWT handling. Context or Server Components are used to expose the user session.

**Example:**
```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});
```

**Follow-up questions interviewers might ask:**
- Why is it better to check authentication in Server Components rather than Client Components?
- How do you manage session tokens in the App Router?

---

## 21. Internationalization (i18n)

**Difficulty:** Hard

**Answer:**
In the App Router, i18n is typically achieved using dynamic segments and middleware. Middleware detects the user's preferred language and redirects or rewrites to a localized route like `/en/about` or `/fr/about`. Dictionaries (JSON files) are loaded asynchronously in Server Components based on the locale parameter.

**Example:**
```tsx
// app/[lang]/page.tsx
import { getDictionary } from './dictionaries'

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang)
  return <h1>{dict.hello_world}</h1>
}
```

**Follow-up questions interviewers might ask:**
- How do you handle language negotiation in Middleware?
- How does i18n impact static generation?

---

## 22. Environment Variables

**Difficulty:** Easy

**Answer:**
Next.js supports environment variables loaded from `.env` files. Variables are strictly server-side by default, ensuring secrets don't leak to the browser. To expose a variable to the browser (Client Components), you must prefix it with `NEXT_PUBLIC_`.

**Example:**
```bash
# .env.local
DATABASE_URL=postgres://user:pass@localhost:5432/db # Server only
NEXT_PUBLIC_API_URL=https://api.example.com         # Available on Client
```

**Follow-up questions interviewers might ask:**
- How do you provide different environment variables for staging vs production?
- Can you read `NEXT_PUBLIC_` variables dynamically on the edge?

---

## 23. Deployment Options

**Difficulty:** Medium

**Answer:**
Next.js is built by Vercel, making it the most seamless deployment target with zero-config support for Edge functions, ISR, and image optimization. However, Next.js can be self-hosted via a standard Node.js server (using `next start`), containerized using Docker (often using Next.js standalone mode), or deployed via Azure Static Web Apps / AWS Amplify.

**Example:**
```javascript
// next.config.js for optimized Docker deployment
module.exports = {
  output: 'standalone',
}
```

**Follow-up questions interviewers might ask:**
- What does `output: 'standalone'` actually do?
- How do Image Optimization and ISR work when self-hosting in a Node container?

---

## 24. Performance Optimization

**Difficulty:** Hard

**Answer:**
Next.js offers various performance optimizations out-of-the-box, such as automatic code splitting via Server Components, lazy loading of Client Components via `next/dynamic`, optimized media loading (`next/image`, `next/font`), streaming SSR, and aggressive multi-tier caching. Using third-party script optimization (`next/script`) also prevents render blocking.

**Example:**
```tsx
import dynamic from 'next/dynamic'
import Script from 'next/script'

const HeavyChart = dynamic(() => import('./Chart'), { ssr: false })

export default function Page() {
  return (
    <div>
      <Script src="https://example.com/analytics.js" strategy="worker" />
      <HeavyChart />
    </div>
  )
}
```

**Follow-up questions interviewers might ask:**
- What's the difference between `strategy="lazyOnload"` and `strategy="afterInteractive"` in `next/script`?
- How do you analyze the Next.js bundle size?

---

## 25. Testing Next.js Applications

**Difficulty:** Medium

**Answer:**
Testing in Next.js usually involves a mix of unit testing (Vitest / Jest + React Testing Library) for standalone components, and End-to-End (E2E) testing (Playwright or Cypress) for full flows including routing and data fetching. With Server Components, unit testing is trickier, making E2E and integration tests highly valuable.

**Example:**
```typescript
// playwright.config.ts config to run next dev before tests
export default {
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
}
```

**Follow-up questions interviewers might ask:**
- How do you mock a Next.js router in Jest?
- How do you test Server Actions?

---

## 26. Edge Runtime vs Node.js Runtime

**Difficulty:** Hard

**Answer:**
Next.js supports two runtimes. The Node.js runtime is the default and provides access to all Node APIs and ecosystem packages. The Edge Runtime is a lighter, faster runtime based on Web APIs. It runs at the CDN edge closest to the user. It is mandatory for Middleware but can also be opted into for Route Handlers and Pages to achieve extremely low latency.

**Example:**
```tsx
// Opt into edge runtime for a specific route
export const runtime = 'edge'

export default function Page() {
  return <h1>Fast Edge Page</h1>
}
```

**Follow-up questions interviewers might ask:**
- What are the limitations of the Edge runtime?
- Can you use a standard PostgreSQL driver (like `pg`) on the Edge runtime?

---

## 27. Revalidation Strategies

**Difficulty:** Medium

**Answer:**
Revalidation purges cached data to serve fresh content. Next.js supports two types:
- **Time-based revalidation:** Revalidates data after a specified time interval has passed (like traditional ISR).
- **On-demand revalidation:** Manually purges the cache based on an event (e.g., a webhook when a CMS updates), using `revalidatePath` or `revalidateTag`.

**Example:**
```tsx
import { revalidateTag } from 'next/cache'

export async function updateArticle(formData: FormData) {
  // update article logic
  revalidateTag('articles') // purges all fetches tagged with 'articles'
}
```

**Follow-up questions interviewers might ask:**
- What happens to a user's request if it hits a stale page right after the revalidation interval expires?
- Can you revalidate data from a Client Component?

---

## 28. Turbopack

**Difficulty:** Easy

**Answer:**
Turbopack is an incremental bundler optimized for Next.js, written in Rust. It was built by the creators of Webpack to be its successor. It significantly speeds up local development start times and hot module replacement (HMR) compared to Webpack. You opt-in by passing the `--turbo` flag.

**Example:**
```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

**Follow-up questions interviewers might ask:**
- Is Turbopack used for production builds yet?
- How does Turbopack differ architecturally from Webpack?

---

## 29. Client-side Navigation & Prefetching

**Difficulty:** Medium

**Answer:**
Next.js `<Link>` components automatically prefetch linked routes in the background as they enter the viewport. When a user clicks a link, the navigation is client-side, instant, and avoids a full page reload. It utilizes the Router Cache to load the Server Component payload instantly.

**Example:**
```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    // prefetches by default
    <Link href="/dashboard">Dashboard</Link>
  )
}
```

**Follow-up questions interviewers might ask:**
- How do you disable prefetching for a specific link?
- What happens if the prefetched data gets stale?

---

## 30. Integration with State Management

**Difficulty:** Medium

**Answer:**
With Server Components, global state management needs shift. Server components handle global data state, drastically reducing the need for libraries like Redux. For complex client-side interactive state (UI state), lightweight tools like Zustand or React Context are used exclusively within Client Components (`'use client'`).

**Example:**
```tsx
'use client'
import { create } from 'zustand'

const useStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export default function MenuToggle() {
  const toggle = useStore((state) => state.toggle)
  return <button onClick={toggle}>Toggle Menu</button>
}
```

**Follow-up questions interviewers might ask:**
- Why shouldn't you wrap your entire `layout.tsx` in a Redux Provider?
- How do you initialize client state with data fetched on the server?
