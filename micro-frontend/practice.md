# Micro-Frontend & Build Tools — Practice

Test your knowledge with these 10 practice questions, ordered from easiest to hardest. Only hints are provided!

## 1. The Entry Point
**Question:** In a standard Webpack 5 configuration, how do you define multiple entry points to generate separate bundles (e.g., one for the main app, one for an admin dashboard)?
*Hint: Look into providing an object rather than a string to a specific property in `webpack.config.js`.*

## 2. Loader Ordering
**Question:** When using Webpack to process CSS, you typically need both `css-loader` and `style-loader`. In the `use` array, what is the correct order to place them, and why does the order matter?
*Hint: Webpack loaders evaluate from right-to-left (or bottom-to-top).*

## 3. Basic Module Federation
**Question:** You are creating a Remote application using Webpack 5 Module Federation. What is the property name in the plugin configuration used to expose a local component to the outside world?
*Hint: It's an object where keys are the public paths and values are the local file paths.*

## 4. Vite vs Webpack
**Question:** During development, why does Vite start up significantly faster than Webpack, especially on very large codebases?
*Hint: Think about what Webpack does with the entire module graph before the server starts, compared to how Vite utilizes browser-native ESM.*

## 5. Singleton Dependencies
**Question:** In a Module Federation setup, you see an error in the console: `Uncaught Error: Minified React error #321; ... Invalid hook call`. What did you likely forget to configure in your `shared` dependencies?
*Hint: React requires that only one instance of it runs in the DOM at any time.*

## 6. Code Splitting
**Question:** You want to lazy load a charting library only when the user clicks the "View Chart" button. How do you implement this in modern JavaScript/Webpack without modifying `webpack.config.js`?
*Hint: Use a specific function-like syntax that returns a Promise.*

## 7. CSS Isolation
**Question:** Your Host application has a global CSS rule `button { padding: 10px; }`. Your Micro-Frontend is supposed to have `padding: 20px` on its buttons, but the Host styles are interfering. What are two distinct strategies to prevent this leakage?
*Hint: One strategy involves build tools generating unique hashes. The other involves a browser API often used with Web Components.*

## 8. Cross-MFE Communication
**Question:** MFE-A (Product List) and MFE-B (Shopping Cart) are rendered on the same page. When a user clicks "Add to Cart" in MFE-A, MFE-B needs to update. Without using Redux or Context, how can MFE-A notify MFE-B?
*Hint: Utilize a standard API built into the browser `window` object.*

## 9. Dependency Version Conflicts
**Question:** Host uses `lodash@4.10.0`. Remote A uses `lodash@4.17.21`. Both specify `lodash` in their Module Federation `shared` config without the `singleton` flag. What happens at runtime when the Host loads Remote A? 
*Hint: Does Webpack load one version, both versions, or throw an error?*

## 10. Turbopack Architecture
**Question:** Turbopack claims massive performance gains over Webpack due to its "incremental architecture". What does this mean in practice when a developer saves a file during development?
*Hint: Think about how it caches outputs of functions and avoids re-executing tasks whose inputs haven't changed.*
