# JavaScript — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

---

1. **Predict the output:**
   ```javascript
   console.log(1);
   setTimeout(() => console.log(2), 0);
   Promise.resolve().then(() => console.log(3));
   console.log(4);
   ```
   _Hint: think about call stack → microtask queue → macrotask queue order._

2. **Write a function `once(fn)`** that returns a version of `fn` which can only be invoked once — subsequent calls return the cached result of the first call.
   _Hint: closures + a flag variable._

3. **Explain and fix the bug:**
   ```javascript
   for (var i = 0; i < 3; i++) {
     setTimeout(() => console.log(i), 100);
   }
   ```
   _Hint: `var` scoping vs `let`, or use an IIFE to capture `i`._

4. **Implement a simple `pipe(...fns)`** function that composes multiple functions left to right, passing the output of one as input to the next.
   _Hint: use `reduce` over the functions array._

5. **Given an array of objects, group them by a key** without using Lodash — e.g. group `orders` by `status`.
   _Hint: `reduce` into an object/Map keyed by the grouping field._

6. **Implement `Array.prototype.flat`** for a single level of nesting, without using the built-in method.
   _Hint: use `reduce` and `concat`, or a loop with `Array.isArray` checks for full recursion._

7. **What will this log, and why?**
   ```javascript
   const obj = {
     name: 'Test',
     getName: function () {
       return () => this.name;
     },
   };
   const fn = obj.getName();
   console.log(fn());
   ```
   _Hint: arrow functions and lexical `this` — trace where `getName` was called vs where the arrow was defined._

8. **Write a rate-limited function queue** — given an array of async tasks, run only 2 at a time concurrently, waiting for one to finish before starting the next.
   _Hint: track an in-flight counter and use `Promise.race` or a worker-pool pattern._

9. **Implement your own `bind` polyfill** (`Function.prototype.myBind`) without using the native `.bind()`.
   _Hint: return a new function that uses `.apply()` internally, and handle the case of being combined with `new`._

10. **Given a deeply nested object, write a function to flatten it** into a single-level object with dot-notation keys, e.g. `{a: {b: {c: 1}}}` → `{'a.b.c': 1}`.
    _Hint: recursion + accumulating a prefix string as you go deeper._
