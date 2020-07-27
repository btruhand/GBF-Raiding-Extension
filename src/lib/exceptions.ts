class MissingCredentials extends Error {
  constructor(message: string) {
    super(message)
  }
}

class NoResponse extends Error {
  constructor(message: string) {
    super(message)
  }
}

export { MissingCredentials, NoResponse }