export function createEvent<T>(type: string, payload?: T): ExtensionEvent<T> {
  return { type, payload }
}

export interface ExtensionEvent<T> {
  type: string,
  payload?: T
}