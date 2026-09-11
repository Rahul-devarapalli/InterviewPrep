//closure example
function createCounter() {
  let count = 0;
  console.log(count); // 0 — count is accessible here
  return function increment() {
    console.log(count);
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2 — count persisted between calls

//Debounce example
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function fetchSuggestions(query) {
  console.log(`API Call sent for: ${query}`);
}

// 2. Wrap it with debounce (wait 500ms after the last keystroke)
const processSearch = debounce(fetchSuggestions, 500);
