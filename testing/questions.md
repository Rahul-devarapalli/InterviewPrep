# Testing (Jest, Playwright & RTL) Q&A

## Table of Contents
1. [Testing pyramid — unit, integration, E2E, when to use which](#1-testing-pyramid)
2. [Jest fundamentals — describe, it, expect, matchers](#2-jest-fundamentals)
3. [Jest mocking — jest.fn(), jest.mock(), jest.spyOn()](#3-jest-mocking)
4. [Jest async testing — async/await, done callback, resolves/rejects](#4-jest-async-testing)
5. [Jest configuration — transform, moduleNameMapper, coverage thresholds](#5-jest-configuration)
6. [Vitest — how it compares to Jest, why it's faster, Vite integration](#6-vitest)
7. [Vitest configuration & migration from Jest](#7-vitest-configuration)
8. [React Testing Library (RTL) philosophy — testing behavior, not implementation](#8-rtl-philosophy)
9. [RTL core APIs — render, screen, getBy/queryBy/findBy queries](#9-rtl-core-apis)
10. [RTL user interactions — userEvent vs fireEvent](#10-rtl-user-interactions)
11. [Testing React hooks with RTL (renderHook)](#11-testing-react-hooks)
12. [Testing async components — waitFor, findBy queries](#12-testing-async-components)
13. [Testing forms & controlled inputs with RTL](#13-testing-forms)
14. [Testing Context providers & Redux store in RTL](#14-testing-context)
15. [Mocking API calls in tests — MSW (Mock Service Worker)](#15-mocking-api-calls-msw)
16. [Snapshot testing — when to use, when to avoid](#16-snapshot-testing)
17. [Playwright fundamentals — browser contexts, pages, locators](#17-playwright-fundamentals)
18. [Playwright selectors — CSS, text, role-based, data-testid](#18-playwright-selectors)
19. [Playwright auto-waiting & assertions](#19-playwright-auto-waiting)
20. [Playwright Page Object Model pattern](#20-playwright-pom)
21. [Playwright fixtures & test hooks (beforeAll, beforeEach)](#21-playwright-fixtures)
22. [Playwright parallel execution & test isolation](#22-playwright-parallel-execution)
23. [Playwright visual regression testing (screenshots)](#23-playwright-visual-regression)
24. [Playwright API testing capabilities](#24-playwright-api-testing)
25. [Playwright trace viewer & debugging](#25-playwright-trace-viewer)
26. [Playwright CI integration (GitHub Actions, Jenkins)](#26-playwright-ci)
27. [Code coverage — Istanbul/c8, coverage reports, thresholds](#27-code-coverage)
28. [Testing accessibility (a11y) with axe-core & RTL](#28-testing-accessibility)
29. [Testing performance — React Profiler, Lighthouse CI](#29-testing-performance)
30. [Test-Driven Development (TDD) vs Behavior-Driven Development (BDD)](#30-tdd-vs-bdd)

---

## 1. Testing pyramid <a name="1-testing-pyramid"></a>

**Difficulty:** Easy

**Answer:**
The testing pyramid is a concept illustrating the ideal distribution of different types of tests. At the base are **Unit Tests** (fast, highly isolated, cheap, numerous). In the middle are **Integration Tests** (testing combined units or components working together). At the top are **End-to-End (E2E) Tests** (slow, broad scope, simulate real user flows, fewest in number).

**Example:**
```javascript
// Unit: Testing a pure math function
// Integration: Testing a React component with its context and hooks
// E2E: Testing the full login flow in a real browser using Playwright
```

**Follow-up questions interviewers might ask:**
- What happens if you have an inverted testing pyramid (ice cream cone)?
- Where does component testing (like RTL) fit in the pyramid?

---

## 2. Jest fundamentals <a name="2-jest-fundamentals"></a>

**Difficulty:** Easy

**Answer:**
Jest uses `describe` to group related tests into test suites, `it` (or `test`) to define individual test cases, and `expect` with various matchers (`toBe`, `toEqual`, `toBeTruthy`) to assert conditions.

**Example:**
```javascript
describe('Math utilities', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3); // toBe checks referential identity
  });

  it('matches object values', () => {
    const data = { one: 1, two: 2 };
    expect(data).toEqual({ one: 1, two: 2 }); // toEqual checks deep equality
  });
});
```

**Follow-up questions interviewers might ask:**
- What is the difference between `toBe` and `toEqual`?
- How do you skip or run only a specific test?

---

## 3. Jest mocking <a name="3-jest-mocking"></a>

**Difficulty:** Medium

**Answer:**
Mocking replaces real implementations with controllable "dummy" functions.
- `jest.fn()` creates a basic mock function to track calls and return specific values.
- `jest.mock()` mocks an entire module.
- `jest.spyOn()` tracks calls to a method of an existing object without necessarily overriding its implementation.

**Example:**
```javascript
// jest.fn()
const mockCallback = jest.fn(x => 42 + x);
mockCallback(0);
expect(mockCallback).toHaveBeenCalledWith(0);

// jest.spyOn()
const video = { play: () => true };
const spy = jest.spyOn(video, 'play').mockReturnValue(false);
const isPlaying = video.play();
expect(spy).toHaveBeenCalled();
expect(isPlaying).toBe(false);
```

**Follow-up questions interviewers might ask:**
- How do you clear or reset mocks between tests?
- What's the difference between `mockReset`, `mockRestore`, and `mockClear`?

---

## 4. Jest async testing <a name="4-jest-async-testing"></a>

**Difficulty:** Medium

**Answer:**
To test asynchronous code, you can return a Promise, use `async/await`, use the `.resolves`/`.rejects` matchers, or use a `done` callback (though modern code prefers Promises).

**Example:**
```javascript
// Using async/await
it('fetches data successfully', async () => {
  const data = await fetchData();
  expect(data).toEqual('peanut butter');
});

// Using resolves
it('resolves with the right data', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});

// Handling errors
it('tests error with rejects', async () => {
  await expect(fetchError()).rejects.toThrow('error');
});
```

**Follow-up questions interviewers might ask:**
- Why is it important to `return` the Promise or `await` it in Jest tests?
- How would you test a function that uses `setTimeout`? (Hint: fake timers).

---

## 5. Jest configuration <a name="5-jest-configuration"></a>

**Difficulty:** Medium

**Answer:**
Jest is configured via `jest.config.js`. Key options:
- `transform`: Tells Jest how to compile files (e.g., using `babel-jest` or `ts-jest`).
- `moduleNameMapper`: Mocks static assets (CSS, images) or resolves path aliases.
- `coverageThreshold`: Fails the build if test coverage drops below specific percentages.

**Example:**
```javascript
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    }
  }
};
```

**Follow-up questions interviewers might ask:**
- How does `identity-obj-proxy` help with CSS Modules?
- What is `setupFilesAfterEnv` used for?

---

## 6. Vitest <a name="6-vitest"></a>

**Difficulty:** Easy

**Answer:**
Vitest is a blazing fast unit testing framework powered by Vite. It is compatible with Jest's API but doesn't require a separate configuration pipeline (like Babel/Webpack) if you're already using Vite. It shares the `vite.config.js` and transformation pipeline, making it significantly faster and less prone to configuration duplication.

**Example:**
```javascript
import { describe, it, expect } from 'vitest';

describe('suite', () => {
  it('test', () => {
    expect(1).toBe(1);
  });
});
```

**Follow-up questions interviewers might ask:**
- Why is Vitest typically faster than Jest for Vite projects?
- Does Vitest support mocking modules like Jest does?

---

## 7. Vitest configuration & migration <a name="7-vitest-configuration"></a>

**Difficulty:** Medium

**Answer:**
Migrating from Jest to Vitest involves updating dependencies, changing `jest.config.js` to `vite.config.js` (or `vitest.config.js`), and updating global test variables. Vitest requires explicitly importing `describe`, `it`, `expect` unless `globals: true` is configured. `jest.mock` is replaced by `vi.mock`.

**Example:**
```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // allows using describe/it without importing
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
})
```

**Follow-up questions interviewers might ask:**
- How do you handle Jest global variables when migrating to Vitest?
- What test environment is needed for React components in Vitest?

---

## 8. RTL philosophy <a name="8-rtl-philosophy"></a>

**Difficulty:** Easy

**Answer:**
The core philosophy of React Testing Library is: "The more your tests resemble the way your software is used, the more confidence they can give you." Instead of testing implementation details (like component state or lifecycle methods), RTL tests what is rendered to the DOM and how a user interacts with it (clicking buttons, reading text).

**Example:**
```javascript
// Anti-pattern (Enzyme-style):
// expect(wrapper.state('isOpen')).toBe(true);

// RTL-style:
expect(screen.getByText('Dropdown Content')).toBeVisible();
```

**Follow-up questions interviewers might ask:**
- Why should you avoid testing implementation details?
- What is the difference between Enzyme and React Testing Library?

---

## 9. RTL core APIs <a name="9-rtl-core-apis"></a>

**Difficulty:** Medium

**Answer:**
- `render`: Renders a React component into a virtual DOM (JSDOM).
- `screen`: An object that has all the querying methods bound to the `document.body`.
- `getBy...`: Returns the element. Throws an error if not found. Use for elements that *should* exist.
- `queryBy...`: Returns the element or `null`. Use for asserting an element does *not* exist.
- `findBy...`: Returns a Promise. Use for elements that will appear asynchronously.

**Example:**
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

it('renders correctly', async () => {
  render(<MyComponent />);
  
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  
  const lazyElement = await screen.findByText(/loaded/i);
  expect(lazyElement).toBeVisible();
});
```

**Follow-up questions interviewers might ask:**
- What is the recommended query to use first according to RTL docs? (`getByRole`)
- What happens if `getByText` finds multiple matching elements?

---

## 10. RTL user interactions <a name="10-rtl-user-interactions"></a>

**Difficulty:** Medium

**Answer:**
`fireEvent` dispatches DOM events directly. `@testing-library/user-event` is a companion library that simulates actual user interactions more realistically (e.g., triggering `hover`, `focus`, `keydown`, `keyup`, and `click` when typing). `userEvent` is preferred.

**Example:**
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

it('allows the user to login', async () => {
  const user = userEvent.setup();
  render(<Login />);
  
  const input = screen.getByLabelText(/username/i);
  await user.type(input, 'admin'); // Types out 'admin' triggering all events
  
  const button = screen.getByRole('button', { name: /login/i });
  await user.click(button);
});
```

**Follow-up questions interviewers might ask:**
- Why is `userEvent.setup()` recommended over calling `userEvent.click()` directly?
- Can `fireEvent` trigger a `change` event on an input?

---

## 11. Testing React hooks with RTL <a name="11-testing-react-hooks"></a>

**Difficulty:** Medium

**Answer:**
Hooks cannot be called outside of a component. To test them independently, RTL provides `renderHook`. It returns the current state (`result.current`) and allows you to update the hook via actions. For asynchronous hook updates or state changes, wrap the action in `act()`.

**Example:**
```javascript
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}

it('increments count', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

**Follow-up questions interviewers might ask:**
- What does the `act` function do in React testing?
- When would you test a hook directly versus testing the component that uses it?

---

## 12. Testing async components <a name="12-testing-async-components"></a>

**Difficulty:** Hard

**Answer:**
When components fetch data and update state asynchronously, use `findBy` queries or the `waitFor` utility. `findBy` is a wrapper around `getBy` and `waitFor`.

**Example:**
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataFetcher from './DataFetcher';

it('displays data after fetching', async () => {
  render(<DataFetcher />);
  
  // Initially loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Using findBy (preferred for elements that will appear)
  const data = await screen.findByText('Mocked Data Result');
  expect(data).toBeInTheDocument();
  
  // Using waitFor (for asserting other conditions)
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

**Follow-up questions interviewers might ask:**
- What is the default timeout for `findBy` and `waitFor`? (1000ms)
- What causes the "Warning: An update to Component inside a test was not wrapped in act(...)" error?

---

## 13. Testing forms & controlled inputs <a name="13-testing-forms"></a>

**Difficulty:** Medium

**Answer:**
Testing forms involves simulating user typing, selection, and form submission. We use `userEvent.type`, `userEvent.selectOptions`, and `userEvent.click`. Assertions check if inputs have the correct values and if the submit handler was called with the correct data.

**Example:**
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

it('submits form data', async () => {
  const mockSubmit = jest.fn();
  const user = userEvent.setup();
  render(<Form onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
});
```

**Follow-up questions interviewers might ask:**
- How do you query a specific input if there is no explicit label?
- How do you verify an input is disabled or required?

---

## 14. Testing Context & Redux in RTL <a name="14-testing-context"></a>

**Difficulty:** Hard

**Answer:**
Components connected to Redux or Context will crash if rendered without their providers. To fix this, wrap the component in the provider during `render`. Often, a custom `render` function is created in test setup to wrap all tested components with necessary providers automatically.

**Example:**
```javascript
// test-utils.js
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from './store';

const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
  const store = createStore(preloadedState);
  return render(<Provider store={store}>{ui}</Provider>);
};

// Component.test.js
it('renders with redux state', () => {
  renderWithProviders(<MyComponent />, {
    preloadedState: { user: { name: 'Alice' } }
  });
  expect(screen.getByText(/Alice/)).toBeInTheDocument();
});
```

**Follow-up questions interviewers might ask:**
- How do you test a component connected to React Router?
- Why might you prefer a custom `render` wrapper over mocking the `useSelector` hook?

---

## 15. Mocking APIs with MSW <a name="15-mocking-api-calls-msw"></a>

**Difficulty:** Hard

**Answer:**
Mock Service Worker (MSW) intercepts network requests at the network level using Service Workers (in browser) or Node's `http` interceptors (in tests). It allows you to define mock responses without altering application code or mocking `fetch`/`axios` directly, making tests highly realistic.

**Example:**
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'John' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('fetches user data', async () => {
  render(<UserProfile />);
  expect(await screen.findByText('John')).toBeInTheDocument();
});
```

**Follow-up questions interviewers might ask:**
- Why is MSW preferred over `jest.mock('axios')`?
- How do you test a failed API response with MSW?

---

## 16. Snapshot testing <a name="16-snapshot-testing"></a>

**Difficulty:** Easy

**Answer:**
Snapshot testing captures the rendered output (HTML/JSON) of a component and saves it to a file. Future test runs compare the new output to the saved snapshot. It's useful for ensuring UI doesn't change unexpectedly, but it's prone to "snapshot fatigue" where developers mindlessly update snapshots without verifying changes.

**Example:**
```javascript
import renderer from 'react-test-renderer';
import Button from './Button';

it('renders correctly', () => {
  const tree = renderer.create(<Button label="Click Me" />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

**Follow-up questions interviewers might ask:**
- What are the downsides of snapshot testing?
- When would you explicitly avoid snapshot tests?

---

## 17. Playwright fundamentals <a name="17-playwright-fundamentals"></a>

**Difficulty:** Medium

**Answer:**
Playwright is an E2E testing framework. It uses:
- **Browser**: The browser instance (Chromium, Firefox, WebKit).
- **Browser Context**: An isolated incognito-like session within a browser (fast, separate cookies/cache).
- **Page**: A single tab/window within a context.
- **Locator**: A mechanism to find elements on the page (auto-waiting by default).

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  const title = page.locator('h1');
  await expect(title).toHaveText('Example Domain');
});
```

**Follow-up questions interviewers might ask:**
- Why is Playwright faster than Cypress or Selenium in multi-browser testing?
- How are Browser Contexts useful for testing user authentication?

---

## 18. Playwright selectors <a name="18-playwright-selectors"></a>

**Difficulty:** Easy

**Answer:**
Playwright supports standard CSS/XPath selectors, but highly recommends user-facing locators (similar to RTL) because they are more resilient to DOM changes.
- `getByRole('button', { name: 'Submit' })`
- `getByText('Welcome')`
- `getByTestId('submit-btn')`

**Example:**
```typescript
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByPlaceholder('Email address').fill('test@test.com');
await page.getByTestId('custom-component').isVisible();
```

**Follow-up questions interviewers might ask:**
- Why should you avoid chaining complex CSS selectors like `div > ul > li:nth-child(2) > a`?
- How do you configure the test id attribute if you don't use `data-testid`?

---

## 19. Playwright auto-waiting & assertions <a name="19-playwright-auto-waiting"></a>

**Difficulty:** Medium

**Answer:**
Playwright automatically waits for elements to be actionable (visible, stable, enabled) before performing actions (click, fill). Its web-first assertions (`expect(locator).toBeVisible()`) also automatically wait and retry until the condition is met or the timeout is reached.

**Example:**
```typescript
// Playwright automatically waits for the button to be visible and clickable
await page.getByRole('button', { name: 'Submit' }).click();

// Automatically retries until the text appears or times out
await expect(page.getByText('Success!')).toBeVisible();
```

**Follow-up questions interviewers might ask:**
- What happens if an element is hidden by another element when `click()` is called?
- How do you assert an element *does not* exist?

---

## 20. Playwright Page Object Model (POM) <a name="20-playwright-pom"></a>

**Difficulty:** Medium

**Answer:**
POM is a design pattern that creates an object-oriented class for a web page. It encapsulates locators and actions, making tests more readable and significantly easier to maintain if the UI changes.

**Example:**
```typescript
// LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async login(username, password) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }
}

// test.spec.ts
test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('admin', 'password123');
  await expect(page.getByText('Dashboard')).toBeVisible();
});
```

**Follow-up questions interviewers might ask:**
- What are the benefits of POM over putting locators directly in tests?
- How would you structure POM classes for a complex application with shared components (like a navigation bar)?

---

## 21. Playwright fixtures <a name="21-playwright-fixtures"></a>

**Difficulty:** Hard

**Answer:**
Fixtures provide an isolated environment for each test. Instead of using `beforeEach` to set up state (which can leak or require careful teardown), fixtures inject dependencies directly into the test function. Playwright's built-in `page` and `context` are fixtures. You can define custom fixtures to set up things like authenticated users, database connections, or POM objects.

**Example:**
```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from './LoginPage';

const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // Use the fixture value in the test
    await use(loginPage);
    // Teardown code could go here
  },
});

test('login test', async ({ loginPage }) => {
  await loginPage.login('user', 'pass');
});
```

**Follow-up questions interviewers might ask:**
- Why are fixtures preferred over `beforeAll` / `beforeEach` in Playwright?
- What is worker-scoped vs test-scoped fixture?

---

## 22. Playwright parallel execution <a name="22-playwright-parallel-execution"></a>

**Difficulty:** Medium

**Answer:**
Playwright runs tests in separate OS processes (workers) for true parallel execution. By default, tests in a single file run sequentially in one worker, while different test files run in parallel across multiple workers. You can opt-in to parallel execution within a single file using `test.describe.configure({ mode: 'parallel' })`.

**Example:**
```typescript
// Runs tests in this file in parallel
test.describe.configure({ mode: 'parallel' });

test('test 1', async ({ page }) => { /* ... */ });
test('test 2', async ({ page }) => { /* ... */ });
```

**Follow-up questions interviewers might ask:**
- What is the difference between parallel mode and `fullyParallel` in config?
- How do you handle database state collisions when tests run in parallel?

---

## 23. Playwright visual regression testing <a name="23-playwright-visual-regression"></a>

**Difficulty:** Medium

**Answer:**
Playwright can take screenshots and compare them against baseline images to detect unintended visual changes (CSS changes, missing images). Use `expect(page).toHaveScreenshot()`.

**Example:**
```typescript
test('homepage visual test', async ({ page }) => {
  await page.goto('/');
  // On first run, it saves the baseline. 
  // Subsequent runs compare against the baseline.
  await expect(page).toHaveScreenshot('homepage.png');
});
```

**Follow-up questions interviewers might ask:**
- How do you handle dynamic content (like a clock or random IDs) in visual regression tests? (Hint: `mask` option).
- How do you update snapshots when a visual change is intentional?

---

## 24. Playwright API testing <a name="24-playwright-api-testing"></a>

**Difficulty:** Medium

**Answer:**
Playwright can test REST APIs directly using the `request` fixture (`APIRequestContext`). It's useful for setting up test data, testing backend services directly, or verifying API behavior alongside UI behavior.

**Example:**
```typescript
test('create user via API', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'Alice', role: 'admin' }
  });
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.name).toBe('Alice');
});
```

**Follow-up questions interviewers might ask:**
- Why might you use API requests inside an E2E UI test instead of doing UI clicks? (To speed up test setup, e.g., logging in).
- Does the `request` fixture share cookies with the `page` fixture?

---

## 25. Playwright trace viewer & debugging <a name="25-playwright-trace-viewer"></a>

**Difficulty:** Easy

**Answer:**
Playwright Trace Viewer is a GUI tool that explores recorded traces of test executions. It captures screenshots, DOM snapshots, network requests, console logs, and source code. It is the primary way to debug failed CI tests. Locally, you can use `--debug` to step through tests using Playwright Inspector.

**Example:**
```bash
# Run tests with tracing enabled
npx playwright test --trace on

# View the trace of a failed test
npx playwright show-trace trace.zip

# Run tests in debug mode (opens inspector)
npx playwright test --debug
```

**Follow-up questions interviewers might ask:**
- How do you configure Playwright to only record traces on failure? (`trace: 'retain-on-failure'`)
- What is Playwright UI Mode?

---

## 26. Playwright CI integration <a name="26-playwright-ci"></a>

**Difficulty:** Medium

**Answer:**
Playwright integrates easily with CI/CD platforms via CLI commands. Since it downloads its own browser binaries, the CI environment only needs basic dependencies (installed via `npx playwright install --with-deps`). It outputs test reports and trace files that can be uploaded as CI artifacts.

**Example:**
```yaml
# GitHub Actions snippet
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-node@v3
  - run: npm ci
  - run: npx playwright install --with-deps
  - run: npx playwright test
  - uses: actions/upload-artifact@v3
    if: always()
    with:
      name: playwright-report
      path: playwright-report/
```

**Follow-up questions interviewers might ask:**
- Why do visual snapshots sometimes fail in CI even though they pass locally? (Different OS rendering, e.g., Linux vs Mac).
- How do you shard Playwright tests across multiple CI jobs?

---

## 27. Code coverage <a name="27-code-coverage"></a>

**Difficulty:** Medium

**Answer:**
Code coverage measures the percentage of source code executed during tests. Metrics include Lines, Statements, Branches (if/else), and Functions. Istanbul (for Jest) or c8/v8 (for Vitest) generates reports. Coverage helps identify untested code paths, but 100% coverage doesn't guarantee a bug-free application.

**Example:**
```bash
# Running Jest with coverage
jest --coverage

# Running Vitest with coverage
vitest run --coverage
```

**Follow-up questions interviewers might ask:**
- What is Branch coverage and why is it often lower than Line coverage?
- Should you aim for 100% test coverage? Why or why not?

---

## 28. Testing accessibility (a11y) <a name="28-testing-accessibility"></a>

**Difficulty:** Hard

**Answer:**
Accessibility testing ensures the app is usable by people with disabilities. We use `jest-axe` alongside RTL, or `@axe-core/playwright` in E2E tests, to run the Axe accessibility engine against the rendered DOM and catch WCAG violations (e.g., missing ARIA labels, low contrast).

**Example:**
```typescript
// RTL + jest-axe
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('should have no a11y violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Playwright E2E
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**Follow-up questions interviewers might ask:**
- Can automated a11y tools catch all accessibility issues? (No, manual testing with screen readers is still required).
- What is the difference between `aria-label` and `aria-labelledby`?

---

## 29. Testing performance <a name="29-testing-performance"></a>

**Difficulty:** Hard

**Answer:**
Performance testing verifies speed and responsiveness. In React, the `<Profiler>` API measures rendering phases. For overall web performance (Core Web Vitals), tools like Lighthouse CI or Playwright integrated with performance tracing are used to measure LCP, CLS, and TBT.

**Example:**
```javascript
// React Profiler
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  if (actualDuration > 16) {
    console.warn(`Component ${id} took too long: ${actualDuration}ms`);
  }
}

<Profiler id="List" onRender={onRender}>
  <HugeList />
</Profiler>
```

**Follow-up questions interviewers might ask:**
- How do you prevent unnecessary re-renders in React?
- Can Playwright measure Core Web Vitals?

---

## 30. TDD vs BDD <a name="30-tdd-vs-bdd"></a>

**Difficulty:** Easy

**Answer:**
- **TDD (Test-Driven Development):** Write a failing test, write the minimal code to pass it, then refactor. Focuses on the implementation details and developer perspective. Uses tools like Jest/JUnit.
- **BDD (Behavior-Driven Development):** An extension of TDD focusing on application behavior from the user/business perspective. Uses human-readable syntax (Given/When/Then) via tools like Cucumber, mapping steps to automated tests (like Playwright).

**Example:**
```gherkin
# BDD Feature File (Cucumber)
Feature: Login
  Scenario: Successful login
    Given the user is on the login page
    When they enter valid credentials
    Then they should see the dashboard
```

**Follow-up questions interviewers might ask:**
- Have you used Gherkin syntax? How does it integrate with Playwright or Cypress?
- What are the advantages of TDD?
