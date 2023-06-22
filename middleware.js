export const config = {
  // Only run the middleware on the admin route
  matcher: "/analytics.js",
};
export default async function middleware(request) {
  const { search, pathname } = new URL(request.url);
  // You can retrieve IP location or cookies here.
  if (pathname === "/analytics.js") {
    return Response.redirect(`https://www.googletagmanager.com/analytics.js${search}`);
  }
}
