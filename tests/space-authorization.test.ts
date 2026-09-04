import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAuthUser, limit } = vi.hoisted(() => ({
  getAuthUser: vi.fn(),
  limit: vi.fn(),
}));

vi.mock("~/auth.server", () => ({ getAuthUser }));
vi.mock("~/db/client.server", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => ({ limit })),
        })),
      })),
    })),
  },
}));

import {
  activeSpaceCookieHeader,
  requireSpaceMember,
  requireSpaceOwner,
  requireSpaceRole,
} from "~/auth-helpers.server";

const request = new Request("http://localhost/app");
const user = {
  id: "user-1",
  name: "Planner",
  email: "planner@example.com",
};
const personalSpace = {
  id: "space-1",
  name: "Planner's Space",
  type: "personal" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Space authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAuthUser.mockResolvedValue(user);
  });

  it("returns the verified membership for an allowed role", async () => {
    limit.mockResolvedValue([{ space: personalSpace, role: "owner" }]);

    const context = await requireSpaceRole(request, personalSpace.id, [
      "owner",
      "admin",
    ]);

    expect(context.space.id).toBe(personalSpace.id);
    expect(context.role).toBe("owner");
  });

  it("hides Spaces that do not belong to the user", async () => {
    limit.mockResolvedValue([]);

    await expect(
      requireSpaceMember(request, "another-space"),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("rejects a verified member without the required role", async () => {
    limit.mockResolvedValue([{ space: personalSpace, role: "member" }]);

    await expect(
      requireSpaceRole(request, personalSpace.id, ["owner", "admin"]),
    ).rejects.toMatchObject({ status: 403 });
  });

  it("requires ownership for owner-only operations", async () => {
    limit.mockResolvedValue([{ space: personalSpace, role: "admin" }]);

    await expect(
      requireSpaceOwner(request, personalSpace.id),
    ).rejects.toMatchObject({ status: 403 });
  });

  it("creates a server-only active-Space cookie", () => {
    expect(activeSpaceCookieHeader("space/one")).toContain(
      "active_space_id=space%2Fone",
    );
    expect(activeSpaceCookieHeader("space/one")).toContain("HttpOnly");
    expect(activeSpaceCookieHeader("space/one")).toContain("SameSite=Lax");
  });
});
