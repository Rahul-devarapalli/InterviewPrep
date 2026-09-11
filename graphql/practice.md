# GraphQL Practice Questions

Test your knowledge with these 10 practice questions, ordered from easy to hard. Only hints are provided—try to code or write out the answers yourself before checking the concepts!

## 1. Schema Design (Easy)
Design a GraphQL schema for a simple Blog. Include types for `User`, `Post`, and `Comment`. Define queries to fetch a user by ID and a list of posts.

*Hint:* Don't forget `!` for required fields and the `ID` scalar. Think about the relationships (e.g., a Post has an author of type User).

## 2. Apollo Client Query (Easy)
Write a React component using `@apollo/client`'s `useQuery` hook to fetch a list of products. Handle loading and error states appropriately.

*Hint:* Import `useQuery` and `gql`. Your component should return early for `loading` and `error`.

## 3. Resolver Implementation (Medium)
Given a schema where `Author` has a `books: [Book!]!` field, write the resolver for `Author.books` assuming you have access to a database function `db.getBooksByAuthorId(authorId)`.

*Hint:* Look at the positional arguments of a resolver function. Which argument contains the `id` of the parent Author?

## 4. Apollo Cache Update (Medium)
Write a mutation to `DELETE_POST`. Using the `update` function provided by Apollo's `useMutation`, explain how you would remove the deleted post from the local cache without refetching the list query from the network.

*Hint:* You can use `cache.modify` or `cache.readQuery`/`cache.writeQuery`. `cache.evict` combined with cache ID normalization is often the cleanest approach.

## 5. Handling Fragments (Medium)
Create a `UserCard` React component that requires a user's name and avatar. Define a GraphQL fragment for these requirements and show how a parent component would include this fragment in its main query.

*Hint:* Use `gql` to define the fragment on the `User` type. Use the spread syntax (`...`) inside the parent's query.

## 6. DataLoader Setup (Hard)
You have an N+1 problem fetching users for a list of comments. Write a generic setup for a DataLoader that batches requests for users by their IDs.

*Hint:* You need to create a new `DataLoader` instance. The batch function receives an array of IDs. Ensure the returned array of results exactly matches the order and length of the input IDs array.

## 7. Apollo Federation Configuration (Hard)
You are building an e-commerce app with Federation. Write the schema for an `Inventory` subgraph that extends a `Product` entity defined in a different subgraph, adding an `inStock` boolean field.

*Hint:* You'll need to use the `extend` keyword, the `@key` directive to define the primary key of the entity, and the `@external` directive for fields owned by other subgraphs.

## 8. Pagination Implementation (Hard)
Write a GraphQL query using Relay-style cursor pagination to fetch a list of followers for a user. Request the first 5 followers after a specific cursor.

*Hint:* Your query should accept `first` and `after` variables. The response structure must include `edges` (with `node` and `cursor`) and `pageInfo`.

## 9. Error Policy Handling (Hard)
Explain how you would configure an Apollo Client request to render partial UI when a query requests a User's basic info (succeeds) and their bank details (fails due to authorization).

*Hint:* What happens to `data` if you use the default error policy? Look into changing the `errorPolicy` to `'all'`.

## 10. Query Complexity Rule (Hard)
Conceptually design a query complexity calculator. If a scalar field costs 1 point, and returning a list multiplies the cost of its children by the list limit, how would you calculate the cost of a query fetching 10 users, each with 5 posts, where posts have an `id` and `title`?

*Hint:* Calculate from the leaves up to the root. (1 ID + 1 Title = 2). 5 posts * 2 = 10. Add the user scalar fields, then multiply by 10 users.
