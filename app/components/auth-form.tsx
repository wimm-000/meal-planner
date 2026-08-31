import { useEffect } from "react";
import { Link, useFetcher, useNavigate } from "react-router";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const fetcher = useFetcher<{
    user?: unknown;
    error?: { message?: string };
  }>();
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.user) void navigate("/app");
  }, [fetcher.data, fetcher.state, navigate]);

  return (
    <main className="auth-shell">
      <div className="auth-panel">
        <p className="eyebrow">Weekly Meal Planner</p>
        <h1>{isSignup ? "Make room for good weeks." : "Welcome back."}</h1>
        <p className="auth-intro">
          {isSignup
            ? "Create your account and your personal meal-planning space."
            : "Sign in to continue planning meals and shopping."}
        </p>
        <fetcher.Form
          method="post"
          action={
            isSignup ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email"
          }
          className="auth-form"
        >
          {isSignup ? (
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required />
            </label>
          ) : null}
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </label>
          {fetcher.data?.error ? (
            <p className="form-error" role="alert">
              {fetcher.data.error.message || "Authentication failed."}
            </p>
          ) : null}
          <button type="submit" disabled={fetcher.state !== "idle"}>
            {fetcher.state !== "idle"
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </fetcher.Form>
        <p className="auth-switch">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <Link to="/">Back to home</Link>
      </div>
    </main>
  );
}

export function LogoutButton() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/api/auth/sign-out">
      <button type="submit" disabled={fetcher.state !== "idle"}>
        {fetcher.state === "idle" ? "Sign out" : "Signing out..."}
      </button>
    </fetcher.Form>
  );
}
