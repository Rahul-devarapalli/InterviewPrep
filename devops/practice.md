# DevOps & CI/CD — Practice Questions

Test your knowledge on DevOps, CI/CD, Docker, and Monitoring. These questions are ordered from easiest to hardest. Try to answer them out loud or on paper before checking your notes!

---

### 1. The CI/CD Pipeline Flow (Easy)
You push a new branch to GitHub. Describe the standard steps a CI/CD pipeline takes to get a React application from that push to being deployed as a static site.
*Hint: Think about checkout, node modules, validation, and artifacts.*

### 2. GitHub Actions Secrets (Easy)
Your React app requires an API key for a third-party service during the build process, but you don't want to commit it to the repository. How do you securely provide this to your GitHub Actions workflow?
*Hint: Where do you store it in GitHub, and how do you reference it in the YAML file?*

### 3. Caching node_modules (Medium)
Your Jenkins pipeline takes 5 minutes to run `npm install` on every build. How can you optimize this process to speed up subsequent builds?
*Hint: Think about what doesn't change often and how CI systems handle temporary files across builds.*

### 4. SPA Nginx Routing (Medium)
You deployed your React application to a server using Nginx. When a user clicks a link to navigate to `/dashboard`, it works perfectly. But if they refresh the page on `/dashboard`, they get a `404 Not Found` error. What causes this and how do you fix the Nginx config?
*Hint: Who handles the routing—the server or the client? What file should the server fallback to?*

### 5. Multi-stage Docker Builds (Medium)
You wrote a Dockerfile for a Next.js app that simply installs Node, copies files, and runs `npm run build` and `npm start`. The resulting image is 1.5GB. How can you drastically reduce the size of the final image?
*Hint: Can you separate the environment needed to build the app from the environment needed to run it?*

### 6. Blue-Green vs Canary Deployments (Medium)
Your team is discussing deployment strategies. The Product Manager wants to ensure that if a new release has a critical bug, only a small fraction of users are affected. The QA lead prefers an environment where they can test the new version safely in production before any real users see it. Which deployment strategy suits each requirement?
*Hint: Traffic splitting vs identical environment switching.*

### 7. Sentry & Source Maps (Hard)
You have Sentry set up in production, but all error stack traces point to a minified file (e.g., `main.8f2b3a.js:1:500`) with variable names like `a` and `b`. How do you fix this so you can see the original React component code in the Sentry dashboard?
*Hint: What files map minified code to original code, and how does Sentry get access to them securely?*

### 8. Core Web Vitals Optimization (Hard)
Your Next.js application has a poor LCP (Largest Contentful Paint) score because the hero image loads slowly. It also has a poor CLS (Cumulative Layout Shift) score because the text below the image jumps down once the image loads. How do you resolve both issues?
*Hint: Think about `preload`, `priority` hints, and reserving space in CSS.*

### 9. Monorepo CI Strategy (Hard)
You have a monorepo containing 5 different React applications and 3 shared UI libraries. Every time a PR is opened, the CI pipeline builds and tests all 8 projects, which takes 30 minutes. If a PR only changes code in `App 1`, how can you optimize the CI to skip unnecessary work?
*Hint: Think about tools like Nx or Turborepo, dependency graphs, and what "affected" means.*

### 10. Lighthouse CI Gates (Hard)
You want to prevent any pull requests from being merged if they degrade the application's performance. How would you automate this check in GitHub Actions?
*Hint: How do you serve the build temporarily in CI, what tool runs the audit, and how do you assert the score?*
