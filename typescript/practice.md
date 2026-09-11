# TypeScript — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

---

1. **How do you define an array of objects where each object must have a `name` string and an optional `age` number?**
   _Hint: You can use an interface and an array type notation `[]` or the `Array<T>` generic._

2. **Given a union type `type Status = "pending" | "approved" | "rejected"`, how do you extract only "approved" and "rejected" into a new type?**
   _Hint: Look into the built-in utility type `Extract` or `Exclude`._

3. **How do you narrow down `unknown` data before using it in a function?**
   _Hint: Use standard JavaScript type checking operators like `typeof` or `instanceof`._

4. **In React, how do you correctly type a `ref` applied to an `<input>` element?**
   _Hint: Use the generic `useRef<T>` and pass the specific HTML element type. Also remember what the initial value should be._

5. **How do you type the parameters of an event handler function passed to a `<button onClick={...}>` in React?**
   _Hint: React provides specific event types like `React.MouseEvent`. Check what generic type it requires._

6. **Create a custom type guard function that determines if an object is of type `User` (has `id` and `email`).**
   _Hint: Use the `val is User` return type and perform property checks using the `in` operator inside the function._

7. **How do you construct a new type that makes all properties of an existing interface `User` readonly and optional at the same time?**
   _Hint: You can combine two built-in utility types, or write a custom mapped type using `readonly` and `?` modifiers._

8. **Given a function that returns a Promise resolving to a user object, how do you extract the User type programmatically using TS utilities?**
   _Hint: Combine `ReturnType<typeof myFunction>` with `Awaited<T>` (or a custom `infer` conditional type)._

9. **Explain how to use discriminated unions to type a Redux-style reducer state and actions securely.**
   _Hint: Give every action object a common literal property like `type`. Use a `switch` statement on `type` so TS narrows the payload._

10. **Write a conditional type that checks if a given type is an array. If it is, return the type of the array's elements; otherwise, return the original type.**
    _Hint: Use `T extends Array<infer U>`._
