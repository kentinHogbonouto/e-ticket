import { it, expect, describe } from "vitest";

import PasswordHelpers from "../../../src/helpers/password.helper";

describe("hashPassword", () => {
  it("Should return a string when password is provided", async () => {
    const passwordInput = "test";

    const result = await PasswordHelpers.hashPassword(passwordInput);

    expect(result).toBeTypeOf("string");
  }, 6500);
});

describe("comparePasswords", () => {
  it("Should return a boolean", async () => {
    const passwordInput = "test";
    const hashedPassword = await PasswordHelpers.hashPassword(passwordInput);

    const result = await PasswordHelpers.comparePasswords(
      passwordInput,
      hashedPassword
    );

    expect(result).toBeTypeOf("boolean");
  }, 20000);
});
