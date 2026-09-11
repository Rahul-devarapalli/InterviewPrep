# React — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

---

1. **Build a `useToggle` custom hook** that returns `[value, toggle]` — a boolean and a function to flip it.
   _Hint: `useState` + `useCallback` wrapping a functional updater._

2. **Predict the re-render behavior:**
   ```jsx
   function Parent() {
     const [count, setCount] = useState(0);
     return (
       <div>
         <button onClick={() => setCount(count + 1)}>{count}</button>
         <ExpensiveChild />
       </div>
     );
   }
   ```
   Does `ExpensiveChild` re-render every time the button is clicked? How would you prevent it?
   _Hint: default behavior re-renders all children; think `React.memo`._

3. **Fix the stale closure bug:**
   ```jsx
   function Timer() {
     const [seconds, setSeconds] = useState(0);
     useEffect(() => {
       const id = setInterval(() => setSeconds(seconds + 1), 1000);
       return () => clearInterval(id);
     }, []);
     return <p>{seconds}</p>;
   }
   ```
   _Hint: functional updater form `setSeconds(s => s + 1)`._

4. **Write a `useDebounce` custom hook** that returns a debounced version of a value, updating only after the value stops changing for a given delay.
   _Hint: `useState` + `useEffect` with `setTimeout`/`clearTimeout` inside._

5. **Given a list of 10,000 items, describe (or sketch code for) how you'd render it performantly.**
   _Hint: virtualization — `react-window`'s `FixedSizeList`._

6. **Build a controlled multi-step form** (3 steps) that preserves entered data when navigating back and forth between steps.
   _Hint: lift the combined form state up to a parent component or a reducer, not per-step local state._

7. **Explain what's wrong with this code and fix it:**
   ```jsx
   function ProductList({ products }) {
     return products.map((p, i) => <Product key={i} data={p} />);
   }
   ```
   assuming `products` can be filtered/sorted by the user.
   _Hint: index-as-key breaks when list order changes._

8. **Implement a simple error boundary component** that catches errors in its children and shows a "Try again" button that resets the boundary's state.
   _Hint: class component with `getDerivedStateFromError` + a reset handler that clears `hasError`._

9. **Build a `useFetch(url)` hook that handles loading, error, and data states**, and cancels the request if the component unmounts before it resolves.
   _Hint: `AbortController` inside `useEffect`, cleanup function calls `.abort()`._

10. **Given this component, identify all the reasons it might re-render unnecessarily and fix them:**
    ```jsx
    function Dashboard({ userId }) {
      const style = { padding: 10 };
      const handleClick = () => console.log('clicked');
      return (
        <div style={style}>
          <MemoizedWidget onClick={handleClick} config={{ theme: 'dark' }} />
        </div>
      );
    }
    ```
    _Hint: inline object/function literals recreated every render break `React.memo` — `useMemo`/`useCallback` or hoist outside the component._

---

## 🖥️ Runnable Coding Challenges

These are self-contained React components you can run locally. Each is a single-page interview-style challenge.

**Setup:** `cd react/practice-app && npm install && npm run dev`

| # | Challenge | File | Key Concepts |
|---|---|---|---|
| 1 | Fetch API → Sortable Table | [`P1_ApiTableSorting.jsx`](./practice-app/src/practices/P1_ApiTableSorting.jsx) | `useEffect`, fetch, controlled sorting |
| 2 | Shopping Cart with `useReducer` | [`P2_UseReducer.jsx`](./practice-app/src/practices/P2_UseReducer.jsx) | `useReducer`, dispatch, immutable updates |
| 3 | Debounce Search (Custom Hook) | [`P3_DebounceSearch.jsx`](./practice-app/src/practices/P3_DebounceSearch.jsx) | Custom hooks, AbortController, closures |
| 4 | User Search (2+ char filter) | [`P4_UserSearchFilter.jsx`](./practice-app/src/practices/P4_UserSearchFilter.jsx) | Controlled input, filtering, autocomplete |
| 5 | Client-Side Pagination | [`P5_Pagination.jsx`](./practice-app/src/practices/P5_Pagination.jsx) | `useMemo`, page size config, edge cases |
| 6 | Todo CRUD App | [`P6_TodoApp.jsx`](./practice-app/src/practices/P6_TodoApp.jsx) | CRUD, localStorage, filter tabs |
| 7 | Stopwatch + Laps | [`P7_StopWatch.jsx`](./practice-app/src/practices/P7_StopWatch.jsx) | `useRef` for intervals, cleanup |
| 8 | Infinite Scroll | [`P8_InfiniteScroll.jsx`](./practice-app/src/practices/P8_InfiniteScroll.jsx) | IntersectionObserver, `useCallback` |
| 9 | Multi-Step Form | [`P9_MultiStepForm.jsx`](./practice-app/src/practices/P9_MultiStepForm.jsx) | Validation, lifting state, step management |
| 10 | Context API Theme Switcher | [`P10_ContextTheme.jsx`](./practice-app/src/practices/P10_ContextTheme.jsx) | `createContext`, `useContext`, providers |

