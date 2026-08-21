# Node.js — Interview Q&A

## Table of Contents
1. [Explain the Node.js Event Loop](#1-explain-the-nodejs-event-loop)
2. [Streams and Buffers](#2-streams-and-buffers)
3. [Cluster Module](#3-cluster-module)
4. [Worker Threads](#4-worker-threads)
5. [EventEmitter](#5-eventemitter)
6. [CJS vs ESM](#6-cjs-vs-esm)
7. [Error Handling Middleware](#7-error-handling-middleware)
8. [process.nextTick vs setImmediate](#8-processnexttick-vs-setimmediate)
9. [File System Operations](#9-file-system-operations)
10. [Package Management](#10-package-management)
11. [Security Best Practices](#11-security-best-practices)
12. [Memory Leaks](#12-memory-leaks)
13. [Debugging Memory Leaks](#13-debugging-memory-leaks)
14. [Child Processes (fork vs spawn)](#14-child-processes-fork-vs-spawn)
15. [Garbage Collection](#15-garbage-collection)
16. [Uncaught Exception vs Unhandled Rejection](#16-uncaught-exception-vs-unhandled-rejection)
17. [Graceful Shutdown](#17-graceful-shutdown)
18. [EventEmitter Memory Leaks](#18-eventemitter-memory-leaks)
19. [Creating an HTTP server](#19-creating-an-http-server)
20. [REST vs GraphQL in Node](#20-rest-vs-graphql-in-node)
21. [Express vs Fastify](#21-express-vs-fastify)
22. [Authentication (JWT)](#22-authentication-jwt)
23. [WebSockets](#23-websockets)
24. [Rate Limiting](#24-rate-limiting)
25. [Microservices architecture](#25-microservices-architecture)
26. [Connection Pooling](#26-connection-pooling)
27. [Logging (Winston/Pino)](#27-logging-winstonpino)
28. [Environment Variables](#28-environment-variables)
29. [Caching with Redis](#29-caching-with-redis)
30. [Unit Testing (Jest)](#30-unit-testing-jest)

---

## 1. Explain the Node.js Event Loop

**Difficulty:** Medium

**Answer:**
The Event Loop is what allows Node.js to perform non-blocking I/O operations, despite JavaScript being single-threaded. It offloads operations to the system kernel whenever possible using libuv. When operations complete, the kernel tells Node.js, and the corresponding callbacks are added to the poll queue to eventually be executed. The loop has several phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks.

**Example:**
```javascript
setTimeout(() => console.log('Timer'), 0);
setImmediate(() => console.log('Immediate'));
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('NextTick'));

// Output: NextTick, Promise, Timer, Immediate
```

**Follow-up questions interviewers might ask:**
- What is the difference between `process.nextTick()` and `setImmediate()`?
- How does libuv help Node.js?

---

## 2. Streams and Buffers

**Difficulty:** Easy

**Answer:**
A Buffer is a temporary memory area that stores raw binary data. A Stream is an abstract interface for working with continuous data flow, rather than reading it all into memory at once. Streams use Buffers internally to handle chunks of data. Streams are highly memory-efficient for large files.

**Example:**
```javascript
const fs = require('fs');
const readableStream = fs.createReadStream('large-file.txt');
const writableStream = fs.createWriteStream('output.txt');

readableStream.pipe(writableStream);
```

**Follow-up questions interviewers might ask:**
- What are the four types of streams in Node.js?
- How do you handle stream errors?

---

## 3. Cluster Module

**Difficulty:** Medium

**Answer:**
Since Node.js runs in a single thread, it can only utilize one CPU core by default. The `cluster` module allows creating child processes (workers) that share the same server port. The master process routes incoming requests to worker processes using round-robin scheduling, effectively scaling the app across multiple CPU cores.

**Example:**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  cluster.on('exit', (worker) => cluster.fork()); // auto-restart
} else {
  http.createServer((req, res) => res.end('Hello')).listen(8000);
}
```

**Follow-up questions interviewers might ask:**
- How is the cluster module different from worker threads?
- Does clustering share memory between workers?

---

## 4. Worker Threads

**Difficulty:** Hard

**Answer:**
Unlike the `cluster` module, `worker_threads` run in the same process and share memory (using `SharedArrayBuffer`). They are useful for offloading CPU-intensive JavaScript tasks (e.g., cryptography, image processing) without blocking the main event loop, whereas clustering is typically used for scaling I/O (network requests).

**Example:**
```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('From worker:', msg));
} else {
  parentPort.postMessage('Hello from Worker');
}
```

**Follow-up questions interviewers might ask:**
- When would you use a Worker Thread over a Child Process?
- How do you pass data between the main thread and a worker?

---

## 5. EventEmitter

**Difficulty:** Easy

**Answer:**
`EventEmitter` is a core module that facilitates event-driven programming in Node.js. It allows objects to emit named events that cause previously registered callback functions (listeners) to be called. Many core Node.js APIs, like Streams and HTTP servers, inherit from EventEmitter.

**Example:**
```javascript
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('event', (a, b) => {
  console.log('Event fired with:', a, b);
});
myEmitter.emit('event', 'arg1', 'arg2');
```

**Follow-up questions interviewers might ask:**
- How do you prevent memory leaks with EventEmitters?
- Can you make EventEmitter synchronous or asynchronous?

---

## 6. CJS vs ESM

**Difficulty:** Easy

**Answer:**
CommonJS (CJS) uses `require()` and `module.exports`, and it loads modules synchronously. ECMAScript Modules (ESM) use `import` and `export`, and they load modules asynchronously, which allows for static analysis and tree-shaking. Node.js natively supports both.

**Example:**
```javascript
// CJS
const fs = require('fs');
module.exports = function() {};

// ESM (requires "type": "module" in package.json or .mjs extension)
import fs from 'fs';
export default function() {};
```

**Follow-up questions interviewers might ask:**
- How do you enable ESM in a Node.js project?
- Can you use `require()` inside an ES module?

---

## 7. Error Handling Middleware

**Difficulty:** Medium

**Answer:**
In Express, error handling middleware is a special middleware function with exactly four arguments: `(err, req, res, next)`. When an error is passed to `next(err)` from any route, Express will skip normal middleware and go straight to the error handler.

**Example:**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
  next(new Error('Something broke!'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});
```

**Follow-up questions interviewers might ask:**
- How do you handle unhandled promise rejections globally?
- Why must the error handler have exactly four arguments?

---

## 8. process.nextTick vs setImmediate

**Difficulty:** Hard

**Answer:**
`process.nextTick()` callbacks are executed immediately after the current operation completes, before the event loop continues to the next phase. `setImmediate()` callbacks are executed in the "check" phase of the event loop, typically after I/O events. `process.nextTick()` can potentially block the event loop if called recursively.

**Example:**
```javascript
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
console.log('Sync code');

// Output: Sync code, nextTick, setImmediate
```

**Follow-up questions interviewers might ask:**
- Why might excessive `process.nextTick` calls be dangerous?
- In what event loop phase does `setTimeout` run?

---

## 9. File System Operations

**Difficulty:** Easy

**Answer:**
The `fs` module provides APIs to interact with the file system. It supports synchronous (`fs.readFileSync`), callback-based asynchronous (`fs.readFile`), and Promise-based asynchronous (`fs.promises.readFile`) methods. The Promise API is generally preferred in modern Node.js code.

**Example:**
```javascript
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('config.json', 'utf8');
    console.log(JSON.parse(data));
  } catch (err) {
    console.error('File read error', err);
  }
}
```

**Follow-up questions interviewers might ask:**
- Why should you avoid synchronous `fs` methods in production?
- How would you efficiently read a 10GB file?

---

## 10. Package Management

**Difficulty:** Easy

**Answer:**
npm and yarn are package managers for Node.js. They handle dependency installation, versioning, and script execution. `package-lock.json` (or `yarn.lock`) ensures that dependencies are deterministically resolved to exact versions across different environments, preventing "it works on my machine" issues.

**Example:**
```json
// package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

**Follow-up questions interviewers might ask:**
- What is the difference between dependencies and devDependencies?
- What does the caret (`^`) mean in a version number?

---

## 11. Security Best Practices

**Difficulty:** Medium

**Answer:**
Security in Node.js involves sanitizing user input to prevent SQL/NoSQL injection, using HTTPS, implementing rate limiting, and securing HTTP headers. In Express, the `helmet` package is commonly used to automatically set secure HTTP headers (like CSP, HSTS).

**Example:**
```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet()); // Secures HTTP headers automatically
```

**Follow-up questions interviewers might ask:**
- How do you prevent Cross-Site Scripting (XSS) in Node.js?
- What is Cross-Site Request Forgery (CSRF) and how do you mitigate it?

---

## 12. Memory Leaks

**Difficulty:** Hard

**Answer:**
A memory leak in Node.js occurs when objects are no longer needed but are still referenced, preventing the garbage collector from freeing the memory. Common causes include uncleared intervals/timeouts, unbounded caches, and event listeners that are never removed.

**Example:**
```javascript
// Memory leak example
const leakyCache = {};
app.get('/data', (req, res) => {
  // Keeps accumulating memory endlessly
  leakyCache[req.query.id] = new Array(1000000).fill('data');
  res.send('ok');
});
```

**Follow-up questions interviewers might ask:**
- How does Node.js garbage collection work?
- How do WeakMap and WeakSet help with memory management?

---

## 13. Debugging Memory Leaks

**Difficulty:** Medium

**Answer:**
To debug memory leaks, you can run Node.js with the `--inspect` flag and connect Chrome DevTools. You take heap snapshots over time and compare them to see which objects are growing continuously. Tools like `clinic.js` or PM2 can also monitor memory usage.

**Example:**
```bash
# Start node with inspector enabled
node --inspect server.js
```
*In Chrome, go to `chrome://inspect`, connect to the target, and take Heap Snapshots in the Memory tab.*

**Follow-up questions interviewers might ask:**
- What is a Heap Snapshot?
- What command line flags can help limit Node's memory usage?

---

## 14. Child Processes (fork vs spawn)

**Difficulty:** Medium

**Answer:**
Child processes allow Node to execute external scripts or commands. 
- `spawn`: Runs a command in a new process and returns streams for I/O. Good for large data.
- `exec`: Runs a command in a shell and buffers the output. Good for small output.
- `fork`: A special case of `spawn` designed specifically to run Node.js modules, with a built-in IPC (Inter-Process Communication) channel.

**Example:**
```javascript
const { fork } = require('child_process');

const child = fork('./heavyTask.js');
child.send({ start: true });
child.on('message', (result) => console.log('Result:', result));
```

**Follow-up questions interviewers might ask:**
- Why use `spawn` over `exec` for large outputs?
- How do you kill a child process?

---

## 15. Garbage Collection

**Difficulty:** Hard

**Answer:**
Node.js relies on the V8 engine's garbage collector. It divides the heap into a New Space (for short-lived objects) and an Old Space (for long-lived objects). Scavenger GC frequently cleans New Space, while Mark-Sweep/Mark-Compact GC runs less frequently to clean Old Space.

**Example:**
```javascript
// You can manually trigger GC for testing (requires --expose-gc flag)
if (global.gc) {
  global.gc();
} else {
  console.log('Garbage collection unavailable. Use --expose-gc');
}
```

**Follow-up questions interviewers might ask:**
- What is the "Stop-The-World" phase in garbage collection?
- What is the default memory limit for a Node.js process?

---

## 16. Uncaught Exception vs Unhandled Rejection

**Difficulty:** Medium

**Answer:**
`uncaughtException` occurs when a synchronous error is thrown and not caught by a `try...catch` block. `unhandledRejection` occurs when a Promise is rejected and no `.catch()` is attached to handle it. Uncaught exceptions usually leave the app in an unstable state and should trigger a process restart.

**Example:**
```javascript
process.on('uncaughtException', (err) => {
  console.error('Fatal Error:', err);
  process.exit(1); // Exit is recommended
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
```

**Follow-up questions interviewers might ask:**
- Why is it bad practice to ignore `uncaughtException` and continue running?
- How does Node 15+ handle unhandled rejections by default?

---

## 17. Graceful Shutdown

**Difficulty:** Medium

**Answer:**
Graceful shutdown ensures that an application finishes processing ongoing requests before shutting down, rather than killing them mid-flight. It involves listening to termination signals (`SIGTERM`, `SIGINT`), stopping new connections, and closing database pools.

**Example:**
```javascript
const server = app.listen(3000);

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    // Close DB connections here
    process.exit(0);
  });
});
```

**Follow-up questions interviewers might ask:**
- What is the difference between `SIGTERM` and `SIGKILL`?
- How do you handle long-polling connections during shutdown?

---

## 18. EventEmitter Memory Leaks

**Difficulty:** Easy

**Answer:**
A common memory leak in Node.js occurs when you add too many listeners to a single EventEmitter (default limit is 10). If listeners are added inside a frequently called function (like a request handler) but never removed, memory usage will grow indefinitely.

**Example:**
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Fix: Remove the listener when done, or use .once()
app.get('/', (req, res) => {
  const handler = () => console.log('Event!');
  emitter.once('data', handler); // Using once prevents leaks
  res.send('ok');
});
```

**Follow-up questions interviewers might ask:**
- How do you increase the maximum number of listeners?
- How do you remove a specific listener?

---

## 19. Creating an HTTP server

**Difficulty:** Easy

**Answer:**
The built-in `http` module can create a basic web server without any external dependencies. While frameworks like Express are preferred for complex routing, `http` is the foundation.

**Example:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

**Follow-up questions interviewers might ask:**
- How does Express utilize the built-in HTTP module?
- How do you read the request body in a pure HTTP server?

---

## 20. REST vs GraphQL in Node

**Difficulty:** Medium

**Answer:**
REST exposes multiple endpoints, each returning a fixed data structure. GraphQL exposes a single endpoint and allows clients to request exactly the data they need, preventing over-fetching and under-fetching. Node.js supports both seamlessly (e.g., Express vs Apollo Server).

**Example:**
```javascript
// GraphQL query example
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query { hello: String }
`;
const resolvers = {
  Query: { hello: () => 'Hello world!' },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => console.log(`Server ready at ${url}`));
```

**Follow-up questions interviewers might ask:**
- What is the N+1 problem in GraphQL and how does DataLoader solve it?
- When would you choose REST over GraphQL?

---

## 21. Express vs Fastify

**Difficulty:** Medium

**Answer:**
Express is the most popular Node.js web framework, known for its massive ecosystem and middleware. Fastify is a newer framework heavily focused on performance and low overhead, using schema-based serialization to achieve significantly higher requests-per-second than Express.

**Example:**
```javascript
const fastify = require('fastify')({ logger: true });

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) process.exit(1);
});
```

**Follow-up questions interviewers might ask:**
- Why is Fastify generally faster than Express?
- Can you use Express middleware in Fastify?

---

## 22. Authentication (JWT)

**Difficulty:** Medium

**Answer:**
JSON Web Tokens (JWT) are a stateless way to handle authentication. After verifying credentials, the server signs a JWT and sends it to the client. The client sends it in the `Authorization` header on subsequent requests. The server verifies the signature without needing a database lookup.

**Example:**
```javascript
const jwt = require('jsonwebtoken');

// Sign a token
const token = jwt.sign({ userId: 123 }, 'secret_key', { expiresIn: '1h' });

// Verify a token
try {
  const decoded = jwt.verify(token, 'secret_key');
  console.log(decoded.userId);
} catch (err) {
  console.error('Invalid token');
}
```

**Follow-up questions interviewers might ask:**
- Where should the client store the JWT (Local Storage vs HttpOnly Cookies)?
- How do you revoke a JWT before it expires?

---

## 23. WebSockets

**Difficulty:** Medium

**Answer:**
WebSockets provide a persistent, full-duplex communication channel over a single TCP connection. Unlike HTTP requests, which are stateless and client-initiated, WebSockets allow the server to push data to the client at any time. `socket.io` and `ws` are popular Node.js libraries for this.

**Example:**
```javascript
const io = require('socket.io')(3000);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast to everyone
  });
});
```

**Follow-up questions interviewers might ask:**
- How do WebSockets differ from Server-Sent Events (SSE)?
- How do you scale WebSockets across multiple Node.js instances?

---

## 24. Rate Limiting

**Difficulty:** Easy

**Answer:**
Rate limiting restricts the number of requests a client can make within a certain timeframe to protect APIs from brute-force attacks or DDoS. In Node.js/Express, libraries like `express-rate-limit` backed by an in-memory store or Redis are commonly used.

**Example:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

**Follow-up questions interviewers might ask:**
- Why is an in-memory rate limiter bad for a multi-instance deployment?
- How does the token bucket algorithm work?

---

## 25. Microservices architecture

**Difficulty:** Hard

**Answer:**
Microservices break down a monolithic application into small, independent services communicating over a network (e.g., HTTP, gRPC, message brokers like RabbitMQ). In Node.js, this involves managing API Gateways, service discovery, distributed tracing, and fault tolerance.

**Example:**
```javascript
// Example using a message broker (amqplib) to communicate between services
const amqp = require('amqplib');

async function sendTask() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  ch.sendToQueue('tasks', Buffer.from('Process data'));
}
```

**Follow-up questions interviewers might ask:**
- How do you handle distributed transactions across microservices?
- What is an API Gateway?

---

## 26. Connection Pooling

**Difficulty:** Medium

**Answer:**
Establishing a new database connection for every request is slow and resource-intensive. Connection pooling maintains a set of active database connections in memory, reusing them for incoming requests.

**Example:**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'dbuser',
  host: 'database.server.com',
  database: 'mydb',
  password: 'secretpassword',
  port: 5432,
  max: 20 // Max number of connections in the pool
});

// Reuse connection from the pool
pool.query('SELECT NOW()', (err, res) => {
  console.log(res.rows);
});
```

**Follow-up questions interviewers might ask:**
- What happens if the connection pool limit is reached?
- How do you handle stale or broken connections in a pool?

---

## 27. Logging (Winston/Pino)

**Difficulty:** Easy

**Answer:**
`console.log` is synchronous and can block the event loop in older Node versions or certain environments; it also lacks structure. Libraries like Winston or Pino provide structured, asynchronous JSON logging, log levels (info, error, debug), and external transports (saving logs to files or external services).

**Example:**
```javascript
const pino = require('pino');
const logger = pino({ level: 'info' });

logger.info({ user: 'Alice' }, 'User logged in');
logger.error(new Error('Connection failed'), 'DB Error');
```

**Follow-up questions interviewers might ask:**
- Why is structured JSON logging preferred in production?
- How do you track a single request across multiple log entries?

---

## 28. Environment Variables

**Difficulty:** Easy

**Answer:**
Environment variables keep sensitive data (passwords, API keys) and configuration out of the source code. In Node.js, they are accessed via `process.env`. The `dotenv` package is often used to load variables from a `.env` file during local development.

**Example:**
```javascript
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
console.log(`Connecting to ${dbHost}`);
```

**Follow-up questions interviewers might ask:**
- Should you commit your `.env` file to version control?
- How do you enforce required environment variables at startup?

---

## 29. Caching with Redis

**Difficulty:** Medium

**Answer:**
Caching stores frequently accessed data in memory to reduce database load and improve response times. Redis is a popular in-memory data store used with Node.js. Cached data should typically have a Time-To-Live (TTL) to ensure freshness.

**Example:**
```javascript
const redis = require('redis');
const client = redis.createClient();
await client.connect();

async function getUser(id) {
  const cached = await client.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  await client.set(`user:${id}`, JSON.stringify(user), { EX: 3600 }); // 1 hour TTL
  return user;
}
```

**Follow-up questions interviewers might ask:**
- What is cache invalidation and why is it difficult?
- What happens when Redis runs out of memory?

---

## 30. Unit Testing (Jest)

**Difficulty:** Easy

**Answer:**
Unit testing ensures individual functions or components work as expected. Jest is a popular testing framework that provides test runners, assertion libraries, and mocking capabilities out of the box.

**Example:**
```javascript
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// math.test.js
const { add } = require('./math');

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});
```

**Follow-up questions interviewers might ask:**
- What is the difference between a mock and a stub?
- How do you measure test coverage?
