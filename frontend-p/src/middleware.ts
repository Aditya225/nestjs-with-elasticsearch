// frontend-p/src/middleware.ts
export { default } from "next-auth/middleware";

export const config = { 
  // Jin routes ko protect karna hai unka path yahan daalo
  matcher: ["/dashboard/:path*", "/profile/:path*"] 
};