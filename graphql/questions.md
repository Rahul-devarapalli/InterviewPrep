# GraphQL Interview Questions

## Table of Contents
1. [What is GraphQL & how it differs from REST](#1-what-is-graphql--how-it-differs-from-rest)
2. [Schema Definition Language (SDL)](#2-schema-definition-language-sdl)
3. [Resolvers](#3-resolvers)
4. [GraphQL vs REST — pros/cons comparison](#4-graphql-vs-rest--proscons-comparison)
5. [Queries — arguments, aliases, fragments](#5-queries--arguments-aliases-fragments)
6. [Mutations — input types, return types](#6-mutations--input-types-return-types)
7. [Subscriptions — real-time data](#7-subscriptions--real-time-data)
8. [Apollo Client setup with React](#8-apollo-client-setup-with-react)
9. [Apollo Client caching](#9-apollo-client-caching)
10. [useQuery, useMutation, useSubscription hooks](#10-usequery-usemutation-usesubscription-hooks)
11. [Apollo Client state management](#11-apollo-client-state-management)
12. [Error handling in GraphQL](#12-error-handling-in-graphql)
13. [Pagination — cursor-based vs offset](#13-pagination)
14. [Authentication & authorization](#14-authentication--authorization)
15. [GraphQL with TypeScript](#15-graphql-with-typescript)
16. [DataLoader & the N+1 problem](#16-dataloader--the-n1-problem)
17. [Schema stitching vs Federation](#17-schema-stitching-vs-federation)
18. [Apollo Federation](#18-apollo-federation)
19. [GraphQL directives](#19-graphql-directives)
20. [File uploads with GraphQL](#20-file-uploads-with-graphql)
21. [Rate limiting & query complexity analysis](#21-rate-limiting--query-complexity)
22. [Persisted queries & APQ](#22-persisted-queries--apq)
23. [GraphQL testing strategies](#23-graphql-testing-strategies)
24. [GraphQL vs tRPC comparison](#24-graphql-vs-trpc)
25. [Batching queries & query deduplication](#25-batching-queries--deduplication)
26. [GraphQL security](#26-graphql-security)
27. [Optimistic updates with Apollo](#27-optimistic-updates)
28. [GraphQL Code Generator](#28-graphql-code-generator)
29. [Relay vs Apollo comparison](#29-relay-vs-apollo)
30. [REST to GraphQL migration strategies](#30-rest-to-graphql-migration)

---

## 1. What is GraphQL & how it differs from REST

**Difficulty:** Easy

**Answer:**
GraphQL is a query language for your API and a server-side runtime for executing queries using a type system you define for your data. Unlike REST, which uses multiple endpoints returning fixed data structures (over-fetching or under-fetching), GraphQL exposes a single endpoint and allows clients to specify exactly what data they need.

**Example:**
```graphql
# REST: GET /users/1, GET /users/1/posts
# GraphQL: Single request asking for exactly what is needed
query GetUserAndPosts {
  user(id: "1") {
    name
    posts {
      title
    }
  }
}
```

**Follow-up questions interviewers might ask:**
- How does caching work in GraphQL compared to REST?
- What are the main downsides of GraphQL?

---

## 2. Schema Definition Language (SDL)

**Difficulty:** Easy

**Answer:**
SDL is the syntax used to define the schema of a GraphQL API. It defines the types, their fields, and the relationships between them. The core types include `Query`, `Mutation`, and `Subscription` (the entry points), as well as object types, scalars, enums, unions, and interfaces.

**Example:**
```graphql
type User {
  id: ID!
  name: String!
  age: Int
  status: UserStatus!
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

type Query {
  getUser(id: ID!): User
}
```

**Follow-up questions interviewers might ask:**
- What is the difference between an Interface and a Union type?
- What are the default scalar types in GraphQL?

---

## 3. Resolvers

**Difficulty:** Medium

**Answer:**
Resolvers are functions that populate the data for a single field in your schema. When a query is executed, GraphQL traverses the query tree and calls the corresponding resolver for each field. Resolvers take four arguments: `parent` (result of the previous resolver), `args` (arguments provided to the field), `context` (shared object, e.g., for auth or DB connections), and `info` (AST of the query).

**Example:**
```javascript
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      return context.db.getUserById(args.id);
    },
  },
  User: {
    posts: (parent, args, context) => {
      // parent is the user object returned by the Query.user resolver
      return context.db.getPostsByUserId(parent.id);
    }
  }
};
```

**Follow-up questions interviewers might ask:**
- How do resolvers handle asynchronous operations?
- Explain the resolver chain and how `parent` is used.

---

## 4. GraphQL vs REST — pros/cons comparison

**Difficulty:** Medium

**Answer:**
**GraphQL Pros:**
- Solves over-fetching and under-fetching.
- Strongly typed schema serves as a contract and documentation.
- Single endpoint reduces network requests.
- Excellent developer tooling (GraphiQL, Apollo).

**GraphQL Cons:**
- Caching is harder (cannot rely solely on HTTP caching).
- N+1 problem is common and requires DataLoader.
- Performance issues if queries are overly complex or deep.
- Steeper learning curve.

**Example:**
N/A - Conceptual question.

**Follow-up questions interviewers might ask:**
- In what scenario would you choose REST over GraphQL?
- How do you handle file uploads in both?

---

## 5. Queries — arguments, aliases, fragments

**Difficulty:** Easy

**Answer:**
GraphQL Queries fetch data. 
- **Arguments** allow passing variables to fields.
- **Aliases** rename the result of a field to avoid conflicts when querying the same field multiple times.
- **Fragments** are reusable units of fields that reduce duplication in queries.

**Example:**
```graphql
fragment UserDetails on User {
  id
  name
  email
}

query GetUsers {
  activeUser: getUser(id: "1") {
    ...UserDetails
  }
  inactiveUser: getUser(id: "2") {
    ...UserDetails
  }
}
```

**Follow-up questions interviewers might ask:**
- How do you use variables in queries?
- What are inline fragments and when do you use them?

---

## 6. Mutations — input types, return types

**Difficulty:** Medium

**Answer:**
Mutations modify server-side data and return a result. They are executed serially, unlike queries which can execute in parallel. Best practice is to use `Input` types for arguments to keep the schema clean, and return a payload type that includes the modified object and/or operation status.

**Example:**
```graphql
input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

type CreateUserPayload {
  user: User
  success: Boolean!
  message: String
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
}
```

**Follow-up questions interviewers might ask:**
- Why return a payload object instead of just the User?
- Can mutations be executed in parallel?

---

## 7. Subscriptions — real-time data with WebSockets

**Difficulty:** Medium

**Answer:**
Subscriptions allow clients to receive real-time updates from the server. They maintain a steady connection (usually via WebSockets) and push data to the client when a specific event happens on the server.

**Example:**
```graphql
type Subscription {
  messageAdded(chatRoomId: ID!): Message!
}
```
```javascript
// Server-side resolver using PubSub
const resolvers = {
  Subscription: {
    messageAdded: {
      subscribe: (_, { chatRoomId }, { pubsub }) => {
        return pubsub.asyncIterator(`MESSAGE_ADDED_${chatRoomId}`);
      }
    }
  }
}
```

**Follow-up questions interviewers might ask:**
- How does subscription scalability compare to standard HTTP requests?
- How do you authenticate a WebSocket connection?

---

## 8. Apollo Client setup with React

**Difficulty:** Easy

**Answer:**
Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Setup involves creating an `ApolloClient` instance with a cache and HTTP link, and wrapping the React app in an `ApolloProvider`.

**Example:**
```tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <MyComponent />
    </ApolloProvider>
  );
}
```

**Follow-up questions interviewers might ask:**
- How do you pass authentication headers in Apollo Client?
- What is the difference between `HttpLink` and `BatchHttpLink`?

---

## 9. Apollo Client caching — InMemoryCache, cache policies

**Difficulty:** Medium

**Answer:**
Apollo Client uses `InMemoryCache` to store the results of GraphQL queries locally. It normalizes data by splitting it into individual objects with unique IDs (usually `__typename` + `id`).
Fetch policies control how Apollo interacts with the cache and network:
- `cache-first` (default): Check cache, if missing, fetch from network.
- `network-only`: Always fetch from network, update cache.
- `cache-and-network`: Return cache immediately, then fetch network and update.
- `no-cache`: Fetch from network, don't store in cache.

**Example:**
```tsx
const { data, loading } = useQuery(GET_USER, {
  variables: { id: "1" },
  fetchPolicy: 'cache-and-network'
});
```

**Follow-up questions interviewers might ask:**
- How does Apollo generate cache IDs? What if an object doesn't have an `id`?
- How do you manually evict an item from the cache?

---

## 10. useQuery, useMutation, useSubscription hooks

**Difficulty:** Easy

**Answer:**
These are the primary React hooks provided by Apollo Client to interact with GraphQL.
- `useQuery`: Executes a query on mount or variable change. Returns data, loading, error, and refetch.
- `useMutation`: Returns a mutate function and state (data, loading, error). Does not execute automatically.
- `useSubscription`: Opens a WebSocket connection and updates data in real-time.

**Example:**
```tsx
const [updateUser, { loading, error }] = useMutation(UPDATE_USER);

const handleUpdate = async () => {
  try {
    await updateUser({ variables: { id: "1", name: "New Name" } });
  } catch (err) {
    console.error(err);
  }
};
```

**Follow-up questions interviewers might ask:**
- How do you trigger a `useQuery` manually (imperatively)? (A: useLazyQuery)
- How do you update the cache after a mutation?

---

## 11. Apollo Client state management (reactive variables, local state)

**Difficulty:** Medium

**Answer:**
Apollo can manage local (client-side) state alongside remote data. Modern Apollo uses Reactive Variables (`makeVar`) for local state. When a reactive variable changes, queries depending on it automatically re-render. Alternatively, you can use local-only fields in GraphQL queries using the `@client` directive.

**Example:**
```tsx
import { makeVar, useReactiveVar } from '@apollo/client';

export const cartItemsVar = makeVar([]);

function Cart() {
  const cartItems = useReactiveVar(cartItemsVar);
  
  return (
    <button onClick={() => cartItemsVar([...cartItems, newItem])}>
      Add to Cart ({cartItems.length})
    </button>
  );
}
```

**Follow-up questions interviewers might ask:**
- Why use Apollo for local state instead of Redux or Context?
- How do you query a reactive variable using a GraphQL query?

---

## 12. Error handling in GraphQL (partial errors, error policies)

**Difficulty:** Hard

**Answer:**
Unlike REST which uses HTTP status codes (404, 500), GraphQL typically returns a 200 OK even if errors occur, placing errors in the `errors` array of the response.
GraphQL supports partial successes: some resolvers might fail while others succeed.
Apollo Client handles this via `errorPolicy`:
- `none` (default): Treats any GraphQL error as a network error, data is undefined.
- `ignore`: Ignores errors, returns available data.
- `all`: Returns both `data` (partial) and `error`.

**Example:**
```tsx
const { data, error } = useQuery(GET_DASHBOARD, {
  errorPolicy: 'all' // Allows rendering the parts of the dashboard that succeeded
});

if (error) console.log("Some components failed to load", error.graphQLErrors);
```

**Follow-up questions interviewers might ask:**
- How should a server format errors to be easily readable by the client?
- Differentiate between Network Errors and GraphQL Errors.

---

## 13. Pagination — cursor-based vs offset, Relay-style connections

**Difficulty:** Medium

**Answer:**
- **Offset/Limit:** Uses `skip` and `limit`. Easy to implement but can result in duplicate or missing items if the underlying data changes between queries. Performance degrades at high offsets.
- **Cursor-based:** Uses a pointer (cursor) to a specific item. Much more resilient to data changes and performant for deep pagination.
- **Relay-style connections:** A standardized cursor-based specification requiring `edges` (containing `node` and `cursor`) and `pageInfo` (containing `hasNextPage`, etc.).

**Example:**
```graphql
query GetFriends($after: String) {
  user(id: "1") {
    friends(first: 10, after: $after) {
      edges {
        cursor
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

**Follow-up questions interviewers might ask:**
- How does Apollo cache paginated results? (A: fetchMore and typePolicies/merge functions)
- What is opaque vs transparent cursor?

---

## 14. Authentication & authorization in GraphQL

**Difficulty:** Medium

**Answer:**
- **Authentication** (Who are you?): Usually handled at the HTTP/network layer (e.g., passing a JWT in headers). The token is verified before GraphQL execution, and the user object is placed in the GraphQL `context`.
- **Authorization** (What can you do?): Usually handled in resolvers or via directives. Resolvers check the user in `context` to ensure they have permission to access a field or execute a mutation. It's best to delegate this to the business logic layer.

**Example:**
```javascript
const resolvers = {
  Query: {
    secretData: (_, args, context) => {
      if (!context.user) throw new AuthenticationError('Must be logged in');
      if (context.user.role !== 'ADMIN') throw new ForbiddenError('Not an admin');
      return "Secret";
    }
  }
}
```

**Follow-up questions interviewers might ask:**
- Why shouldn't authorization logic live directly in the resolvers?
- How do you use schema directives for authorization (e.g., `@auth(requires: ADMIN)`)?

---

## 15. GraphQL with TypeScript — codegen, typed hooks

**Difficulty:** Medium

**Answer:**
TypeScript improves GraphQL development by providing type safety. Since GraphQL schemas are strongly typed, we can auto-generate TypeScript types and Apollo React hooks using GraphQL Code Generator based on the schema and client `.graphql` operations.

**Example:**
```yaml
# codegen.yml
schema: "http://localhost:4000/graphql"
documents: "src/**/*.graphql"
generates:
  src/generated/graphql.ts:
    plugins:
      - "typescript"
      - "typescript-operations"
      - "typescript-react-apollo"
```
```tsx
// Using the generated hook
import { useGetUserQuery } from './generated/graphql';

const { data } = useGetUserQuery({ variables: { id: "1" } });
// data.getUser.name is strictly typed!
```

**Follow-up questions interviewers might ask:**
- How does codegen handle custom scalars (like Date)?
- What is `__typename` used for in generated types?

---

## 16. DataLoader & the N+1 problem

**Difficulty:** Hard

**Answer:**
The N+1 problem occurs when a query fetches a list of N items, and the resolver for a child field executes a database query for each item (1 initial query + N child queries).
**DataLoader** solves this by batching and caching requests. It collects all IDs requested in a single tick of the event loop and dispatches one batched request to the database.

**Example:**
```javascript
// 1. Create loader (usually per request context)
const userLoader = new DataLoader(async (userIds) => {
  const users = await db.getUsersByIds(userIds); // 1 SQL query!
  // Must return array mapped identically to userIds
  return userIds.map(id => users.find(u => u.id === id));
});

// 2. Use in resolver
const resolvers = {
  Post: {
    author: (post, _, { loaders }) => loaders.userLoader.load(post.authorId)
  }
}
```

**Follow-up questions interviewers might ask:**
- Why should a new DataLoader instance be created for each HTTP request?
- How does DataLoader handle caching within the same request?

---

## 17. Schema stitching vs Federation

**Difficulty:** Hard

**Answer:**
Both are techniques to combine multiple GraphQL APIs into a single gateway endpoint.
- **Schema Stitching:** The gateway manually merges schemas. It requires writing custom resolver logic at the gateway level to delegate parts of the query to the appropriate underlying services.
- **Apollo Federation:** A declarative approach. Services (subgraphs) define their own schema and relationships using directives (`@key`, `@extends`). The gateway simply reads these directives and automatically constructs a supergraph without custom gateway logic. Federation is generally the modern enterprise standard.

**Example:**
N/A - Architectural comparison.

**Follow-up questions interviewers might ask:**
- What are the operational challenges of maintaining a stitched schema?
- How does Federation handle resolving an entity across multiple subgraphs?

---

## 18. Apollo Federation — gateway, subgraphs

**Difficulty:** Hard

**Answer:**
Apollo Federation consists of:
- **Subgraphs:** Individual GraphQL APIs focusing on specific domains (e.g., Users, Products).
- **Gateway:** The router that client queries hit. It plans the execution and fetches data from the relevant subgraphs.
Entities are defined using `@key` to allow different subgraphs to contribute fields to the same type.

**Example:**
```graphql
# User Subgraph
type User @key(fields: "id") {
  id: ID!
  name: String!
}

# Review Subgraph
type Review {
  id: ID!
  body: String!
  author: User!
}
# Extending the User type from another subgraph
extend type User @key(fields: "id") {
  id: ID! @external
  reviews: [Review!]! 
}
```

**Follow-up questions interviewers might ask:**
- What does the `__resolveReference` function do in a subgraph?
- What is Managed Federation (Apollo Studio)?

---

## 19. GraphQL directives (@deprecated, custom directives)

**Difficulty:** Medium

**Answer:**
Directives are instructions that modify the execution or schema generation behavior. 
- **Built-in:** `@include(if: Boolean)`, `@skip(if: Boolean)`, `@deprecated(reason: String)`.
- **Custom directives:** Can be used for formatting strings, authorization, rate limiting, etc.

**Example:**
```graphql
directive @auth(role: String!) on FIELD_DEFINITION

type Query {
  secretData: String! @auth(role: "ADMIN")
  oldField: String @deprecated(reason: "Use newField instead")
}
```

**Follow-up questions interviewers might ask:**
- How do you implement a custom schema directive on the server?
- Can directives be applied by the client in a query?

---

## 20. File uploads with GraphQL

**Difficulty:** Medium

**Answer:**
GraphQL natively handles text (JSON). To upload files, the standard approach is the `graphql-multipart-request-spec`. It allows sending a `multipart/form-data` request where some fields are standard JSON GraphQL operations, and others are binary files mapped to variables using an `Upload` scalar.
*Note: Many teams prefer doing file uploads out-of-band (e.g., request pre-signed S3 URL via GraphQL, then upload directly via REST) to keep the GraphQL server performant.*

**Example:**
```graphql
scalar Upload

type Mutation {
  uploadAvatar(file: Upload!): Boolean!
}
```

**Follow-up questions interviewers might ask:**
- Why might handling large file uploads in a Node.js GraphQL server be a bad idea?
- How do you use `apollo-upload-client`?

---

## 21. Rate limiting & query complexity analysis

**Difficulty:** Hard

**Answer:**
Because a single GraphQL query can ask for deep, nested data, standard endpoint-based rate limiting is insufficient.
- **Query Complexity Analysis:** Assigns a "cost" to each field. Before execution, the server parses the AST, calculates the total cost, and rejects the query if it exceeds a threshold.
- **Depth Limiting:** Prevents queries from nesting too deeply (e.g., limiting to a depth of 5).

**Example:**
```javascript
// Using graphql-query-complexity
const rule = queryComplexity({
  maximumComplexity: 100,
  estimators: [
    simpleEstimator({ defaultComplexity: 1 })
  ]
});
```

**Follow-up questions interviewers might ask:**
- How would you handle a malicious query that tries to bring down the server?
- How do paginated lists factor into complexity calculation?

---

## 22. Persisted queries & automatic persisted queries (APQ)

**Difficulty:** Hard

**Answer:**
GraphQL queries can be very large, consuming network bandwidth.
- **Persisted Queries:** Queries are hashed at build time. The client sends the hash, and the server looks up the query string from a pre-populated database.
- **APQ (Automatic Persisted Queries):** Apollo's dynamic version. The client sends a hash. If the server doesn't know it, it returns an error. The client automatically retries with both the hash and the full query. The server caches it for future use. This allows caching GraphQL requests on edge CDNs using GET requests.

**Example:**
```javascript
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { sha256 } from "crypto-hash";

const link = createPersistedQueryLink({ sha256 }).concat(httpLink);
```

**Follow-up questions interviewers might ask:**
- How does APQ enable HTTP GET caching at the CDN level?
- What are the security benefits of Persisted Queries?

---

## 23. GraphQL testing strategies

**Difficulty:** Medium

**Answer:**
- **Unit Testing Resolvers:** Since resolvers are just functions, test them by mocking `parent`, `args`, and `context`.
- **Integration Testing:** Spin up the Apollo Server instance in tests and run raw GraphQL queries against it using tools like `apollo-server-testing`.
- **Client Testing (React):** Use Apollo's `MockedProvider` to mock query responses and test component rendering.

**Example:**
```tsx
import { MockedProvider } from '@apollo/client/testing';

const mocks = [{
  request: { query: GET_USER, variables: { id: '1' } },
  result: { data: { getUser: { id: '1', name: 'John' } } }
}];

render(
  <MockedProvider mocks={mocks} addTypename={false}>
    <UserProfile id="1" />
  </MockedProvider>
);
```

**Follow-up questions interviewers might ask:**
- How do you test mutations and ensure the cache updates correctly?
- What is the challenge of testing fragmented queries?

---

## 24. GraphQL vs tRPC comparison

**Difficulty:** Medium

**Answer:**
Both provide end-to-end type safety.
- **GraphQL:** Language agnostic, great for public APIs or multi-client scenarios (web, iOS, Android). Requires a build step (codegen) for type safety. Highly flexible for clients.
- **tRPC:** TypeScript strictly. Best for monorepos where backend and frontend share types directly without code generation. Uses standard RPC over HTTP. Extremely fast setup, but less flexible for clients (no dynamic field selection).

**Example:**
N/A

**Follow-up questions interviewers might ask:**
- If you are building an internal dashboard in a React/Node monorepo, which would you choose and why?
- Does tRPC have the N+1 problem?

---

## 25. Batching queries & query deduplication

**Difficulty:** Medium

**Answer:**
- **Query Deduplication:** Apollo Client automatically deduplicates identical queries fired at the same time by different components, sending only one network request.
- **Query Batching:** Apollo can group multiple different GraphQL operations fired in the same tick into a single HTTP request using `BatchHttpLink`. The server processes the array of operations and returns an array of responses.

**Example:**
```tsx
import { BatchHttpLink } from '@apollo/client/link/batch-http';

const client = new ApolloClient({
  link: new BatchHttpLink({ uri: '/graphql', batchMax: 5 }),
  cache: new InMemoryCache()
});
```

**Follow-up questions interviewers might ask:**
- What is the drawback of query batching regarding TTFB (Time to First Byte)?

---

## 26. GraphQL security

**Difficulty:** Hard

**Answer:**
GraphQL exposes the entire data graph, bringing unique security risks. Defenses include:
- **Introspection disabling:** Turn off introspection in production to hide schema details.
- **Depth limiting:** Prevent cyclic/deep queries.
- **Complexity analysis:** Limit total query cost.
- **Rate limiting:** Based on user context/IP.
- **Authorization:** Granular checks at the resolver level.
- **Timeout mechanisms:** Abort long-running resolvers.

**Example:**
N/A

**Follow-up questions interviewers might ask:**
- Why is turning off introspection not a complete security solution?
- How does batching complicate rate limiting?

---

## 27. Optimistic updates with Apollo

**Difficulty:** Medium

**Answer:**
Optimistic UI makes an app feel faster by updating the UI with an expected result before the server confirms the mutation. Apollo allows you to provide an `optimisticResponse` in `useMutation`. The cache updates immediately, components re-render, and when the real network response arrives, Apollo quietly replaces the optimistic data with the real data.

**Example:**
```tsx
const [addTodo] = useMutation(ADD_TODO);

addTodo({
  variables: { text: "Learn GraphQL" },
  optimisticResponse: {
    addTodo: {
      id: Math.round(Math.random() * -1000000).toString(),
      text: "Learn GraphQL",
      completed: false,
      __typename: "Todo"
    }
  }
});
```

**Follow-up questions interviewers might ask:**
- What happens if the mutation fails after an optimistic update? (A: Apollo rolls back the cache).
- How do you optimistically update a paginated list?

---

## 28. GraphQL Code Generator

**Difficulty:** Easy

**Answer:**
GraphQL Code Generator (`graphql-codegen`) is a CLI tool that parses your GraphQL schema and operations, and generates code. In React ecosystems, it generates TypeScript interfaces for all types and custom React hooks (like `useGetUsersQuery`) with fully typed variables and responses, eliminating manual type maintenance.

**Example:**
N/A

**Follow-up questions interviewers might ask:**
- How do you integrate codegen into a CI/CD pipeline?
- Can codegen generate resolvers signatures for the backend? (A: Yes)

---

## 29. Relay vs Apollo comparison

**Difficulty:** Hard

**Answer:**
- **Relay:** Built by Facebook. Highly opinionated, incredibly performant for large scale apps. Enforces strict conventions (Global Object Identification, Connections for pagination). Uses compilation to optimize queries heavily. Steeper learning curve.
- **Apollo:** More flexible, unopinionated, and community-driven. Easier to get started, huge ecosystem, great for both small apps and enterprise. Less strict about schema design.

**Example:**
N/A

**Follow-up questions interviewers might ask:**
- What is Relay's "data masking" feature?
- Why might an enterprise choose Relay over Apollo?

---

## 30. REST to GraphQL migration strategies

**Difficulty:** Medium

**Answer:**
The most common strategy is the **"BFF" (Backend for Frontend) or Wrapper pattern**.
1. Create a GraphQL server that acts as a proxy.
2. The resolvers make HTTP calls to the existing REST API.
3. Slowly migrate frontend clients to query the GraphQL layer instead of REST endpoints.
4. Over time, swap out the REST calls in resolvers with direct database or gRPC microservice calls.

**Example:**
```javascript
// GraphQL resolver wrapping a REST endpoint using apollo-datasource-rest
class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.legacy-rest.com/';
  }
  async getUser(id) {
    return this.get(`users/${id}`);
  }
}
```

**Follow-up questions interviewers might ask:**
- How do you handle N+1 problems when wrapping a REST API?
- What are the performance implications of the wrapper pattern?
