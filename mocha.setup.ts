import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.window = dom.window as any;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.customElements = dom.window.customElements;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).dispatchEvent = dom.window.dispatchEvent.bind(dom.window);
