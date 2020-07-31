class RaidBoss {

  private level: Number
  private engName: string
  private jpnName: string
  private searchWithLevel: boolean

  constructor(level: Number, engName: string, jpnName: string, searchWithLevel: boolean = true) {
    this.level = level;
    this.engName = engName
    this.jpnName = jpnName
    this.searchWithLevel = searchWithLevel
  }

  uniqueName() {
    return `${this.level}-${this.engName}-${this.jpnName}`;
  }

  englishName() {
    return `Lvl ${this.level} ${this.engName}`
  }

  japaneseName() {
    return `Lvl ${this.level} ${this.jpnName}`
  }

  get englishSearchTerm(): string {
    if (this.searchWithLevel) return `Lvl ${this.level} ${this.engName}`
    else return this.engName
  }

  get japaneseSearchTerm(): string {
    if (this.searchWithLevel) return `Lvl ${this.level} ${this.jpnName}`
    else return this.jpnName
  }
}

export { RaidBoss } 