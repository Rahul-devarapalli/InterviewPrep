## Table of Contents
1. [What is CI/CD](#1-what-is-cicd)
2. [GitHub Actions fundamentals](#2-github-actions-fundamentals)
3. [GitHub Actions — React CI pipeline](#3-github-actions--react-ci-pipeline)
4. [GitHub Actions — caching](#4-github-actions--caching)
5. [GitHub Actions — secrets management](#5-github-actions--secrets-management)
6. [GitHub Actions — matrix builds](#6-github-actions--matrix-builds)
7. [Jenkins fundamentals](#7-jenkins-fundamentals)
8. [Jenkins Pipeline (Declarative vs Scripted)](#8-jenkins-pipeline-declarative-vs-scripted)
9. [Jenkins for frontend — Jenkinsfile](#9-jenkins-for-frontend--jenkinsfile)
10. [Jenkins vs GitHub Actions](#10-jenkins-vs-github-actions-comparison)
11. [Docker basics](#11-docker-basics)
12. [Docker multi-stage builds](#12-docker-multi-stage-builds-for-react)
13. [Web Vitals — LCP, FID/INP, CLS](#13-web-vitals--lcp-fidinp-cls)
14. [Core Web Vitals monitoring](#14-core-web-vitals-monitoring-with-web-vitals)
15. [Sentry — error tracking setup](#15-sentry--error-tracking-setup-for-react-apps)
16. [Sentry — source maps and releases](#16-sentry--source-maps-release-tracking-performance-monitoring)
17. [Lighthouse CI](#17-lighthouse-ci--automated-performance-auditing-in-pipelines)
18. [Application monitoring](#18-application-monitoring--metrics-logging-alerting-for-frontend)
19. [Nginx configuration for SPA](#19-nginx-configuration-for-spareact-apps)
20. [Environment management](#20-environment-management-dev-staging-production)
21. [Deployment strategies](#21-deployment-strategies--blue-green-canary-rolling-updates)
22. [CDN deployment](#22-cdn-deployment--static-assets-cache-invalidation)
23. [Git branching strategies](#23-git-branching-strategies--gitflow-trunk-based-development)
24. [Code quality gates](#24-code-quality-gates--eslint-prettier-husky-pre-commit-hooks)
25. [Semantic versioning](#25-semantic-versioning--changelog-automation)
26. [npm/yarn workspaces & monorepo CI](#26-npmyarn-workspaces--monorepo-ci-strategies)
27. [Infrastructure as Code basics](#27-infrastructure-as-code-basics-for-frontend-devs)
28. [SSL/TLS & HTTPS](#28-ssltls--https)
29. [Security scanning in CI](#29-security-scanning-in-ci--npm-audit-snyk-dependabot)
30. [Observability for frontend](#30-observability-for-frontend--rum-synthetic-monitoring-error-budgets)

---

## 1. What is CI/CD

**Difficulty:** Easy

**Answer:**
CI/CD stands for Continuous Integration and Continuous Deployment (or Delivery). 
- **Continuous Integration (CI):** The practice of automating the integration of code changes from multiple contributors into a single software project. It involves automatically building, testing, and linting the code whenever a new commit is pushed.
- **Continuous Delivery (CD):** Automates the release process so that the software can be deployed to production reliably at any time.
- **Continuous Deployment (CD):** Goes one step further by automatically deploying every change that passes the automated tests to production without manual intervention.

**Benefits:** Faster release cycles, reduced manual errors, immediate feedback on code changes, and improved developer productivity.

**Example:**
N/A (Conceptual)

**Follow-up questions interviewers might ask:**
- What is the difference between Continuous Delivery and Continuous Deployment?
- How would you explain CI/CD to a non-technical stakeholder?

---

## 2. GitHub Actions fundamentals

**Difficulty:** Easy

**Answer:**
GitHub Actions is a CI/CD platform integrated into GitHub.
- **Workflows:** A configurable automated process made up of one or more jobs, defined by a YAML file in the `.github/workflows` directory.
- **Jobs:** A set of steps in a workflow that execute on the same runner. Jobs run in parallel by default but can be configured to run sequentially.
- **Steps:** An individual task that can run commands in a job, or use an action (a reusable extension).
- **Triggers:** Events that cause the workflow to run (e.g., `push`, `pull_request`, `schedule`).

**Example:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run a one-line script
        run: echo Hello, world!
```

**Follow-up questions interviewers might ask:**
- How do you trigger a workflow manually? (A: `workflow_dispatch`)
- Can jobs share data between each other? (A: Yes, using artifacts)

---

## 3. GitHub Actions — React CI pipeline

**Difficulty:** Medium

**Answer:**
A standard CI pipeline for a React application typically involves checking out the code, setting up Node.js, installing dependencies, running a linter, running unit tests, and finally building the production bundle.

**Example:**
```yaml
name: React CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Linter
        run: npm run lint
        
      - name: Run Tests
        run: npm run test -- --ci
        
      - name: Build Application
        run: npm run build
```

**Follow-up questions interviewers might ask:**
- Why use `npm ci` instead of `npm install` in a CI environment?
- How would you handle deploying the built artifact after this workflow succeeds?

---

## 4. GitHub Actions — caching

**Difficulty:** Medium

**Answer:**
Caching dependencies speeds up workflow execution times by avoiding downloading the same packages repeatedly. In GitHub Actions, you can cache `node_modules` or global caches like `~/.npm` using `actions/cache` or natively via the `actions/setup-node` action.

**Example:**
```yaml
# Using actions/setup-node (Recommended approach)
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm' # Automatically caches ~/.npm and restores it

# Manual caching (if needed for custom paths)
- name: Cache node modules
  uses: actions/cache@v3
  env:
    cache-name: cache-node-modules
  with:
    path: ~/.npm
    key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-build-${{ env.cache-name }}-
```

**Follow-up questions interviewers might ask:**
- How do you cache build artifacts (like a Next.js `.next` folder)?
- What happens if the cache key doesn't match exactly?

---

## 5. GitHub Actions — secrets management

**Difficulty:** Medium

**Answer:**
Secrets are encrypted environment variables used to store sensitive information, such as API keys, cloud credentials, or access tokens. They are configured in the repository settings and accessed in workflows via the `${{ secrets.SECRET_NAME }}` syntax.

**Example:**
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        env:
          API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
          AWS_ACCESS_KEY: ${{ secrets.AWS_ACCESS_KEY_ID }}
        run: |
          echo "Deploying..."
          ./deploy-script.sh
```

**Follow-up questions interviewers might ask:**
- How do you prevent secrets from being printed in workflow logs? (A: GitHub masks them automatically).
- Can you use secrets in forks? (A: By default, secrets are not passed to pull requests from forks for security reasons).

---

## 6. GitHub Actions — matrix builds

**Difficulty:** Medium

**Answer:**
A matrix build lets you run a job multiple times with different combinations of variables. This is especially useful for cross-browser testing or testing against multiple versions of Node.js.

**Example:**
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]
        os: [ubuntu-latest, windows-latest]
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }} on ${{ matrix.os }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

**Follow-up questions interviewers might ask:**
- If one matrix job fails, do the others continue? (A: `fail-fast: true` by default stops others; you can set it to `false`).
- Can you exclude specific combinations from a matrix?

---

## 7. Jenkins fundamentals

**Difficulty:** Easy

**Answer:**
Jenkins is an open-source automation server used for CI/CD.
- **Pipeline:** A set of instructions (often written in a `Jenkinsfile`) that define the entire build process.
- **Stages:** Logical divisions in a pipeline (e.g., Build, Test, Deploy).
- **Agents/Nodes:** The machines or containers where Jenkins executes the pipeline jobs.
- **Plugins:** Extensions that integrate Jenkins with other tools (e.g., Git, Docker, Slack).

**Example:**
N/A (Conceptual)

**Follow-up questions interviewers might ask:**
- What is the master-agent (controller-agent) architecture in Jenkins?
- How do you trigger Jenkins builds automatically on GitHub pushes?

---

## 8. Jenkins Pipeline (Declarative vs Scripted)

**Difficulty:** Medium

**Answer:**
Jenkins pipelines can be written in two syntaxes:
- **Declarative Pipeline:** A more recent, structured syntax that is easier to read and write. It enforces a strict structure (`pipeline`, `agent`, `stages`, `steps`).
- **Scripted Pipeline:** Older syntax based on Groovy. It offers maximum flexibility but lacks the rigid structure of Declarative pipelines, making it harder to maintain for complex flows.

**Example:**
```groovy
// Declarative Pipeline Example
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
    }
}
```

**Follow-up questions interviewers might ask:**
- Why would you choose Declarative over Scripted?
- How do you handle failure notifications in a Declarative pipeline? (A: Using the `post` block).

---

## 9. Jenkins for frontend — Jenkinsfile

**Difficulty:** Medium

**Answer:**
A Jenkinsfile for a React application defines stages for installing dependencies, checking code quality, testing, and building the static assets.

**Example:**
```groovy
pipeline {
    agent {
        docker { image 'node:18-alpine' }
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test -- --passWithNoTests'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'build/**/*', fingerprint: true
        }
    }
}
```

**Follow-up questions interviewers might ask:**
- How does using a Docker agent benefit the Jenkins build?
- How do you publish the build artifact to an S3 bucket from Jenkins?

---

## 10. Jenkins vs GitHub Actions

**Difficulty:** Medium

**Answer:**
- **Hosting:** Jenkins is traditionally self-hosted (requires maintenance), while GitHub Actions is fully managed SaaS (though self-hosted runners are supported).
- **Configuration:** Jenkins uses Groovy (`Jenkinsfile`), whereas GitHub Actions uses YAML.
- **Integration:** GitHub Actions is tightly integrated with GitHub repos; Jenkins requires webhooks and plugins to integrate with Git providers.
- **Ecosystem:** Jenkins has thousands of plugins, while Actions relies on the GitHub Marketplace (community actions).

**Example:**
N/A (Conceptual)

**Follow-up questions interviewers might ask:**
- When would an enterprise choose Jenkins over GitHub Actions?
- Is it possible to migrate from Jenkins to GitHub Actions easily?

---

## 11. Docker basics

**Difficulty:** Easy

**Answer:**
Docker packages an application and its dependencies into a standardized unit called a container.
- **Dockerfile:** A text document containing instructions to build an image.
- **Image:** A read-only template with instructions for creating a container.
- **Container:** A runnable instance of an image.

For frontend, Docker ensures the build environment is consistent across all developer machines and CI servers.

**Example:**
```dockerfile
# Simple Dockerfile for a React build environment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

**Follow-up questions interviewers might ask:**
- What is the difference between an image and a container?
- Why use `alpine` versions of Node images?

---

## 12. Docker multi-stage builds

**Difficulty:** Hard

**Answer:**
Multi-stage builds allow you to use multiple `FROM` statements in a single Dockerfile. For frontend apps, this means you can compile the app in a large Node environment, and then copy *only* the compiled static files into a small web server image (like Nginx), keeping the final image tiny and secure.

**Example:**
```dockerfile
# Stage 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built assets from 'build' stage
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Follow-up questions interviewers might ask:**
- How does multi-stage building reduce the attack surface of an application?
- How do you pass build-time environment variables in a multi-stage build?

---

## 13. Web Vitals — LCP, FID/INP, CLS

**Difficulty:** Medium

**Answer:**
Core Web Vitals are user-centric metrics introduced by Google to measure perceived web performance.
- **LCP (Largest Contentful Paint):** Measures loading performance. How long it takes to render the largest visible image or text block. Target: < 2.5s.
- **FID (First Input Delay) / INP (Interaction to Next Paint):** Measures interactivity and responsiveness. INP is replacing FID and measures overall responsiveness to user interactions.
- **CLS (Cumulative Layout Shift):** Measures visual stability. It quantifies unexpected layout shifts. Target: < 0.1.

**Example:**
Optimizations:
- LCP: Preload critical images, optimize fonts, reduce server response times.
- CLS: Add `width` and `height` attributes to images, reserve space for ads.

**Follow-up questions interviewers might ask:**
- How can a heavy JavaScript bundle affect INP?
- What tools can you use to measure these locally and in production?

---

## 14. Core Web Vitals monitoring

**Difficulty:** Medium

**Answer:**
You can monitor Core Web Vitals in a React app using the `web-vitals` library. It allows you to measure metrics in real-time and send them to an analytics endpoint (like Google Analytics, Sentry, or custom endpoints).

**Example:**
```javascript
import { onCLS, onFID, onLCP, onINP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // Use navigator.sendBeacon or fetch to send data
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true });
  }
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
```

**Follow-up questions interviewers might ask:**
- Why use `navigator.sendBeacon` over a standard `fetch` call?
- What is RUM (Real User Monitoring) vs Synthetic Monitoring?

---

## 15. Sentry — error tracking setup

**Difficulty:** Easy

**Answer:**
Sentry is an error tracking and performance monitoring tool. Setting it up in a React app involves installing the SDK and initializing it at the entry point of your application before rendering the root component.

**Example:**
```javascript
import * as Sentry from "@sentry/react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0,
});

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

**Follow-up questions interviewers might ask:**
- What is an Error Boundary in React, and how does Sentry integrate with it?
- Why should you lower `tracesSampleRate` in production?

---

## 16. Sentry — source maps and releases

**Difficulty:** Hard

**Answer:**
In production, React code is minified. To see readable stack traces in Sentry, you must upload Source Maps. This is typically automated in CI/CD using the Sentry CLI or Sentry webpack/Vite plugins to associate a build with a specific "Release" version.

**Example:**
Using `@sentry/webpack-plugin` in `webpack.config.js`:
```javascript
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

module.exports = {
  // ... other config
  devtool: "source-map",
  plugins: [
    sentryWebpackPlugin({
      org: "my-org",
      project: "my-react-app",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
};
```

**Follow-up questions interviewers might ask:**
- How do you ensure source maps are uploaded to Sentry but not served to public users?
- What is the benefit of associating errors with a specific release?

---

## 17. Lighthouse CI

**Difficulty:** Medium

**Answer:**
Lighthouse CI (LHCI) automates running Google Lighthouse audits against your web app in a CI/CD pipeline. It prevents performance regressions by failing the build if metrics drop below configured thresholds.

**Example:**
`lighthouserc.js`:
```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './build',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```
Run in GitHub Actions with `lhci autorun`.

**Follow-up questions interviewers might ask:**
- How do you test authenticated routes with Lighthouse CI?
- Can Lighthouse CI run against a live staging URL instead of a static build?

---

## 18. Application monitoring

**Difficulty:** Medium

**Answer:**
Frontend monitoring consists of:
- **Error Tracking:** Capturing JS exceptions (e.g., Sentry, Bugsnag).
- **Performance Metrics:** Web Vitals, API response times (e.g., Datadog, New Relic).
- **User Behavior/Analytics:** Tracking clicks, navigation, funnels (e.g., Amplitude, Google Analytics).
- **Logging:** Structured logs sent from client to server (rarely used for frontend, mostly for edge cases).

**Example:**
N/A (Conceptual)

**Follow-up questions interviewers might ask:**
- What are "Error Budgets"?
- How do you handle alerts if an API endpoint suddenly returns 500s for all users?

---

## 19. Nginx configuration for SPA

**Difficulty:** Medium

**Answer:**
Single Page Applications (SPAs) like React handle routing client-side. When hosting an SPA on Nginx, you must configure the server to redirect all requests to `index.html` so that direct navigation to a route (like `/about`) doesn't return a 404 from the server.

**Example:**
```nginx
server {
    listen 80;
    server_name myapp.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        # Try to serve file directly, fallback to index.html
        try_files $uri $uri/ /index.html;
    }

    # Optional: Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

**Follow-up questions interviewers might ask:**
- Why should `index.html` *never* be cached by the browser?
- What does the `immutable` directive in Cache-Control do?

---

## 20. Environment management

**Difficulty:** Easy

**Answer:**
Managing environments (Dev, Staging, Prod) ensures that code is tested properly before reaching users.
- **.env files:** Used to inject environment-specific variables at build time (e.g., `REACT_APP_API_URL`).
- **Feature Flags:** A technique to enable/disable features dynamically without redeploying code. Useful for trunk-based development.

**Example:**
```env
# .env.development
REACT_APP_API_URL=http://localhost:3000/api

# .env.production
REACT_APP_API_URL=https://api.myapp.com
```

**Follow-up questions interviewers might ask:**
- Can you read `REACT_APP_*` variables at runtime without rebuilding the app? (A: No, Create React App embeds them at build time).
- What tool would you use for Feature Flags? (e.g., LaunchDarkly, Optimizely).

---

## 21. Deployment strategies

**Difficulty:** Hard

**Answer:**
- **Blue-Green Deployment:** Two identical environments. Traffic routes to Blue. Deploy new version to Green, test, then switch router to send traffic to Green. Zero downtime.
- **Canary Release:** Deploy new version to a small subset of users (e.g., 5%). Monitor errors. Gradually increase traffic to 100%.
- **Rolling Updates:** Replace old instances with new ones incrementally.

**Example:**
N/A (Conceptual / Infrastructure specific)

**Follow-up questions interviewers might ask:**
- How does caching affect Blue-Green deployments in a frontend application?
- How do you route 5% of traffic in a Canary deployment?

---

## 22. CDN deployment

**Difficulty:** Medium

**Answer:**
A Content Delivery Network (CDN) distributes static assets (HTML, JS, CSS, images) across edge servers globally.
Deploying a frontend to a CDN involves uploading assets to storage (like AWS S3) and invalidating the CDN cache (like CloudFront) to serve the latest version.

**Example:**
Deploying to AWS via GitHub Actions:
```yaml
- name: Deploy to S3
  run: aws s3 sync build/ s3://my-bucket --delete

- name: Invalidate CloudFront
  run: aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

**Follow-up questions interviewers might ask:**
- Why is it better to serve JS/CSS with content hashes in their filenames?
- If filenames have hashes, do you still need to invalidate them on the CDN?

---

## 23. Git branching strategies

**Difficulty:** Medium

**Answer:**
- **GitFlow:** Strict branching model with `master`, `develop`, `feature/*`, `release/*`, and `hotfix/*` branches. Good for scheduled releases but can create merge hell.
- **Trunk-Based Development:** Developers merge code directly into the main branch (trunk) multiple times a day. Requires strong CI/CD and feature flags. Preferred in DevOps for continuous delivery.

**Example:**
N/A

**Follow-up questions interviewers might ask:**
- What are the downsides of long-lived feature branches?
- How do you manage incomplete features in trunk-based development?

---

## 24. Code quality gates

**Difficulty:** Medium

**Answer:**
Quality gates prevent bad code from being committed or deployed.
- **Pre-commit hooks:** Tools like `Husky` and `lint-staged` run formatters (Prettier) and linters (ESLint) locally before a commit is created.
- **CI Gates:** The CI pipeline runs these checks again. If they fail, the PR cannot be merged.

**Example:**
`package.json` with Husky:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Follow-up questions interviewers might ask:**
- If you have CI checks, why do you need Husky pre-commit hooks?
- How can you bypass a pre-commit hook? (A: `git commit --no-verify`)

---

## 25. Semantic versioning

**Difficulty:** Easy

**Answer:**
Semantic Versioning (SemVer) uses `MAJOR.MINOR.PATCH` (e.g., `1.4.2`).
- **MAJOR:** Incompatible API changes.
- **MINOR:** New functionality, backwards compatible.
- **PATCH:** Backwards compatible bug fixes.
Tools like `semantic-release` can parse commit messages (using Conventional Commits like `feat:` or `fix:`) to automatically determine the version bump, generate changelogs, and publish releases.

**Example:**
Commit message: `fix: resolved button alignment` -> Bumps Patch.
Commit message: `feat: added dark mode` -> Bumps Minor.

**Follow-up questions interviewers might ask:**
- What happens if a commit message says `BREAKING CHANGE: ...`?
- How do you enforce Conventional Commits? (A: `commitlint`)

---

## 26. npm workspaces & monorepo CI

**Difficulty:** Hard

**Answer:**
Monorepos store multiple projects in one repository. npm/yarn workspaces manage dependencies across them efficiently.
In CI, running `npm run build` on all projects is slow. Tools like **Nx** or **Turborepo** analyze the dependency graph and git history to only test and build projects affected by a PR, and cache the outputs.

**Example:**
Turborepo `turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    }
  }
}
```

**Follow-up questions interviewers might ask:**
- What is "Remote Caching" in monorepo tools?
- Why use a monorepo over multi-repo?

---

## 27. Infrastructure as Code basics

**Difficulty:** Hard

**Answer:**
Infrastructure as Code (IaC) manages cloud resources using machine-readable definition files instead of manual UI clicks.
For frontend, this means defining your S3 bucket, CloudFront distribution, or Vercel project configuration using tools like Terraform or Pulumi.

**Example:**
Terraform setting up an S3 bucket for a static site:
```hcl
resource "aws_s3_bucket" "website" {
  bucket = "my-react-app-bucket"
}

resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }
}
```

**Follow-up questions interviewers might ask:**
- What is terraform state?
- Why should a frontend developer care about IaC?

---

## 28. SSL/TLS & HTTPS

**Difficulty:** Medium

**Answer:**
HTTPS encrypts data between the client and server using TLS/SSL certificates.
- **Mixed Content:** Occurs when an initial HTML document is loaded securely over HTTPS, but other resources (like images or APIs) are loaded over insecure HTTP. Browsers block active mixed content.
- **HSTS (HTTP Strict Transport Security):** A header telling browsers to ONLY access the site via HTTPS.

**Example:**
N/A

**Follow-up questions interviewers might ask:**
- How do you get a free SSL certificate? (A: Let's Encrypt, AWS ACM).
- What happens when an SSL certificate expires?

---

## 29. Security scanning in CI

**Difficulty:** Medium

**Answer:**
Automated security scanning identifies vulnerabilities in code and dependencies.
- **npm audit / Dependabot:** Checks for known vulnerabilities in `package.json` dependencies.
- **Snyk / SonarQube:** Performs Static Application Security Testing (SAST) to find vulnerable code patterns and dependency issues.

**Example:**
GitHub Actions running audit:
```yaml
- name: Check for vulnerabilities
  run: npm audit --audit-level=high
```

**Follow-up questions interviewers might ask:**
- What should you do if an older package has a high vulnerability but no updates available?
- What are secret scanning tools used for?

---

## 30. Observability for frontend

**Difficulty:** Hard

**Answer:**
Observability goes beyond simple monitoring by allowing teams to understand the internal state of an application based on external outputs.
- **RUM (Real User Monitoring):** Capturing actual user sessions, clicks, and load times.
- **Synthetic Monitoring:** Scripts running on a schedule in a clean environment (like a headless browser) to ensure critical flows (e.g., login, checkout) are always up.

**Example:**
A Datadog Synthetic test script might navigate to the page, wait for the login button, enter credentials, and assert the dashboard loads within 3 seconds.

**Follow-up questions interviewers might ask:**
- How does Synthetic Monitoring differ from End-to-End (E2E) testing in CI?
- What is an Apdex score?
