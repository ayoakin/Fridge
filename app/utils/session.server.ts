import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "fridge_session",
        secure: process.env.NODE_ENV === "production",
        secrets: ["s3cr3t"], // replace with a real secret
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
    },
});
