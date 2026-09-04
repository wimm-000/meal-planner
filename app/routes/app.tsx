import type { Route } from "./+types/app";

import { useFetcher } from "react-router";

import {
  activeSpaceCookieHeader,
  getActiveSpace,
  requireSpaceMember,
} from "~/auth-helpers.server";
import { LogoutButton } from "~/components/auth-form";

export async function loader({ request }: Route.LoaderArgs) {
  return getActiveSpace(request);
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  if (form.get("intent") !== "switch-space") {
    return Response.json({ error: "Unsupported action." }, { status: 400 });
  }

  const spaceId = form.get("spaceId");
  if (typeof spaceId !== "string" || !spaceId) {
    return Response.json({ error: "Choose a Space." }, { status: 400 });
  }

  await requireSpaceMember(request, spaceId);

  return Response.json(
    { success: true },
    { headers: { "Set-Cookie": activeSpaceCookieHeader(spaceId) } },
  );
}

export default function AppRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main className="foundation-shell">
      <header className="foundation-header">
        <span className="brand">Weekly Meal Planner</span>
        <div className="app-header-actions">
          <SpaceSwitcher
            activeSpaceId={loaderData.space.id}
            spaces={loaderData.spaces}
          />
          <LogoutButton />
        </div>
      </header>
      <section className="foundation-content">
        <p className="eyebrow">Your space</p>
        <h1>{loaderData.space?.name || "Your meal plan"}</h1>
        <p className="intro-text">
          Signed in as {loaderData.user.name}. Your personal Space is ready for
          Ingredients, Recipes, and weekly planning.
        </p>
      </section>
    </main>
  );
}

function SpaceSwitcher({
  activeSpaceId,
  spaces,
}: {
  activeSpaceId: string;
  spaces: Route.ComponentProps["loaderData"]["spaces"];
}) {
  const fetcher = useFetcher<typeof action>();
  const pendingSpaceId = fetcher.formData?.get("spaceId");
  const selectedSpaceId =
    typeof pendingSpaceId === "string" ? pendingSpaceId : activeSpaceId;

  return (
    <fetcher.Form method="post" className="space-switcher">
      <input type="hidden" name="intent" value="switch-space" />
      <label htmlFor="active-space">Space</label>
      <select
        id="active-space"
        name="spaceId"
        value={selectedSpaceId}
        disabled={fetcher.state !== "idle"}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {spaces.map(({ space }) => (
          <option key={space.id} value={space.id}>
            {space.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={fetcher.state !== "idle"}>
        {fetcher.state === "idle" ? "Switch" : "Switching…"}
      </button>
    </fetcher.Form>
  );
}
