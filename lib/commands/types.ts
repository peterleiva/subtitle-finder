export interface Action {
  (...args: any[]): void | Promise<void>;
}
