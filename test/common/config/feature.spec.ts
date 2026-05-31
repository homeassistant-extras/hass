import { hasFeature } from "../../../src/common/config/feature";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("feature", () => {
  it("should return true when config is null", () => {
    expect(hasFeature(null, "percentage")).to.be.true;
  });

  it("should return true when config is undefined", () => {
    expect(hasFeature(undefined, "percentage")).to.be.true;
  });

  it("should return false when config.features is undefined", () => {
    expect(hasFeature({}, "percentage")).to.be.false;
  });

  it("should return false when config.features is empty", () => {
    expect(hasFeature({ features: [] }, "percentage")).to.be.false;
  });

  it("should return true when feature is present in config.features", () => {
    expect(
      hasFeature({ features: ["percentage", "exclude_default_entities"] }, "percentage"),
    ).to.be.true;
  });

  it("should return false when feature is not present in config.features", () => {
    expect(hasFeature({ features: [] }, "percentage")).to.be.false;
  });

  it("should handle case-sensitive feature names", () => {
    expect(hasFeature({ features: ["PERCENTAGE"] }, "percentage")).to.be.false;
  });

  it("should handle empty string feature names", () => {
    expect(hasFeature({ features: [""] }, "")).to.be.true;
  });
});
