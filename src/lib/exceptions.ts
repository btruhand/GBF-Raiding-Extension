class MissingCredentials extends Error {
  constructor(message: string) {
    super(message)
  }
}

export { MissingCredentials }