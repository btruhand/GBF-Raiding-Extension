export class Optional<T> {
  val: T

  private constructor(val: T) {
    this.val = val;
  }

  public static of<T>(val: T) {
    return new Optional(val)
  }

  /**
   * Returns the specified value if wrapped value is not truthy, else the wrapped value
   * @param anotherValue value to be returned if wrapped value is not truthy
   */
  orElse<S>(anotherValue: S): T | S {
    if (this.val) return this.val
    else return anotherValue
  }

  apply<R>(f: (val: T) => R | undefined): R | undefined {
    if (this.val) {
      return f(this.val)
    }
    return;
  }
}