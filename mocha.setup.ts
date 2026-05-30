import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.window = dom.window as any;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).dispatchEvent = dom.window.dispatchEvent.bind(dom.window);
