# SQL — 30 Interview Questions & Answers

## Table of Contents
1. [Explain the different types of JOINs](#1-explain-the-different-types-of-joins)
2. [What is the difference between WHERE and HAVING?](#2-what-is-the-difference-between-where-and-having)
3. [Explain ACID properties](#3-explain-acid-properties)
4. [What are database indexes and how do they work?](#4-what-are-database-indexes-and-how-do-they-work)
5. [Explain the different types of indexes (B-Tree, Hash, Composite)](#5-explain-the-different-types-of-indexes-b-tree-hash-composite)
6. [What is normalization? Explain 1NF, 2NF, 3NF](#6-what-is-normalization-explain-1nf-2nf-3nf)
7. [What is denormalization and when would you use it?](#7-what-is-denormalization-and-when-would-you-use-it)
8. [Explain the N+1 query problem and how to fix it](#8-explain-the-n1-query-problem-and-how-to-fix-it)
9. [What are transaction isolation levels?](#9-what-are-transaction-isolation-levels)
10. [Explain primary key vs foreign key vs unique key](#10-explain-primary-key-vs-foreign-key-vs-unique-key)
11. [What is a composite key?](#11-what-is-a-composite-key)
12. [Explain the difference between DELETE, TRUNCATE, and DROP](#12-explain-the-difference-between-delete-truncate-and-drop)
13. [What is a subquery, and correlated vs non-correlated subqueries?](#13-what-is-a-subquery-and-correlated-vs-non-correlated-subqueries)
14. [Explain window functions](#14-explain-window-functions)
15. [What is a CTE (Common Table Expression)?](#15-what-is-a-cte-common-table-expression)
16. [Explain GROUP BY and aggregate functions](#16-explain-group-by-and-aggregate-functions)
17. [What is a database view, and materialized vs regular views?](#17-what-is-a-database-view-and-materialized-vs-regular-views)
18. [Explain database locking — optimistic vs pessimistic](#18-explain-database-locking--optimistic-vs-pessimistic)
19. [What is a deadlock and how do you prevent it?](#19-what-is-a-deadlock-and-how-do-you-prevent-it)
20. [Explain query execution plans (EXPLAIN)](#20-explain-query-execution-plans-explain)
21. [What is database sharding vs replication?](#21-what-is-database-sharding-vs-replication)
22. [Explain the difference between clustered and non-clustered indexes](#22-explain-the-difference-between-clustered-and-non-clustered-indexes)
23. [What is a stored procedure vs a function?](#23-what-is-a-stored-procedure-vs-a-function)
24. [Explain database triggers](#24-explain-database-triggers)
25. [What is connection pooling and why does it matter?](#25-what-is-connection-pooling-and-why-does-it-matter)
26. [Explain the difference between UNION and UNION ALL](#26-explain-the-difference-between-union-and-union-all)
27. [What are constraints (CHECK, NOT NULL, DEFAULT)?](#27-what-are-constraints-check-not-null-default)
28. [Explain how you'd design a schema for a reconciliation/matching system](#28-explain-how-youd-design-a-schema-for-a-reconciliationmatching-system)
29. [What is a self-join, and when would you use one?](#29-what-is-a-self-join-and-when-would-you-use-one)
30. [How would you optimize a slow query?](#30-how-would-you-optimize-a-slow-query)

---

## 1. Explain the different types of JOINs

**Difficulty:** Easy

**Answer:**
`INNER JOIN` returns only rows with matches in both tables. `LEFT JOIN` returns all rows from the left table plus matched rows from the right (nulls where no match exists). `RIGHT JOIN` is the mirror of that. `FULL OUTER JOIN` returns all rows from both tables, matched where possible and null-filled otherwise. `CROSS JOIN` returns the Cartesian product — every row from one table paired with every row from the other.

**Example:**
```sql
SELECT o.id, o.amount, c.name
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;
-- Returns all orders, even ones with a missing/deleted customer (c.name = NULL)
```

**Follow-up questions interviewers might ask:**
- When would a `LEFT JOIN` return more rows than the left table itself has?
- How do you find unmatched rows only (an "anti-join") using `LEFT JOIN`?

---

## 2. What is the difference between WHERE and HAVING?

**Difficulty:** Easy

**Answer:**
`WHERE` filters individual rows before grouping/aggregation happens, and cannot reference aggregate functions. `HAVING` filters groups after `GROUP BY` has aggregated the data, so it can reference aggregates like `COUNT()` or `SUM()`. If you don't need aggregation, `WHERE` is more efficient since it filters earlier in query execution.

**Example:**
```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
WHERE status = 'completed'      -- filters rows first
GROUP BY customer_id
HAVING COUNT(*) > 5;            -- filters groups after aggregation
```

**Follow-up questions interviewers might ask:**
- Can you use an alias defined in `SELECT` inside a `HAVING` clause? What about `WHERE`?
- Why does putting an aggregate filter in `WHERE` instead of `HAVING` throw an error?

---

## 3. Explain ACID properties

**Difficulty:** Medium

**Answer:**
**Atomicity** — a transaction either fully completes or fully rolls back, no partial state. **Consistency** — a transaction moves the database from one valid state to another, respecting all constraints. **Isolation** — concurrent transactions don't interfere with each other's intermediate state (controlled by isolation levels). **Durability** — once committed, changes survive even a system crash, typically via write-ahead logging.

**Example:**
```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- If the second UPDATE fails, the first is rolled back too — atomicity in action
```

**Follow-up questions interviewers might ask:**
- How does a reconciliation system rely on atomicity when matching and updating transaction pairs?
- What's the difference between how relational databases and NoSQL databases (like MongoDB) handle ACID guarantees?

---

## 4. What are database indexes and how do they work?

**Difficulty:** Medium

**Answer:**
An index is a separate data structure (most commonly a B-Tree) that stores a sorted reference to column values and pointers to the actual rows, allowing the database to find rows without scanning the entire table. They dramatically speed up `WHERE`, `JOIN`, and `ORDER BY` operations on indexed columns, but slow down writes (`INSERT`/`UPDATE`/`DELETE`) since the index must be updated too, and they consume additional disk space.

**Example:**
```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Without index: full table scan, O(n)
-- With index: B-Tree lookup, roughly O(log n)
SELECT * FROM orders WHERE customer_id = 42;
```

**Follow-up questions interviewers might ask:**
- Why shouldn't you index every column "just in case"?
- How would you decide which columns to index in a high-write reconciliation table?

---

## 5. Explain the different types of indexes (B-Tree, Hash, Composite)

**Difficulty:** Medium

**Answer:**
**B-Tree** is the default and most common index type — good for equality and range queries (`<`, `>`, `BETWEEN`), sorted order. **Hash** indexes are optimized purely for equality lookups (`=`) and are faster for that specific case but don't support range queries or sorting. **Composite (multi-column)** indexes cover multiple columns together, but column order matters — the index is only useful for queries filtering on a left-to-right prefix of the indexed columns.

**Example:**
```sql
CREATE INDEX idx_orders_status_date ON orders(status, created_at);

-- Uses the index efficiently (leftmost prefix):
SELECT * FROM orders WHERE status = 'pending';
SELECT * FROM orders WHERE status = 'pending' AND created_at > '2026-01-01';

-- Does NOT use the index efficiently (skips leftmost column):
SELECT * FROM orders WHERE created_at > '2026-01-01';
```

**Follow-up questions interviewers might ask:**
- Why does column order matter in a composite index?
- When would a Hash index outperform a B-Tree index, and why is it rarely the default choice?

---

## 6. What is normalization? Explain 1NF, 2NF, 3NF

**Difficulty:** Medium

**Answer:**
Normalization organizes data to reduce redundancy and prevent update anomalies. **1NF** requires atomic column values (no repeating groups or arrays in a single field). **2NF** requires 1NF plus every non-key column depending on the entire primary key (relevant for composite keys, eliminating partial dependency). **3NF** requires 2NF plus no transitive dependencies — non-key columns shouldn't depend on other non-key columns.

**Example:**
```sql
-- Violates 3NF: city depends on zip_code, not directly on order_id
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  zip_code VARCHAR(10),
  city VARCHAR(50)  -- transitively dependent on zip_code
);

-- 3NF fix: separate zip_code -> city into its own table
CREATE TABLE zip_codes (zip_code VARCHAR(10) PRIMARY KEY, city VARCHAR(50));
CREATE TABLE orders (order_id INT PRIMARY KEY, zip_code VARCHAR(10) REFERENCES zip_codes(zip_code));
```

**Follow-up questions interviewers might ask:**
- What update anomaly does normalization actually prevent — walk through a concrete example?
- Have you had to trade off normalization for query performance in a real project?

---

## 7. What is denormalization and when would you use it?

**Difficulty:** Medium

**Answer:**
Denormalization deliberately introduces redundancy (duplicating data or pre-computing aggregates) to reduce expensive joins and improve read performance, at the cost of extra storage and more complex write logic to keep duplicated data in sync. It's common in read-heavy systems, reporting/analytics tables, or caching layers where query speed matters more than storage efficiency or strict normalization.

**Example:**
```sql
-- Normalized: requires a JOIN every time you display an order
SELECT o.id, c.name FROM orders o JOIN customers c ON o.customer_id = c.id;

-- Denormalized: customer_name duplicated directly on the orders table
-- avoids the JOIN, at the cost of needing to update it if the customer renames
ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255);
```

**Follow-up questions interviewers might ask:**
- How do you keep denormalized data consistent when the source of truth changes?
- Would you denormalize a reconciliation matching table for reporting purposes? Why or why not?

---

## 8. Explain the N+1 query problem and how to fix it

**Difficulty:** Medium

**Answer:**
The N+1 problem happens when you fetch a list of N parent records with one query, then run a separate query for each parent's related data — resulting in N+1 total queries instead of 2. It's a common ORM pitfall (lazy loading). The fix is eager loading via a `JOIN` or a single batched query (`WHERE id IN (...)`) that fetches all related data at once.

**Example:**
```sql
-- N+1 problem (pseudocode with an ORM):
-- SELECT * FROM orders;              -- 1 query
-- for each order: SELECT * FROM customers WHERE id = order.customer_id; -- N queries

-- Fixed with a JOIN:
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id;
-- 1 query total
```

**Follow-up questions interviewers might ask:**
- How does Prisma's `include` or TypeORM's `relations` option solve N+1 under the hood?
- Have you encountered and fixed an N+1 issue in a real project?

---

## 9. What are transaction isolation levels?

**Difficulty:** Hard

**Answer:**
Isolation levels control how much one transaction can see of another's uncommitted changes, trading consistency for concurrency. **Read Uncommitted** allows dirty reads. **Read Committed** (Postgres default) prevents dirty reads but allows non-repeatable reads. **Repeatable Read** (MySQL default) prevents non-repeatable reads but can allow phantom reads. **Serializable** is the strictest, fully preventing all anomalies by effectively serializing transactions, at the cost of the most contention.

**Example:**
```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT balance FROM accounts WHERE id = 1;
  -- No other transaction can modify this row until this transaction commits
COMMIT;
```

**Follow-up questions interviewers might ask:**
- What's the difference between a "dirty read," "non-repeatable read," and "phantom read"?
- Which isolation level would you choose for a financial reconciliation system, and why?

---

## 10. Explain primary key vs foreign key vs unique key

**Difficulty:** Easy

**Answer:**
A **primary key** uniquely identifies each row in a table, cannot be null, and a table can have only one. A **foreign key** references a primary (or unique) key in another table, enforcing referential integrity — you can't insert a foreign key value that doesn't exist in the parent table. A **unique key** enforces uniqueness like a primary key but allows one null value and a table can have multiple unique keys.

**Example:**
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id), -- foreign key
  order_number VARCHAR(50) UNIQUE            -- unique key, not the PK
);
```

**Follow-up questions interviewers might ask:**
- What happens if you try to delete a customer row that's referenced by a foreign key, without `ON DELETE CASCADE`?
- Can a foreign key reference a unique key instead of a primary key?

---

## 11. What is a composite key?

**Difficulty:** Easy

**Answer:**
A composite key is a primary key made up of two or more columns together, where the combination must be unique even if individual columns repeat. It's common in junction/join tables representing many-to-many relationships, where no single column naturally identifies a row.

**Example:**
```sql
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT,
  PRIMARY KEY (order_id, product_id) -- composite key
);
-- (order_id=1, product_id=5) can exist once; product_id=5 can repeat with a different order_id
```

**Follow-up questions interviewers might ask:**
- Why would a junction table for a many-to-many relationship typically use a composite key instead of a surrogate `id`?
- How does a composite key interact with 2NF (partial dependency)?

---

## 12. Explain the difference between DELETE, TRUNCATE, and DROP

**Difficulty:** Easy

**Answer:**
`DELETE` removes rows one at a time (optionally filtered with `WHERE`), is logged and can be rolled back, and triggers fire. `TRUNCATE` removes all rows at once, is minimally logged and much faster, resets auto-increment counters, but generally can't be filtered with `WHERE` and may not fire row-level triggers. `DROP` removes the entire table structure itself, not just the data.

**Example:**
```sql
DELETE FROM orders WHERE status = 'cancelled'; -- selective, slow, rollback-able
TRUNCATE TABLE orders;                          -- all rows, fast, resets identity
DROP TABLE orders;                              -- removes the table entirely
```

**Follow-up questions interviewers might ask:**
- Why is `TRUNCATE` typically faster than `DELETE` for clearing an entire table?
- Can `TRUNCATE` be rolled back inside a transaction in Postgres vs MySQL — does behavior differ?

---

## 13. What is a subquery, and correlated vs non-correlated subqueries?

**Difficulty:** Medium

**Answer:**
A subquery is a query nested inside another query, used in `SELECT`, `FROM`, or `WHERE` clauses. A **non-correlated** subquery runs independently of the outer query and executes once. A **correlated** subquery references a column from the outer query and re-executes once per outer row, which can be much slower — often rewritable as a `JOIN` for better performance.

**Example:**
```sql
-- Non-correlated: runs once
SELECT * FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE country = 'IN');

-- Correlated: runs once per row in the outer orders query
SELECT * FROM orders o
WHERE amount > (SELECT AVG(amount) FROM orders WHERE customer_id = o.customer_id);
```

**Follow-up questions interviewers might ask:**
- How would you rewrite a correlated subquery as a `JOIN` with a window function instead, for performance?
- When is a subquery in `FROM` (a derived table) preferable to a `JOIN`?

---

## 14. Explain window functions

**Difficulty:** Hard

**Answer:**
Window functions perform calculations across a set of rows related to the current row (a "window"), without collapsing rows the way `GROUP BY` does — each row keeps its individual identity while gaining an aggregate-like computed value. Common ones: `ROW_NUMBER()`, `RANK()`, `LAG()`/`LEAD()` for comparing to previous/next rows, and running totals with `SUM() OVER()`. Defined with `OVER (PARTITION BY ... ORDER BY ...)`.

**Example:**
```sql
SELECT
  customer_id,
  order_date,
  amount,
  SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_total,
  RANK() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS amount_rank
FROM orders;
-- Each order row keeps its own data, plus a running total and rank within its customer group
```

**Follow-up questions interviewers might ask:**
- How is a window function different from `GROUP BY` in terms of output row count?
- How would you find each customer's most recent order using `ROW_NUMBER()`?

---

## 15. What is a CTE (Common Table Expression)?

**Difficulty:** Medium

**Answer:**
A CTE, defined with `WITH name AS (...)`, is a named temporary result set scoped to a single query, improving readability for complex queries by breaking them into logical steps. Unlike a subquery, it can be referenced multiple times in the outer query and supports recursion (`WITH RECURSIVE`), useful for hierarchical data like org charts or category trees.

**Example:**
```sql
WITH high_value_customers AS (
  SELECT customer_id, SUM(amount) AS total_spent
  FROM orders
  GROUP BY customer_id
  HAVING SUM(amount) > 10000
)
SELECT c.name, h.total_spent
FROM high_value_customers h
JOIN customers c ON c.id = h.customer_id;
```

**Follow-up questions interviewers might ask:**
- How would you write a recursive CTE to traverse a category tree with parent/child relationships?
- Does a CTE get materialized (computed once) or inlined by the query planner — does it depend on the database?

---

## 16. Explain GROUP BY and aggregate functions

**Difficulty:** Easy

**Answer:**
`GROUP BY` collapses rows sharing the same value(s) in specified columns into a single summary row, typically paired with aggregate functions like `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()` to compute a value per group. Every column in the `SELECT` list must either be in the `GROUP BY` clause or wrapped in an aggregate function.

**Example:**
```sql
SELECT status, COUNT(*) AS total, AVG(amount) AS avg_amount
FROM orders
GROUP BY status;
-- One row per distinct status, with count and average amount for that group
```

**Follow-up questions interviewers might ask:**
- Why does SQL throw an error if you `SELECT` a non-aggregated, non-grouped column?
- What's the execution order of `GROUP BY` relative to `WHERE` and `HAVING`?

---

## 17. What is a database view, and materialized vs regular views?

**Difficulty:** Medium

**Answer:**
A view is a saved, named query that acts like a virtual table — it doesn't store data itself, just the query definition, and re-runs the underlying query every time it's accessed. A **materialized view** does store the computed result physically, offering much faster reads at the cost of staleness — it needs to be explicitly refreshed to reflect underlying data changes.

**Example:**
```sql
-- Regular view: always fresh, computed on every query
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE status = 'active';

-- Materialized view: fast reads, needs manual refresh
CREATE MATERIALIZED VIEW customer_order_totals AS
SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id;

REFRESH MATERIALIZED VIEW customer_order_totals;
```

**Follow-up questions interviewers might ask:**
- When would you choose a materialized view over just caching the query result in the application layer?
- How would you keep a materialized view reasonably fresh without refreshing on every write?

---

## 18. Explain database locking — optimistic vs pessimistic

**Difficulty:** Hard

**Answer:**
**Pessimistic locking** assumes conflicts are likely, so it locks a row (`SELECT ... FOR UPDATE`) as soon as it's read, blocking other transactions from modifying it until the lock is released — safe but can hurt concurrency. **Optimistic locking** assumes conflicts are rare; it reads data without locking, then checks a version number or timestamp at write time to detect if the data changed since it was read, rejecting the write if there's a conflict instead of blocking upfront.

**Example:**
```sql
-- Pessimistic: locks the row immediately
BEGIN;
SELECT * FROM inventory WHERE product_id = 1 FOR UPDATE;
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 1;
COMMIT;

-- Optimistic: check version before committing
UPDATE inventory SET quantity = quantity - 1, version = version + 1
WHERE product_id = 1 AND version = 5; -- fails silently (0 rows) if version changed
```

**Follow-up questions interviewers might ask:**
- Which approach would you use for a high-contention resource like limited-stock inventory during a flash sale?
- How does optimistic locking handle the case where the update affects 0 rows — what does the application need to do?

---

## 19. What is a deadlock and how do you prevent it?

**Difficulty:** Hard

**Answer:**
A deadlock occurs when two or more transactions each hold a lock the other needs, so neither can proceed — the database typically detects this and forcibly rolls back one transaction (the "victim") to break the cycle. Prevention strategies: always acquire locks in a consistent order across transactions, keep transactions short, use appropriate isolation levels, and add retry logic in the application for deadlock-related failures.

**Example:**
```sql
-- Transaction A: locks account 1, then tries to lock account 2
-- Transaction B: locks account 2, then tries to lock account 1
-- Classic deadlock — the fix is to always lock in the same order (e.g. by ascending id)

BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = LEAST(1, 2); -- consistent order
UPDATE accounts SET balance = balance + 100 WHERE id = GREATEST(1, 2);
COMMIT;
```

**Follow-up questions interviewers might ask:**
- How would your application detect and handle a deadlock error from the database driver?
- Have you seen a real deadlock scenario in a reconciliation or payment-matching system?

---

## 20. Explain query execution plans (EXPLAIN)

**Difficulty:** Medium

**Answer:**
`EXPLAIN` (or `EXPLAIN ANALYZE` for actual runtime stats) shows how the database's query planner intends to execute a query — whether it uses an index scan or a full table scan, the join strategy chosen, estimated vs actual row counts, and cost estimates. It's the primary tool for diagnosing why a query is slow and verifying that an index is actually being used.

**Example:**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42;

-- Output shows either:
-- "Index Scan using idx_orders_customer_id" (good, using the index)
-- "Seq Scan on orders" (bad — full table scan, missing/unused index)
```

**Follow-up questions interviewers might ask:**
- What would make the planner ignore an existing index and do a sequential scan anyway?
- What's the difference between `EXPLAIN` and `EXPLAIN ANALYZE` — why is one riskier to run on a production write query?

---

## 21. What is database sharding vs replication?

**Difficulty:** Hard

**Answer:**
**Sharding** horizontally partitions data across multiple database instances by some key (e.g. customer ID range), so each shard holds a subset of the total data — this scales write throughput and storage but adds complexity for cross-shard queries and joins. **Replication** copies the same full dataset across multiple instances (typically one primary, multiple read replicas), improving read scalability and fault tolerance, but every replica holds the complete dataset rather than a subset.

**Example:**
```
Sharding:     Shard 1 (customers A-M) | Shard 2 (customers N-Z)
Replication:  Primary (all data, handles writes) → Replica 1, Replica 2 (read-only copies)
```

**Follow-up questions interviewers might ask:**
- How do you handle a query that needs to join data across two different shards?
- What's replication lag, and how could it cause a user to read stale data right after a write?

---

## 22. Explain the difference between clustered and non-clustered indexes

**Difficulty:** Hard

**Answer:**
A **clustered index** determines the physical order rows are stored on disk — a table can have only one, since data can only be sorted one way physically (often the primary key by default). A **non-clustered index** is a separate structure holding pointers back to the actual row location, so a table can have many of them. Looking up via a non-clustered index typically requires an extra step to fetch the full row ("key lookup"), unless the index covers all needed columns.

**Example:**
```sql
-- Clustered: table physically ordered by id (often the default for PK)
CREATE TABLE orders (id INT PRIMARY KEY, ...); -- clustered on id in most engines

-- Non-clustered: separate structure pointing back to rows
CREATE INDEX idx_orders_status ON orders(status); -- non-clustered
```

**Follow-up questions interviewers might ask:**
- Why can a table have only one clustered index but many non-clustered ones?
- What is a "covering index" and how does it avoid the key lookup cost of a non-clustered index?

---

## 23. What is a stored procedure vs a function?

**Difficulty:** Medium

**Answer:**
A stored procedure is a precompiled block of SQL that can perform actions (including DML like `INSERT`/`UPDATE`), doesn't have to return a value, and is called with `CALL`. A function must return a single value (or table), can be used inline within a `SELECT` statement, and generally shouldn't perform side-effecting writes (behavior varies by database). Both live in the database and reduce round trips for complex logic, but functions are more composable within queries.

**Example:**
```sql
-- Function: usable inline in a SELECT
CREATE FUNCTION get_customer_total(cust_id INT) RETURNS DECIMAL AS $$
  SELECT SUM(amount) FROM orders WHERE customer_id = cust_id;
$$ LANGUAGE SQL;

SELECT name, get_customer_total(id) FROM customers;

-- Stored procedure: called standalone, can perform writes
CREATE PROCEDURE archive_old_orders() AS $$
  DELETE FROM orders WHERE created_at < NOW() - INTERVAL '2 years';
$$ LANGUAGE SQL;
```

**Follow-up questions interviewers might ask:**
- Why might a team avoid putting significant business logic in stored procedures for a modern app?
- What are the testing/version-control challenges of stored procedures compared to application-layer code?

---

## 24. Explain database triggers

**Difficulty:** Medium

**Answer:**
A trigger is a piece of SQL automatically executed in response to a specific event (`INSERT`, `UPDATE`, `DELETE`) on a table, either `BEFORE` or `AFTER` the event. Common uses: maintaining an audit log, enforcing complex business rules that constraints can't express, or keeping a denormalized column in sync. Overuse makes application behavior harder to trace, since the logic lives hidden in the database rather than visible in application code.

**Example:**
```sql
CREATE TRIGGER update_modified_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
-- Automatically stamps updated_at on every row modification, no app code needed
```

**Follow-up questions interviewers might ask:**
- What's a downside of relying heavily on triggers for business logic in a microservices architecture?
- How would you debug unexpected data changes caused by a trigger you didn't know existed?

---

## 25. What is connection pooling and why does it matter?

**Difficulty:** Medium

**Answer:**
Opening a new database connection is expensive (TCP handshake, auth, resource allocation), so connection pooling maintains a set of reusable open connections that the application borrows and returns instead of opening/closing a connection per request. This is critical under load — without pooling, a high-traffic app can exhaust the database's max connection limit or spend more time establishing connections than running queries.

**Example:**
```javascript
// Prisma automatically manages a connection pool
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});
// Under the hood, Prisma reuses a pool of connections rather than
// opening a new one for every query
```

**Follow-up questions interviewers might ask:**
- What happens when a serverless function architecture exhausts the database's connection limit — how do you fix it (e.g. PgBouncer)?
- How would you size a connection pool appropriately for expected concurrent traffic?

---

## 26. Explain the difference between UNION and UNION ALL

**Difficulty:** Easy

**Answer:**
`UNION` combines the result sets of two queries and removes duplicate rows, which requires an implicit sort/dedup step and is therefore slower. `UNION ALL` combines results without removing duplicates, making it faster since it skips that step. Both require the queries to have the same number of columns with compatible types.

**Example:**
```sql
SELECT customer_id FROM orders_2025
UNION
SELECT customer_id FROM orders_2026;
-- Deduplicated list of customers who ordered in either year

SELECT customer_id FROM orders_2025
UNION ALL
SELECT customer_id FROM orders_2026;
-- Same customer_id can appear twice if they ordered in both years
```

**Follow-up questions interviewers might ask:**
- Why should you default to `UNION ALL` when you know duplicates aren't possible or don't matter?
- How does performance scale differently between `UNION` and `UNION ALL` on large datasets?

---

## 27. What are constraints (CHECK, NOT NULL, DEFAULT)?

**Difficulty:** Easy

**Answer:**
Constraints enforce data integrity rules directly at the database level, independent of application code. `NOT NULL` requires a value to be present. `DEFAULT` provides a fallback value when none is supplied. `CHECK` enforces a custom boolean condition (like a value range) on every insert/update. `UNIQUE` and `FOREIGN KEY` (covered earlier) are also constraints. Enforcing rules here guarantees they hold even if buggy application code tries to insert bad data.

**Example:**
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  amount DECIMAL NOT NULL CHECK (amount > 0),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Follow-up questions interviewers might ask:**
- Why is it good practice to enforce validation both in the application layer AND as database constraints?
- How would you add a `CHECK` constraint to an existing table with data that might already violate it?

---

## 28. Explain how you'd design a schema for a reconciliation/matching system

**Difficulty:** Hard

**Answer:**
A reconciliation system typically needs at least three core tables: raw transaction records from each source (e.g. `bank_transactions`, `internal_transactions`), a `matches` table linking pairs (or groups) of records with a match status and confidence score, and an `exceptions`/`unmatched` view or table for records that couldn't be auto-matched. Key design decisions: indexing on amount/date/reference-number combinations used for matching logic, storing match status as an enum for filtering, and keeping an audit trail (matched_by, matched_at) since financial reconciliation typically needs traceability.

**Example:**
```sql
CREATE TABLE bank_transactions (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(100),
  amount DECIMAL NOT NULL,
  transaction_date DATE NOT NULL,
  matched BOOLEAN DEFAULT FALSE
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  bank_transaction_id INT REFERENCES bank_transactions(id),
  internal_transaction_id INT REFERENCES internal_transactions(id),
  match_type VARCHAR(20), -- 'exact', 'fuzzy', 'manual'
  confidence_score DECIMAL,
  matched_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bank_txn_amount_date ON bank_transactions(amount, transaction_date);
```

**Follow-up questions interviewers might ask:**
- How would you index this schema to make fuzzy amount/date matching performant at scale?
- How does this design compare to what you built for Settlr?

---

## 29. What is a self-join, and when would you use one?

**Difficulty:** Medium

**Answer:**
A self-join joins a table to itself, treated as two logical tables via aliases, used when rows in a table relate to other rows in the same table — like an employee/manager hierarchy, or finding duplicate/related records within one dataset.

**Example:**
```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
-- Each employee row joined to its own manager's row, both from the same table
```

**Follow-up questions interviewers might ask:**
- How would you use a self-join to find duplicate transaction records with the same amount and date?
- What's the performance concern with a self-join on a very large table without proper indexing?

---

## 30. How would you optimize a slow query?

**Difficulty:** Hard

**Answer:**
Start with `EXPLAIN ANALYZE` to see the actual execution plan and find the bottleneck — a sequential scan where an index should be used, a poor join order, or an inefficient subquery. Common fixes: add a missing index on filtered/joined columns, rewrite a correlated subquery as a `JOIN`, avoid `SELECT *` (fetch only needed columns), check if a composite index's column order matches the query's filter pattern, and consider whether the query is fetching more data than actually needed (pagination, narrower date ranges). For aggregate-heavy reporting queries, a materialized view or denormalized summary table might be the real fix rather than micro-optimizing the query itself.

**Example:**
```sql
-- Before: full table scan due to function wrapping the indexed column
SELECT * FROM orders WHERE YEAR(created_at) = 2026;

-- After: index-friendly range condition instead of wrapping the column in a function
SELECT * FROM orders WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';
```

**Follow-up questions interviewers might ask:**
- Walk me through a real slow query you diagnosed and fixed — what did `EXPLAIN` reveal?
- Why does wrapping an indexed column in a function (like `YEAR(created_at)`) often prevent the index from being used?
