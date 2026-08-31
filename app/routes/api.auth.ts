import type { Route } from "./+types/api.auth";

import {
  clearSessionCookieHeader,
  destroySession,
  loginUser,
  registerUser,
  sessionCookieHeader,
} from "~/auth.server";

export function loader() {
  return new Response("Not found", { status: 404 });
}

export async function action({ request }: Route.ActionArgs) {
  const pathname = new URL(request.url).pathname;
  const isSignup = pathname.endsWith("/sign-up/email");
  if (pathname.endsWith("/sign-out")) {
    await destroySession(request);
    return Response.json(
      { success: true },
      { headers: { "Set-Cookie": clearSessionCookieHeader() } },
    );
  }
  try {
    const form = await request.formData();
    const body = {
      name: formValue(form.get("name")),
      email: formValue(form.get("email")),
      password: formValue(form.get("password")),
    };
    if (!body.email || !body.password || (isSignup && !body.name)) {
      return Response.json(
        { error: { message: "Please complete all fields." } },
        { status: 400 },
      );
    }
    if (body.password.length < 8) {
      return Response.json(
        { error: { message: "Password must be at least 8 characters." } },
        { status: 400 },
      );
    }
    const result = isSignup
      ? await registerUser(body.name, body.email, body.password)
      : await loginUser(body.email, body.password);
    return Response.json(
      { user: { id: result.userId } },
      { headers: { "Set-Cookie": sessionCookieHeader(result.token) } },
    );
  } catch (error) {
    return Response.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Authentication failed.",
        },
      },
      { status: 400 },
    );
  }
}

function formValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}
