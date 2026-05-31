import { HassConfigMixin } from "../../src/mixins/hass-config-mixin";
import { SubscribeEntityStateMixin } from "../../src/mixins/subscribe-entity-state-mixin";
import type { HomeAssistant } from "../../src/types";
import { expect } from "chai";
import { LitElement } from "lit";
import { stub, useFakeTimers } from "sinon";

// Matches the manager's debounce before it issues the subscribe_entities call.
const RESUBSCRIBE_DEBOUNCE_MS = 50;

describe("SubscribeEntityStateMixin", () => {
  let TestElement: ReturnType<typeof SubscribeEntityStateMixin>;
  let element: InstanceType<typeof TestElement>;
  let hass: HomeAssistant;
  let unsubscribeSpy: ReturnType<typeof stub>;
  // The callback the manager registers with subscribeMessage, plus the message
  // it sent (so we can assert which entity_ids were requested).
  let capturedCallback: ((ev: unknown) => void) | null;
  let capturedMessage: { entity_ids?: string[] } | null;
  let elementCounter = 0;

  beforeEach(() => {
    unsubscribeSpy = stub();
    capturedCallback = null;
    capturedMessage = null;
    const subscribeMessage = (
      callback: (ev: unknown) => void,
      message: { entity_ids?: string[] },
    ) => {
      capturedCallback = callback;
      capturedMessage = message;
      return Promise.resolve(unsubscribeSpy);
    };

    const elementName = `test-sub-entity-${elementCounter++}`;
    TestElement = SubscribeEntityStateMixin(HassConfigMixin(LitElement));

    if (!customElements.get(elementName)) {
      customElements.define(elementName, TestElement);
    }

    element = new TestElement();
    hass = {
      language: "en",
      localize: (key: string) => key,
      connection: { subscribeMessage },
      states: {
        "light.bedroom": {
          entity_id: "light.bedroom",
          state: "on",
          attributes: { friendly_name: "Bedroom Light" },
        },
        "light.kitchen": {
          entity_id: "light.kitchen",
          state: "off",
          attributes: { friendly_name: "Kitchen Light" },
        },
      },
    } as unknown as HomeAssistant;
  });

  it("should have empty states and undefined state initially", () => {
    expect(element["states"]).to.deep.equal({});
    expect(element["state"]).to.be.undefined;
  });

  // --- single-entity convenience (entity / state) ---------------------------

  it("should subscribe via the single entity convenience", async () => {
    const clock = useFakeTimers();
    element.hass = hass;
    element["entity"] = "light.bedroom";

    element.connectedCallback();
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    expect(capturedCallback).to.not.be.null;
    expect(capturedMessage!.entity_ids).to.have.members(["light.bedroom"]);
    clock.restore();
  });

  it("should expose state for the single entity convenience", async () => {
    const clock = useFakeTimers();
    element.hass = hass;
    element["entity"] = "light.bedroom";

    element.connectedCallback();
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    capturedCallback!({
      a: {
        "light.bedroom": {
          s: "on",
          a: { friendly_name: "Bedroom Light" },
          c: "",
          lc: 0,
          lu: 0,
        },
      },
      c: {},
    });

    // `state` is derived from the reactive `states` map.
    expect(element["state"]).to.deep.equal({
      entity_id: "light.bedroom",
      state: "on",
      attributes: { friendly_name: "Bedroom Light" },
      last_changed: "1970-01-01T00:00:00.000Z",
    });
    clock.restore();
  });

  // --- multi-entity (entities / states) -------------------------------------

  it("should subscribe to all entities in one call when connected", async () => {
    const clock = useFakeTimers();
    element.hass = hass;
    element["entities"] = ["light.bedroom", "light.kitchen"];

    element.connectedCallback();
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    // Manager consolidates both entities into a single subscribe_entities call.
    expect(capturedCallback).to.not.be.null;
    expect(capturedMessage!.entity_ids).to.have.members([
      "light.bedroom",
      "light.kitchen",
    ]);
    clock.restore();
  });

  it("should populate states for each entity on subscribe", async () => {
    const clock = useFakeTimers();
    element.hass = hass;
    element["entities"] = ["light.bedroom", "light.kitchen"];

    element.connectedCallback();
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    // subscribe_entities sends initial state via ev.a; fire it for both.
    expect(capturedCallback).to.not.be.null;
    capturedCallback!({
      a: {
        "light.bedroom": {
          s: "on",
          a: { friendly_name: "Bedroom Light" },
          c: "",
          lc: 0,
          lu: 0,
        },
        "light.kitchen": {
          s: "off",
          a: { friendly_name: "Kitchen Light" },
          c: "",
          lc: 0,
          lu: 0,
        },
      },
      c: {},
    });

    expect(element["states"]["light.bedroom"]).to.deep.equal({
      entity_id: "light.bedroom",
      state: "on",
      attributes: { friendly_name: "Bedroom Light" },
      last_changed: "1970-01-01T00:00:00.000Z",
    });
    expect(element["states"]["light.kitchen"]).to.deep.equal({
      entity_id: "light.kitchen",
      state: "off",
      attributes: { friendly_name: "Kitchen Light" },
      last_changed: "1970-01-01T00:00:00.000Z",
    });
    clock.restore();
  });

  it("should compose entity and entities, de-duping overlap", async () => {
    const clock = useFakeTimers();
    element.hass = hass;
    element["entity"] = "light.bedroom";
    element["entities"] = ["light.bedroom", "light.kitchen"];

    element.connectedCallback();
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    // bedroom appears in both but should only be requested once.
    expect(capturedMessage!.entity_ids).to.have.members([
      "light.bedroom",
      "light.kitchen",
    ]);
    expect(capturedMessage!.entity_ids).to.have.lengthOf(2);
    clock.restore();
  });

  it("should drop an entity and its state when removed from entities", async () => {
    const clock = useFakeTimers();
    element.hass = hass;
    element["entities"] = ["light.bedroom", "light.kitchen"];

    element.connectedCallback();
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    capturedCallback!({
      a: {
        "light.bedroom": { s: "on", a: {}, c: "", lc: 0, lu: 0 },
        "light.kitchen": { s: "off", a: {}, c: "", lc: 0, lu: 0 },
      },
      c: {},
    });

    // Drop kitchen and re-reconcile.
    element["entities"] = ["light.bedroom"];
    (element as unknown as { _setupEntitySubscriptions(): void })[
      "_setupEntitySubscriptions"
    ]();

    expect(element["states"]).to.have.property("light.bedroom");
    expect(element["states"]).to.not.have.property("light.kitchen");
    clock.restore();
  });

  // --- guards & teardown ----------------------------------------------------

  it("should not subscribe without any entity or entities", () => {
    element.hass = hass;

    element.connectedCallback();

    expect(capturedCallback).to.be.null;
  });

  it("should not subscribe without hass", () => {
    element["entities"] = ["light.bedroom"];

    element.connectedCallback();

    expect(capturedCallback).to.be.null;
  });

  it("should reset states on disconnect", async () => {
    const clock = useFakeTimers();
    element.hass = hass;
    element["entities"] = ["light.bedroom"];

    element.connectedCallback();
    clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
    await Promise.resolve();

    capturedCallback!({
      a: { "light.bedroom": { s: "on", a: {}, c: "", lc: 0, lu: 0 } },
      c: {},
    });
    expect(element["states"]).to.have.property("light.bedroom");

    element.disconnectedCallback();

    expect(element["states"]).to.deep.equal({});
    clock.restore();
  });
});
