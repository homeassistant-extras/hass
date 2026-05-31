// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mixin constructor
export type Constructor<T = object> = new (...args: any[]) => T;
