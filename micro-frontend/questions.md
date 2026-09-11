## Table of Contents
1. [What is Micro-Frontend architecture & why use it?](#1-what-is-micro-frontend-architecture--why-use-it)
2. [Micro-Frontend composition patterns](#2-micro-frontend-composition-patterns-build-time-runtime-server-side)
3. [Module Federation (Webpack 5) — how it works](#3-module-federation-webpack-5--how-it-works-hostremote-setup)
4. [Module Federation configuration](#4-module-federation-configuration--exposes-remotes-shared-dependencies)
5. [Shared dependencies management](#5-shared-dependencies-management--singleton-version-conflicts)
6. [Webpack 5 fundamentals](#6-webpack-5-fundamentals--entry-output-loaders-plugins)
7. [Webpack code splitting](#7-webpack-code-splitting--dynamic-imports-splitchunks)
8. [Webpack Module Federation vs single-spa vs iframe approaches](#8-webpack-module-federation-vs-single-spa-vs-iframe-approaches)
9. [Vite — how it differs from Webpack](#9-vite--how-it-differs-from-webpack-esbuild-dev-server-architecture)
10. [Vite plugin system & configuration](#10-vite-plugin-system--configuration)
11. [Vite vs Webpack performance comparison](#11-vite-vs-webpack-performance-comparison)
12. [Turbopack — what it is, Next.js integration](#12-turbopack--what-it-is-nextjs-integration)
13. [Tree shaking](#13-tree-shaking--how-it-works-esm-requirement)
14. [Lazy loading & dynamic imports in MFE](#14-lazy-loading--dynamic-imports-in-mfe)
15. [CSS isolation strategies in MFE](#15-css-isolation-strategies-in-mfe-css-modules-shadow-dom-scoped-css)
16. [State sharing between micro-frontends](#16-state-sharing-between-micro-frontends)
17. [Routing in micro-frontend applications](#17-routing-in-micro-frontend-applications)
18. [Communication between micro-frontends](#18-communication-between-micro-frontends-custom-events-pubsub-shared-state)
19. [Error boundaries & fault isolation in MFE](#19-error-boundaries--fault-isolation-in-mfe)
20. [Deploying micro-frontends independently](#20-deploying-micro-frontends-independently)
21. [Mono-repo vs poly-repo for MFE](#21-mono-repo-vs-poly-repo-for-mfe)
22. [Design system / shared component library across MFEs](#22-design-system--shared-component-library-across-mfes)
23. [Authentication & authorization across micro-frontends](#23-authentication--authorization-across-micro-frontends)
24. [Performance considerations in MFE](#24-performance-considerations-in-mfe-bundle-size-loading-strategies)
25. [Webpack Dev Server & HMR](#25-webpack-dev-server--hmr-hot-module-replacement)
26. [Source maps configuration](#26-source-maps-configuration)
27. [Environment-specific builds](#27-environment-specific-builds-dev-staging-prod)
28. [Babel vs SWC vs esbuild](#28-babel-vs-swc-vs-esbuild--transpiler-comparison)
29. [Asset optimization in build pipelines](#29-asset-optimization-images-fonts-svgs-in-build-pipelines)
30. [Migrating from monolith SPA to micro-frontend](#30-migrating-from-monolith-spa-to-micro-frontend--strategy--pitfalls)

---

## 1. What is Micro-Frontend architecture & why use it?

**Difficulty:** Easy

**Answer:**
Micro-Frontend (MFE) architecture is a design approach where a monolithic frontend application is broken down into smaller, logical, and independently manageable pieces. Each piece (MFE) can be developed, tested, and deployed by different teams independently.

Why use it?
- **Independent deployments:** Teams can deploy their features without waiting for the entire application to release.
- **Team autonomy:** Teams can choose their own tech stack (though standardizing is often better) and work independently.
- **Scalability:** Large applications can be scaled easier when split into multiple apps.
- **Resilience:** A failure in one micro-frontend doesn't necessarily bring down the entire application.

**Example:**
```javascript
// High-level concept - an e-commerce site
// Container app loads multiple micro-frontends:
// - Header & Navigation (MFE 1)
// - Product Listing (MFE 2)
// - Shopping Cart (MFE 3)
```

**Follow-up questions interviewers might ask:**
- What are the main drawbacks or complexities introduced by micro-frontends?
- When would you advise AGAINST using a micro-frontend architecture?

---

## 2. Micro-Frontend composition patterns (build-time, runtime, server-side)

**Difficulty:** Medium

**Answer:**
Micro-frontends can be composed (combined) in three main ways:

1. **Build-time composition:** MFEs are published as NPM packages and the container app imports them. 
   - *Pros:* Simple, good performance.
   - *Cons:* Requires re-compiling and re-deploying the container whenever a child app updates. Doesn't truly decouple deployments.
2. **Runtime composition (Client-side):** The container app dynamically loads the MFE bundles at runtime (e.g., via Module Federation, single-spa, or dynamic script tags).
   - *Pros:* Fully independent deployments. Container always fetches the latest version.
   - *Cons:* Slightly more complex setup, potential for runtime issues if interfaces change.
3. **Server-side composition:** Fragments of the UI are rendered on the server and assembled before sending to the client (e.g., Server Side Includes, Edge Side Includes, or frameworks like Tailor).
   - *Pros:* Great for initial load performance and SEO.
   - *Cons:* Harder to maintain complex client-side interactivity across boundaries.

**Example:**
```javascript
// Runtime composition using dynamic script loading
const loadMicroFrontend = (url) => {
  const script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
};
```

**Follow-up questions interviewers might ask:**
- Which composition pattern provides the most team autonomy and why?
- How does Module Federation fit into these patterns?

---

## 3. Module Federation (Webpack 5) — how it works, host/remote setup

**Difficulty:** Medium

**Answer:**
Module Federation is a Webpack 5 feature that allows multiple separate builds to form a single application at runtime. It enables applications to dynamically load code from other applications.

In this architecture, there are two main roles (an app can be both):
- **Host:** The application that initializes the loading process and consumes code from other applications.
- **Remote:** The application that exposes modules to be consumed by the host or other remotes.

Webpack creates a "remoteEntry.js" file for the remote app. This file is a manifest of the modules it exposes. The host app loads this file at runtime, which tells it how to fetch the required modules.

**Example:**
```javascript
// Host loading a remote component dynamically
const RemoteComponent = React.lazy(() => import('app2/Button'));

const App = () => (
  <Suspense fallback="Loading...">
    <RemoteComponent />
  </Suspense>
);
```

**Follow-up questions interviewers might ask:**
- How does Module Federation differ from loading an iframe?
- Can a host application also act as a remote application?

---

## 4. Module Federation configuration — exposes, remotes, shared dependencies

**Difficulty:** Hard

**Answer:**
Configuring Module Federation involves using the `ModuleFederationPlugin`. Key configuration options are:

- `name`: A unique identifier for the application.
- `filename`: The name of the remote entry file (usually `remoteEntry.js`).
- `exposes`: An object mapping local file paths to public module names. Used by remotes.
- `remotes`: An object mapping remote names to their URLs. Used by hosts.
- `shared`: Dependencies that should be shared across the host and remotes to avoid downloading multiple copies (like React or ReactDOM).

**Example:**
```javascript
// webpack.config.js - Remote App
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button', // What I provide
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
};

// webpack.config.js - Host App
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js', // What I consume
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
};
```

**Follow-up questions interviewers might ask:**
- How do you handle dynamic URLs for remotes instead of hardcoding them in Webpack config?
- What happens if the host and remote have different versions of an unshared dependency?

---

## 5. Shared dependencies management — singleton, version conflicts

**Difficulty:** Hard

**Answer:**
In Module Federation, the `shared` property optimizes bundles by preventing multiple downloads of the same library. 

Key configurations for shared dependencies:
- **`singleton: true`**: Ensures only a single instance of the library is loaded in the entire app. Crucial for libraries with internal state, like React (multiple React instances cause errors).
- **`requiredVersion`**: Specifies the exact version or range required by an app.
- **`eager: true`**: Forces the dependency to be bundled in the main initial chunk instead of being lazily loaded. Useful for core dependencies needed immediately.

If a host and remote request different incompatible versions (and `singleton` is false), Webpack will load both versions to satisfy both apps. If `singleton: true` is set and versions conflict, Webpack will use the highest version, but will print a warning if it doesn't satisfy `requiredVersion`.

**Example:**
```javascript
shared: {
  react: { 
    singleton: true, 
    requiredVersion: '^18.2.0',
    eager: true // Load immediately in the host
  },
  lodash: {
    // Not a singleton, different apps can load different versions if needed
    requiredVersion: '^4.17.21'
  }
}
```

**Follow-up questions interviewers might ask:**
- What error do you get if React is loaded twice (not as a singleton)?
- How do you fix the "shared module is not available for eager consumption" error?

---

## 6. Webpack 5 fundamentals — entry, output, loaders, plugins

**Difficulty:** Easy

**Answer:**
Webpack is a static module bundler. It builds a dependency graph from one or more entry points and combines modules into one or more bundles.

Core concepts:
- **Entry:** The starting point(s) Webpack uses to begin building its internal dependency graph.
- **Output:** Where Webpack should emit the bundles it creates and how to name them.
- **Loaders:** Webpack only understands JS and JSON natively. Loaders transform other types of files (CSS, TS, images) into valid modules that can be added to the dependency graph.
- **Plugins:** Perform a wider range of tasks like bundle optimization, asset management, and injecting environment variables. They hook into Webpack's lifecycle.

**Example:**
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.[contenthash].js', // Output
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] } // Loader
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }) // Plugin
  ]
};
```

**Follow-up questions interviewers might ask:**
- What is the difference between a loader and a plugin?
- How does `contenthash` help with caching?

---

## 7. Webpack code splitting — dynamic imports, splitChunks

**Difficulty:** Medium

**Answer:**
Code splitting allows you to split your code into various bundles which can then be loaded on demand or in parallel, reducing the initial load time.

Two main approaches in Webpack:
1. **Dynamic Imports:** Using `import()` syntax. Webpack automatically creates a separate chunk for dynamically imported modules.
2. **`optimization.splitChunks`:** A configuration to automatically extract common dependencies into their own chunks. By default, it splits chunks for node_modules.

**Example:**
```javascript
// 1. Dynamic import (creates a separate chunk)
button.addEventListener('click', () => {
  import('./math.js').then(math => {
    console.log(math.add(16, 26));
  });
});

// 2. splitChunks config in webpack.config.js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all', // Apply to both async and sync chunks
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

**Follow-up questions interviewers might ask:**
- What is the difference between `chunks: 'async'` and `chunks: 'all'`?
- How does code splitting interact with React.lazy?

---

## 8. Webpack Module Federation vs single-spa vs iframe approaches

**Difficulty:** Medium

**Answer:**
- **Iframes:** The oldest approach. 
  - *Pros:* Perfect CSS/JS isolation.
  - *Cons:* Bad UX (routing, scrolling), slow performance, hard to share state or communicate, duplicate dependencies (each iframe downloads React).
- **single-spa:** A framework for bringing together multiple JS micro-frontends. It acts as an orchestrator, determining which MFE to mount/unmount based on the URL.
  - *Pros:* Framework agnostic, handles routing well.
  - *Cons:* Sharing dependencies requires complex setup (like SystemJS or import maps), tight coupling to the single-spa lifecycle.
- **Webpack Module Federation:** A bundler-level feature.
  - *Pros:* First-class support for sharing dependencies efficiently. Feels like native development. No orchestration framework needed.
  - *Cons:* Tied to Webpack (though Rspack/Vite have implementations now), doesn't provide routing or lifecycle management out of the box.

**Example:**
```javascript
// single-spa requires specific lifecycle exports from the micro-frontend
export const bootstrap = [/* ... */];
export const mount = [/* ... */];
export const unmount = [/* ... */];

// Module federation just exports the component
export default function MyComponent() { return <div>Hello</div>; }
```

**Follow-up questions interviewers might ask:**
- Can you use single-spa and Module Federation together? (Yes)
- Which approach provides the strongest CSS isolation?

---

## 9. Vite — how it differs from Webpack, ESBuild, dev server architecture

**Difficulty:** Medium

**Answer:**
Vite is a modern build tool that aims to provide a faster and leaner development experience. 

Differences from Webpack:
- **Dev Server Architecture:** Webpack bundles the entire application before the dev server starts. Vite does *not* bundle during development. It serves source code over native ESM (ECMAScript Modules). The browser requests modules as needed.
- **Pre-bundling:** Vite uses `esbuild` (written in Go) to pre-bundle dependencies (node_modules) extremely quickly before the server starts. Webpack uses JS-based transpilers.
- **Production Build:** Vite uses Rollup for production builds, providing highly optimized static assets, whereas Webpack uses its own bundler.

**Example:**
```javascript
// In development, Vite serves files like this directly to the browser:
// The browser's native ESM support handles resolving the imports
import { useState } from '/node_modules/.vite/deps/react.js';
import MyComponent from '/src/MyComponent.jsx';
```

**Follow-up questions interviewers might ask:**
- Why does Vite use Rollup for production instead of esbuild?
- How does Hot Module Replacement (HMR) differ between Vite and Webpack?

---

## 10. Vite plugin system & configuration

**Difficulty:** Easy

**Answer:**
Vite configuration is typically done in a `vite.config.js` or `vite.config.ts` file. 

Vite's plugin system is based on Rollup's plugin interface. This means many existing Rollup plugins work out-of-the-box with Vite. Vite also extends the plugin API with Vite-specific hooks (like `config`, `configureServer`, `handleHotUpdate`).

**Example:**
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(), // Enables React HMR and Fast Refresh
    svgr()   // Allows importing SVGs as React components
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    outDir: 'build'
  }
});
```

**Follow-up questions interviewers might ask:**
- How do you handle environment variables in Vite compared to Webpack?
- Can you write a custom Vite plugin? What hooks are available?

---

## 11. Vite vs Webpack performance comparison

**Difficulty:** Medium

**Answer:**
- **Cold Start:** Vite is significantly faster. It only pre-bundles dependencies (using esbuild) and serves source code on-demand via native ESM. Webpack must crawl, build, and bundle the entire application graph before the dev server can start.
- **HMR (Hot Module Replacement):** In Webpack, HMR speed degrades as the application size grows because it has to reconstruct parts of the bundle. In Vite, HMR performance is decoupled from the total number of modules. When a file is edited, Vite precisely invalidates the chain between the edited module and its closest HMR boundary, keeping updates fast regardless of app size.
- **Production Build:** Webpack and Vite (via Rollup) have more comparable production build times, though Vite is often slightly faster due to Rollup's efficiency and esbuild minification.

**Example:**
```javascript
// Vite's speed comes from esbuild (written in Go) for deps 
// and Native ESM for source code.
// No specific code example, this is a conceptual difference.
```

**Follow-up questions interviewers might ask:**
- In what scenarios might Webpack still be preferable to Vite?
- How does Vite handle older browsers that don't support native ESM?

---

## 12. Turbopack — what it is, Next.js integration

**Difficulty:** Medium

**Answer:**
Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust. It was created by Vercel (the team behind Next.js) and Tobias Koppers (the creator of Webpack) as the successor to Webpack.

Key features:
- **Rust-based:** Provides massive performance improvements over JS-based bundlers.
- **Incremental Architecture:** It caches the results of function calls and tasks. If an input doesn't change, it doesn't re-compute the output, making rebuilds extremely fast.
- **Next.js Integration:** It is deeply integrated into Next.js. You can enable it in Next.js development using the `--turbo` flag.

**Example:**
```bash
// package.json in a Next.js app
{
  "scripts": {
    "dev": "next dev --turbo", // Starts dev server with Turbopack
    "build": "next build"
  }
}
```

**Follow-up questions interviewers might ask:**
- How does Turbopack's caching mechanism work compared to Webpack's?
- Is Turbopack ready for production builds outside of Next.js?

---

## 13. Tree shaking — how it works, ESM requirement

**Difficulty:** Medium

**Answer:**
Tree shaking is a term for dead-code elimination. It removes unused code from the final bundle, reducing the file size.

How it works:
- It relies on the static structure of ES2015 module syntax (`import` and `export`).
- Because ESM is static (imports/exports cannot be conditional or dynamic), bundlers can analyze the dependency graph at build time and determine which exports are never imported or used.
- CommonJS (`require()`) is dynamic, making it very difficult or impossible to tree-shake reliably.

In Webpack, tree shaking requires configuration: `mode: 'production'` automatically enables it, and the `sideEffects` property in `package.json` helps the bundler know if files have side effects.

**Example:**
```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b; // If never imported, will be tree-shaken

// index.js
import { add } from './math.js';
console.log(add(2, 2));

// package.json optimization
{
  "name": "my-lib",
  "sideEffects": false // Tells bundler it's safe to drop unused files completely
}
```

**Follow-up questions interviewers might ask:**
- What are "side effects" in the context of tree shaking?
- Why doesn't tree shaking work well with CommonJS modules?

---

## 14. Lazy loading & dynamic imports in MFE

**Difficulty:** Medium

**Answer:**
Lazy loading defers the loading of non-critical resources at page load time. In Micro-Frontends, this is essential to ensure the host application loads quickly without waiting for all remotes to download.

Dynamic imports (`import()`) are used to fetch micro-frontend modules asynchronously. In React, this is paired with `React.lazy()` and `<Suspense>`.

**Example:**
```javascript
import React, { Suspense } from 'react';

// Dynamically import the remote micro-frontend
// This creates a separate network request when the component renders
const RemoteDashboard = React.lazy(() => import('dashboardApp/Dashboard'));

function App() {
  return (
    <div>
      <h1>Main Application</h1>
      <Suspense fallback={<div>Loading Dashboard MFE...</div>}>
        <RemoteDashboard />
      </Suspense>
    </div>
  );
}
```

**Follow-up questions interviewers might ask:**
- How do you handle network errors when a dynamic import fails in React?
- What is the impact of lazy loading too many small components?

---

## 15. CSS isolation strategies in MFE (CSS Modules, Shadow DOM, scoped CSS)

**Difficulty:** Hard

**Answer:**
Because micro-frontends run in the same DOM, CSS from one MFE can accidentally leak and affect another. Isolation strategies include:

1. **CSS Modules:** Generates unique class names at build time (e.g., `.button_x7y9`). Excellent for React/Webpack apps.
2. **Shadow DOM (Web Components):** Provides true browser-native encapsulation. CSS inside a Shadow DOM cannot affect the outside, and vice versa.
3. **BEM (Block Element Modifier):** A naming convention to avoid collisions, but requires strict developer discipline.
4. **CSS-in-JS (Styled Components, Emotion):** Generates unique classes dynamically.
5. **Prefixing/Scoped CSS:** Wrapping an MFE's CSS in a specific ID or class selector (e.g., `#mfe-app1 .button { ... }`).

**Example:**
```javascript
// 1. CSS Modules
import styles from './Button.module.css';
const Btn = () => <button className={styles.primary}>Click</button>;

// 2. Shadow DOM (Web Components approach)
class MyMFE extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style> p { color: red; } </style> <!-- Isolated style -->
      <p>Hello from MFE</p>
    `;
  }
}
```

**Follow-up questions interviewers might ask:**
- How do global styles (like a reset or typography) work with Shadow DOM?
- What are the performance implications of CSS-in-JS in a micro-frontend?

---

## 16. State sharing between micro-frontends

**Difficulty:** Hard

**Answer:**
Sharing state between MFEs should be minimized to maintain loose coupling. However, when necessary, strategies include:

1. **URL/Routing (Best Practice):** Pass state via query parameters or path variables.
2. **Custom Events / PubSub:** Use the browser's `CustomEvent` API for decoupled messaging.
3. **Shared State Library (Zustand, Redux):** A host can expose a global store, or apps can use a shared module. *Risky: tight coupling.*
4. **Local/Session Storage:** Persist data globally, accessible by all MFEs.
5. **React Context:** If using Module Federation, a Host can wrap Remotes in a Context Provider (provided React is a shared singleton).

**Example:**
```javascript
// Using Custom Events (Decoupled)
// MFE 1 (Publisher)
const event = new CustomEvent('ADD_TO_CART', { detail: { productId: 123 } });
window.dispatchEvent(event);

// MFE 2 (Subscriber)
window.addEventListener('ADD_TO_CART', (e) => {
  console.log('Item added:', e.detail.productId);
});
```

**Follow-up questions interviewers might ask:**
- Why is sharing a Redux store across micro-frontends generally considered an anti-pattern?
- How do you ensure type safety when communicating via Custom Events?

---

## 17. Routing in micro-frontend applications

**Difficulty:** Medium

**Answer:**
Routing in an MFE architecture usually involves a two-tier system:
1. **Host/Shell Routing (Global):** The container application determines which MFE to mount based on the primary path (e.g., `/products/*` mounts the Product MFE).
2. **MFE Routing (Local):** Once mounted, the MFE handles its own internal routing (e.g., `/products/123`).

To make this work seamlessly, especially with React Router, the local router often uses a `MemoryRouter` (if embedded) or a standard `BrowserRouter` mapped to a sub-path (`basename`).

**Example:**
```javascript
// Host App (React Router)
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products/*" element={<RemoteProductsApp />} />
  </Routes>
</BrowserRouter>

// Remote App (React Router)
// Needs to know its base path
<BrowserRouter basename="/products">
  <Routes>
    <Route path="/" element={<ProductList />} />
    <Route path="/:id" element={<ProductDetails />} />
  </Routes>
</BrowserRouter>
```

**Follow-up questions interviewers might ask:**
- How do you handle navigation from inside a Remote to a route owned by the Host?
- What happens if both Host and Remote try to manipulate browser history simultaneously?

---

## 18. Communication between micro-frontends (Custom Events, pub/sub, shared state)

**Difficulty:** Medium

**Answer:**
Similar to state sharing, communication must be decoupled.
- **Custom Events:** Standard browser API. Simple, zero dependencies, completely decoupled.
- **Pub/Sub (Event Bus):** A small library (like `mitt` or RxJS) injected into window or shared via Module Federation. Better for complex event orchestration.
- **Props (Module Federation specific):** If importing a remote component directly, the host can pass standard React props or callbacks.

**Example:**
```javascript
// Passing Props (Tight coupling - Host to Remote)
const RemoteCart = React.lazy(() => import('cart/CartWidget'));

function Shell() {
  const [user, setUser] = useState({ id: 1, name: 'John' });
  return <RemoteCart user={user} onCheckout={() => console.log('Checkout')} />;
}
```

**Follow-up questions interviewers might ask:**
- If you use an Event Bus library, how do you ensure all MFEs use the exact same instance of the bus?
- How do you prevent event naming collisions between different teams?

---

## 19. Error boundaries & fault isolation in MFE

**Difficulty:** Medium

**Answer:**
A core benefit of MFE is resilience. If a remote app crashes, it shouldn't take down the host app. In React, this is handled using Error Boundaries.

Every dynamically imported remote component should be wrapped in an Error Boundary. If the network request fails or the remote code throws a runtime error, the boundary catches it and displays a fallback UI, while the rest of the application continues to function.

**Example:**
```javascript
class MFEErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) { return { hasError: true }; }
  
  render() {
    if (this.state.hasError) {
      return <div>Could not load widget. Please try again later.</div>;
    }
    return this.props.children;
  }
}

// Usage in Host
<MFEErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <RemoteWidget />
  </Suspense>
</MFEErrorBoundary>
```

**Follow-up questions interviewers might ask:**
- Can Error Boundaries catch asynchronous errors or errors in event handlers within the remote?
- How do you monitor and log errors that occur in a specific remote MFE?

---

## 20. Deploying micro-frontends independently

**Difficulty:** Hard

**Answer:**
Independent deployment is the ultimate goal of MFE. 
- Each MFE has its own CI/CD pipeline.
- When an MFE is built, its static assets (JS, CSS) and the `remoteEntry.js` manifest are uploaded to a CDN/storage bucket.
- The Host app always requests `remoteEntry.js` from the URL. Because the remote deployment simply overwrote the `remoteEntry.js` file on the CDN, the Host automatically gets the new pointers to the updated JS chunks on the next page refresh.

**Example:**
```yaml
# Conceptual CI/CD for Remote App
stages:
  - build: npm run build
  - deploy: 
      # Uploads chunks (e.g. main.123.js) and overwrites remoteEntry.js
      script: aws s3 sync ./dist s3://my-mfe-bucket/app1/ 
```

**Follow-up questions interviewers might ask:**
- How do you ensure browser caching doesn't serve a stale `remoteEntry.js` file?
- What is a "manifest based" deployment strategy?

---

## 21. Mono-repo vs poly-repo for MFE

**Difficulty:** Medium

**Answer:**
- **Poly-repo (Multi-repo):** Each MFE is in its own Git repository.
  - *Pros:* Ultimate separation of concerns, tight access control, smaller repo size.
  - *Cons:* Hard to share configurations (ESLint, Prettier), testing integration requires deploying, difficult to update shared dependencies across all apps.
- **Mono-repo:** All MFEs live in a single Git repository, managed by tools like Nx, Lerna, or Turborepo.
  - *Pros:* Easy to share code (design systems, utils), unified configuration, atomic commits across boundaries, simplified local development.
  - *Cons:* Repo size grows, CI/CD can become complex (needs to detect which apps changed to avoid building everything).

**Example:**
```text
// Monorepo structure (e.g., using Nx or Turborepo)
apps/
  host-app/
  cart-mfe/
  catalog-mfe/
packages/
  ui-components/  <-- Shared easily
  eslint-config/
```

**Follow-up questions interviewers might ask:**
- Which setup do you prefer and why?
- How does a tool like Turborepo speed up monorepo builds?

---

## 22. Design system / shared component library across MFEs

**Difficulty:** Medium

**Answer:**
To maintain a consistent UI/UX, MFEs should use a shared component library.
- **As an NPM Package:** Publish the UI library to a registry. MFEs install it. To avoid bloat, this library MUST support tree-shaking, and the Host should ideally share it via Module Federation so it's not downloaded multiple times.
- **As a Remote MFE:** Expose UI components directly via Module Federation. (Less common, usually better as a shared NPM library for strong typing and version control).

**Example:**
```javascript
// Module federation config to share the UI library
shared: {
  '@my-org/design-system': { 
    singleton: true, 
    requiredVersion: '^1.0.0' 
  },
  react: { singleton: true }
}
```

**Follow-up questions interviewers might ask:**
- How do you handle major breaking changes in the design system when you have 10 different MFEs?
- What are the benefits of using a tool like Storybook for this?

---

## 23. Authentication & authorization across micro-frontends

**Difficulty:** Hard

**Answer:**
Authentication should almost always be handled by the Host (container) application.
1. The Host authenticates the user and obtains a token (e.g., JWT).
2. The Host passes this token or user state to the Remotes.
3. Remotes use this token to make API calls to backend microservices.

Ways to pass the token:
- Storing it in `localStorage` or `sessionStorage` (accessible to all apps on the same domain).
- Passing it as a prop (if using component composition).
- Setting it as an HTTP Cookie (HttpOnly secure cookies are safest for APIs).

**Example:**
```javascript
// Host authenticates and saves to session storage
sessionStorage.setItem('jwt', token);

// Remote reads the token for API calls
const token = sessionStorage.getItem('jwt');
fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` }});
```

**Follow-up questions interviewers might ask:**
- If the token expires, which application is responsible for refreshing it?
- Why is an HttpOnly cookie often preferred over localStorage for JWTs?

---

## 24. Performance considerations in MFE (bundle size, loading strategies)

**Difficulty:** Medium

**Answer:**
MFEs can easily lead to performance degradation if not managed correctly.
- **Dependency Duplication:** If `react` or `lodash` isn't properly shared, the user downloads them multiple times. Use Module Federation `shared` array.
- **Network Waterfall:** Loading the host, which loads the remote entry, which then requests chunks. Mitigation: prefetch remote entries using `<link rel="prefetch">` or Server-Side Rendering.
- **CSS Bloat:** Duplicate global styles. Mitigation: Strict CSS modularization.

**Example:**
```html
<!-- Prefetching a remote entry in the Host's index.html -->
<link rel="prefetch" href="http://localhost:3001/remoteEntry.js">
```

**Follow-up questions interviewers might ask:**
- How can you analyze the bundle size of a Webpack federated application?
- What is the performance impact of setting `eager: true` on shared dependencies?

---

## 25. Webpack Dev Server & HMR (Hot Module Replacement)

**Difficulty:** Easy

**Answer:**
Webpack Dev Server (WDS) provides a local server with live reloading.
HMR is a feature that exchanges, adds, or removes modules while an application is running, without a full reload. This retains application state.

In React, this is powered by React Refresh, which allows components to update their rendering logic while keeping their `useState` data intact.

**Example:**
```javascript
// webpack.config.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  devServer: {
    port: 3000,
    hot: true, // Enables HMR
    historyApiFallback: true, // Crucial for React Router (SPA routing)
  },
  plugins: [new ReactRefreshWebpackPlugin()]
};
```

**Follow-up questions interviewers might ask:**
- Why do you need `historyApiFallback` in SPA development?
- What happens if HMR fails to update a module?

---

## 26. Source maps configuration

**Difficulty:** Easy

**Answer:**
Source maps map the minified/transpiled code back to the original source code, allowing for easier debugging in the browser dev tools.

In Webpack, this is controlled by the `devtool` property.
- Development: `eval-source-map` (fast, high quality)
- Production: `source-map` (creates a separate `.map` file) or `none` (if you want to hide source code from users).

**Example:**
```javascript
module.exports = (env, argv) => ({
  // Use inline source maps in dev, separate files in prod
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
});
```

**Follow-up questions interviewers might ask:**
- Why wouldn't you use `eval-source-map` in production?
- How do source maps impact build times?

---

## 27. Environment-specific builds (dev, staging, prod)

**Difficulty:** Medium

**Answer:**
Build tools use environment variables to optimize code (e.g., stripping out `console.log` or React dev warnings in prod) and to configure API endpoints.

In Webpack, you use `DefinePlugin` or `EnvironmentPlugin`. In Vite, you use `.env` files and the `import.meta.env` object.

**Example:**
```javascript
// Webpack setup
const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost/api'),
    }),
  ],
};

// Application code
fetch(process.env.API_URL + '/users');
```

**Follow-up questions interviewers might ask:**
- Why must you `JSON.stringify` values in Webpack's DefinePlugin?
- How does Vite expose environment variables to the client to prevent accidental leaking of secrets?

---

## 28. Babel vs SWC vs esbuild — transpiler comparison

**Difficulty:** Medium

**Answer:**
- **Babel:** Written in JS. The industry standard for years. Highly pluggable, supports polyfills easily. Very slow compared to newer tools.
- **esbuild:** Written in Go. Extremely fast bundler and minifier. Doesn't support type checking (just strips TS) and has limited support for older browser polyfills. Used internally by Vite.
- **SWC:** Written in Rust. Designed as a direct drop-in replacement for Babel. Massively faster than Babel. Used by Next.js and Turbopack.

**Example:**
```javascript
// Instead of babel-loader in Webpack, you can swap to swc-loader for speed
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'swc-loader', // Replaces babel-loader
        exclude: /node_modules/,
      },
    ],
  },
};
```

**Follow-up questions interviewers might ask:**
- If esbuild and SWC are so fast, why do people still use Babel?
- Does esbuild perform TypeScript type checking?

---

## 29. Asset optimization (images, fonts, SVGs) in build pipelines

**Difficulty:** Easy

**Answer:**
Optimizing assets reduces the bundle size and improves load times.
- **Images:** Compress images, convert to WebP, or inline small images as base64 URIs to save network requests.
- **SVGs:** Can be imported as raw strings, URLs, or directly as React Components (via `@svgr/webpack`).
- **Fonts:** Preload critical fonts, subset fonts (remove unused characters).

**Example:**
```javascript
// Webpack 5 Asset Modules (replaces file-loader/url-loader)
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset', // Automatically chooses between data URI (inline) or separate file based on size
        parser: { dataUrlCondition: { maxSize: 8 * 1024 } } // 8kb
      },
    ],
  },
};
```

**Follow-up questions interviewers might ask:**
- What is a Base64 encoded image and when should you use it?
- How does Vite handle static asset imports compared to Webpack 5?

---

## 30. Migrating from monolith SPA to micro-frontend — strategy & pitfalls

**Difficulty:** Hard

**Answer:**
Migration should be incremental (Strangler Fig pattern).
**Strategy:**
1. Setup a host container that initially loads the existing monolith as one giant "remote".
2. Identify a decoupled domain (e.g., a Settings page or a specific route).
3. Extract that domain into a new MFE repository.
4. Update the Host router to send traffic for that domain to the new MFE, while routing everything else to the monolith.
5. Repeat until the monolith is gone.

**Pitfalls:**
- Underestimating the complexity of CI/CD and deployment.
- State coupling: finding out the "decoupled" route actually deeply relies on the monolith's Redux store.
- CSS collisions when running the old monolith alongside the new MFE.

**Example:**
```javascript
// Host Router during migration
<Routes>
  {/* New extracted micro-frontend */}
  <Route path="/settings/*" element={<NewSettingsMFE />} />
  
  {/* Fallback to the legacy monolith for all other routes */}
  <Route path="*" element={<LegacyMonolithMFE />} />
</Routes>
```

**Follow-up questions interviewers might ask:**
- How do you handle authentication during this migration phase?
- How do you convince business stakeholders to invest time in this migration?
