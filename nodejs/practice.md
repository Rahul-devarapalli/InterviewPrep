# Node.js — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

---

1. **Write a basic HTTP server in Node.js that returns a 200 OK and a simple JSON response.**
   _Hint: Use the built-in `http` module. Don't forget `res.writeHead` and `res.end`._

2. **Read a large text file using streams and pipe it to the response object of an HTTP server.**
   _Hint: Use `fs.createReadStream` and `.pipe(res)`._

3. **Write an Express error-handling middleware that logs the error and sends a generic 500 error response.**
   _Hint: Error-handling middleware in Express takes exactly four arguments: `(err, req, res, next)`._

4. **Implement an EventEmitter that emits a 'ping' event every second, and listen for it to log 'pong'.**
   _Hint: Extend the `EventEmitter` class and use `setInterval`._

5. **Setup a child process using `fork` to run a heavy computation task without blocking the main event loop.**
   _Hint: Use `child_process.fork()` and communicate using `process.on('message', ...)` and `process.send(...)`._

6. **Write a function to handle Graceful Shutdown of an Express server when receiving a SIGTERM signal.**
   _Hint: Listen to `process.on('SIGTERM', ...)` and call `server.close()` before closing DB connections._

7. **Implement basic rate limiting in an Express application without external libraries using a simple in-memory store.**
   _Hint: Keep a `Map` or object tracking IP addresses and timestamps, and clear old entries periodically._

8. **Connect to a PostgreSQL or MySQL database using a connection pool and execute a simple query.**
   _Hint: Use a library like `pg` or `mysql2`, instantiate a `Pool`, and acquire a client._

9. **Implement a cluster setup where the master forks a worker for each CPU core, and restarts workers if they die.**
   _Hint: Use the `cluster` module, check `cluster.isPrimary` (or `isMaster`), loop over `os.cpus().length`, and listen on `cluster.on('exit')`._

10. **Debug a memory leak scenario: Write a script that deliberately leaks memory and explain how you would generate and analyze a heap snapshot.**
    _Hint: Store objects in a global array. Use `v8.writeHeapSnapshot()` or run Node with `--inspect` and use Chrome DevTools._
