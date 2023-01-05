import { describe, expect, it } from "vitest";
import { Server } from "http";

import server from "../../src/server";

describe("Express App", () => {
  it("Should return valid http server", () => {
    expect(server).toBeInstanceOf(Server);
  });
});
