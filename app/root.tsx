import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { ConnectivityNotice } from "./components/connectivity-notice";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/assets/favicon.ico", sizes: "any" },
  {
    rel: "icon",
    href: "/assets/favicon-32.png",
    type: "image/png",
    sizes: "32x32",
  },
  {
    rel: "apple-touch-icon",
    href: "/assets/apple-touch-icon.png",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fff1cb" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ConnectivityNotice />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let message = "The page could not be loaded. Please try again.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : "Request failed";
    message =
      error.status === 404
        ? "The page you requested does not exist."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <main className="error-page">
      <div>
        <p className="eyebrow">Weekly Meal Planner</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <a className="primary-link" href="/">
          Return home
        </a>
        {stack ? (
          <pre>
            <code>{stack}</code>
          </pre>
        ) : null}
      </div>
    </main>
  );
}
