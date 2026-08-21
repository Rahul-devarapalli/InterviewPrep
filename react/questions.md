# React — 30 Interview Questions & Answers

## Table of Contents

1. [What is the Virtual DOM and how does reconciliation work?](#1-what-is-the-virtual-dom-and-how-does-reconciliation-work)
2. [Explain the React component lifecycle (class vs hooks)](#2-explain-the-react-component-lifecycle-class-vs-hooks)
3. [What is `useState` and how does batching work?](#3-what-is-usestate-and-how-does-batching-work)
4. [Explain `useEffect` and its dependency array](#4-explain-useeffect-and-its-dependency-array)
5. [`useMemo` vs `useCallback`](#5-usememo-vs-usecallback)
6. [What is `React.memo` and when should you use it?](#6-what-is-reactmemo-and-when-should-you-use-it)
7. [Controlled vs uncontrolled components](#7-controlled-vs-uncontrolled-components)
8. [What are keys in React lists, and why do they matter?](#8-what-are-keys-in-react-lists-and-why-do-they-matter)
9. [Explain the Context API and when to avoid it](#9-explain-the-context-api-and-when-to-avoid-it)
10. [What is prop drilling and how do you solve it?](#10-what-is-prop-drilling-and-how-do-you-solve-it)
11. [Explain custom hooks with an example](#11-explain-custom-hooks-with-an-example)
12. [What is a stale closure in React, and how does it happen?](#12-what-is-a-stale-closure-in-react-and-how-does-it-happen)
13. [Explain `useRef` — DOM refs vs mutable values](#13-explain-useref--dom-refs-vs-mutable-values)
14. [What is React's synthetic event system?](#14-what-is-reacts-synthetic-event-system)
15. [Explain error boundaries](#15-explain-error-boundaries)
16. [What is code-splitting and `React.lazy`/`Suspense`?](#16-what-is-code-splitting-and-reactlazysuspense)
17. [How does React batch state updates, and what changed in React 18?](#17-how-does-react-batch-state-updates-and-what-changed-in-react-18)
18. [Explain `useReducer` and when to prefer it over `useState`](#18-explain-usereducer-and-when-to-prefer-it-over-usestate)
19. [What causes unnecessary re-renders, and how do you debug them?](#19-what-causes-unnecessary-re-renders-and-how-do-you-debug-them)
20. [Explain the difference between state and props](#20-explain-the-difference-between-state-and-props)
21. [What is the difference between `useEffect` and `useLayoutEffect`?](#21-what-is-the-difference-between-useeffect-and-uselayouteffect)
22. [How do Higher-Order Components (HOCs) work?](#22-how-do-higher-order-components-hocs-work)
23. [Explain render props pattern](#23-explain-render-props-pattern)
24. [What is React Fiber?](#24-what-is-react-fiber)
25. [How would you optimize a large list rendering performance issue?](#25-how-would-you-optimize-a-large-list-rendering-performance-issue)
26. [Explain the `key` prop pitfall with index as key](#26-explain-the-key-prop-pitfall-with-index-as-key)
27. [What is hydration in the context of SSR?](#27-what-is-hydration-in-the-context-of-ssr)
28. [How do you handle forms in React — libraries vs manual?](#28-how-do-you-handle-forms-in-react--libraries-vs-manual)
29. [Explain React's concurrent rendering and `startTransition`](#29-explain-reacts-concurrent-rendering-and-starttransition)
30. [How would you structure state management in a mid-to-large app?](#30-how-would-you-structure-state-management-in-a-mid-to-large-app)

---

## 1. What is the Virtual DOM and how does reconciliation work?

**Difficulty:** Medium

**Answer:**
The Virtual DOM is a lightweight JS representation of the actual DOM. When state changes, React builds a new virtual tree, diffs it against the previous one (reconciliation), and computes the minimal set of real DOM mutations needed — then applies them in a single batch. This avoids expensive direct DOM manipulation on every state change. React's diffing uses heuristics like comparing element types and `key` props rather than a full tree diff, which is what makes it fast in practice.

**Example:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
// Only the text node inside <button> is updated in the real DOM,
// not the whole button element.
```

**Follow-up questions interviewers might ask:**

- Why does React need `key` props to reconcile lists correctly?
  React needs key props to establish a stable identity for elements across renders. Without explicit keys, React cannot know if a list item has been reordered, added, or removed.
- What's the algorithmic complexity trade-off React makes to keep diffing fast?

---

## 2. Explain the React component lifecycle (class vs hooks)

**Difficulty:** Medium

**Answer:**
Class components use lifecycle methods: `constructor` for setup, `componentDidMount` for post-render side effects, `componentDidUpdate` for reacting to changes, and `componentWillUnmount` for cleanup. Hooks replace this with `useEffect`, which combines mount/update/unmount behavior into one API based on its dependency array — an empty array behaves like `componentDidMount`, and a returned cleanup function behaves like `componentWillUnmount`.

**Example:**

```jsx
// Class
componentDidMount() { this.fetchData(); }
componentWillUnmount() { this.subscription.unsubscribe(); }

// Hooks equivalent
useEffect(() => {
  fetchData();
  const sub = subscribe();
  return () => sub.unsubscribe();
}, []);
```

**Follow-up questions interviewers might ask:**

- Why can't hooks be called conditionally or inside loops?
- What's the hooks equivalent of `getDerivedStateFromProps`?

---

## 3. What is `useState` and how does batching work?

**Difficulty:** Easy

**Answer:**
`useState` returns a stateful value and a setter function; calling the setter schedules a re-render with the new value rather than mutating state in place. React batches multiple `setState` calls within the same event handler into a single re-render for performance — since React 18, this batching applies even inside promises, timeouts, and native event handlers (automatic batching), not just React's synthetic events.

**Example:**

```jsx
function Form() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount((c) => c + 1);
    setFlag((f) => !f);
    // Only ONE re-render happens, not two — React 18 batches both
  }
  return <button onClick={handleClick}>{count}</button>;
}
```

**Follow-up questions interviewers might ask:**

- Why should you use the functional updater form `setCount(c => c + 1)` instead of `setCount(count + 1)`?

```jsx
function handleDoubleIncrement() {
  setCount(count + 1); // Looks at the "snapshot" where count is 0. Updates to 0 + 1 = 1.
  setCount(count + 1); // Still looks at the same snapshot where count is 0. Updates to 0 + 1 = 1.
}
function handleDoubleIncrement() {
  setCount((c) => c + 1); // c is 0. React schedules it to become 1.
  setCount((c) => c + 1); // c is now 1 (the latest scheduled value). React schedules it to become 2.
}
```

- What changed specifically about batching between React 17 and React 18?
  React 18 (Automatic Batching): Groups updates everywhere by default. This includes timeouts, promises, network requests, and native browser events

---

## 4. Explain `useEffect` and its dependency array

**Difficulty:** Medium

**Answer:**
`useEffect` runs side effects after render — data fetching, subscriptions, manual DOM work. The dependency array controls when it re-runs: omitted means every render, `[]` means once on mount, and `[dep1, dep2]` means it re-runs only when those values change between renders. Getting the dependency array wrong is one of the most common sources of bugs — missing deps cause stale closures, over-inclusive deps cause unnecessary re-runs.

**Example:**

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setUser);
  return () => controller.abort(); // cleanup on unmount or userId change
}, [userId]);
```

**Follow-up questions interviewers might ask:**

- Why does the ESLint `exhaustive-deps` rule exist, and when is it safe to ignore?
- How would you avoid an infinite loop caused by an object/array dependency that's recreated every render?

---

## 5. `useMemo` vs `useCallback`

**Difficulty:** Medium

**Answer:**
Both memoize across re-renders based on a dependency array, but `useMemo` caches a computed **value**, while `useCallback` caches a **function reference**. `useCallback(fn, deps)` is functionally equivalent to `useMemo(() => fn, deps)`. Both exist primarily to prevent unnecessary re-renders of memoized children (`React.memo`) or to avoid re-running expensive calculations.

**Example:**

```jsx
const expensiveResult = useMemo(() => computeTotal(orders), [orders]);

const handleClick = useCallback(() => {
  onSelect(item.id);
}, [item.id, onSelect]);

return <MemoizedChild onClick={handleClick} total={expensiveResult} />;
```

**Follow-up questions interviewers might ask:**

- Why is overusing `useMemo`/`useCallback` sometimes a performance anti-pattern?
- How does `useCallback` interact with `React.memo`'s shallow prop comparison?

---

## 6. What is `React.memo` and when should you use it?

**Difficulty:** Medium

**Answer:**
`React.memo` is a higher-order component that skips re-rendering a component if its props haven't shallowly changed since the last render. It's useful for expensive components receiving stable props, but it adds a comparison overhead on every render, so wrapping cheap components in it can actually hurt performance. It only helps if the parent re-renders frequently but the relevant props don't change.

**Example:**

```jsx
const ExpensiveRow = React.memo(function ExpensiveRow({ data }) {
  return <div>{heavyComputation(data)}</div>;
});
// Only re-renders when `data` prop reference changes
```

**Follow-up questions interviewers might ask:**

- Why does `React.memo` need `useCallback`/`useMemo` on the parent to be effective when passing functions/objects as props?
- How would you provide a custom comparison function to `React.memo`?

---

## 7. Controlled vs uncontrolled components

**Difficulty:** Easy

**Answer:**
A controlled component's value is driven entirely by React state — the input's `value` comes from state and updates flow through `onChange`. An uncontrolled component manages its own internal DOM state, and React reads the value only when needed via a `ref`. Controlled components give React full visibility (useful for validation, conditional logic) at the cost of a re-render per keystroke; uncontrolled components are simpler and more performant for basic forms.

**Example:**

```jsx
// Controlled
function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled
function UncontrolledInput() {
  const inputRef = useRef();
  return <input ref={inputRef} defaultValue="" />;
}
```

**Follow-up questions interviewers might ask:**

- Why do most form libraries (React Hook Form) favor uncontrolled inputs internally for performance?
- How would you validate a controlled form field on every keystroke without excessive re-renders?

---

## 8. What are keys in React lists, and why do they matter?

**Difficulty:** Easy

**Answer:**
Keys give React a stable identity for list items across renders so it can correctly match old elements to new ones during reconciliation, instead of re-rendering everything or misapplying state to the wrong item. Keys should be stable and unique — ideally a database ID, not the array index, since index-based keys break when items are reordered, inserted, or removed.

**Example:**

```jsx
{
  orders.map((order) => (
    <OrderRow key={order.id} order={order} /> // stable ID, not index
  ));
}
```

**Follow-up questions interviewers might ask:**

- What specific bug can occur when using array index as a key with a reorderable list?
- How does React use keys differently from a `dangerouslySetInnerHTML`-style raw diff?

---

## 9. Explain the Context API and when to avoid it

**Difficulty:** Medium

**Answer:**
Context provides a way to pass data through the component tree without manually threading props at every level — useful for theme, auth state, or locale. However, any component consuming a context re-renders whenever that context value changes, even if it only cares about part of it, which can cause performance problems in large trees. For high-frequency updates (like a form with many fields), dedicated state management (Zustand, Redux) or splitting contexts is usually better.

**Example:**

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

**Follow-up questions interviewers might ask:**

- How would you prevent unnecessary re-renders when using Context for frequently changing state?
- When would you reach for Redux/Zustand instead of Context?

---

## 10. What is prop drilling and how do you solve it?

**Difficulty:** Easy

**Answer:**
Prop drilling is passing a prop through several intermediate components that don't use it themselves, just to get it to a deeply nested child. It makes components harder to refactor and couples unrelated components together. Solutions include the Context API for infrequently-changing global data, component composition (passing children as props instead of drilling), or a state management library for complex, frequently-updated state.

**Example:**

```jsx
// Prop drilling
<Grandparent user={user}>
  <Parent user={user}>
    <Child user={user} /> {/* only Child actually needs `user` */}
  </Parent>
</Grandparent>

// Composition fix
<Grandparent>
  <Parent>
    <Child user={user} />
  </Parent>
</Grandparent>
```

**Follow-up questions interviewers might ask:**

- Why is component composition often preferred over Context for solving prop drilling?
- What are the trade-offs of introducing a global state library just to avoid drilling?

---

## 11. Explain custom hooks with an example

**Difficulty:** Medium

**Answer:**
Custom hooks are plain JS functions prefixed with `use` that extract and reuse stateful logic across components, following the same rules as built-in hooks. They don't share state between components that use them — each call gets its own independent state. They're primarily a code-organization tool for de-duplicating logic like data fetching, form handling, or subscriptions.

**Example:**

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

function UserProfile({ id }) {
  const { data, loading } = useFetch(`/api/users/${id}`);
  if (loading) return <Spinner />;
  return <div>{data.name}</div>;
}
```

**Follow-up questions interviewers might ask:**

- Why don't two components using the same custom hook share state?
- What's a custom hook you've written in a real project, and what problem did it solve?

---

## 12. What is a stale closure in React, and how does it happen?

**Difficulty:** Hard

**Answer:**
A stale closure occurs when a function (often inside `useEffect`, `setTimeout`, or an event handler) captures a value from a specific render and keeps referencing that old value even after state has updated, because the dependency array didn't include it. Each render creates new closures with fresh values, but a closure created in an earlier render is "frozen" with that render's variables until it's replaced.

**Example:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // always 0 — stale closure from the first render
    }, 1000);
    return () => clearInterval(id);
  }, []); // missing `count` dependency
}
```

**Follow-up questions interviewers might ask:**

- How would you fix this using the functional updater form or a ref?
- Why does adding `count` to the dependency array fix it, and what trade-off does that introduce (interval resets)?

---

## 13. Explain `useRef` — DOM refs vs mutable values

**Difficulty:** Medium

**Answer:**
`useRef` returns a mutable object (`{ current: ... }`) that persists across renders without causing a re-render when updated — unlike state. It has two common uses: holding a reference to a DOM node (`<input ref={inputRef} />`) for imperative access, or storing any mutable value (like a timer ID or previous prop value) that shouldn't trigger a re-render when it changes.

**Example:**

```jsx
function SearchBox() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current += 1; // doesn't cause a re-render

  useEffect(() => {
    inputRef.current.focus(); // imperative DOM access
  }, []);

  return <input ref={inputRef} />;
}
```

**Follow-up questions interviewers might ask:**

- Why doesn't updating a ref trigger a re-render, and when is that a feature vs a bug risk?
- How would you use a ref to store the "previous" value of a prop between renders?

---

## 14. What is React's synthetic event system?

**Difficulty:** Medium

**Answer:**
React wraps native DOM events in a cross-browser `SyntheticEvent` object with a consistent API, so handlers behave predictably across browsers. Historically React attached a single listener at the root and used event delegation for performance; React 17+ delegates to the root DOM container the app is rendered into (rather than `document`) to better support multiple React roots on one page.

**Example:**

```jsx
function Button() {
  function handleClick(event) {
    console.log(event.type); // "click" — normalized SyntheticEvent
    event.persist?.(); // no longer needed since React 17, events aren't pooled
  }
  return <button onClick={handleClick}>Click</button>;
}
```

**Follow-up questions interviewers might ask:**

- Why did React remove event pooling in React 17?
- How would you access the native event underneath a SyntheticEvent (`event.nativeEvent`)?

---

## 15. Explain error boundaries

**Difficulty:** Medium

**Answer:**
Error boundaries are class components that implement `getDerivedStateFromError` and/or `componentDidCatch` to catch JavaScript errors thrown during rendering in their child tree, log them, and display a fallback UI instead of crashing the whole app. They don't catch errors in event handlers, async code, or server-side rendering — those need regular try/catch. There's currently no hook-based equivalent; error boundaries must be class components.

**Example:**

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}
```

**Follow-up questions interviewers might ask:**

- Why do error boundaries not catch errors in event handlers?
- How would you handle errors thrown inside an `async` function triggered by a button click?

---

## 16. What is code-splitting and `React.lazy`/`Suspense`?

**Difficulty:** Medium

**Answer:**
Code-splitting breaks a bundle into smaller chunks loaded on demand instead of all upfront, improving initial load time. `React.lazy` dynamically imports a component, and `Suspense` wraps it to show a fallback UI while the chunk loads. This is typically combined with route-based splitting so each page only loads the code it needs.

**Example:**

```jsx
const Dashboard = React.lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

**Follow-up questions interviewers might ask:**

- How does `Suspense` behave with multiple lazy components loading simultaneously?
- What's the difference between route-based and component-based code-splitting?

---

## 17. How does React batch state updates, and what changed in React 18?

**Difficulty:** Hard

**Answer:**
Before React 18, batching only happened inside React event handlers — state updates in promises, `setTimeout`, or native event listeners each triggered a separate re-render. React 18 introduced automatic batching everywhere via the new `createRoot` API, so multiple `setState` calls anywhere are grouped into one re-render by default. You can opt out with `flushSync` if you need a synchronous update.

**Example:**

```jsx
// React 18 with createRoot
function handleClick() {
  fetchData().then(() => {
    setCount((c) => c + 1); // batched
    setFlag((f) => !f); // batched — only 1 re-render, even inside a promise
  });
}
```

**Follow-up questions interviewers might ask:**

- When would you deliberately use `flushSync` to opt out of batching?
- How would this same code have behaved differently under React 17?

---

## 18. Explain `useReducer` and when to prefer it over `useState`

**Difficulty:** Medium

**Answer:**
`useReducer` manages state via a reducer function `(state, action) => newState`, similar to Redux. It's preferable to `useState` when state logic is complex, involves multiple sub-values that update together, or when the next state depends on the previous one in non-trivial ways — it centralizes update logic and makes state transitions easier to test and trace.

**Example:**

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "reset":
      return { count: 0 };
    default:
      throw new Error("Unknown action");
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <button onClick={() => dispatch({ type: "increment" })}>
      {state.count}
    </button>
  );
}
```

**Follow-up questions interviewers might ask:**

- How would you combine `useReducer` with `Context` to build a lightweight Redux alternative?
- Why is a reducer required to be a pure function?

---

## 19. What causes unnecessary re-renders, and how do you debug them?

**Difficulty:** Medium

**Answer:**
Common causes: passing new object/array/function literals as props on every render (breaking `React.memo`'s shallow comparison), unnecessary Context consumption, or state living higher in the tree than it needs to. Debugging tools include React DevTools Profiler to see what re-rendered and why, `why-did-you-render` for automated detection, and simply moving state closer to where it's used.

**Example:**

```jsx
// Problem: new object literal every render breaks memoization
<MemoizedChild style={{ color: "red" }} />; // new object each render

// Fix: hoist or memoize the object
const style = useMemo(() => ({ color: "red" }), []);
<MemoizedChild style={style} />;
```

**Follow-up questions interviewers might ask:**

- How does the React DevTools Profiler help identify wasted renders?
- What's the difference between a re-render and a DOM update — does every re-render touch the real DOM?

---

## 20. Explain the difference between state and props

**Difficulty:** Easy

**Answer:**
Props are read-only data passed from a parent to a child component — the child cannot modify them directly. State is data owned and managed internally by a component, which can change over time and triggers a re-render when updated. Props flow down; state is local, though it can be "lifted up" to a common ancestor when multiple components need to share it.

**Example:**

```jsx
function Parent() {
  const [count, setCount] = useState(0); // state, owned by Parent
  return <Child count={count} />; // passed down as a prop
}

function Child({ count }) {
  // read-only prop
  return <p>{count}</p>;
}
```

**Follow-up questions interviewers might ask:**

- What does "lifting state up" mean and when would you do it?
- Can a child component modify a prop directly? Why is that considered an anti-pattern?

---

## 21. What is the difference between `useEffect` and `useLayoutEffect`?

**Difficulty:** Hard

**Answer:**
`useEffect` runs asynchronously after the browser paints, so it doesn't block visual updates. `useLayoutEffect` runs synchronously right after DOM mutations but before the browser paints, which is necessary when you need to measure or mutate the DOM before the user sees it (e.g., preventing a visual flicker). `useLayoutEffect` should be used sparingly since it can block painting and hurt perceived performance.

**Example:**

```jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setTooltipPosition(height); // measure & adjust before paint, avoiding flicker
}, []);
```

**Follow-up questions interviewers might ask:**

- Give a real scenario where using `useEffect` instead of `useLayoutEffect` would cause a visible flicker.
- Does `useLayoutEffect` run on the server during SSR? Why or why not?

---

## 22. How do Higher-Order Components (HOCs) work?

**Difficulty:** Medium

**Answer:**
An HOC is a function that takes a component and returns a new enhanced component, injecting additional props or behavior — a pattern for reusing logic before hooks existed. Common examples were `connect()` from Redux or `withRouter`. HOCs can cause "wrapper hell" with deeply nested components and prop naming collisions, which is largely why custom hooks have replaced them as the preferred pattern.

**Example:**

```jsx
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <Spinner />;
    return <Component {...props} />;
  };
}

const UserListWithLoading = withLoading(UserList);
```

**Follow-up questions interviewers might ask:**

- Why have custom hooks largely replaced HOCs in modern React codebases?
- What is "wrapper hell" and how does it show up in React DevTools?

---

## 23. Explain render props pattern

**Difficulty:** Medium

**Answer:**
Render props is a pattern where a component takes a function as a prop (often named `children` or `render`) and calls it to determine what to render, passing it internal state or logic. It was another pre-hooks solution for sharing logic between components, similar in purpose to HOCs but avoiding some of the naming-collision issues, at the cost of more nested JSX ("callback hell" in the tree).

**Example:**

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setPosition({ x: e.clientX, y: e.clientY })}>
      {render(position)}
    </div>
  );
}

<MouseTracker
  render={({ x, y }) => (
    <p>
      {x}, {y}
    </p>
  )}
/>;
```

**Follow-up questions interviewers might ask:**

- How would you rewrite this render-props example using a custom hook instead?
- What's the performance concern with defining the render function inline on every render?

---

## 24. What is React Fiber?

**Difficulty:** Hard

**Answer:**
Fiber is React's internal reconciliation engine (since React 16), a reimplementation that made rendering interruptible and incremental instead of one synchronous recursive pass. It allows React to pause work, prioritize urgent updates (like user input) over less urgent ones (like a large list re-render), and resume or abandon work — the foundation for concurrent features like `startTransition` and `Suspense`.

**Example:**

```jsx
// Conceptually: Fiber lets React split rendering work into units
// and yield back to the browser between them, instead of blocking
// the main thread with one giant synchronous render pass.
```

**Follow-up questions interviewers might ask:**

- How does Fiber enable features like `startTransition`?
- What problem did the pre-Fiber "Stack" reconciler have with long render trees?

---

## 25. How would you optimize a large list rendering performance issue?

**Difficulty:** Medium

**Answer:**
For large lists, virtualization (rendering only the visible rows via libraries like `react-window` or `react-virtualized`) is the biggest win — it avoids mounting thousands of DOM nodes at once. Beyond that: stable keys, `React.memo` on row components, avoiding inline function/object props that break memoization, and pagination or infinite scroll to limit total data loaded at once.

**Example:**

```jsx
import { FixedSizeList } from "react-window";

<FixedSizeList height={600} itemCount={10000} itemSize={40} width="100%">
  {({ index, style }) => <div style={style}>{items[index].name}</div>}
</FixedSizeList>;
// Only renders the ~15 rows currently visible in the viewport
```

**Follow-up questions interviewers might ask:**

- How does list virtualization interact with variable-height rows?
- Have you handled a real large-dataset rendering problem — e.g. reconciliation records in Settlr?

---

## 26. Explain the `key` prop pitfall with index as key

**Difficulty:** Medium

**Answer:**
Using the array index as a key works fine for static, never-reordered lists, but breaks when items are inserted, removed, or reordered — React matches by key position, so it can misattribute component state (like input values or checkbox state) to the wrong data item after a reorder, since the index now points to a different item. Always prefer a stable unique ID from the data itself.

**Example:**

```jsx
// Buggy: if `items` is reordered, input state gets misassigned
{
  items.map((item, index) => <input key={index} defaultValue={item.name} />);
}

// Correct:
{
  items.map((item) => <input key={item.id} defaultValue={item.name} />);
}
```

**Follow-up questions interviewers might ask:**

- Can you describe a concrete bug scenario this causes with a form inside a reorderable list?
- Is index-as-key ever acceptable? When?

---

## 27. What is hydration in the context of SSR?

**Difficulty:** Hard

**Answer:**
Hydration is the process where React "attaches" to server-rendered HTML on the client — reusing the existing DOM nodes instead of re-creating them, while wiring up event listeners and internal React state to make the page interactive. If the client-rendered output doesn't match the server-rendered HTML (a "hydration mismatch"), React logs warnings and may re-render, causing flicker or errors.

**Example:**

```jsx
// Server renders: <div id="root"><h1>Hello</h1></div>
// Client hydrates instead of re-rendering from scratch:
hydrateRoot(document.getElementById("root"), <App />);
// React reuses the existing <h1> DOM node and attaches event listeners
```

**Follow-up questions interviewers might ask:**

- What commonly causes hydration mismatches (e.g. `Date.now()`, `Math.random()`, browser-only APIs)?
- How does Next.js handle SSR + hydration under the hood?

---

## 28. How do you handle forms in React — libraries vs manual?

**Difficulty:** Medium

**Answer:**
Manual forms with `useState` per field work for simple cases but get verbose and re-render-heavy at scale. Libraries like React Hook Form use uncontrolled inputs with refs internally, minimizing re-renders and providing built-in validation, error handling, and integration with schema validators (Zod, Yup). The trade-off is a bit more setup and a library dependency versus full manual control.

**Example:**

```jsx
import { useForm } from "react-hook-form";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true })} />
      {errors.email && <span>Email is required</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Follow-up questions interviewers might ask:**

- Why does React Hook Form cause fewer re-renders than a fully controlled form?
- How would you integrate Zod schema validation with React Hook Form?

---

## 29. Explain React's concurrent rendering and `startTransition`

**Difficulty:** Hard

**Answer:**
Concurrent rendering (React 18+) lets React interrupt, pause, or abandon a render in progress to prioritize more urgent updates — like typing in an input — over less urgent ones. `startTransition` marks a state update as non-urgent ("a transition"), so React can keep the UI responsive by rendering urgent updates first and letting the transition update happen in the background, potentially showing a pending state via `useTransition`.

**Example:**

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);

  function handleChange(e) {
    setQuery(e.target.value); // urgent — updates immediately
    startTransition(() => {
      setResults(filterLargeDataset(e.target.value)); // non-urgent, can be interrupted
    });
  }
  return <>{isPending ? <Spinner /> : <ResultsList results={results} />}</>;
}
```

**Follow-up questions interviewers might ask:**

- How does `startTransition` differ from debouncing the search input?
- What's the difference between `useTransition` and `useDeferredValue`?

---

## 30. How would you structure state management in a mid-to-large app?

**Difficulty:** Hard

**Answer:**
Split state by scope and update frequency: local UI state stays in `useState`/`useReducer` within the component, shared-but-rarely-changing state (auth, theme) goes in Context, server data is best handled by a dedicated data-fetching library (React Query/TanStack Query, SWR) which manages caching, revalidation, and loading states — not `useEffect` + `useState` manually — and truly global client state (complex cross-cutting UI state) goes in a lightweight store like Zustand or Redux Toolkit only when Context's re-render cost becomes a real problem.

**Example:**

```jsx
// Server state: TanStack Query, not manual useEffect
const { data: orders, isLoading } = useQuery({
  queryKey: ["orders", userId],
  queryFn: () => fetchOrders(userId),
});

// Global client state: Zustand, minimal boilerplate
const useAppStore = create((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));
```

**Follow-up questions interviewers might ask:**

- Why is "server state" (data from an API) considered fundamentally different from "client state" in modern React architecture?
- How would you decide between Context and Zustand/Redux for a given piece of shared state?
