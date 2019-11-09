let currentTransaction: Transaction | undefined

export class Transaction {
  private _callbacks = new Set<Function>()

  public begin() {
    if (currentTransaction) return
    currentTransaction = this
  }

  public end() {
    if (currentTransaction !== this) return
    currentTransaction = undefined
    this._flush()
  }

  private _flush() {
    const callbacks = Array.from(this._callbacks)
    this._callbacks.clear()

    callbacks.forEach(callback => callback())
  }

  public _onComplete(callback: Function) {
    this._callbacks.add(callback)
  }
}

export const afterTransaction = (callback: Function) => {
  if (currentTransaction) {
    currentTransaction._onComplete(callback)
    return
  }

  callback()
}
