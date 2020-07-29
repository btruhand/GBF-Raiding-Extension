class RaidBoss {

  level: Number
  engName: string
  jpnName: string

  constructor(level: Number, engName: string, jpnName: string) {
    this.level = level;
    this.engName = engName
    this.jpnName = jpnName
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
}

export { RaidBoss } 