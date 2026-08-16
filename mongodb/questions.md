# MongoDB — 30 Interview Questions & Answers

## Table of Contents
1. [What is MongoDB and how does it differ from relational databases?](#1-what-is-mongodb-and-how-does-it-differ-from-relational-databases)
2. [Explain documents, collections, and the BSON format](#2-explain-documents-collections-and-the-bson-format)
3. [Embedding vs referencing — how do you decide?](#3-embedding-vs-referencing--how-do-you-decide)
4. [What is the aggregation pipeline?](#4-what-is-the-aggregation-pipeline)
5. [Explain common aggregation stages: `$match`, `$group`, `$project`, `$sort`](#5-explain-common-aggregation-stages-match-group-project-sort)
6. [What is `$lookup` and how does it work like a JOIN?](#6-what-is-lookup-and-how-does-it-work-like-a-join)
7. [Explain indexing in MongoDB](#7-explain-indexing-in-mongodb)
8. [What is a compound index, and how does field order matter?](#8-what-is-a-compound-index-and-how-does-field-order-matter)
9. [Explain the different index types (single field, compound, multikey, text, TTL)](#9-explain-the-different-index-types-single-field-compound-multikey-text-ttl)
10. [How does MongoDB handle transactions?](#10-how-does-mongodb-handle-transactions)
11. [What is schema design/schema validation in a schemaless database?](#11-what-is-schema-designschema-validation-in-a-schemaless-database)
12. [Explain replica sets](#12-explain-replica-sets)
13. [What is sharding in MongoDB, and how do you choose a shard key?](#13-what-is-sharding-in-mongodb-and-how-do-you-choose-a-shard-key)
14. [Explain the CAP theorem and where MongoDB fits](#14-explain-the-cap-theorem-and-where-mongodb-fits)
15. [What is the difference between `find()` and `aggregate()`?](#15-what-is-the-difference-between-find-and-aggregate)
16. [Explain read/write concerns](#16-explain-readwrite-concerns)
17. [What is an ObjectId?](#17-what-is-an-objectid)
18. [How do you model one-to-many relationships in MongoDB?](#18-how-do-you-model-one-to-many-relationships-in-mongodb)
19. [How do you model many-to-many relationships in MongoDB?](#19-how-do-you-model-many-to-many-relationships-in-mongodb)
20. [Explain upsert operations](#20-explain-upsert-operations)
21. [What is the explain() plan in MongoDB?](#21-what-is-the-explain-plan-in-mongodb)
22. [Explain the difference between `updateOne`, `updateMany`, and `replaceOne`](#22-explain-the-difference-between-updateone-updatemany-and-replaceone)
23. [What are MongoDB change streams?](#23-what-are-mongodb-change-streams)
24. [Explain how Mongoose schemas work (if using Node.js)](#24-explain-how-mongoose-schemas-work-if-using-nodejs)
25. [What is document size limit, and how does it affect schema design?](#25-what-is-document-size-limit-and-how-does-it-affect-schema-design)
26. [Explain the difference between embedded documents and arrays of subdocuments](#26-explain-the-difference-between-embedded-documents-and-arrays-of-subdocuments)
27. [How would you handle schema migrations in MongoDB?](#27-how-would-you-handle-schema-migrations-in-mongodb)
28. [Explain covered queries](#28-explain-covered-queries)
29. [What is the difference between MongoDB and a document store like Firestore (conceptually)?](#29-what-is-the-difference-between-mongodb-and-a-document-store-like-firestore-conceptually)
30. [How would you design a MongoDB schema for an e-commerce order system?](#30-how-would-you-design-a-mongodb-schema-for-an-e-commerce-order-system)

---

## 1. What is MongoDB and how does it differ from relational databases?

**Difficulty:** Easy

**Answer:**
MongoDB is a document-oriented NoSQL database that stores data as flexible, JSON-like BSON documents grouped into collections, rather than rows in fixed-schema tables. It doesn't enforce a rigid schema by default, supports nested/embedded data structures naturally, and scales horizontally via sharding more straightforwardly than most relational databases. The trade-off is weaker built-in support for multi-document joins and traditionally looser consistency guarantees, though modern MongoDB supports multi-document ACID transactions.

**Example:**
```javascript
// MongoDB document — nested structure, no fixed schema required
{
  _id: ObjectId("..."),
  name: "Rahul",
  skills: ["React", "Node.js", "SQL"],
  address: { city: "Hyderabad", country: "India" }
}
```

**Follow-up questions interviewers might ask:**
- When would you choose MongoDB over PostgreSQL for a new project, and vice versa?
- How does MongoDB's flexible schema affect application-layer validation responsibility?

---

## 2. Explain documents, collections, and the BSON format

**Difficulty:** Easy

**Answer:**
A document is a single record, structurally similar to a JSON object, stored in **BSON** (Binary JSON) — a binary-encoded format that adds support for extra types JSON lacks natively, like `Date`, `ObjectId`, and binary data, plus faster parsing/traversal. A collection is a grouping of documents, roughly analogous to a table in a relational database, but without enforcing that every document share the same fields or types.

**Example:**
```javascript
// A "users" collection containing documents with different shapes
db.users.insertMany([
  { name: "Rahul", role: "developer" },
  { name: "Anita", role: "designer", portfolio_url: "https://..." } // extra field, no schema violation
]);
```

**Follow-up questions interviewers might ask:**
- What specific data types does BSON support that plain JSON doesn't?
- Why does MongoDB use BSON instead of storing documents as plain JSON text?

---

## 3. Embedding vs referencing — how do you decide?

**Difficulty:** Medium

**Answer:**
Embedding nests related data directly inside a parent document — best when the related data is always accessed together, doesn't grow unbounded, and doesn't need to be queried independently (favors read performance, avoids joins). Referencing stores a related document's `_id` and requires a separate query or `$lookup` to join them — better when the related data is large, shared across many parents, updated independently, or could grow without bound (avoiding MongoDB's 16MB document size limit).

**Example:**
```javascript
// Embedding: order and its line items are always read together
{
  _id: ObjectId("..."),
  customer: "Rahul",
  items: [{ product: "Laptop", qty: 1 }, { product: "Mouse", qty: 2 }]
}

// Referencing: product catalog is large and shared/updated independently
{
  _id: ObjectId("..."),
  customer: "Rahul",
  items: [{ productId: ObjectId("prod123"), qty: 1 }]
}
```

**Follow-up questions interviewers might ask:**
- What happens to an embedded array if it grows unbounded — e.g. embedding all of a user's comments ever made?
- How would you decide for a reconciliation system whether matched transaction pairs should be embedded or referenced?

---

## 4. What is the aggregation pipeline?

**Difficulty:** Medium

**Answer:**
The aggregation pipeline processes documents through a sequence of stages, each transforming the data and passing its output to the next stage — similar conceptually to a Unix pipe or a SQL query broken into composable steps (filter, group, reshape, sort). It's MongoDB's primary tool for complex data transformation, reporting, and analytics that go beyond simple `find()` queries.

**Example:**
```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
// Filters completed orders, groups by customer, sums amounts, sorts, takes top 10
```

**Follow-up questions interviewers might ask:**
- Why does stage order matter for performance — should `$match` come early or late?
- How does the aggregation pipeline compare conceptually to SQL's `GROUP BY` + `HAVING` + `ORDER BY`?

---

## 5. Explain common aggregation stages: `$match`, `$group`, `$project`, `$sort`

**Difficulty:** Medium

**Answer:**
`$match` filters documents (like `WHERE`), ideally placed early to reduce the working set. `$group` aggregates documents by a key (like `GROUP BY`), computing accumulator expressions (`$sum`, `$avg`, `$push`). `$project` reshapes documents — including, excluding, or computing new fields (like `SELECT`). `$sort` orders the results, and can leverage an index if placed early enough in the pipeline.

**Example:**
```javascript
db.orders.aggregate([
  { $match: { createdAt: { $gte: ISODate("2026-01-01") } } },
  { $group: { _id: "$status", count: { $sum: 1 }, avgAmount: { $avg: "$amount" } } },
  { $project: { status: "$_id", count: 1, avgAmount: { $round: ["$avgAmount", 2] }, _id: 0 } },
  { $sort: { count: -1 } }
]);
```

**Follow-up questions interviewers might ask:**
- Why would placing `$sort` before `$group` behave differently than placing it after?
- How does `$project` differ from `$addFields` when you just want to add a computed field without dropping others?

---

## 6. What is `$lookup` and how does it work like a JOIN?

**Difficulty:** Medium

**Answer:**
`$lookup` performs a left outer join against another collection in the same database, matching a field from the input documents to a field in the target collection, and adding the matched documents as an array field. It's the closest MongoDB equivalent to a SQL `JOIN`, but since MongoDB is document-oriented, overusing `$lookup` across many collections can indicate the schema might benefit from more embedding.

**Example:**
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customerInfo"
    }
  },
  { $unwind: "$customerInfo" } // flattens the joined array into a single object
]);
```

**Follow-up questions interviewers might ask:**
- Why is `$lookup` generally considered less performant than embedding, and when is it still the right choice?
- What does `$unwind` do, and why is it commonly paired with `$lookup`?

---

## 7. Explain indexing in MongoDB

**Difficulty:** Medium

**Answer:**
Indexes in MongoDB work conceptually like relational database indexes — a B-Tree structure that avoids full collection scans for queries, sorts, and range filters on indexed fields. Every collection automatically has an index on `_id`. Without proper indexes, MongoDB performs a `COLLSCAN` (collection scan), checking every document, which becomes a serious performance problem as collections grow.

**Example:**
```javascript
db.orders.createIndex({ customerId: 1 }); // ascending index

db.orders.find({ customerId: ObjectId("...") }).explain("executionStats");
// Look for "IXSCAN" (index used) vs "COLLSCAN" (full scan, bad for large collections)
```

**Follow-up questions interviewers might ask:**
- What's the performance and storage trade-off of adding too many indexes to a write-heavy collection?
- How would you identify unused indexes in a production MongoDB deployment?

---

## 8. What is a compound index, and how does field order matter?

**Difficulty:** Medium

**Answer:**
A compound index covers multiple fields in a single index structure, and — just like in relational databases — field order determines which query patterns can use it efficiently, following the "prefix rule." A query can use the index if it filters on a left-to-right prefix of the indexed fields; skipping the first field(s) means the index won't be used for that filter.

**Example:**
```javascript
db.orders.createIndex({ status: 1, createdAt: -1 });

// Uses the index efficiently:
db.orders.find({ status: "pending" });
db.orders.find({ status: "pending" }).sort({ createdAt: -1 });

// Does NOT use this index efficiently (skips the leftmost field):
db.orders.find({ createdAt: { $gte: ISODate("2026-01-01") } });
```

**Follow-up questions interviewers might ask:**
- How would you design a compound index to support both an equality filter and a range filter efficiently?
- What is the "ESR rule" (Equality, Sort, Range) for ordering compound index fields?

---

## 9. Explain the different index types (single field, compound, multikey, text, TTL)

**Difficulty:** Hard

**Answer:**
**Single field** indexes cover one field. **Compound** indexes cover multiple fields together. **Multikey** indexes are automatically created when you index a field containing an array — MongoDB indexes each array element separately. **Text** indexes support full-text search across string fields. **TTL (time-to-live)** indexes automatically delete documents after a specified duration, useful for expiring sessions, logs, or temporary cache entries.

**Example:**
```javascript
// Multikey — automatic when indexing an array field
db.products.createIndex({ tags: 1 }); // tags: ["electronics", "sale"]

// TTL — auto-delete documents 24 hours after createdAt
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Text — full-text search
db.products.createIndex({ description: "text" });
db.products.find({ $text: { $search: "wireless headphones" } });
```

**Follow-up questions interviewers might ask:**
- What's a real use case where you'd reach for a TTL index instead of a scheduled cleanup job?
- Why can a multikey index not also be used as part of a compound index on two array fields simultaneously?

---

## 10. How does MongoDB handle transactions?

**Difficulty:** Hard

**Answer:**
Since MongoDB 4.0, multi-document ACID transactions are supported (initially replica sets, later sharded clusters too), letting you group multiple operations across documents/collections into a single atomic unit with `session.startTransaction()` / `commitTransaction()`. Before this, atomicity was guaranteed only at the single-document level, which pushed schema design toward embedding to keep related writes atomic. Transactions have a performance cost and are best used sparingly, not as the default pattern.

**Example:**
```javascript
const session = client.startSession();
session.startTransaction();
try {
  await accounts.updateOne({ _id: fromId }, { $inc: { balance: -100 } }, { session });
  await accounts.updateOne({ _id: toId }, { $inc: { balance: 100 } }, { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

**Follow-up questions interviewers might ask:**
- Why did MongoDB's schema design philosophy historically favor embedding, given single-document atomicity?
- What's the performance overhead of using multi-document transactions frequently, and when should you avoid them?

---

## 11. What is schema design/schema validation in a schemaless database?

**Difficulty:** Medium

**Answer:**
"Schemaless" doesn't mean no schema — it means the database doesn't enforce one by default, so schema discipline shifts to the application layer (via an ODM like Mongoose) or optional server-side **schema validation** rules (`$jsonSchema`) that MongoDB can enforce on inserts/updates. This flexibility is powerful for evolving data models but requires deliberate discipline to avoid inconsistent document shapes across a collection over time.

**Example:**
```javascript
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "amount"],
      properties: {
        amount: { bsonType: "decimal", minimum: 0 }
      }
    }
  }
});
```

**Follow-up questions interviewers might ask:**
- Why would you add server-side `$jsonSchema` validation in addition to Mongoose-level validation?
- What happens to existing documents when you add a stricter validator to a collection that already has inconsistent data?

---

## 12. Explain replica sets

**Difficulty:** Medium

**Answer:**
A replica set is a group of MongoDB instances maintaining the same dataset for high availability — one **primary** node accepts all writes, and multiple **secondary** nodes replicate the primary's oplog asynchronously. If the primary fails, the remaining nodes hold an election to promote a new primary automatically, minimizing downtime. Secondaries can also serve reads (with relaxed consistency) to distribute read load.

**Example:**
```javascript
// Connection string aware of the whole replica set
mongodb://host1:27017,host2:27017,host3:27017/mydb?replicaSet=rs0

// Reading from secondaries (eventually consistent)
db.orders.find().readPref("secondaryPreferred");
```

**Follow-up questions interviewers might ask:**
- What happens to in-flight writes during a primary election/failover?
- Why might reading from a secondary return stale data, and when is that an acceptable trade-off?

---

## 13. What is sharding in MongoDB, and how do you choose a shard key?

**Difficulty:** Hard

**Answer:**
Sharding horizontally partitions a collection's data across multiple servers (shards) based on a **shard key** — a field or combination of fields used to distribute documents. A well-chosen shard key has high cardinality and distributes both data and query load evenly ("write hotspots" happen with poorly chosen keys, like a monotonically increasing timestamp, which concentrates all new writes on one shard). Choosing the right shard key is one of the hardest and most consequential MongoDB architecture decisions since it's difficult to change later.

**Example:**
```javascript
sh.shardCollection("mydb.orders", { customerId: "hashed" });
// Hashed sharding distributes writes evenly, avoiding hotspots,
// at the cost of losing efficient range queries on customerId
```

**Follow-up questions interviewers might ask:**
- Why does using `_id` (an increasing ObjectId) as a shard key create a write hotspot?
- What's the trade-off between a hashed shard key and a ranged shard key?

---

## 14. Explain the CAP theorem and where MongoDB fits

**Difficulty:** Hard

**Answer:**
CAP theorem states a distributed system can only fully guarantee two of three properties during a network partition: Consistency, Availability, Partition tolerance. MongoDB is generally categorized as **CP** (consistent + partition-tolerant) by default — a replica set won't accept writes without a primary, favoring consistency over availability during a partition — though its tunable read/write concerns let you shift toward more availability-favoring behavior when needed (e.g. reading from secondaries).

**Example:**
```javascript
// Favoring consistency (default-ish behavior)
db.orders.insertOne(doc, { writeConcern: { w: "majority" } });

// Favoring availability (read from any available secondary, possibly stale)
db.orders.find().readPref("nearest");
```

**Follow-up questions interviewers might ask:**
- How do MongoDB's write concern (`w: majority`) and read concern settings let you tune the CAP trade-off per operation?
- Is CAP theorem a strict binary in practice, or more of a spectrum — how does MongoDB's tunability reflect that?

---

## 15. What is the difference between `find()` and `aggregate()`?

**Difficulty:** Easy

**Answer:**
`find()` retrieves documents matching a query filter, optionally with projection/sort/limit — it's simple and fast for straightforward lookups. `aggregate()` runs a multi-stage pipeline capable of grouping, joining (`$lookup`), reshaping documents, and computing derived values — far more powerful but also more complex. As a rule of thumb: use `find()` for simple retrieval, `aggregate()` when you need transformation, grouping, or joins.

**Example:**
```javascript
// find() — simple filter + sort
db.orders.find({ status: "pending" }).sort({ createdAt: -1 });

// aggregate() — grouping and computed fields, beyond what find() can do
db.orders.aggregate([
  { $match: { status: "pending" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } }
]);
```

**Follow-up questions interviewers might ask:**
- Can `find()` do everything a simple single-stage `aggregate()` pipeline can, and when would you still prefer `aggregate()`?
- How do index usage and performance compare between `find()` and `aggregate()` for equivalent filters?

---

## 16. Explain read/write concerns

**Difficulty:** Hard

**Answer:**
**Write concern** controls how many replica set members must acknowledge a write before it's considered successful (`w: 1` = just the primary, `w: "majority"` = a majority of the set, stronger durability guarantee). **Read concern** controls the consistency guarantee for reads — `"local"` returns the most recent data on that node (possibly not yet replicated/committed), while `"majority"` only returns data acknowledged by a majority of the set, guaranteeing it won't be rolled back.

**Example:**
```javascript
db.orders.insertOne(doc, { writeConcern: { w: "majority", wtimeout: 5000 } });

db.orders.find({ status: "pending" }, { readConcern: { level: "majority" } });
```

**Follow-up questions interviewers might ask:**
- What's the durability risk of using `w: 1` for a financial transaction write?
- How do read and write concern combine to affect consistency guarantees when reading right after a write?

---

## 17. What is an ObjectId?

**Difficulty:** Easy

**Answer:**
`ObjectId` is MongoDB's default 12-byte identifier type for the `_id` field — composed of a 4-byte timestamp, 5 bytes of random/machine identifier, and a 3-byte incrementing counter, making it roughly sortable by creation time and unique without central coordination across distributed nodes.

**Example:**
```javascript
db.orders.insertOne({ customerId: "abc" });
// Auto-generated: _id: ObjectId("66f1a2b3c4d5e6f7a8b9c0d1")

const id = ObjectId("66f1a2b3c4d5e6f7a8b9c0d1");
console.log(id.getTimestamp()); // extractable creation timestamp
```

**Follow-up questions interviewers might ask:**
- Why is `ObjectId` roughly (but not perfectly) sortable by creation time, and why might that matter for a shard key?
- What are the implications of exposing raw `ObjectId`s in a public API vs a custom-generated ID?

---

## 18. How do you model one-to-many relationships in MongoDB?

**Difficulty:** Medium

**Answer:**
For a "few" (bounded, small) many side, embed the related documents as an array inside the parent — e.g. a blog post with a handful of comments. For a "many" (large or unbounded) side, reference the parent's `_id` from the child documents instead — e.g. a customer with potentially thousands of orders should not embed all orders in the customer document, but rather store `customerId` on each order document.

**Example:**
```javascript
// One-to-few: embed
{ _id: 1, title: "Post", comments: [{ text: "Nice!" }, { text: "Thanks" }] }

// One-to-many (unbounded): reference
{ _id: ObjectId("cust1"), name: "Rahul" } // customer
{ customerId: ObjectId("cust1"), amount: 500 } // order, references customer
```

**Follow-up questions interviewers might ask:**
- What's the "one-to-squillions" pattern, and how does it differ from standard one-to-many referencing?
- What breaks if you embed an unbounded array and it eventually exceeds the 16MB document limit?

---

## 19. How do you model many-to-many relationships in MongoDB?

**Difficulty:** Medium

**Answer:**
The most common approach is storing an array of referenced `_id`s on both sides (or just one side, depending on query patterns) — e.g. a `students` collection with a `courseIds` array, and a `courses` collection with a `studentIds` array — then using `$lookup` to join when needed. Unlike relational databases, MongoDB doesn't require a separate junction table, though one can still be used if the relationship itself carries additional data (like an enrollment date).

**Example:**
```javascript
// students collection
{ _id: ObjectId("s1"), name: "Rahul", courseIds: [ObjectId("c1"), ObjectId("c2")] }

// courses collection
{ _id: ObjectId("c1"), title: "System Design", studentIds: [ObjectId("s1")] }
```

**Follow-up questions interviewers might ask:**
- When would you introduce a separate "junction" collection instead of arrays of references on both sides?
- How do you keep both sides of a bidirectional reference array in sync when the relationship changes?

---

## 20. Explain upsert operations

**Difficulty:** Easy

**Answer:**
An upsert (`{ upsert: true }` on an update operation) updates a matching document if one exists, or inserts a new document if no match is found — combining "update" and "insert" into a single atomic operation. It's useful for idempotent write patterns, like syncing external data where you don't know ahead of time whether a record already exists.

**Example:**
```javascript
db.inventory.updateOne(
  { sku: "ABC123" },
  { $set: { quantity: 50 }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }
);
// Updates quantity if sku exists, otherwise creates a new document
```

**Follow-up questions interviewers might ask:**
- What does `$setOnInsert` do, and why is it useful specifically in upsert operations?
- What race condition could occur with concurrent upserts on the same key, and how would you handle it?

---

## 21. What is the explain() plan in MongoDB?

**Difficulty:** Medium

**Answer:**
`.explain()` (or `.explain("executionStats")`) shows how MongoDB's query planner executed (or would execute) a query — whether it used an index (`IXSCAN`) or scanned the full collection (`COLLSCAN`), how many documents were examined vs returned, and execution time. It's the primary diagnostic tool for identifying missing indexes or inefficient query patterns, directly analogous to SQL's `EXPLAIN`.

**Example:**
```javascript
db.orders.find({ status: "pending" }).explain("executionStats");
// Check: totalDocsExamined vs nReturned — a huge gap signals a missing/unused index
```

**Follow-up questions interviewers might ask:**
- What does it mean if `totalDocsExamined` is much larger than `nReturned` in the output?
- How would you use `explain()` to verify a compound index is actually being used as intended?

---

## 22. Explain the difference between `updateOne`, `updateMany`, and `replaceOne`

**Difficulty:** Easy

**Answer:**
`updateOne` modifies the first document matching a filter using update operators (`$set`, `$inc`, etc.), leaving unspecified fields untouched. `updateMany` applies the same operator-based update to all matching documents. `replaceOne` replaces the entire matched document's content with a new document (except `_id`), rather than merging fields — any field not in the replacement document is removed.

**Example:**
```javascript
db.orders.updateOne({ _id: id }, { $set: { status: "shipped" } }); // only status changes
db.orders.updateMany({ status: "pending" }, { $set: { status: "expired" } }); // bulk update
db.orders.replaceOne({ _id: id }, { customerId: "x", amount: 100 }); // entire doc replaced
```

**Follow-up questions interviewers might ask:**
- What happens to fields not included in a `replaceOne` call — are they preserved or dropped?
- Why is `updateMany` on an unindexed filter risky at scale?

---

## 23. What are MongoDB change streams?

**Difficulty:** Hard

**Answer:**
Change streams let an application subscribe to real-time notifications of data changes (inserts, updates, deletes) on a collection, database, or entire deployment, built on top of the replication oplog. They're useful for reactive architectures — triggering notifications, syncing data to a search index or cache, or driving event-based microservice communication — without polling the database.

**Example:**
```javascript
const changeStream = db.orders.watch([{ $match: { operationType: "insert" } }]);
changeStream.on("change", (event) => {
  console.log("New order created:", event.fullDocument);
  // e.g. trigger a notification or sync to Elasticsearch
});
```

**Follow-up questions interviewers might ask:**
- How do change streams compare to using a message queue (Kafka/RabbitMQ) for reacting to data changes?
- What happens to a change stream's position if the application disconnects and reconnects — can you resume where you left off?

---

## 24. Explain how Mongoose schemas work (if using Node.js)

**Difficulty:** Medium

**Answer:**
Mongoose is an ODM (Object Document Mapper) for Node.js that layers schema definition, validation, type casting, middleware (hooks), and query building on top of MongoDB's native driver — bringing structure to an otherwise schemaless database at the application level. Schemas define field types, required/default values, and custom validators, and compile into Models used for all CRUD operations.

**Example:**
```javascript
const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
```

**Follow-up questions interviewers might ask:**
- How does Mongoose's `.populate()` work, and how does it compare to `$lookup`?
- What are Mongoose middleware/hooks (`pre('save')`), and what's a real use case for one?

---

## 25. What is document size limit, and how does it affect schema design?

**Difficulty:** Medium

**Answer:**
MongoDB enforces a 16MB maximum size per document, which directly influences the embed-vs-reference decision — any field that could grow unbounded (like an ever-growing array of logs, comments, or events) shouldn't be embedded directly, since it risks eventually exceeding the limit and causing write failures. This is one of the strongest practical arguments against blindly embedding "for performance" without considering growth patterns.

**Example:**
```javascript
// Risky: comments array could grow unbounded and eventually hit 16MB
{ _id: 1, title: "Popular Post", comments: [ /* thousands of comments */ ] }

// Safer: reference comments in their own collection, paginated on read
{ _id: 1, title: "Popular Post" }
// comments collection: { postId: 1, text: "..." }
```

**Follow-up questions interviewers might ask:**
- How would you migrate an existing embedded array that's now approaching the size limit, without downtime?
- What's the "bucket pattern," and how does it help with high-volume time-series-like embedded data?

---

## 26. Explain the difference between embedded documents and arrays of subdocuments

**Difficulty:** Easy

**Answer:**
An embedded document is a single nested object field within a parent document — representing a one-to-one relationship, like an `address` object on a `user`. An array of subdocuments represents a one-to-many relationship embedded directly in the parent, like `orderItems` on an `order` — each array element is itself a structured object, and MongoDB indexes them as a multikey index if you index that field.

**Example:**
```javascript
{
  _id: 1,
  address: { city: "Hyderabad", zip: "500001" }, // embedded document, 1:1
  orderItems: [ // array of subdocuments, 1:many
    { product: "Laptop", qty: 1, price: 800 },
    { product: "Mouse", qty: 2, price: 20 }
  ]
}
```

**Follow-up questions interviewers might ask:**
- How would you query for orders containing a specific product inside the `orderItems` array?
- What's the performance implication of indexing a field inside an array of subdocuments (multikey index)?

---

## 27. How would you handle schema migrations in MongoDB?

**Difficulty:** Medium

**Answer:**
Since MongoDB doesn't enforce schema at write time, "migrations" typically mean either a bulk update script (`updateMany` with new fields/defaults) run against existing documents, or — more commonly in production — a versioned/dual-read approach where application code handles both old and new document shapes gradually, backfilling data lazily or via a background job, rather than requiring an all-at-once blocking migration like a relational `ALTER TABLE`.

**Example:**
```javascript
// Bulk migration: add a new field with a default to all existing documents
db.orders.updateMany(
  { paymentMethod: { $exists: false } },
  { $set: { paymentMethod: "unknown" } }
);

// Or application-level dual handling:
const paymentMethod = order.paymentMethod ?? "unknown"; // handles old docs missing the field
```

**Follow-up questions interviewers might ask:**
- Why is a "big bang" migration riskier in MongoDB than in a relational database with schema enforcement?
- How would you safely rename a field across millions of documents without downtime?

---

## 28. Explain covered queries

**Difficulty:** Hard

**Answer:**
A covered query is one where all the fields requested in the query and projection exist entirely within an index, so MongoDB never needs to fetch the actual documents from disk — it satisfies the query directly from the index structure, which is significantly faster. To achieve this, the query's filter, projection, and sort fields must all be part of the same index, and `_id` must be explicitly excluded from the projection (unless it's part of the index).

**Example:**
```javascript
db.orders.createIndex({ status: 1, amount: 1 });

// Covered query — filter and projection fields are both in the index, _id excluded
db.orders.find({ status: "pending" }, { status: 1, amount: 1, _id: 0 });
```

**Follow-up questions interviewers might ask:**
- Why must `_id` be explicitly excluded for a query to be covered, given it's not part of your custom index?
- How would you verify via `explain()` that a query is actually covered (`totalDocsExamined: 0`)?

---

## 29. What is the difference between MongoDB and a document store like Firestore (conceptually)?

**Difficulty:** Medium

**Answer:**
Both are document-oriented NoSQL databases, but MongoDB is a general-purpose database you host/manage (or use via Atlas) with a powerful aggregation framework and strong ACID transaction support, while Firestore is a fully-managed, real-time-sync-first database tightly integrated with Google's ecosystem, optimized for client-side listeners and offline support in mobile/web apps, but with a comparatively limited query and aggregation model (no arbitrary joins, more restrictive indexing rules).

**Example:**
```javascript
// MongoDB: rich aggregation, self/cloud-hosted
db.orders.aggregate([{ $group: { _id: "$status", total: { $sum: "$amount" } } }]);

// Firestore: simpler queries, real-time listeners built in
db.collection('orders').where('status', '==', 'pending')
  .onSnapshot(snapshot => { /* auto-updates in real time */ });
```

**Follow-up questions interviewers might ask:**
- Why might a real-time collaborative mobile app favor Firestore over MongoDB, despite MongoDB's more powerful querying?
- How does MongoDB's Change Streams feature narrow this real-time-sync gap with Firestore?

---

## 30. How would you design a MongoDB schema for an e-commerce order system?

**Difficulty:** Hard

**Answer:**
Embed order line items directly in the order document (bounded, always read together, rarely modified after creation) — pricing/product name snapshotted at order time rather than referenced live, since historical orders shouldn't change if the product catalog updates later. Reference the customer and product catalog by `_id` (large, independently updated, queried on their own). Index on `customerId` + `createdAt` for order history lookups, and consider a separate `payments` or `shipments` collection referenced by `orderId` if those have their own independent lifecycle and update frequency.

**Example:**
```javascript
{
  _id: ObjectId("..."),
  customerId: ObjectId("cust1"), // referenced — large, independent collection
  items: [ // embedded — bounded, always read with the order
    { productId: ObjectId("prod1"), name: "Laptop", price: 800, qty: 1 } // price snapshot
  ],
  status: "pending",
  totalAmount: 800,
  createdAt: ISODate("2026-08-01")
}

db.orders.createIndex({ customerId: 1, createdAt: -1 }); // fast order history queries
```

**Follow-up questions interviewers might ask:**
- Why should the item price be snapshotted into the order rather than looked up live from the product catalog?
- How would this schema handle order status updates without needing a multi-document transaction most of the time?
