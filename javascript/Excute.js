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
