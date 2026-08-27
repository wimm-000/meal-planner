import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FoundationScreen } from "~/routes/home";

describe("foundation screen", () => {
  it("reports the server-rendered foundation as ready", () => {
    render(<FoundationScreen serverReady />);

    expect(
      screen.getByRole("heading", {
        name: "Plan the week. Shop once. Eat well.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Netlify serverless")).toBeInTheDocument();
    expect(screen.getByText("Ready", { selector: "dd" })).toBeInTheDocument();
  });
});
