export function createEvent(type: string, payload: any): ExtensionEvent {
  return { type, payload }
}

export interface ExtensionEvent {
  type: string,
  payload?: any
}