# Nest.js — 30 Interview Questions & Answers

## Table of Contents
1. [What is Nest.js and why use it over plain Express?](#1-what-is-nestjs-and-why-use-it-over-plain-express)
2. [Explain the core building blocks: Modules, Controllers, Providers](#2-explain-the-core-building-blocks-modules-controllers-providers)
3. [What is Dependency Injection in Nest, and how does the IoC container work?](#3-what-is-dependency-injection-in-nest-and-how-does-the-ioc-container-work)
4. [Explain provider scopes: Singleton, Request, Transient](#4-explain-provider-scopes-singleton-request-transient)
5. [What are decorators and how does Nest use them?](#5-what-are-decorators-and-how-does-nest-use-them)
6. [Explain Middleware in Nest.js](#6-explain-middleware-in-nestjs)
7. [What are Guards and how do they differ from Middleware?](#7-what-are-guards-and-how-do-they-differ-from-middleware)
8. [Explain Interceptors](#8-explain-interceptors)
9. [What are Pipes, and validation with `class-validator`?](#9-what-are-pipes-and-validation-with-class-validator)
10. [Explain Exception Filters](#10-explain-exception-filters)
11. [What is the request lifecycle order: Middleware → Guard → Interceptor → Pipe → Handler?](#11-what-is-the-request-lifecycle-order-middleware--guard--interceptor--pipe--handler)
12. [How do you implement authentication with Passport + JWT in Nest?](#12-how-do-you-implement-authentication-with-passport--jwt-in-nest)
13. [How do you implement role-based authorization?](#13-how-do-you-implement-role-based-authorization)
14. [Explain custom decorators](#14-explain-custom-decorators)
15. [What is a DTO and why use it?](#15-what-is-a-dto-and-why-use-it)
16. [How does Nest integrate with TypeORM/Prisma for database access?](#16-how-does-nest-integrate-with-typeormprisma-for-database-access)
17. [Explain circular dependency issues and how to resolve them](#17-explain-circular-dependency-issues-and-how-to-resolve-them)
18. [What is a dynamic module?](#18-what-is-a-dynamic-module)
19. [Explain `@Injectable()` and how Nest resolves constructor dependencies](#19-explain-injectable-and-how-nest-resolves-constructor-dependencies)
20. [How do you handle configuration and environment variables?](#20-how-do-you-handle-configuration-and-environment-variables)
21. [Explain how Nest supports microservices](#21-explain-how-nest-supports-microservices)
22. [What is a Nest.js Interceptor used for beyond logging — e.g. response transformation?](#22-what-is-a-nestjs-interceptor-used-for-beyond-logging--eg-response-transformation)
23. [How would you implement rate limiting in Nest?](#23-how-would-you-implement-rate-limiting-in-nest)
24. [Explain testing in Nest — unit vs e2e](#24-explain-testing-in-nest--unit-vs-e2e)
25. [How do you handle file uploads in Nest?](#25-how-do-you-handle-file-uploads-in-nest)
26. [What is the difference between `@Body()`, `@Param()`, `@Query()`?](#26-what-is-the-difference-between-body-param-query)
27. [How would you structure a large Nest.js application (modular monolith)?](#27-how-would-you-structure-a-large-nestjs-application-modular-monolith)
28. [Explain WebSockets support in Nest](#28-explain-websockets-support-in-nest)
29. [How do you handle global error logging and monitoring?](#29-how-do-you-handle-global-error-logging-and-monitoring)
30. [How would you version an API in Nest.js?](#30-how-would-you-version-an-api-in-nestjs)

---

## 1. What is Nest.js and why use it over plain Express?

**Difficulty:** Easy

**Answer:**
Nest.js is a Node.js framework built on top of Express (or Fastify) that adds a structured, opinionated architecture inspired by Angular — modules, dependency injection, decorators, and a clear separation of concerns. Plain Express gives you routing and middleware but no built-in structure, so large Express apps often become inconsistent as they grow. Nest enforces conventions that make large codebases more maintainable, testable, and easier to onboard new developers onto.

**Example:**
```typescript
// Express: manual structure, everything is up to you
app.get('/users/:id', (req, res) => { /* ... */ });

// Nest: structured, decorator-driven
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) { /* ... */ }
}
```

**Follow-up questions interviewers might ask:**
- What are the trade-offs of Nest's opinionated structure for a small microservice vs a large monolith?
- Can Nest run on top of Fastify instead of Express, and why might you choose that?

---

## 2. Explain the core building blocks: Modules, Controllers, Providers

**Difficulty:** Easy

**Answer:**
Modules organize related functionality into cohesive units using `@Module()`, declaring which controllers and providers belong together and what's exported for other modules. Controllers handle incoming HTTP requests and return responses — they should stay thin, delegating logic to providers. Providers (often services) contain the actual business logic and can be injected into controllers or other providers via Nest's DI system.

**Example:**
```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll(); // controller delegates to service
  }
}
```

**Follow-up questions interviewers might ask:**
- Why should controllers stay "thin" and avoid business logic?
- What happens if you forget to export a provider that another module needs?

---

## 3. What is Dependency Injection in Nest, and how does the IoC container work?

**Difficulty:** Medium

**Answer:**
Dependency Injection means a class receives its dependencies (like services) from an external source rather than creating them itself — Nest's IoC (Inversion of Control) container manages instantiation and injects dependencies via the constructor, based on TypeScript's type metadata and the `@Injectable()` decorator. This decouples classes from their dependencies' concrete implementations, making testing (via mocking) and swapping implementations much easier.

**Example:**
```typescript
@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {} // injected automatically
}

// In tests, you can swap DatabaseService for a mock without touching UsersService
const module = await Test.createTestingModule({
  providers: [UsersService, { provide: DatabaseService, useValue: mockDb }],
}).compile();
```

**Follow-up questions interviewers might ask:**
- How does Nest know what to inject — is it based on type or on a token?
- What happens if two providers implement the same interface — how do you disambiguate injection?

---

## 4. Explain provider scopes: Singleton, Request, Transient

**Difficulty:** Medium

**Answer:**
By default, providers are **Singleton**-scoped — one shared instance across the entire application lifetime, which is the most performant. **Request**-scoped creates a new instance per incoming request, useful when you need request-specific state (like a tenant ID), but it hurts performance since DI subtrees get recreated per request. **Transient**-scoped creates a new instance every time it's injected, even within the same request, useful for stateless utility providers that shouldn't be shared.

**Example:**
```typescript
@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  tenantId: string; // safe to store per-request state here
}

@Injectable({ scope: Scope.DEFAULT }) // Singleton — the default
export class LoggerService {}
```

**Follow-up questions interviewers might ask:**
- Why does Request scope hurt performance, and how does it "bubble up" to consuming providers?
- When would you actually need Request scope in a real app — e.g. multi-tenancy?

---

## 5. What are decorators and how does Nest use them?

**Difficulty:** Easy

**Answer:**
Decorators are a TypeScript/JS feature (functions prefixed with `@`) that attach metadata or modify behavior on classes, methods, or parameters at design time. Nest is built almost entirely around decorators — `@Module()`, `@Controller()`, `@Injectable()`, `@Get()`, `@Body()` — which Nest reads via reflection at startup to wire up routing, DI, and validation without you writing boilerplate registration code.

**Example:**
```typescript
@Controller('orders')
export class OrdersController {
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
```

**Follow-up questions interviewers might ask:**
- How would you write a custom parameter decorator, e.g. `@CurrentUser()`?
- What's the difference between a class decorator and a method decorator internally?

---

## 6. Explain Middleware in Nest.js

**Difficulty:** Medium

**Answer:**
Middleware runs before the route handler, with access to the raw request and response objects — same concept as Express middleware, since Nest sits on top of it. It's used for cross-cutting concerns like logging, request ID generation, or raw body parsing, applied either function-style or as a class implementing `NestMiddleware`, and configured in a module's `configure()` method rather than decorators.

**Example:**
```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

// In a module
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

**Follow-up questions interviewers might ask:**
- Why can't Middleware access the route handler's execution context the way Guards can?
- How would you exclude specific routes from a middleware?

---

## 7. What are Guards and how do they differ from Middleware?

**Difficulty:** Medium

**Answer:**
Guards determine whether a request is allowed to proceed to the route handler, primarily used for authentication and authorization. Unlike middleware, Guards have access to the full `ExecutionContext` (including the handler and class being called), which lets them use metadata (via `Reflector`) to make decisions — like checking required roles set with a custom decorator. Guards run after middleware but before interceptors and pipes.

**Example:**
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.headers.authorization; // simplified check
  }
}

@UseGuards(AuthGuard)
@Get('profile')
getProfile() { /* ... */ }
```

**Follow-up questions interviewers might ask:**
- How would you build a `RolesGuard` that reads required roles set via a custom `@Roles()` decorator using `Reflector`?
- Why are Guards a better fit for auth than Middleware in Nest's architecture?

---

## 8. Explain Interceptors

**Difficulty:** Medium

**Answer:**
Interceptors wrap around route handler execution using RxJS, letting you run logic both before and after the handler runs — transforming the response, adding logging/timing, catching and mapping exceptions, or even caching the response entirely, bypassing the handler. They implement `NestInterceptor` with an `intercept()` method that calls `next.handle()` to proceed, and can `.pipe()` RxJS operators on the returned Observable.

**Example:**
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Request took ${Date.now() - start}ms`))
    );
  }
}
```

**Follow-up questions interviewers might ask:**
- How would you use an Interceptor to wrap every response in a consistent `{ data, meta }` envelope?
- How do Interceptors differ from Pipes in terms of when they run and what they touch?

---

## 9. What are Pipes, and validation with `class-validator`?

**Difficulty:** Medium

**Answer:**
Pipes transform or validate input data before it reaches the route handler — commonly used for parsing (`ParseIntPipe`) or validation (`ValidationPipe`). Combined with `class-validator` decorators on a DTO class, `ValidationPipe` automatically validates incoming request bodies against the DTO's rules and throws a `400 Bad Request` with detailed errors if validation fails, without writing manual `if` checks in the controller.

**Example:**
```typescript
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

@Post()
create(@Body(new ValidationPipe()) dto: CreateOrderDto) {
  return this.ordersService.create(dto);
}
```

**Follow-up questions interviewers might ask:**
- How would you apply `ValidationPipe` globally instead of per-route?
- What's the difference between built-in Pipes and writing a custom Pipe?

---

## 10. Explain Exception Filters

**Difficulty:** Medium

**Answer:**
Exception Filters catch unhandled exceptions thrown anywhere in the request pipeline and format a consistent error response, similar to a global error-handling middleware but integrated into Nest's DI and execution context. Nest has a built-in filter that handles `HttpException` by default; custom filters implement `ExceptionFilter` to catch specific exception types (or all exceptions) and customize the response shape, useful for standardizing error formats across an API.

**Example:**
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

**Follow-up questions interviewers might ask:**
- How would you create a global exception filter that also catches non-HTTP errors (e.g. database errors)?
- How do Exception Filters interact with Interceptors when an error occurs mid-pipeline?

---

## 11. What is the request lifecycle order: Middleware → Guard → Interceptor → Pipe → Handler?

**Difficulty:** Hard

**Answer:**
The order is: Middleware runs first (raw request/response, Express-level), then Guards decide if the request can proceed (auth/authz), then Interceptors run their "before" logic, then Pipes validate/transform the input, then the route Handler executes, then Interceptors run their "after" logic on the response, and finally Exception Filters catch any error thrown at any point in this chain. Understanding this order matters for deciding where to put cross-cutting logic.

**Example:**
```
Request → Middleware → Guards → Interceptors (pre) → Pipes → Handler
       → Interceptors (post) → Response
                ↓ (if error thrown anywhere)
         Exception Filters → Error Response
```

**Follow-up questions interviewers might ask:**
- Why would you put input validation in a Pipe rather than a Guard?
- If an error is thrown inside a Guard, does it still reach an Interceptor's "after" logic?

---

## 12. How do you implement authentication with Passport + JWT in Nest?

**Difficulty:** Hard

**Answer:**
Nest integrates with Passport via `@nestjs/passport`, where you define a `Strategy` (e.g. `JwtStrategy` extending `PassportStrategy(Strategy)`) that validates the token and returns the user payload, then protect routes with `AuthGuard('jwt')`. On login, you sign a JWT with `@nestjs/jwt`'s `JwtService` containing the user's ID/roles, which the client sends back in the `Authorization` header on subsequent requests.

**Example:**
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: { sub: string; role: string }) {
    return { userId: payload.sub, role: payload.role }; // attached to request.user
  }
}

@UseGuards(AuthGuard('jwt'))
@Get('me')
getProfile(@Request() req) {
  return req.user;
}
```

**Follow-up questions interviewers might ask:**
- How would you implement refresh tokens alongside short-lived access tokens?
- Where should the JWT secret live, and how do you rotate it safely in production?

---

## 13. How do you implement role-based authorization?

**Difficulty:** Medium

**Answer:**
Combine a custom `@Roles()` decorator (using `SetMetadata`) with a `RolesGuard` that reads the required roles via `Reflector` and compares them against the authenticated user's role (typically attached to `request.user` by an earlier auth guard). This keeps authorization declarative at the route level rather than scattered as `if` checks inside handlers.

**Example:**
```typescript
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Delete(':id')
remove(@Param('id') id: string) { /* ... */ }
```

**Follow-up questions interviewers might ask:**
- Why does `RolesGuard` need to run after the JWT `AuthGuard`, and how do you enforce that order?
- How would you extend this to permission-based (not just role-based) authorization?

---

## 14. Explain custom decorators

**Difficulty:** Medium

**Answer:**
Custom decorators reduce repetitive boilerplate by encapsulating common patterns — most commonly custom parameter decorators built with `createParamDecorator` to extract data from the request (like the current authenticated user), or metadata decorators built with `SetMetadata` for use with Guards/Interceptors.

**Example:**
```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Get('profile')
getProfile(@CurrentUser() user: User) { // clean, no manual req.user access
  return user;
}
```

**Follow-up questions interviewers might ask:**
- How would you make `@CurrentUser('email')` return just the email field instead of the whole user object?
- What's the difference between `createParamDecorator` and `SetMetadata`?

---

## 15. What is a DTO and why use it?

**Difficulty:** Easy

**Answer:**
A DTO (Data Transfer Object) is a class that defines the shape of data expected in a request (or returned in a response), typically annotated with `class-validator` decorators for automatic validation and `class-transformer` decorators for serialization control. DTOs decouple your API's external contract from internal entities/database models, so you can validate and shape input/output independently of how data is stored.

**Example:**
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

// The DTO never exposes internal fields like `passwordHash` or `createdAt`
// that live on the database entity but shouldn't be part of the API contract.
```

**Follow-up questions interviewers might ask:**
- How do you avoid exposing sensitive entity fields in an API response — DTO mapping or `class-transformer`'s `@Exclude()`?
- Should DTOs be shared between create and update operations, or kept separate (`CreateUserDto` vs `UpdateUserDto`)?

---

## 16. How does Nest integrate with TypeORM/Prisma for database access?

**Difficulty:** Medium

**Answer:**
With TypeORM, you register entities via `TypeOrmModule.forFeature([Entity])` in a module and inject a `Repository<Entity>` into services using `@InjectRepository()`. With Prisma (more common in newer projects), you typically create a `PrismaService` extending `PrismaClient`, wrapped as an injectable provider in a shared `PrismaModule`, and inject it wherever database access is needed — Prisma doesn't have the same tight decorator-based integration as TypeORM but pairs well with Nest's DI.

**Example:**
```typescript
// Prisma approach
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.order.findMany(); }
}
```

**Follow-up questions interviewers might ask:**
- Why does `PrismaService` implement `OnModuleInit` — what would break without it?
- What are the trade-offs of TypeORM's Active Record vs Data Mapper pattern compared to Prisma's query builder approach?

---

## 17. Explain circular dependency issues and how to resolve them

**Difficulty:** Hard

**Answer:**
Circular dependencies happen when two providers (or modules) depend on each other directly, which Nest's DI container can't resolve by default since it needs to fully construct one before the other. Nest provides `forwardRef()` to break the cycle at both the module and provider level, telling Nest to resolve the reference lazily instead of immediately. That said, circular dependencies are often a sign the responsibilities should be refactored — e.g. extracting shared logic into a third module both can depend on.

**Example:**
```typescript
// UsersService and OrdersService depend on each other
@Injectable()
export class UsersService {
  constructor(@Inject(forwardRef(() => OrdersService)) private ordersService: OrdersService) {}
}

@Module({
  imports: [forwardRef(() => OrdersModule)],
})
export class UsersModule {}
```

**Follow-up questions interviewers might ask:**
- Why is `forwardRef` usually considered a code smell rather than a permanent solution?
- How would you refactor two circularly-dependent services to avoid the cycle entirely?

---

## 18. What is a dynamic module?

**Difficulty:** Hard

**Answer:**
A dynamic module is a module that's configured at runtime rather than statically, exposing a static method (conventionally `forRoot()` or `forFeature()`) that returns a `DynamicModule` object — allowing consumers to pass configuration (like a database connection string or API key) when importing the module. This pattern is how libraries like `TypeOrmModule.forRoot(config)` or `ConfigModule.forRoot()` work.

**Example:**
```typescript
@Module({})
export class DatabaseModule {
  static forRoot(options: DbOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [{ provide: 'DB_OPTIONS', useValue: options }, DatabaseService],
      exports: [DatabaseService],
    };
  }
}

// Usage
@Module({ imports: [DatabaseModule.forRoot({ url: process.env.DB_URL })] })
export class AppModule {}
```

**Follow-up questions interviewers might ask:**
- What's the difference between `forRoot()` and `forFeature()` conventions?
- How would you make a dynamic module async-configurable (`forRootAsync`) to read config from another service?

---

## 19. Explain `@Injectable()` and how Nest resolves constructor dependencies

**Difficulty:** Medium

**Answer:**
`@Injectable()` marks a class as a provider that can be managed by Nest's IoC container — without it, Nest won't know how to instantiate or inject the class. Nest resolves constructor dependencies using TypeScript's emitted type metadata (via `reflect-metadata`) combined with each parameter's type, so it can automatically figure out what to inject based on the constructor's parameter types, unless you use `@Inject()` with an explicit token for non-class dependencies (like config values or interfaces).

**Example:**
```typescript
@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,      // resolved by type
    @Inject('CONFIG') private readonly config: AppConfig, // resolved by token
  ) {}
}
```

**Follow-up questions interviewers might ask:**
- Why do you need `@Inject()` with a string/symbol token for things like interfaces or primitive config values?
- What happens if you forget `@Injectable()` on a class you're trying to inject?

---

## 20. How do you handle configuration and environment variables?

**Difficulty:** Easy

**Answer:**
Nest provides `@nestjs/config`, which loads `.env` files and exposes a `ConfigService` for type-safe, injectable access to environment variables anywhere in the app, avoiding scattered `process.env` references. It supports validation schemas (often with Joi or Zod) to fail fast at startup if required config is missing, and can be scoped per-module or made global with `ConfigModule.forRoot({ isGlobal: true })`.

**Example:**
```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
  }),
});

@Injectable()
export class OrdersService {
  constructor(private configService: ConfigService) {}
  someMethod() {
    const dbUrl = this.configService.get<string>('DATABASE_URL');
  }
}
```

**Follow-up questions interviewers might ask:**
- Why is validating config at startup (fail-fast) better than discovering a missing env var mid-request?
- How would you support different `.env` files per environment (dev, staging, prod)?

---

## 21. Explain how Nest supports microservices

**Difficulty:** Hard

**Answer:**
Nest has a built-in `@nestjs/microservices` package supporting multiple transport layers (TCP, Redis, NATS, Kafka, RabbitMQ, gRPC) with a consistent API — you create a microservice with `NestFactory.createMicroservice()` and define message handlers with `@MessagePattern()` (request-response) or `@EventPattern()` (fire-and-forget events). This lets you build the same service using familiar Nest patterns (DI, decorators) regardless of the underlying transport.

**Example:**
```typescript
@Controller()
export class OrdersController {
  @MessagePattern('get_order')
  getOrder(@Payload() data: { id: string }) {
    return this.ordersService.findOne(data.id);
  }

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: OrderCreatedEvent) {
    // fire-and-forget, no response expected
  }
}
```

**Follow-up questions interviewers might ask:**
- What's the difference between `@MessagePattern` and `@EventPattern` in terms of guarantees?
- How would you choose between Kafka, RabbitMQ, and Redis as the transport for a given use case?

---

## 22. What is a Nest.js Interceptor used for beyond logging — e.g. response transformation?

**Difficulty:** Medium

**Answer:**
Interceptors are commonly used to wrap responses in a consistent envelope (e.g. `{ data, timestamp }`), strip sensitive fields before returning data, implement caching by short-circuiting `next.handle()` and returning a cached Observable directly, or manage timeouts by piping `.timeout()` onto the response stream. Since they use RxJS operators, they're powerful for any "before and after" cross-cutting transformation.

**Example:**
```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({ data, timestamp: new Date().toISOString() }))
    );
  }
}
```

**Follow-up questions interviewers might ask:**
- How would you implement response caching entirely inside an Interceptor?
- How does an Interceptor's `.pipe(catchError(...))` compare to using an Exception Filter for error handling?

---

## 23. How would you implement rate limiting in Nest?

**Difficulty:** Medium

**Answer:**
The official `@nestjs/throttler` package provides a `ThrottlerGuard` you apply globally or per-route, configured with a time-to-live window and max request count — it tracks requests per client (by IP by default) and throws a `429 Too Many Requests` when the limit is exceeded. For distributed deployments across multiple instances, you'd back it with a shared store like Redis instead of in-memory tracking.

**Example:**
```typescript
@Module({
  imports: [ThrottlerModule.forRoot({ ttl: 60, limit: 10 })], // 10 requests per 60s
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

@Throttle(3, 60) // override: 3 requests per 60s for this route
@Post('login')
login() { /* ... */ }
```

**Follow-up questions interviewers might ask:**
- Why does in-memory rate limiting break down across multiple server instances, and how would Redis fix it?
- How would you rate-limit differently per authenticated user vs anonymous IP?

---

## 24. Explain testing in Nest — unit vs e2e

**Difficulty:** Medium

**Answer:**
Unit tests use `Test.createTestingModule()` to build an isolated testing module, mocking dependencies (like a repository or another service) so you test a single provider/controller in isolation, typically with Jest. E2E tests spin up the full Nest application (via `app.init()`) and use a library like `supertest` to make real HTTP requests against it, testing the full request pipeline including guards, pipes, and middleware — closer to how the app behaves in production.

**Example:**
```typescript
// Unit test
const module = await Test.createTestingModule({
  providers: [UsersService, { provide: UsersRepository, useValue: mockRepo }],
}).compile();
const service = module.get(UsersService);

// E2E test
const app = moduleFixture.createNestApplication();
await app.init();
return request(app.getHttpServer()).get('/users').expect(200);
```

**Follow-up questions interviewers might ask:**
- Why would you mock the database in a unit test but use a real (test) database in e2e tests?
- How do you handle test database setup/teardown for e2e tests without polluting production data?

---

## 25. How do you handle file uploads in Nest?

**Difficulty:** Medium

**Answer:**
Nest uses `@nestjs/platform-express`'s `FileInterceptor` (built on Multer) applied with `@UseInterceptors()`, then accesses the uploaded file via `@UploadedFile()` in the handler. You can configure storage (memory, disk, or cloud via a custom storage engine), file size limits, and MIME type filtering directly in the interceptor's options.

**Example:**
```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  },
}))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return this.filesService.store(file);
}
```

**Follow-up questions interviewers might ask:**
- How would you stream the uploaded file directly to S3 instead of buffering it in memory?
- How do you validate file type reliably beyond trusting the client-sent MIME type?

---

## 26. What is the difference between `@Body()`, `@Param()`, `@Query()`?

**Difficulty:** Easy

**Answer:**
`@Body()` extracts data from the request body (typically JSON payloads on POST/PUT/PATCH), `@Param()` extracts route/path parameters (like `:id` in `/users/:id`), and `@Query()` extracts URL query string parameters (like `?page=2&limit=10`). All three can extract the entire object or a single named field by passing a key as an argument.

**Example:**
```typescript
@Get(':id')
findOne(
  @Param('id') id: string,        // from /orders/123
  @Query('include') include: string, // from ?include=items
) { /* ... */ }

@Post()
create(@Body() dto: CreateOrderDto) { /* ... */ } // from JSON request body
```

**Follow-up questions interviewers might ask:**
- Why might you use `@Query()` with pagination but `@Param()` for a resource identifier?
- How would you type-validate query params the same way you validate a body DTO?

---

## 27. How would you structure a large Nest.js application (modular monolith)?

**Difficulty:** Hard

**Answer:**
Organize by feature/domain module (e.g. `UsersModule`, `OrdersModule`, `PaymentsModule`) rather than by technical layer, with each module owning its controllers, services, DTOs, and entities — keeping a clear boundary and only exporting what other modules genuinely need. A `SharedModule` or `CoreModule` can hold cross-cutting providers (logging, config), and a barrel `AppModule` composes everything together. This "modular monolith" structure makes it straightforward to later extract a module into its own microservice if needed.

**Example:**
```
src/
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    dto/
    entities/
  orders/
    orders.module.ts
    orders.controller.ts
    orders.service.ts
  shared/
    logger.service.ts
  app.module.ts
```

**Follow-up questions interviewers might ask:**
- How do you decide what a module should export vs keep private?
- What's your strategy for extracting a module into a standalone microservice later, if traffic patterns demand it?

---

## 28. Explain WebSockets support in Nest

**Difficulty:** Medium

**Answer:**
Nest supports WebSockets via `@nestjs/websockets`, with gateways (classes decorated with `@WebSocketGateway()`) that handle real-time bidirectional events, similar in structure to controllers but for socket connections instead of HTTP. It supports both Socket.IO and native `ws` as adapters, and you define event handlers with `@SubscribeMessage('eventName')`, which can inject the same DI-managed services as any other provider.

**Example:**
```typescript
@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('order_update')
  handleOrderUpdate(@MessageBody() data: OrderUpdate, @ConnectedSocket() client: Socket) {
    this.server.emit('order_updated', data); // broadcast to all connected clients
  }
}
```

**Follow-up questions interviewers might ask:**
- How would you authenticate a WebSocket connection using the same JWT strategy as your REST API?
- How do you scale WebSocket connections across multiple server instances (Redis adapter)?

---

## 29. How do you handle global error logging and monitoring?

**Difficulty:** Medium

**Answer:**
A global exception filter (`app.useGlobalFilters()`) catches all unhandled exceptions app-wide and can log them to a monitoring service (Sentry, Datadog) before formatting the client response. Combine this with a global logging interceptor for request/response tracing, and structured logging (like Pino via `nestjs-pino`) instead of `console.log`, so logs are queryable in production. Health checks (`@nestjs/terminus`) round this out for uptime monitoring.

**Example:**
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    Sentry.captureException(exception); // send to monitoring service
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    response.status(status).json({ statusCode: status, message: 'Internal error' });
  }
}
```

**Follow-up questions interviewers might ask:**
- Why is structured logging (JSON logs) preferred over plain `console.log` in production?
- How would you avoid logging sensitive data (passwords, tokens) that might appear in a request body during an error?

---

## 30. How would you version an API in Nest.js?

**Difficulty:** Medium

**Answer:**
Nest has built-in API versioning support (`app.enableVersioning()`) with several strategies: URI-based (`/v1/users`), header-based, media-type based, or custom. You can version an entire controller or individual routes, and support multiple versions simultaneously during a migration period — letting older clients keep using `v1` while new clients move to `v2`.

**Example:**
```typescript
app.enableVersioning({ type: VersioningType.URI }); // /v1/users, /v2/users

@Controller({ path: 'users', version: '2' })
export class UsersControllerV2 {
  @Get()
  findAll() { /* new v2 behavior */ }
}
```

**Follow-up questions interviewers might ask:**
- What's the trade-off between URI-based versioning and header-based versioning for client compatibility?
- How would you deprecate and eventually sunset an old API version without breaking existing consumers?
