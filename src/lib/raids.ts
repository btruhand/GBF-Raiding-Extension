import { TweetedRaid } from '@/types/custom';

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

  get searchTerm(): string {
    if (this.searchWithLevel) return `"Lvl ${this.level} ${this.engName}" OR "Lv${this.level} ${this.jpnName}"`
    else return `${this.engName} OR ${this.jpnName}`
  }
}

/**
 * Parses tweet data to get the battle ID for a raid
 * @param tweetData String tweet data
 * @example
 * <code>
 * {"data":{"id":"1293447197564915712","created_at":"2020-08-12T07:20:17.000Z","text":"F1BD53C6 :参戦ID\n参加者募集！\nLv120 グリームニル\nhttps://t.co/QtFG7Je1Zh","author_id":"1109632615202455552","attachments":{"media_keys":["3_972306581810421760"]},"entities":{"urls":[{"start":35,"end":58,"url":"https://t.co/QtFG7Je1Zh"}]},"format":"default"},"matching_rules":[{"id":"1293427133616807936"}]}
 * </code>
 * @param returns an array of battle ID and the raid name or null if tweet data cannot be
 * parsed as expected
 */
function parseTweet(tweetData: string): TweetedRaid | null {
  if (tweetData.length < 10) {
    // unlikely to be an actual tweet data point
    console.log('empty tweet data');
    return null;
  }
  console.log('tweet', tweetData)
  var tweetJson;
  try {
    tweetJson = JSON.parse(tweetData)
  } catch (e) {
    console.error(`an error occurred when parsing tweet: ${tweetData}`, e);
    return null;
  }

  if (tweetJson && tweetJson.data) {
    const tweetText: string = tweetJson.data.text
    if (!tweetText) return null;
    let battleIdRegex = /[A-F0-9]{8}/
    const match = tweetText.match(battleIdRegex)
    if (match) {
      const battleId = match[0]
      const splittedTweet = tweetText.split('\n')
      const raidName = splittedTweet[splittedTweet.length - 2] // expected to be raid name, hack
      return [tweetJson.data.id, battleId, raidName]
    }
  }
  return null
}

export { RaidBoss, parseTweet } 