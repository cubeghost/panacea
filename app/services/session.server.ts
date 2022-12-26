import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "panacea_session",
    sameSite: "lax", // this helps with CSRF
    path: "/", 
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [ process.env.SESSION_SECRET ],
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  },
});