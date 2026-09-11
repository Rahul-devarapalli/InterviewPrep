# Testing (Jest, Playwright & RTL) — Practice Questions

Test your knowledge with these 10 practice questions, ordered from easiest to hardest. **Hints are provided, but no direct answers.** Try writing out the code or explanation before checking online or referring back to the notes.

---

### Question 1 (Easy)
**Scenario:** You have a simple utility function `export const multiply = (a, b) => a * b;`.
**Task:** Write a complete Jest or Vitest test file to verify this function works correctly. Include at least two test cases.
**Hint:** Don't forget the `import` statements. Use `describe`, `it`, and `expect(result).toBe(...)`.

---

### Question 2 (Easy)
**Scenario:** You need to test a button that toggles between "ON" and "OFF" text when clicked. 
**Task:** Using React Testing Library, write a test to verify the initial state is "OFF", and it changes to "ON" after one click.
**Hint:** Use `render`, `screen.getByRole`, and `userEvent.click`. 

---

### Question 3 (Medium)
**Scenario:** You are testing an E2E login flow with Playwright.
**Task:** Write a Playwright test script that navigates to `/login`, fills out an email and password field, clicks "Submit", and verifies that the URL changes to `/dashboard`.
**Hint:** Use `page.goto()`, `page.getByLabel()`, `page.getByRole()`, and `expect(page).toHaveURL()`.

---

### Question 4 (Medium)
**Scenario:** Your React component fetches user data on mount using an API call. 
**Task:** How would you test this component using React Testing Library to ensure a "Loading..." spinner is shown initially, followed by the user's name? Assume the API is mocked via MSW.
**Hint:** Query for the loading state synchronously, then use `await screen.findByText(...)` for the user data.

---

### Question 5 (Medium)
**Scenario:** You have a custom hook `useToggle(initialValue)` that returns a boolean state and a `toggle` function.
**Task:** Write a test using RTL's `renderHook` to verify the state toggles correctly.
**Hint:** Extract `result` from `renderHook`. Remember to wrap the `toggle` function call inside `act()`.

---

### Question 6 (Medium)
**Scenario:** You want to run a Playwright visual regression test on a dynamic component (like a live clock or stock ticker) that changes every second.
**Task:** How do you assert the screenshot without the test constantly failing due to the changing text?
**Hint:** Look into Playwright's `mask` option for `toHaveScreenshot()`.

---

### Question 7 (Hard)
**Scenario:** You are migrating a large test suite from Jest to Vitest. 
**Task:** List 3 specific changes you would need to make to a `Button.test.js` file if your Vitest configuration does **not** use `globals: true`. Additionally, how do you replace `jest.fn()`?
**Hint:** Think about what you normally get for free in Jest that you have to import in standard ES modules. What is the Vitest equivalent of the `jest` object?

---

### Question 8 (Hard)
**Scenario:** Your application uses a complex Redux store and React Router. You are writing an RTL test for a deep nested component that uses `useSelector` and `Link`.
**Task:** Explain how you would set up your test so that the component renders without throwing "Provider not found" or "Router context not found" errors.
**Hint:** Create a custom `render` function (often called `renderWithProviders`) that wraps the `ui` with `<Provider>` and `<BrowserRouter>`.

---

### Question 9 (Hard)
**Scenario:** You are building Page Object Models (POM) in Playwright for an E-commerce site.
**Task:** Write a TypeScript class `CartPage` that encapsulates locators for the "Checkout" button and the list of cart items. Create a method `checkout()` that asserts at least one item is in the cart before clicking the checkout button.
**Hint:** Pass `page` into the constructor. Define locators as private class properties. Use `locator.count()` to check the number of items.

---

### Question 10 (Hard)
**Scenario:** You are testing a backend API using Playwright's `request` fixture alongside your UI tests.
**Task:** Write a setup hook (`beforeAll` or `test.beforeEach`) that uses `request.post` to create a new user via API, saves the generated token, and then uses Playwright's `browserContext.addCookies()` or `setExtraHTTPHeaders()` to authenticate the UI session before the test runs.
**Hint:** API calls with Playwright are done via the `APIRequestContext`. You can inject state into a UI context so the browser is already logged in when `page.goto()` happens.
