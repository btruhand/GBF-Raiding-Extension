export class Optional<T> {
  val: T | null 

  private constructor(val: T | null) {
    this.val = val;
  }

  public static of<T>(val: T) {
    return new Optional(val)
  }

  public static empty<T>() {
    return new Optional<T>(null);
  }

  /**
   * Returns the specified value if wrapped value is not truthy, else the wrapped value
   * @param anotherValue value to be returned if wrapped value is not truthy
   */
  orElse<S>(anotherValue: S): T | S {
    if (this.val) return this.val
    else return anotherValue
  }

  apply<R>(f: (val: T) => R | undefined): Optional<R> {
    if (this.val) {
      const result = f(this.val);
      if (result) {
        return Optional.of(result);
      }
    }
    return Optional.empty();
  }

  applyOpt<R>(f: (optVal: T) => Optional<R>): Optional<R> {
    if (!this.isEmpty()) {
      return f(this.val!);
    }
    return Optional.empty();

  }

  get(): T {
    if (this.isEmpty()) throw new Error("not allowed to get from empty");
    return this.val!;
  }

  isEmpty(): boolean {
    return !this.val;
  }
}