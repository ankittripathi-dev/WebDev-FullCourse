/*
import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("middleware chala");
  // Condition 1:- url ke page pe pahuchne se pahle display pe return kr dega turant hi url me /about hit krte hi.
  // return NextResponse.json({message: 'Hello from the about Page'})

  // Condition 2:- url me /about krte hi home page pe leke jaega.. aur url home ho jaega.
  // return NextResponse.redirect(new URL("/", request.url));

  // Condition 3: url me /about hit krte home wale page open hoga but url me /about hi rhega
  return NextResponse.rewrite(new URL("/", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/about/:path*",
};
*/

/###################### Condition rewrite  ##################################/;
/*
import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
}
*/

/**************************** Condition redirect ***********************************/
import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
