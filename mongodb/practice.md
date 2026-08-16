# MongoDB — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

Assume collections: `customers`, `orders(customerId, items[], amount, status, createdAt)`, `products`.

---

1. **Write an aggregation pipeline** to find the total order amount per customer, sorted highest to lowest.
   _Hint: `$group` with `$sum`, then `$sort`._

2. **Decide: should `orders.items` be embedded or referenced?** Justify your answer given items are always read with the order and rarely exceed 20 per order.
   _Hint: bounded, always-together access pattern → embed._

3. **Write a query using `$lookup`** to join each order with its customer's name.
   _Hint: `$lookup` from `customers`, `localField: customerId`, `foreignField: _id`, then `$unwind`._

4. **Create a compound index to optimize this query** and explain field order:
   ```javascript
   db.orders.find({ status: "pending" }).sort({ createdAt: -1 })
   ```
   _Hint: `{ status: 1, createdAt: -1 }` — equality field first, then sort field._

5. **Write an upsert operation** that increments a product's stock count if it exists, or creates it with an initial stock of the given amount if it doesn't.
   _Hint: `updateOne` with `{ upsert: true }`, `$inc` for existing, `$setOnInsert` for new._

6. **Given `db.orders.find({status:"pending"}).explain("executionStats")` shows `COLLSCAN` and `totalDocsExamined: 500000` vs `nReturned: 200`, what's wrong and how do you fix it?**
   _Hint: missing index on `status` — full collection scan instead of `IXSCAN`._

7. **Design a schema for a many-to-many relationship** between `students` and `courses`, where you also need to store the enrollment date.
   _Hint: since the relationship itself carries data, consider a separate `enrollments` junction collection rather than plain reference arrays._

8. **Write an aggregation pipeline** to find the top 3 best-selling products by total quantity sold, given `orders.items` contains `{ productId, qty }`.
   _Hint: `$unwind` the items array first, then `$group` by `productId` summing `qty`, then `$sort` + `$limit`._

9. **Explain what would break if you embedded an unbounded `activityLog` array directly inside a `user` document**, and describe a better pattern.
   _Hint: 16MB document limit — reference a separate `activity_logs` collection instead, or use the bucket pattern._

10. **A reconciliation matching job needs to atomically mark a bank transaction and its matched internal transaction as "matched" together, or not at all.** How would you implement this in MongoDB?
    _Hint: multi-document transaction with `session.startTransaction()` / `commitTransaction()`, since two separate documents in two collections need to change atomically together._
