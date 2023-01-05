import { describe, expect, it } from "vitest";

import EnvironmentConfigs from "../../src/configs/environments";

describe("Environmets", () => {
  it("Should load default DatabaseURL", () => {
    expect(EnvironmentConfigs.getDatabaseURL()).not.toBeNull();
  });
  
  it("Should load app name", () => {
    expect(EnvironmentConfigs.getAppName()).not.toBeNull();
  });

  it("Should load Server URL", () => {
    expect(EnvironmentConfigs.getServerURL()).not.toBeNull();
  });

  it("Should return server started message", () => {
    expect(EnvironmentConfigs.serverStartedMessage()).not.toBeNull();
  });

  it("Should return server port", () => {
    expect(EnvironmentConfigs.getServerPort()).not.toBeNull();
  });

  it("Should return jwt algorithms", () => {
    expect(EnvironmentConfigs.getJwtTokenAlgorithm()).not.toBeNull();
  });

  it("Should return authorized file minetypes", () => {
    expect(EnvironmentConfigs.getAuthorizedFileMinetypes()).not.toBeNull();
  });

  it("Should return maximum file size", () => {
    expect(EnvironmentConfigs.getMaximumFileSize()).not.toBeNull();
  });
});
