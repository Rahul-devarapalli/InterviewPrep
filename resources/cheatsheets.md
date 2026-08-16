# Quick Reference Cheatsheets

_Fill in as you build each topic — quick-glance tables for last-minute review before an interview._

## JavaScript
| Concept | One-liner |
|---|---|
| Closure | Function + remembered outer scope |
| Debounce | Wait for silence, then fire once |
| Throttle | Fire at most once per interval |
| `map` | Transform, same length |
| `filter` | Keep matching items |
| `reduce` | Collapse to single value |

## SQL
| Concept | One-liner |
|---|---|
| INNER JOIN | Only matching rows in both tables |
| LEFT JOIN | All left rows + matched right rows (nulls if none) |
| Index | Speeds up lookups, costs write performance |
| ACID | Atomicity, Consistency, Isolation, Durability |
| N+1 problem | 1 query + N follow-up queries — fix with JOIN/batch |
| Composite index | Leftmost-prefix rule determines when it's used |
| Window function | Aggregate-like calc without collapsing rows |
| CTE | Named, reusable temp result set (`WITH ... AS`) |
| Optimistic locking | Check version at write time, no upfront lock |
| Deadlock fix | Always acquire locks in the same order |

## React
| Concept | One-liner |
|---|---|
| `useMemo` | Memoize a computed value |
| `useCallback` | Memoize a function reference |
| Reconciliation | React's diffing algorithm for the virtual DOM |
| `React.memo` | Skip re-render if props are shallowly equal |
| Stale closure | Callback captured an old render's state/value |
| `useLayoutEffect` | Like `useEffect` but runs before paint (sync) |
| Controlled input | Value driven by React state |
| Key prop | Stable identity for list reconciliation — never use index if reorderable |

## Nest.js
| Concept | One-liner |
|---|---|
| Middleware → Guard → Interceptor → Pipe → Handler | Request lifecycle order |
| Guard | Decides if a request can proceed (auth/authz) |
| Interceptor | Wraps handler execution, before + after (RxJS) |
| Pipe | Transforms/validates input before the handler |
| DTO | Class defining request shape + validation rules |
| Provider scope | Singleton (default) / Request / Transient |
| `forwardRef()` | Breaks circular dependency between providers/modules |

## MongoDB
| Concept | One-liner |
|---|---|
| Embed vs reference | Embed if bounded & read-together; reference if large/independent |
| `$lookup` | Left outer join against another collection |
| Compound index | Order matters — equality fields before range/sort fields |
| ObjectId | 12-byte ID, roughly time-sortable |
| Shard key | High-cardinality field to avoid write hotspots |
| Covered query | Satisfied entirely by an index, no document fetch |
| Upsert | Update if exists, insert if not — one atomic op |
