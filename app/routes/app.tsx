import type { Route } from "./+types/app";

import { getActiveSpace } from "~/auth-helpers.server";
import { LogoutButton } from "~/components/auth-form";

export async function loader({ request }: Route.LoaderArgs) {
  return getActiveSpace(request);
}

export default function AppRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main className="foundation-shell">
      <header className="foundation-header">
        <span className="brand">Weekly Meal Planner</span>
        <LogoutButton />
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
