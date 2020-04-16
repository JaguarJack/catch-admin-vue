export class Enum {
  constructor (data) {
    this.map = data
  }

  getOptions () {
      let options;
      for (let [item, key] in this.map) {
          option[key] = item
      }
      return options
  }
}
