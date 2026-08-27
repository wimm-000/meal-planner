import type { Route } from "./+types/home";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Weekly Meal Planner" },
    {
      name: "description",
      content:
        "Plan weekly meals, reusable recipes, and shopping in one place.",
    },
  ];
}

export function loader() {
  return { serverReady: true };
}

export function FoundationScreen({ serverReady }: { serverReady: boolean }) {
  return (
    <main className="foundation-shell">
      <header className="foundation-header">
        <a className="brand" href="/" aria-label="Weekly Meal Planner home">
          <img
            className="brand-mark"
            src="/assets/apple-touch-icon.png"
            width="38"
            height="38"
            alt=""
          />
          <span>Weekly Meal Planner</span>
        </a>
        <span className="phase-label">Foundation</span>
      </header>

      <section
        className="foundation-content"
        aria-labelledby="foundation-title"
      >
        <div className="intro-copy">
          <p className="eyebrow">The table is being set</p>
          <h1 id="foundation-title">
            Plan the week. Shop once. <em>Eat well.</em>
          </h1>
          <p className="intro-text">
            A focused home for weekly meals, reusable recipes, and a shopping
            list that stays useful after you edit it.
          </p>
        </div>

        <div className="week-preview" aria-label="Weekly planner preview">
          <div className="preview-heading">
            <div>
              <span className="preview-kicker">This week</span>
              <strong>August 24–30</strong>
            </div>
            <span className="preview-status">
              <span aria-hidden="true" /> Ready for planning
            </span>
          </div>

          <div className="day-list">
            <PreviewDay
              day="Monday"
              meals={["Breakfast", "Lentil salad", "Chicken curry"]}
            />
            <PreviewDay
              day="Tuesday"
              meals={["Overnight oats", "Lunch", "Salmon bowl"]}
            />
            <PreviewDay
              day="Wednesday"
              meals={["Breakfast", "Tomato toast", "Dinner"]}
            />
          </div>
        </div>

        <dl className="foundation-status" aria-label="Foundation status">
          <StatusItem label="Framework" value="React Router 7" />
          <StatusItem label="Deployment" value="Netlify serverless" />
          <StatusItem
            label="Server rendering"
            value={serverReady ? "Ready" : "Unavailable"}
          />
        </dl>

        <p className="checkpoint-note">
          Product features begin after this foundation checkpoint is reviewed.
        </p>
      </section>
    </main>
  );
}

function PreviewDay({ day, meals }: { day: string; meals: string[] }) {
  return (
    <section className="preview-day">
      <h2>{day}</h2>
      <ul>
        {meals.map((meal) => (
          <li
            key={meal}
            data-empty={
              meal === "Breakfast" || meal === "Lunch" || meal === "Dinner"
            }
          >
            <span aria-hidden="true" />
            {meal}
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <FoundationScreen serverReady={loaderData.serverReady} />;
}
