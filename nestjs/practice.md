# Nest.js — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

---

1. **Scaffold a minimal `ProductsModule`** with a controller exposing `GET /products` and `GET /products/:id`, delegating to a `ProductsService`.
   _Hint: `@Module`, `@Controller`, `@Injectable` — keep the controller thin._

2. **Write a DTO with validation** for creating a product: `name` (required string), `price` (required positive number), `description` (optional string, max 500 chars).
   _Hint: `class-validator` decorators — `@IsString`, `@IsPositive`, `@IsOptional`, `@MaxLength`._

3. **Build a custom Guard** that blocks any request without an `x-api-key` header matching an expected value from config.
   _Hint: implement `CanActivate`, inject `ConfigService`, read `request.headers`._

4. **Explain and diagram the request lifecycle order** for a request that fails validation in a Pipe — which components run, and which get skipped?
   _Hint: Middleware → Guard → Interceptor(pre) → Pipe fails → Exception Filter, Handler never runs._

5. **Write a custom parameter decorator `@Ip()`** that extracts the client's IP address from the request.
   _Hint: `createParamDecorator` + `ctx.switchToHttp().getRequest()`._

6. **Fix the circular dependency:** `AuthService` needs `UsersService` to look up a user, and `UsersService` needs `AuthService` to check permissions on update. How do you resolve this without `forwardRef` if possible?
   _Hint: consider extracting a shared `PermissionsService`, or accept `forwardRef` as a last resort — explain the trade-off._

7. **Build an Interceptor** that wraps every successful response in `{ success: true, data: <original response> }`.
   _Hint: `next.handle().pipe(map(data => ({ success: true, data })))`._

8. **Implement a global Exception Filter** that catches Prisma's `PrismaClientKnownRequestError` (e.g. unique constraint violations) and returns a clean `409 Conflict` instead of a raw 500.
   _Hint: `@Catch(PrismaClientKnownRequestError)`, check `exception.code === 'P2002'`._

9. **Write a unit test** for a `UsersService.findByEmail()` method, mocking the underlying Prisma/repository call so no real database is hit.
   _Hint: `Test.createTestingModule` with a `useValue` mock provider for the DB dependency._

10. **Design the module structure** for an e-commerce backend with Users, Products, Orders, and Payments — which modules should export what, and where would circular risk exist (e.g. Orders needing Payments needing Orders)?
    _Hint: think about which module should "own" the relationship, and whether an event-based (EventEmitter) approach avoids a direct circular import._
