import type { HomeAssistant } from "../../dist/types.js";
import { stateIconLabel } from "../../dist/render/state-icon-label.js";
import { stateLabel } from "../../dist/render/state-label.js";
import type { CardHelpers } from "../../dist/helpers/card-helpers.js";
import { expect } from "chai";
import { render, html, nothing, type TemplateResult } from "lit";
import { stub } from "sinon";

describe("state-icon-label render helpers", () => {
  interface MockHuiElement extends HTMLElement {
    hass?: HomeAssistant;
  }

  let mockHass: HomeAssistant;
  let mockCreateHuiElement: sinon.SinonStub;

  beforeEach(() => {
    mockCreateHuiElement = stub().callsFake(() => {
      const element = document.createElement("div") as MockHuiElement;
      return element;
    });

    const helpers: CardHelpers = {
      createRowElement: stub().returns(document.createElement("div")),
      createHuiElement: mockCreateHuiElement,
    };
    globalThis.poatCardHelpers = helpers;

    mockHass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
    } as unknown as HomeAssistant;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "poatCardHelpers");
  });

  it("returns nothing when hass or entity is missing", () => {
    expect(stateIconLabel(undefined, "sensor.weight")).to.equal(nothing);
    expect(stateIconLabel(mockHass, undefined)).to.equal(nothing);
  });

  it("returns nothing when card helpers are not resolved", () => {
    Reflect.deleteProperty(globalThis, "poatCardHelpers");

    expect(stateIconLabel(mockHass, "sensor.weight")).to.equal(nothing);
    expect(mockCreateHuiElement.called).to.be.false;
  });

  it("creates state-icon and state-label with optional wrapper", () => {
    const result = stateIconLabel(mockHass, "sensor.pet_weight", {
      state_color: true,
      wrapperClass: "chip",
    });
    const root = document.createElement("div");
    render(result as TemplateResult, root);

    expect(mockCreateHuiElement.callCount).to.equal(2);
    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: "state-icon",
      entity: "sensor.pet_weight",
      state_color: true,
      hold_action: { action: "none" },
      double_tap_action: { action: "none" },
    });
    expect(mockCreateHuiElement.secondCall.args[0]).to.deep.include({
      type: "state-label",
      entity: "sensor.pet_weight",
      hold_action: { action: "none" },
      double_tap_action: { action: "none" },
    });

    expect(mockCreateHuiElement.firstCall.returnValue.hass).to.equal(mockHass);
    expect(mockCreateHuiElement.secondCall.returnValue.hass).to.equal(mockHass);
    expect(root.firstElementChild?.classList.contains("chip")).to.be.true;
    expect(root.firstElementChild?.getAttribute("part")).to.equal("chip");
    expect(root.firstElementChild?.getAttribute("role")).to.equal("presentation");
    expect(root.firstElementChild?.childElementCount).to.equal(2);
  });

  it("renders icon and label without a wrapper when wrapperClass is omitted", () => {
    const result = stateIconLabel(mockHass, "sensor.total_cycles");
    const root = document.createElement("div");
    render(html`<div>${result as TemplateResult}</div>`, root);

    expect(root.querySelector(".chip")).to.be.null;
    expect(root.firstElementChild?.childElementCount).to.equal(2);
  });

  it("stateLabel creates a state-label element", () => {
    const result = stateLabel(mockHass, "sensor.litter_robot_status");

    expect(mockCreateHuiElement.calledOnce).to.be.true;
    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: "state-label",
      entity: "sensor.litter_robot_status",
      hold_action: { action: "none" },
      double_tap_action: { action: "none" },
    });
    expect(result).to.not.equal(nothing);
    expect(mockCreateHuiElement.firstCall.returnValue.hass).to.equal(mockHass);
  });
});
