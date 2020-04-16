export class Enum {
  constructor (data) {
    for (const key in data) {
      this[key] = data[key]
    }
  }
}
