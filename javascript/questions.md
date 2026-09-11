# JavaScript — 30 Interview Questions & Answers

## Table of Contents

1. [What is a closure?](#1-what-is-a-closure)
2. [Explain the event loop, call stack, microtasks vs macrotasks](#2-explain-the-event-loop-call-stack-microtasks-vs-macrotasks)
3. [`var` vs `let` vs `const`](#3-var-vs-let-vs-const)
4. [What is hoisting?](#4-what-is-hoisting)
5. [Explain `this` binding rules](#5-explain-this-binding-rules)
6. [`==` vs `===`](#6--vs-)
7. [What is the prototype chain?](#7-what-is-the-prototype-chain)
8. [`call`, `apply`, `bind`](#8-call-apply-bind)
9. [Implement debounce](#9-implement-debounce)
10. [Implement throttle](#10-implement-throttle)
11. [Promises vs async/await](#11-promises-vs-asyncawait)
12. [Implement `Promise.all` from scratch](#12-implement-promiseall-from-scratch)
13. [Difference between `Promise.all`, `allSettled`, `race`, `any`](#13-difference-between-promiseall-allsettled-race-any)
14. [What is currying?](#14-what-is-currying)
15. [What is memoization?](#15-what-is-memoization)
16. [Deep clone an object](#16-deep-clone-an-object)
17. [Shallow copy vs deep copy](#17-shallow-copy-vs-deep-copy)
18. [Explain the module pattern / ES modules vs CommonJS](#18-explain-the-module-pattern--es-modules-vs-commonjs)
19. [What are generators?](#19-what-are-generators)
20. [Explain `map`, `filter`, `reduce`](#20-explain-map-filter-reduce)
21. [Event delegation](#21-event-delegation)
22. [What is a pure function?](#22-what-is-a-pure-function)
23. [Explain the difference between synchronous and asynchronous code](#23-explain-the-difference-between-synchronous-and-asynchronous-code)
24. [What is a Higher-Order Function?](#24-what-is-a-higher-order-function)
25. [Explain `null` vs `undefined`](#25-explain-null-vs-undefined)
26. [What is destructuring and spread/rest?](#26-what-is-destructuring-and-spreadrest)
27. [Explain WeakMap and WeakSet](#27-explain-weakmap-and-weakset)
28. [What is the temporal dead zone?](#28-what-is-the-temporal-dead-zone)
29. [Explain `Object.freeze` vs `Object.seal`](#29-explain-objectfreeze-vs-objectseal)
30. [What is a stale closure and how does it happen?](#30-what-is-a-stale-closure-and-how-does-it-happen)

---

## 1. What is a closure?

**Difficulty:** Easy

**Answer:**
In JavaScript, whenever you write a function inside another function, the inner function permanently remembers the variables of the outer function. This memory bank is called a closure

**Example:**

```javascript
function createCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2 — count persisted between calls
```

**Follow-up questions interviewers might ask:**

- How do closures cause memory leaks?
- How would you use a closure to implement a private counter without exposing `count`?

---

## 2. Explain the event loop, call stack, microtasks vs macrotasks

**Difficulty:** Medium

**Answer:**
JavaScript is single-threaded, so it uses the event loop to handle async work. The call stack executes synchronous code first. Once the stack is empty, the event loop checks the microtask queue (Promises, `queueMicrotask`) before the macrotask queue (`setTimeout`, `setInterval`, I/O). All microtasks run to completion before the next macrotask, which is why Promise callbacks fire before `setTimeout` even with a 0ms delay.

**Example:**

```javascript
console.log("1: sync");
setTimeout(() => console.log("2: macrotask"), 0);
Promise.resolve().then(() => console.log("3: microtask"));
console.log("4: sync");

// Output: 1, 4, 3, 2
```

**Follow-up questions interviewers might ask:**
**MicroTasks:**
Promise callbacks: The .then(), .catch(), and .finally() functions.
queueMicrotask(): A built-in function used specifically to queue a microtask manually.
async/await, MutationObserver, process.nextTick().
**MacroTasks:**
setTimeout(), setInterval(),User Input Events,Network Requests / IO

- What happens if a microtask keeps queuing more microtasks — can it starve macrotasks?
  The loop keeps running microtasks until the queue is completely empty.
- Where does `requestAnimationFrame` fit in this model?
  MacroTasks

---

## 3. `var` vs `let` vs `const`

**Difficulty:** Easy

**Answer:**
`var` is function-scoped and hoisted with an `undefined` initial value, which causes classic loop bugs. `let` and `const` are block-scoped and live in the temporal dead zone until their declaration line executes. `const` prevents reassignment of the binding, not mutation of the value itself — you can still push to a `const` array.

**Example:**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 0); // 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 0); // 0, 1, 2
}
```

**Follow-up questions interviewers might ask:**

- Why does `let` fix the loop closure problem — what's happening under the hood?
- Can you reassign a property on a `const` object? Why?

---

## 4. What is hoisting?

**Difficulty:** Easy

**Answer:**
Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during the compile phase, before execution. Function declarations are hoisted fully (usable before their definition line), `var` is hoisted but initialized as `undefined`, and `let`/`const` are hoisted but stay uninitialized in the temporal dead zone until reached.

**Example:**

```javascript
console.log(a); // undefined
var a = 5;

console.log(sayHi()); // works fine
function sayHi() {
  return "hi";
}

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

**Follow-up questions interviewers might ask:**

- Are function expressions hoisted the same way as function declarations?

```javascript
// 1. Try to call it early
sayGoodbye(); // ❌ Error: Cannot access 'sayGoodbye' before initialization

// 2. Create the function expression
const sayGoodbye = function () {
  console.log("Goodbye!");
};
```

- How does hoisting interact with class declarations?
  ReferenceError: Cannot access 'Car' before initialization

---

## 5. Explain `this` binding rules

**Difficulty:** Medium

**Answer:**
`this` is determined by how a function is called, not where it's defined — except for arrow functions, which inherit `this` lexically from their enclosing scope. The four rules in order of precedence: `new` binding (constructor), explicit binding (`call`/`apply`/`bind`), implicit binding (`obj.method()`), and default binding (global object or `undefined` in strict mode).

**Example:**

```javascript
const obj = {
  name: "Rahul",
  regular: function () {
    return this.name;
  },
  arrow: () => {
    return this.name;
  },
};

console.log(obj.regular()); // "Rahul" — implicit binding
console.log(obj.arrow()); // undefined — lexical `this`, not obj
```

**Follow-up questions interviewers might ask:**

- Why do React class components historically bind methods in the constructor?
- What does `this` refer to inside a `setTimeout` callback defined as a regular function?

---

## 6. `==` vs `===`

**Difficulty:** Easy

**Answer:**
`===` checks value and type with no coercion — it's strict equality. `==` performs type coercion before comparing, which leads to surprising results like `'' == 0` being `true`. In production code, `===` is the default choice; `==` is mainly useful for deliberately checking `null`/`undefined` together.(convert values into Numbers or Primitives)

**Example:**

```javascript
console.log(0 == "0"); // true (coercion)
console.log(0 === "0"); // false
console.log(null == undefined); // true
console.log(null === undefined); // false
```

**Follow-up questions interviewers might ask:**

- What's the coercion algorithm behind `==` (ToPrimitive)?
- Why is `value == null` sometimes considered acceptable style?

---

## 7. What is the prototype chain?

**Difficulty:** Medium

**Answer:**
Every JavaScript object has an internal `[[Prototype]]` link to another object, forming a chain. When you access a property, the engine looks on the object itself first, then walks up the chain until it finds the property or hits `null`. This is how inheritance works in JS — `class` syntax is sugar over this prototype-based system.

**Example:**

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

const dog = new Animal("Rex");
console.log(dog.speak()); // "Rex makes a sound" — found on Animal.prototype
console.log(Object.getPrototypeOf(dog) === Animal.prototype); // true
```

**Follow-up questions interviewers might ask:**

- How does `class` + `extends` map to prototype chains under the hood?
- What's the difference between `__proto__` and `prototype`?

---

## 8. `call`, `apply`, `bind`

**Difficulty:** Easy

**Answer:**
All three explicitly set `this` for a function. `call` invokes immediately with arguments listed individually, `apply` invokes immediately with arguments as an array, and `bind` returns a new function with `this` permanently fixed, to be called later. `bind` is common for event handlers or partial application.

**Example:**

```javascript
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
const user = { name: "Rahul" };

console.log(greet.call(user, "Hi")); // "Hi, Rahul"
console.log(greet.apply(user, ["Hello"])); // "Hello, Rahul"
const boundGreet = greet.bind(user);
console.log(boundGreet("Hey")); // "Hey, Rahul"
```

**Follow-up questions interviewers might ask:**

- How would you implement your own version of `bind`?
- Why is `bind` sometimes avoided in performance-critical render loops?

---

## 9. Implement debounce

**Difficulty:** Medium

**Answer:**
Debounce delays executing a function until a certain amount of time has passed without it being called again — useful for search inputs or resize handlers where you only care about the final event after activity stops. Each new call resets the timer.

**Example:**

```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedSearch = debounce(
  (query) => console.log("Searching:", query),
  300,
);
debouncedSearch("a");
debouncedSearch("ab");
debouncedSearch("abc"); // only this call fires, after 300ms of silence
```

**Follow-up questions interviewers might ask:**

- How would you add a "leading edge" option to fire on the first call instead?
- Where have you used debounce in a real project (e.g. reconciliation search/filter UI)?

---

## 10. Implement throttle

**Difficulty:** Medium

**Answer:**
Throttle ensures a function runs at most once every N milliseconds, regardless of how many times it's triggered — useful for scroll or drag events where you want steady, capped execution rather than waiting for silence like debounce does.

**Example:**

```javascript
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const throttledScroll = throttle(() => console.log("scroll handled"), 200);
window.addEventListener("scroll", throttledScroll);
```

**Follow-up questions interviewers might ask:**

- Debounce vs throttle — when would you pick one over the other?
- How would you implement throttle using timestamps instead of a boolean flag?

---

## 11. Promises vs async/await

**Difficulty:** Easy

**Answer:**
`async/await` is syntactic sugar over Promises that lets asynchronous code read like synchronous code, improving readability especially with sequential async calls. Under the hood, an `async` function always returns a Promise, and `await` pauses execution until that Promise settles. Error handling shifts from `.catch()` chains to `try/catch` blocks.

**Example:**

```javascript
// Promise chain
fetchUser(id)
  .then((user) => fetchOrders(user.id))
  .then((orders) => console.log(orders))
  .catch((err) => console.error(err));

// async/await equivalent
async function loadOrders(id) {
  try {
    const user = await fetchUser(id);
    const orders = await fetchOrders(user.id);
    console.log(orders);
  } catch (err) {
    console.error(err);
  }
}
```

**Follow-up questions interviewers might ask:**

- How do you run independent async calls in parallel with `await`?

```javascript
async function fetchDashboardData() {
  // 1. Start both independent operations immediately in parallel
  const userPromise = fetchUserData();
  const settingsPromise = fetchSettingsData();

  // 2. Await both promises concurrently and destructure their resolved values
  const [user, settings] = await Promise.all([userPromise, settingsPromise]);

  return { user, settings };
}
```

- What happens if you forget `await` in front of an async call?

```javascript
async function getDashboard() {
  // Missing 'await' here!
  const userData = fetchUserData();

  // This will print: "User Data: [object Promise]"
  console.log("User Data:", userData);

  // CRASH! Because userData is a Promise, it doesn't have a '.name' property
  console.log("User Name:", userData.name);
}
```

---

## 12. Implement `Promise.all` from scratch

**Difficulty:** Hard

**Answer:**
`Promise.all` takes an array of promises and resolves when all of them resolve, returning results in the same order, or rejects immediately if any one rejects. Implementing it requires tracking a results array, a completion counter, and wrapping non-promise values with `Promise.resolve`.

**Example:**

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          results[index] = value;
          completed += 1;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}
```

**Follow-up questions interviewers might ask:**

- How would this change to implement `Promise.allSettled` instead?
- Why do we use `Promise.resolve(p)` even if `p` might already be a promise?

---

## 13. Difference between `Promise.all`, `allSettled`, `race`, `any`

**Difficulty:** Medium

**Answer:**
`Promise.all` resolves when every promise resolves, rejects fast on the first rejection. `allSettled` waits for all promises regardless of outcome and returns status/value or reason for each. `race` settles as soon as the first promise settles, whether resolved or rejected. `any` resolves as soon as the first promise resolves, and only rejects if all reject.

**Example:**

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject("error");
const p3 = new Promise((res) => setTimeout(() => res(3), 100));

Promise.allSettled([p1, p2, p3]).then(console.log);
// [{status:'fulfilled', value:1}, {status:'rejected', reason:'error'}, {status:'fulfilled', value:3}]
```

**Follow-up questions interviewers might ask:**

- Which of these would you use for parallel API calls where partial failure is acceptable?
  allSettled
- How does `any` differ from `race` when the first settled promise is a rejection?
  Promise.race immediately rejects, while Promise.any ignores the rejection and continues waiting for the first successful fulfillment.

---

## 14. What is currying?

**Difficulty:** Medium

**Answer:**
Currying transforms a function that takes multiple arguments into a sequence of functions that each take a single argument, returning a new function until all arguments are collected. It's useful for creating specialized, reusable functions from a general one — common in functional programming and configuration-style APIs.

**Example:**

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
```

**Follow-up questions interviewers might ask:**

- What's the practical difference between currying and partial application?
- Where might currying be useful in a real API layer, e.g. building configured fetch functions?

---

## 15. What is memoization?

**Difficulty:** Medium

**Answer:**
Memoization caches the result of expensive function calls based on their input arguments, so repeated calls with the same arguments return the cached result instead of recomputing. It trades memory for speed and is commonly used for pure functions — recursive calculations, or expensive derived state in React (`useMemo`).

**Example:**

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => {
  for (let i = 0; i < 1e6; i++);
  return n * n;
};
const fastSquare = memoize(slowSquare);
fastSquare(5); // computed
fastSquare(5); // cached, instant
```

**Follow-up questions interviewers might ask:**

- Why does memoization only work correctly for pure functions?
- What are the memory trade-offs, and how would you add cache eviction (LRU)?

---

## 16. Deep clone an object

**Difficulty:** Medium

**Answer:**
A deep clone creates a fully independent copy of an object, including nested objects/arrays, so mutating the clone never affects the original. `structuredClone()` is the modern native solution and handles most cases including circular references, dates, and Maps/Sets. `JSON.parse(JSON.stringify())` is a common but flawed shortcut — it silently drops functions, `undefined`, and breaks on circular references.

**Example:**

```javascript
const original = { name: "Rahul", meta: { role: "Tech Lead" } };

const clone = structuredClone(original);
clone.meta.role = "Lead Engineer";

console.log(original.meta.role); // "Tech Lead" — unaffected
console.log(clone.meta.role); // "Lead Engineer"
```

**Follow-up questions interviewers might ask:**

- What are the limitations of `JSON.parse(JSON.stringify())` for deep cloning?
- How would you write a custom deep clone that handles circular references?

---

## 17. Shallow copy vs deep copy

**Difficulty:** Easy

**Answer:**
A shallow copy duplicates only the top-level properties — nested objects are still shared by reference with the original, so mutating a nested object in the copy affects the original too. `{...obj}` and `Object.assign` are shallow. A deep copy recursively duplicates every nested level so the two objects are fully independent.

**Example:**

```javascript
const original = { user: { name: "Rahul" } };
const shallow = { ...original };

shallow.user.name = "Changed";
console.log(original.user.name); // "Changed" — nested object was shared
```

**Follow-up questions interviewers might ask:**

- When is a shallow copy sufficient, e.g. in React state updates?
  when the properties you are changing exist at the very top level of the object or array, and any nested structures remain completely untouched.
- How does this relate to React's shallow prop comparison in `React.memo`?
- why we required shallow clone or deepclone:
  to duplicate data safely without unwanted side effects
- React:
  React is Blind to Direct Mutations
  React Won't Know to Re-render
  If you mutate: The memory address stays exactly the same. React thinks nothing changed, and your UI will not update.
  If you make a copy: A brand-new object is created at a new memory address. React instantly notices the new reference and triggers a re-render.

---

## 18. Explain the module pattern / ES modules vs CommonJS

**Difficulty:** Medium

**Answer:**
CommonJS (`require`/`module.exports`) is Node's original synchronous module system, evaluated at runtime. ES Modules (`import`/`export`) are statically analyzable, support tree-shaking, and load asynchronously — they're the browser/modern-Node standard. Key practical differences: ESM imports are live bindings (they reflect updates to the exported value), while CommonJS exports a copy of the value at import time.

**Example:**

```javascript
// CommonJS
const { readFile } = require("fs");
module.exports = { myFunction };

// ES Modules
import { readFile } from "fs";
export function myFunction() {
  /* ... */
}
export default myFunction;
```

**Follow-up questions interviewers might ask:**

- Why does tree-shaking work with ESM but not CommonJS?
- How do you interop between CommonJS and ESM in a Node/Nest.js project?

---

## 19. What are generators?

**Difficulty:** Medium

**Answer:**
Generators are functions (declared with `function*`) that can pause execution at `yield` points and resume later, maintaining their own state between pauses. Calling a generator returns an iterator, not the result directly. They're the foundation async/await is built on, and are useful for lazy sequences, infinite streams, or custom iteration logic.

**Example:**

```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
```

**Follow-up questions interviewers might ask:**

- How would you use a generator to implement a custom iterable?
- How do generators relate to how `async/await` is implemented under the hood?

---

## 20. Explain `map`, `filter`, `reduce`

**Difficulty:** Easy

**Answer:**
All three are non-mutating array methods. `map` transforms each element and returns a new array of the same length. `filter` returns a new array containing only elements that pass a test. `reduce` accumulates all elements into a single value (number, object, array — anything) using an accumulator function. They're the backbone of functional-style data transformation.

**Example:**

```javascript
const orders = [{ amount: 100 }, { amount: 250 }, { amount: 50 }];

const amounts = orders.map((o) => o.amount); // [100, 250, 50]
const large = orders.filter((o) => o.amount > 75); // [{100}, {250}]
const total = orders.reduce((sum, o) => sum + o.amount, 0); // 400
```

**Follow-up questions interviewers might ask:**

- How would you implement `map` using `reduce`?
- What are the performance implications of chaining multiple `.map().filter()` calls vs one `.reduce()`?

---

## 21. Event delegation

**Difficulty:** Medium

**Answer:**
Event delegation attaches a single event listener to a parent element instead of individual listeners on many children, relying on event bubbling to catch events from descendants via `event.target`. This improves performance for long or dynamic lists and avoids re-attaching listeners when elements are added/removed.

**Example:**

```javascript
document.getElementById("list").addEventListener("click", (event) => {
  if (event.target.matches("li")) {
    console.log("Clicked item:", event.target.textContent);
  }
});
// Works even for <li> elements added to the list later
```

**Follow-up questions interviewers might ask:**

- What's the difference between event bubbling and capturing?
- How does React's synthetic event system relate to this native pattern?

---

## 22. What is a pure function?

**Difficulty:** Easy

**Answer:**
A pure function always returns the same output for the same input and produces no side effects — it doesn't mutate external state, make network calls, or depend on anything outside its own arguments. Pure functions are easier to test, memoize, and reason about, which is why they're emphasized heavily in React (reducers, render functions) and functional programming generally.

**Example:**

```javascript
// Pure
function add(a, b) {
  return a + b;
}

// Impure — mutates external state
let total = 0;
function addToTotal(n) {
  total += n;
  return total;
}
```

**Follow-up questions interviewers might ask:**

- Why must React reducers and render functions be pure?
- How does purity affect testability and memoization?

---

## 23. Explain the difference between synchronous and asynchronous code

**Difficulty:** Easy

**Answer:**
Synchronous code executes line by line, blocking further execution until the current operation finishes. Asynchronous code lets long-running operations (network calls, timers, file I/O) run in the background via the event loop, so the rest of the program isn't blocked — the result is handled later through callbacks, Promises, or async/await.

**Example:**

```javascript
console.log("Start");
setTimeout(() => console.log("Async task done"), 1000);
console.log("End");
// Output: Start, End, Async task done
```

**Follow-up questions interviewers might ask:**

- Why is JavaScript described as "single-threaded but non-blocking"?
- How does Node.js handle async I/O under the hood (libuv, thread pool)?

---

## 24. What is a Higher-Order Function?

**Difficulty:** Easy

**Answer:**
A higher-order function either takes one or more functions as arguments, returns a function, or both. They're central to functional JavaScript — `map`, `filter`, `reduce`, `debounce`, and React's HOCs (before hooks) are all higher-order functions. They enable composition and reusable behavior without repeating logic.

**Example:**

```javascript
function withLogging(fn) {
  return function (...args) {
    console.log("Calling with:", args);
    return fn(...args);
  };
}

const loggedAdd = withLogging((a, b) => a + b);
loggedAdd(2, 3); // logs "Calling with: [2, 3]", returns 5
```

**Follow-up questions interviewers might ask:**

- How do React Higher-Order Components compare to custom hooks for the same problem?
- Can you give an example of a higher-order function you've used in a real codebase?

---

## 25. Explain `null` vs `undefined`

**Difficulty:** Easy

**Answer:**
`undefined` means a variable has been declared but not assigned a value — it's JavaScript's default. `null` is an intentional assignment representing "no value," explicitly set by a developer. `typeof undefined` is `'undefined'`, but `typeof null` is (famously, a long-standing bug) `'object'`.

**Example:**

```javascript
let a;
console.log(a); // undefined — not yet assigned

let b = null;
console.log(b); // null — intentionally empty

console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" (legacy JS quirk)
```

**Follow-up questions interviewers might ask:**

- When would you deliberately use `null` over `undefined` in an API response?
- How does `??` (nullish coalescing) differ from `||` when handling these?

---

## 26. What is destructuring and spread/rest?

**Difficulty:** Easy

**Answer:**
Destructuring unpacks values from arrays or objects into individual variables. The spread operator (`...`) expands an iterable into individual elements (useful for copying/merging), while the rest operator uses the same syntax to collect remaining elements into an array — the direction (expanding vs collecting) is what differentiates them.

**Example:**

```javascript
const { name, role = "Developer" } = { name: "Rahul" };
console.log(name, role); // "Rahul" "Developer"

const [first, ...rest] = [1, 2, 3, 4];
console.log(first, rest); // 1 [2, 3, 4]

const merged = { ...{ a: 1 }, ...{ b: 2 } };
console.log(merged); // { a: 1, b: 2 }
```

**Follow-up questions interviewers might ask:**

- How does object spread handle deeply nested properties — is it shallow or deep?
- How would you use rest parameters to write a variadic function?

---

## 27. Explain WeakMap and WeakSet

**Difficulty:** Hard

**Answer:**
`WeakMap` and `WeakSet` hold their keys/values weakly, meaning if there are no other references to an object key, it can be garbage collected even while still "in" the WeakMap. Unlike `Map`/`Set`, they're not iterable and have no `.size`, which is a deliberate trade-off — this makes them ideal for attaching private metadata to objects without causing memory leaks.

**Example:**

```javascript
let user = { name: "Rahul" };
const cache = new WeakMap();
cache.set(user, { role: "Tech Lead" });

console.log(cache.get(user)); // { role: 'Tech Lead' }

user = null; // original object now eligible for garbage collection,
// and its entry in the WeakMap is automatically cleared
```

**Follow-up questions interviewers might ask:**

- Why can't you iterate over a WeakMap?
- Give a real use case, e.g. caching DOM node metadata without leaking memory.

---

## 28. What is the temporal dead zone?

**Difficulty:** Medium

**Answer:**
The temporal dead zone (TDZ) is the period between entering a scope and the point where a `let`/`const` variable is actually declared, during which the variable exists but cannot be accessed — attempting to do so throws a `ReferenceError`. It exists to catch bugs early, unlike `var`, which silently returns `undefined` in the same situation.

**Example:**

```javascript
console.log(typeof x); // "undefined" — var, no TDZ
var x = 1;

console.log(typeof y); // ReferenceError — y is in the TDZ
let y = 2;
```

**Follow-up questions interviewers might ask:**

- Why was the TDZ introduced as a language design decision?
- Does the TDZ apply to function parameters with default values?

---

## 29. Explain `Object.freeze` vs `Object.seal`

**Difficulty:** Medium

**Answer:**
`Object.freeze` makes an object fully immutable — no adding, removing, or modifying properties. `Object.seal` prevents adding or removing properties but still allows modifying existing property values. Both are shallow — nested objects remain mutable unless frozen/sealed individually.

**Example:**

```javascript
const frozen = Object.freeze({ name: "Rahul" });
frozen.name = "Changed"; // silently fails (throws in strict mode)
console.log(frozen.name); // "Rahul"

const sealed = Object.seal({ name: "Rahul" });
sealed.name = "Changed"; // allowed
sealed.age = 25; // silently fails
console.log(sealed); // { name: 'Changed' }
```

**Follow-up questions interviewers might ask:**

- How would you deep-freeze a nested object?
- Where might `Object.freeze` be useful in a Redux-style state management setup?

---

## 30. What is a stale closure and how does it happen?

**Difficulty:** Hard

**Answer:**
A stale closure happens when a function captures a variable's value at the time the closure was created, but that value later becomes outdated — common in React with `useEffect`/`useState` when a callback references old state because it wasn't included in the dependency array. The closure isn't "wrong," it's just holding onto a snapshot from an earlier render.

**Example:**

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count); // always logs 0 — stale closure over initial `count`
    }, 1000);
    return () => clearInterval(interval);
  }, []); // missing `count` in deps — closure never updates
}
```

**Follow-up questions interviewers might ask:**

- How would you fix this — functional state updates, refs, or adding to deps?
- Have you hit a stale closure bug in a real project, and how did you debug it?
