# Next.js — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

---

1. **How do you explicitly declare a component as a Client Component, and when would you actually need to do this?**
   _Hint: Think about what happens by default in the `app` router and consider browser-specific APIs._

2. **Migrate a standard `<img src="/hero.jpg" alt="Hero" />` tag to use Next.js Image Optimization. What required props are you missing?**
   _Hint: `next/image` prevents Cumulative Layout Shift (CLS), which implies it needs to know something about the image's geometry._

3. **Create a basic file structure for a Dynamic Catch-all Route that would match `/docs/installation/windows` and how would you access those segments in the component?**
   _Hint: Look closely at folder naming conventions with brackets and dots._

4. **Write a simple Route Handler (`route.ts`) that accepts a POST request, reads JSON from the body, and returns a JSON response.**
   _Hint: You'll be using standard Web APIs like `Request.json()` and returning a `NextResponse`._

5. **Write a `middleware.ts` snippet that checks for an `auth_token` cookie and redirects the user to `/login` if they try to access `/dashboard`.**
   _Hint: You can access cookies via `request.cookies` and use `NextResponse.redirect`._

6. **You have a Server Component that fetches data from an external API. How do you configure it so the page acts like Incremental Static Regeneration (ISR), revalidating the cache every 60 seconds?**
   _Hint: The `fetch` API in Next.js is extended. Look into the `next` options object._

7. **Construct a simple Server Action within a form that receives `FormData`, extracts a `username`, and triggers a revalidation of the `/users` path.**
   _Hint: You'll need specific directives at the top of the function and the `revalidatePath` utility._

8. **Design a Parallel Route setup for a dashboard where a sidebar and an analytics panel render side-by-side inside `app/dashboard/layout.tsx`.**
   _Hint: Think about how you name the folders (using `@`) and how those translate to props in your layout component._

9. **You have a CMS webhook that pings your app when an author updates an article. How do you implement on-demand revalidation so the specific article's cache is purged without clearing the whole site?**
   _Hint: Consider tagging your fetch requests and using `revalidateTag`._

10. **Describe the folder structure and logic needed to create an Intercepting Route where clicking a photo on `/feed` opens a modal, but refreshing the page loads the photo directly at `/photo/[id]`.**
    _Hint: Use the `(..)` folder convention. This is usually paired with Parallel routes to render the intercepted modal alongside the feed._
