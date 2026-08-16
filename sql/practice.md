# SQL — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

Assume tables: `customers(id, name, country)`, `orders(id, customer_id, amount, status, created_at)`,
`order_items(order_id, product_id, quantity)`.

---

1. **Write a query to find all customers who have never placed an order.**
   _Hint: `LEFT JOIN` + `WHERE orders.id IS NULL`._

2. **Write a query to find the top 3 customers by total order amount.**
   _Hint: `GROUP BY`, `SUM`, `ORDER BY ... DESC`, `LIMIT 3`._

3. **Write a query using a window function to find each customer's most recent order.**
   _Hint: `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC)`, filter `WHERE rn = 1`._

4. **Given a `orders` table with millions of rows and a slow `WHERE status = 'pending' AND created_at > ?` query, what index would you create, and why does column order matter?**
   _Hint: composite index `(status, created_at)` — leftmost prefix rule._

5. **Write a query to find duplicate orders** — same `customer_id`, `amount`, and `created_at` date appearing more than once.
   _Hint: `GROUP BY customer_id, amount, DATE(created_at) HAVING COUNT(*) > 1`._

6. **Explain what would happen and write the fix:** an app does `SELECT * FROM orders` then loops through results calling `SELECT * FROM customers WHERE id = ?` for each order.
   _Hint: N+1 problem — rewrite as a single JOIN._

7. **Write a CTE-based query** to calculate the running total of order amounts per customer, ordered by date.
   _Hint: `WITH` + `SUM() OVER (PARTITION BY customer_id ORDER BY created_at)`._

8. **Design two transactions that would deadlock against each other** on the `accounts` table (from the ACID example), and describe how you'd fix it.
   _Hint: opposite lock-acquisition order on two rows; fix by enforcing consistent lock order (e.g. `ORDER BY id`)._

9. **Write a query to find the second-highest order amount** without using `LIMIT`/`OFFSET` (assume it needs to work across databases).
   _Hint: subquery with `MAX()` excluding the overall max, or `DENSE_RANK()`._

10. **You're asked to design a schema for tracking payment reconciliation between a bank statement and internal ledger.** Sketch the tables and explain your indexing choices for fast matching by amount + date range.
    _Hint: reference the reconciliation schema example — think about what queries the matching engine runs most often, and index accordingly._
