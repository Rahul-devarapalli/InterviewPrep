# TypeScript Interview Questions

## Table of Contents
1. [Basic types (string, number, boolean, any, unknown, never, void)](#1-basic-types)
2. [Interfaces vs Types — when to use which](#2-interfaces-vs-types)
3. [Generics — function generics, constraint generics, utility generics](#3-generics)
4. [Utility types (Partial, Required, Pick, Omit, Record, Exclude, Extract, ReturnType, Parameters)](#4-utility-types)
5. [Union types & discriminated unions](#5-union-types--discriminated-unions)
6. [Type narrowing & type guards](#6-type-narrowing--type-guards)
7. [Enums vs const enums vs union string literals](#7-enums-vs-const-enums-vs-union-string-literals)
8. [TypeScript with React — typing props, state, events, refs, children](#8-typescript-with-react)
9. [Generic React components](#9-generic-react-components)
10. [Typing hooks](#10-typing-hooks)
11. [Declaration merging & module augmentation](#11-declaration-merging--module-augmentation)
12. [Conditional types & infer keyword](#12-conditional-types--infer-keyword)
13. [Mapped types](#13-mapped-types)
14. [Template literal types](#14-template-literal-types)
15. [`as const` assertions](#15-as-const-assertions)
16. [TypeScript strict mode flags](#16-typescript-strict-mode-flags)
17. [Type assertions vs type casting](#17-type-assertions-vs-type-casting)
18. [Index signatures & Record type](#18-index-signatures--record-type)
19. [Function overloads](#19-function-overloads)
20. [tsconfig.json key settings](#20-tsconfigjson-key-settings)
21. [Decorators](#21-decorators)
22. [Namespace vs Module](#22-namespace-vs-module)
23. [Declaration files (.d.ts)](#23-declaration-files-dts)
24. [TypeScript with Redux Toolkit](#24-typescript-with-redux-toolkit)
25. [Intersection types](#25-intersection-types)
26. [Readonly & ReadonlyArray](#26-readonly--readonlyarray)
27. [Typing API responses & Zod/io-ts validation](#27-typing-api-responses--zodio-ts-validation)
28. [Covariance & contravariance](#28-covariance--contravariance)
29. [Typing higher-order components and render props](#29-typing-higher-order-components)
30. [Migrating JS to TS — strategies and common pitfalls](#30-migrating-js-to-ts)

---

## 1. Basic types (string, number, boolean, any, unknown, never, void)

**Difficulty:** Easy

**Answer:**
TypeScript provides primitive types like `string`, `number`, and `boolean`. Beyond primitives, it introduces structural types. 
- `any` bypasses type checking completely. Use sparingly.
- `unknown` is a safer alternative to `any`. You must perform type checking (narrowing) before operating on an `unknown` value.
- `void` indicates a function returns nothing (`undefined` in JS).
- `never` indicates a value that never occurs (e.g., a function that throws an error or has an infinite loop).

**Example:**
```typescript
let str: string = "hello";
let isDone: boolean = false;

// Unknown vs Any
let value1: any = 5;
value1.foo(); // OK, no error at compile time

let value2: unknown = 5;
// value2.foo(); // Error! Object is of type 'unknown'
if (typeof value2 === "number") {
  console.log(value2.toFixed(2)); // OK
}

// Never
function throwError(msg: string): never {
  throw new Error(msg);
}
```

**Follow-up questions interviewers might ask:**
- Why should you prefer `unknown` over `any`?
- How is `never` useful for exhaustive type checking in switch statements?

---

## 2. Interfaces vs Types — when to use which

**Difficulty:** Medium

**Answer:**
Both `interface` and `type` can define object shapes and function signatures. 
- **Interfaces** are specifically for defining shapes of objects. They support **declaration merging** (if you define the same interface twice, they merge). They are often preferred for public APIs and defining class contracts.
- **Types (Type Aliases)** can define objects, but also primitives, unions, intersections, and tuples. They do not support declaration merging.

In modern TypeScript, they are very similar. Generally, use `interface` until you need a feature only `type` provides (like union types or mapped types).

**Example:**
```typescript
// Interface supports merging
interface User { name: string; }
interface User { age: number; }
const u: User = { name: "Alice", age: 30 }; // OK

// Type alias supports unions
type ID = string | number;
type Status = "success" | "error" | "loading";

// Extending
interface Animal { name: string; }
interface Bear extends Animal { honey: boolean; }

type AnimalType = { name: string; };
type BearType = AnimalType & { honey: boolean; };
```

**Follow-up questions interviewers might ask:**
- Can an interface extend a type? Can a type extend an interface?
- When writing a library, why might you expose interfaces rather than types?

---

## 3. Generics — function generics, constraint generics, utility generics

**Difficulty:** Medium

**Answer:**
Generics allow creating reusable components that can work over a variety of types rather than a single one.
- **Function Generics:** Type variables that capture the type provided by the user.
- **Constraints:** Restrict what types can be passed to a generic using the `extends` keyword.

**Example:**
```typescript
// Function generic
function identity<T>(arg: T): T {
  return arg;
}
let res = identity<string>("hello"); // T is string

// Constraint generic
interface HasLength {
  length: number;
}
function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}
logLength({ length: 10, value: 3 }); // OK
// logLength(3); // Error, number doesn't have length
```

**Follow-up questions interviewers might ask:**
- How do you set a default type for a generic?
- In React, how do you specify a generic arrow function inside a `.tsx` file without it being confused for JSX?

---

## 4. Utility types (Partial, Required, Pick, Omit, Record, Exclude, Extract, ReturnType, Parameters)

**Difficulty:** Medium

**Answer:**
TypeScript provides built-in utility types to facilitate common type transformations.
- `Partial<T>`: Makes all properties optional.
- `Required<T>`: Makes all properties required.
- `Pick<T, K>`: Constructs a type picking the set of properties `K` from `T`.
- `Omit<T, K>`: Constructs a type by picking all properties from `T` and then removing `K`.
- `Record<K, T>`: Constructs an object type whose property keys are `K` and whose property values are `T`.
- `Exclude<T, U>`: Excludes from `T` those types that are assignable to `U`.
- `Extract<T, U>`: Extracts from `T` those types that are assignable to `U`.
- `ReturnType<T>`: Extracts the return type of a function type `T`.

**Example:**
```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
type OptionalTodo = Partial<Todo>;
type TodoIdMap = Record<string, Todo>;

type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

function f1() { return { x: 10, y: 3 }; }
type P = ReturnType<typeof f1>; // { x: number, y: number }
```

**Follow-up questions interviewers might ask:**
- How is `Omit` implemented under the hood? (Hint: `Pick` and `Exclude`)
- What's the difference between `Record<string, any>` and `{[key: string]: any}`?

---

## 5. Union types & discriminated unions

**Difficulty:** Medium

**Answer:**
A **Union type** allows a value to be one of several types. A **Discriminated Union** (or tagged union) is a pattern where all types in a union have a common literal property (the "discriminant"), allowing TypeScript to narrow down the specific type based on that property.

**Example:**
```typescript
// Simple union
type StringOrNumber = string | number;

// Discriminated union
interface Circle {
  kind: "circle";
  radius: number;
}
interface Square {
  kind: "square";
  sideLength: number;
}
type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    // TS knows shape is Circle here
    return Math.PI * shape.radius ** 2;
  } else {
    // TS knows shape is Square here
    return shape.sideLength ** 2;
  }
}
```

**Follow-up questions interviewers might ask:**
- How do you use the `never` type to ensure exhaustiveness checking in a `switch` statement over a discriminated union?
- Can a discriminated union use a boolean property as the discriminator?

---

## 6. Type narrowing & type guards (typeof, instanceof, in, custom type guards)

**Difficulty:** Medium

**Answer:**
Type narrowing is the process of moving a value from a less precise type to a more precise type.
- `typeof`: Narrows primitives (`string`, `number`, `boolean`).
- `instanceof`: Narrows class instances.
- `in`: Narrows based on property existence in an object.
- **Custom Type Guards:** Functions returning a type predicate (`arg is Type`).

**Example:**
```typescript
interface Fish { swim: () => void; }
interface Bird { fly: () => void; }

// Custom Type Guard
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TS knows pet is Fish
  } else {
    pet.fly(); // TS knows pet is Bird
  }
}

// `in` operator
function move2(pet: Fish | Bird) {
  if ("swim" in pet) {
    pet.swim();
  }
}
```

**Follow-up questions interviewers might ask:**
- Why can't you use `typeof` to distinguish between an array and a plain object?
- What are the risks of using a custom type guard that is implemented incorrectly?

---

## 7. Enums vs const enums vs union string literals

**Difficulty:** Medium

**Answer:**
- **String literal unions:** (`"ADMIN" | "USER"`) The most idiomatic way in TS. No runtime code is emitted. Highly optimized.
- **Enums:** Generate real objects at runtime (IIFEs mapping keys to values). Useful when you need to iterate over the values at runtime or need two-way mapping (numeric enums).
- **Const Enums:** Do not generate objects at runtime; references are replaced inline by their literal values at compile time.

**Example:**
```typescript
// Union literal (Preferred for simplicity)
type Role = "Admin" | "User";

// Enum (Emits runtime code)
enum Direction { Up = 1, Down, Left, Right }

// Const Enum (Emits NO runtime code, inlines values)
const enum Status { OK = 200, NotFound = 404 }
const code = Status.OK; // Compiles simply to `const code = 200;`
```

**Follow-up questions interviewers might ask:**
- Why does the TypeScript community often recommend string literals over enums?
- What issues can `const enum` cause if used in an exported library? (Hint: IsolatedModules)

---

## 8. TypeScript with React — typing props, state, events, refs, children

**Difficulty:** Easy/Medium

**Answer:**
TypeScript provides types via `@types/react` for React patterns.
- **Props:** Typed via an interface or type alias.
- **State:** `useState<T>()`.
- **Events:** `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`.
- **Refs:** `useRef<HTMLDivElement>(null)`.
- **Children:** `React.ReactNode`.

**Example:**
```tsx
import React, { useState, useRef } from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Button: React.FC<Props> = ({ title, children }) => {
  const [count, setCount] = useState<number>(0);
  const divRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCount(prev => prev + 1);
  };

  return (
    <div ref={divRef}>
      <button onClick={handleClick}>{title} - {count}</button>
      {children}
    </div>
  );
};
```

**Follow-up questions interviewers might ask:**
- What's the difference between `ReactNode`, `ReactElement`, and `JSX.Element`?
- Why might you avoid using `React.FC` in modern React 18 codebases? (Hint: implicit `children` removed, doesn't handle generics well).

---

## 9. Generic React components

**Difficulty:** Hard

**Answer:**
React components can take generic type parameters, which is extremely useful for reusable components like Tables, Selects, or Lists where the data structure shape is variable.

**Example:**
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

// Notice the `<T,>` to prevent TSX parser from confusing it with an HTML tag
function List<T,>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List items={[1, 2, 3]} renderItem={(n) => <span>{n}</span>} />
<List items={[{id: 1, name: 'John'}]} renderItem={(u) => <span>{u.name}</span>} />
```

**Follow-up questions interviewers might ask:**
- How do you use a generic component wrapped in `React.memo` or `forwardRef`?
- What does `<T extends unknown>` or `<T,>` achieve in a TSX file?

---

## 10. Typing hooks (useState, useReducer, useRef, useContext, custom hooks)

**Difficulty:** Medium

**Answer:**
React hooks require specific generic types if TS cannot infer them.
- `useState<T>()`: Infer usually works, but needed for null/union types (`useState<User | null>(null)`).
- `useRef<T>(null)`: DOM elements require the specific HTML element type.
- `useReducer`: Define state and Action types (often a discriminated union).
- `useContext`: Type the context creation, provide default values.

**Example:**
```tsx
type State = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

// Usage
const [state, dispatch] = useReducer(reducer, { count: 0 });
```

**Follow-up questions interviewers might ask:**
- If you don't pass `null` to `useRef<HTMLDivElement>()`, what happens? (MutableRefObject vs RefObject).
- How do you properly type the return array of a custom hook so it acts like a tuple rather than an array of union types? (Hint: `as const`).

---

## 11. Declaration merging & module augmentation

**Difficulty:** Hard

**Answer:**
**Declaration merging** is the compiler merging two or more separate declarations declared with the same name into a single definition.
**Module augmentation** allows you to patch existing types from a third-party library to add your own custom properties.

**Example:**
```typescript
// Module Augmentation Example
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
    };
  }
}

// Now styled-components knows your theme structure
```

**Follow-up questions interviewers might ask:**
- Why can interfaces be merged but type aliases cannot?
- How do you augment a global scope variable (like adding a property to `window`)?

---

## 12. Conditional types & infer keyword

**Difficulty:** Hard

**Answer:**
Conditional types act like ternary operators for types: `T extends U ? X : Y`.
The `infer` keyword can be used within the `extends` clause of a conditional type to deduce a type variable dynamically.

**Example:**
```typescript
// Conditional Type
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true

// Infer Keyword
type ReturnTypeCustom<T> = T extends (...args: any[]) => infer R ? R : any;

function getGreeting() { return "Hello!"; }
type GreetingRet = ReturnTypeCustom<typeof getGreeting>; // string

// Unwrapping a Promise
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Res = UnpackPromise<Promise<number>>; // number
```

**Follow-up questions interviewers might ask:**
- What are distributive conditional types, and how do you prevent them from distributing? (Hint: `[T] extends [U]`)
- How does `Parameters<T>` utility type use `infer`?

---

## 13. Mapped types

**Difficulty:** Hard

**Answer:**
Mapped types build on the syntax for index signatures. They are used to create a new type by iterating over property keys of an existing type. Built-in utility types like `Partial`, `Readonly`, `Pick` are mapped types.

**Example:**
```typescript
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// Remapping keys via `as` (TS 4.1+)
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
}
type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }
```

**Follow-up questions interviewers might ask:**
- How do you remove an optional modifier `?` or `readonly` modifier in a mapped type? (Hint: `-?` or `-readonly`).
- What is the difference between `in` and `keyof` in this context?

---

## 14. Template literal types

**Difficulty:** Hard

**Answer:**
Template literal types build on string literal types, allowing you to manipulate and concatenate string types at compile time.

**Example:**
```typescript
type Color = "red" | "blue";
type Size = "small" | "large";

// Combines unions matrix-style
type ClassName = `${Size}-${Color}`; 
// "small-red" | "small-blue" | "large-red" | "large-blue"

type CSSUnit = "px" | "em" | "rem";
function setMargin(margin: `${number}${CSSUnit}`) {}

setMargin("10px"); // OK
// setMargin("10"); // Error, missing unit
```

**Follow-up questions interviewers might ask:**
- What are the built-in string manipulation types? (Capitalize, Uncapitalize, Uppercase, Lowercase)
- How could you use template literals with mapped types to rename object keys?

---

## 15. `as const` assertions

**Difficulty:** Medium

**Answer:**
`as const` is a const assertion. It tells the compiler to infer the most specific, narrow type possible instead of a wider type. Arrays become `readonly` tuples, objects become `readonly` objects with literal values, and primitives become literal types.

**Example:**
```typescript
const routes = {
  home: "/",
  admin: "/admin"
} as const;

// routes is now:
// {
//   readonly home: "/";
//   readonly admin: "/admin";
// }

// Great for Redux action types or custom hooks returning arrays
function useToggle() {
  const [val, setVal] = useState(false);
  const toggle = () => setVal(!val);
  return [val, toggle] as const; // Types as `readonly [boolean, () => void]` instead of `(boolean | (() => void))[]`
}
```

**Follow-up questions interviewers might ask:**
- How does `as const` help when constructing a Discriminated Union out of an array of objects?
- What's the difference between `Object.freeze()` and `as const`?

---

## 16. TypeScript strict mode flags

**Difficulty:** Medium

**Answer:**
The `strict` flag in `tsconfig.json` turns on several type-checking rules. The most critical are:
- `strictNullChecks`: `null` and `undefined` are not in the domain of every type.
- `noImplicitAny`: Raises an error on expressions and declarations with an implied `any` type.
- `strictFunctionTypes`: Causes function parameter types to be checked contravariantly.
- `strictBindCallApply`: Stricter checking of `.bind`, `.call`, `.apply`.

**Example:**
```json
{
  "compilerOptions": {
    "strict": true
    // Alternatively, you can enable them individually:
    // "strictNullChecks": true,
    // "noImplicitAny": true
  }
}
```

**Follow-up questions interviewers might ask:**
- If you're migrating a JS project to TS, how might you configure strict mode progressively?
- What bug might slip into production if `strictNullChecks` is false?

---

## 17. Type assertions vs type casting

**Difficulty:** Easy

**Answer:**
In TypeScript, we use **Type Assertions** (`as Type` or `<Type>`), not type casting. 
Casting implies a runtime conversion of data, whereas type assertions only tell the compiler to treat a value as a certain type. Assertions are erased at runtime.

**Example:**
```typescript
const someValue: unknown = "this is a string";

// Type Assertion
const strLength1: number = (someValue as string).length;

// Angle bracket syntax (avoid in JSX/TSX as it conflicts)
const strLength2: number = (<string>someValue).length;
```

**Follow-up questions interviewers might ask:**
- Why should you use `as` instead of angle brackets in React TSX files?
- What is a "double assertion" (`val as unknown as Type`), and when might you be forced to use it?

---

## 18. Index signatures & Record type

**Difficulty:** Medium

**Answer:**
Index signatures define the types of properties an object can hold when you don't know the exact property names ahead of time. `Record<K, T>` is a utility type that achieves a similar result but allows for more constrained keys (like a union of strings).

**Example:**
```typescript
// Index Signature
interface Dictionary {
  [key: string]: string; // Keys are strings, values are strings
}

// Record Type
type RolesDict = Record<"admin" | "user", boolean>;
// Same as: { admin: boolean; user: boolean; }
```

**Follow-up questions interviewers might ask:**
- Why can an index signature only be of type `string`, `number`, or `symbol`?
- When typing a dynamically keyed object, why is `Record<string, unknown>` safer than `Record<string, any>`?

---

## 19. Function overloads

**Difficulty:** Medium

**Answer:**
Function overloads allow you to specify multiple function signatures for a single function. You define the signatures first, and the actual implementation signature last (which must be broad enough to handle all overloads).

**Example:**
```typescript
// Signatures
function getDate(timestamp: number): Date;
function getDate(m: number, d: number, y: number): Date;
// Implementation
function getDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  }
  return new Date(mOrTimestamp);
}

getDate(1633036800000); // OK
getDate(10, 1, 2021); // OK
// getDate(10); // Error: No overload expects 1 argument
```

**Follow-up questions interviewers might ask:**
- Why isn't the implementation signature callable directly from the outside?
- When would you use conditional types in a return type instead of overloads?

---

## 20. tsconfig.json key settings (target, module, moduleResolution, paths, baseUrl)

**Difficulty:** Medium

**Answer:**
- `target`: The ECMAScript version TS compiles down to (e.g., `ES2015`, `ESNext`).
- `module`: The module system generated (e.g., `CommonJS` for Node, `ESNext` for Webpack/Vite).
- `moduleResolution`: How imports are resolved (`node` or `bundler`).
- `baseUrl` / `paths`: Configures absolute path imports to avoid `../../../../`.

**Example:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"]
    }
  }
}
```

**Follow-up questions interviewers might ask:**
- If you use `paths` in `tsconfig.json`, does tsc modify the paths in the output JS files? (No, you need Webpack/Vite config or `tsc-alias`).
- What does `skipLibCheck` do, and why is it commonly enabled in React projects?

---

## 21. Decorators (experimental, for NestJS context)

**Difficulty:** Hard

**Answer:**
Decorators are a meta-programming feature (often used in Angular or NestJS). They allow you to annotate and modify classes, methods, and properties at design time. Requires `experimentalDecorators: true`.

**Example:**
```typescript
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
}
```

**Follow-up questions interviewers might ask:**
- What are the differences between Class, Method, and Property decorators?
- How do decorators differ from higher-order functions?

---

## 22. Namespace vs Module

**Difficulty:** Easy

**Answer:**
- **Modules (ES6)**: Declare their dependencies via `import`/`export`. The standard way to structure code in modern TS/JS apps.
- **Namespaces**: TypeScript's older, internal way to organize code globally. They wrap code in an IIFE. Mostly obsolete in modern React/Node apps but still used in older declaration files (`.d.ts`).

**Example:**
```typescript
// Module (Preferred)
export class User {}

// Namespace (Legacy)
namespace Validation {
  export const isString = (s: any) => typeof s === "string";
}
```

**Follow-up questions interviewers might ask:**
- Why does the TS team recommend ES Modules over Namespaces today?
- When might you legitimately still use `declare namespace` in modern codebases?

---

## 23. Declaration files (.d.ts)

**Difficulty:** Medium

**Answer:**
`.d.ts` files provide type information for existing JavaScript code. They contain only types, interfaces, and signatures, with no implementation code. They tell the compiler about global variables or untyped third-party packages.

**Example:**
```typescript
// global.d.ts
declare module 'untyped-legacy-lib' {
  export function doSomething(param: string): void;
}

declare interface Window {
  myCustomGlobal: string;
}
```

**Follow-up questions interviewers might ask:**
- How does TypeScript know where to find `.d.ts` files? (Hint: `typeRoots`, `@types`).
- Can you write runtime implementation code inside a `.d.ts` file?

---

## 24. TypeScript with Redux Toolkit (typed hooks, typed slices)

**Difficulty:** Hard

**Answer:**
Redux Toolkit (RTK) was built with TS in mind. You typically need to type the `RootState` and `AppDispatch`, and then create typed versions of `useSelector` and `useDispatch` to use throughout your app.

**Example:**
```typescript
// store.ts
export const store = configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Follow-up questions interviewers might ask:**
- How do you type the `action.payload` inside an RTK slice reducer? (Hint: `PayloadAction<T>`).
- How does `createAsyncThunk` infer types?

---

## 25. Intersection types

**Difficulty:** Easy

**Answer:**
Intersection types combine multiple types into one, meaning an object must satisfy all intersected types. Done using the `&` operator. Highly useful for composing mixed properties.

**Example:**
```typescript
type ErrorHandling = {
  success: boolean;
  error?: { message: string };
};
type ArtworksData = {
  artworks: { title: string }[];
};

type ArtworksResponse = ArtworksData & ErrorHandling;

const res: ArtworksResponse = {
  success: true,
  artworks: [{ title: "Mona Lisa" }]
};
```

**Follow-up questions interviewers might ask:**
- What happens if two intersected types share a property but with different types (e.g., `string & number`)? (Hint: it becomes `never`).
- How does extending an interface differ from an intersection type?

---

## 26. Readonly & ReadonlyArray

**Difficulty:** Medium

**Answer:**
`Readonly<T>` is a utility type that makes all properties of an object immutable.
`ReadonlyArray<T>` (or `readonly T[]`) prevents array mutation (like `.push()` or assignment via index).

**Example:**
```typescript
interface User { name: string; }
const u: Readonly<User> = { name: "John" };
// u.name = "Doe"; // Error: Cannot assign to 'name' because it is a read-only property.

const nums: ReadonlyArray<number> = [1, 2, 3];
// nums.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'.
```

**Follow-up questions interviewers might ask:**
- Does `Readonly<T>` make nested properties read-only? (No, it is shallow).
- How would you create a `DeepReadonly` utility type?

---

## 27. Typing API responses & Zod/io-ts validation

**Difficulty:** Hard

**Answer:**
TypeScript only exists at compile time; it cannot guarantee that the JSON payload an API returns at runtime matches your types. Zod (or io-ts) solves this by providing runtime validation schemas that automatically infer TS types.

**Example:**
```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Extract TS type from the Zod schema
type User = z.infer<typeof UserSchema>;

async function fetchUser(): Promise<User> {
  const res = await fetch("/api/user");
  const data = await res.json();
  
  // Validates at runtime, throws if invalid
  return UserSchema.parse(data); 
}
```

**Follow-up questions interviewers might ask:**
- Why is it dangerous to simply do `const data = await res.json() as User`?
- How do you handle validation errors elegantly in the UI using Zod?

---

## 28. Covariance & contravariance

**Difficulty:** Hard

**Answer:**
These terms describe how types relate to each other when they are structured complexly.
- **Covariance:** Can I pass a MORE specific type where a LESS specific type is expected? (Typically YES for object properties and return types).
- **Contravariance:** Can I pass a LESS specific type where a MORE specific type is expected? (Typically YES for function parameters in strict mode).

**Example:**
```typescript
interface Animal { name: string; }
interface Dog extends Animal { bark: boolean; }

// Covariance (Return types): Dog is assignable to Animal
let getAnimal: () => Animal;
let getDog: () => Dog = () => ({ name: "Rex", bark: true });
getAnimal = getDog; // OK

// Contravariance (Parameters): 
let feedAnimal = (a: Animal) => {};
let feedDog = (d: Dog) => { console.log(d.bark); };
// feedDog = feedAnimal; // OK in strict mode
// feedAnimal = feedDog; // ERROR in strict mode. If we pass a generic Animal, it lacks 'bark'.
```

**Follow-up questions interviewers might ask:**
- Why does `strictFunctionTypes: true` enable contravariant checking for function parameters?
- How do arrays behave in TypeScript regarding variance? (They are covariant, which can actually cause runtime errors).

---

## 29. Typing higher-order components and render props

**Difficulty:** Hard

**Answer:**
When writing HOCs in React with TS, you must ensure the props of the inner component pass through correctly, and you manage the injected props.

**Example:**
```tsx
import React, { ComponentType } from 'react';

// Injected props
interface WithLoadingProps {
  isLoading: boolean;
}

function withLoading<P extends object>(
  Component: ComponentType<P>
): React.FC<P & WithLoadingProps> {
  return ({ isLoading, ...props }: P & WithLoadingProps) => {
    if (isLoading) return <div>Loading...</div>;
    return <Component {...(props as P)} />;
  };
}

// Usage
interface MyComponentProps { title: string; }
const MyComponent = ({ title }: MyComponentProps) => <h1>{title}</h1>;

const MyComponentWithLoading = withLoading(MyComponent);
// Requires both `title` and `isLoading` props now.
```

**Follow-up questions interviewers might ask:**
- Why is it often recommended to use custom Hooks instead of HOCs in modern React TypeScript applications?
- How do you type a Render Prop correctly?

---

## 30. Migrating JS to TS — strategies and common pitfalls

**Difficulty:** Medium

**Answer:**
**Strategy:**
1. Add `tsconfig.json` with `allowJs: true`.
2. Migrate tooling (Webpack, Vite, Jest) to handle `.ts`/`.tsx`.
3. Rename files incrementally: `.js` to `.ts` / `.tsx`.
4. Fix implicitly `any` types first (progressively turn on strict rules).

**Common Pitfalls:**
- Trying to turn on `strict: true` immediately, causing thousands of errors and blocking development.
- Relying too heavily on `any` to silence the compiler, defeating the purpose of the migration.
- Dealing with third-party libraries that lack `@types/` packages.

**Follow-up questions interviewers might ask:**
- How can `// @ts-expect-error` or `// @ts-ignore` be used during a migration? Which is safer and why?
- What is JSDoc, and how can it be used to type-check JavaScript files without renaming them to `.ts`?
