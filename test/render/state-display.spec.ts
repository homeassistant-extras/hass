import { stateDisplay } from "../../src/render/state-display";
import type { HomeAssistant } from "../../src/types";
import type { HassEntity } from "../../src/ws/types";
import { expect } from "chai";
import { render, type TemplateResult } from "lit";

describe("stateDisplay.ts", () => {
  let mockHass: HomeAssistant;
  let mockEntity: HassEntity;

  beforeEach(() => {
    mockEntity = {
      entity_id: "sensor.test",
      state: "42",
      attributes: {},
      last_changed: "2024-01-01T00:00:00.000Z",
    };

    mockHass = {
      states: {
        "sensor.test": mockEntity,
      },
    } as unknown as HomeAssistant;
  });

  it("renders state-display with hass, stateObj, and optional content", () => {
    const container = document.createElement("div");
    render(stateDisplay(mockHass, mockEntity), container);

    const el = container.querySelector("state-display");
    expect(el).to.exist;
    expect((el as { hass?: HomeAssistant }).hass).to.equal(mockHass);
    expect((el as { stateObj?: HassEntity }).stateObj).to.equal(mockEntity);
    expect((el as { content?: string }).content).to.be.undefined;

    const container2 = document.createElement("div");
    render(stateDisplay(mockHass, mockEntity, "last_changed"), container2);

    const el2 = container2.querySelector("state-display");
    expect((el2 as { content?: string }).content).to.equal("last_changed");
  });

  it("returns a lit template", () => {
    const result = stateDisplay(mockHass, mockEntity);
    expect((result as TemplateResult).strings.join("")).to.include(
      "state-display",
    );
  });
});
