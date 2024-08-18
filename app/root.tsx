import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { AuthProvider } from "./context/AuthContext";

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "Fridge - Minimal Scrum Board" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};


export default function App() {
  return (
      <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
      <ScrollRestoration />
      <Scripts />
      </body>
      </html>
  );
}