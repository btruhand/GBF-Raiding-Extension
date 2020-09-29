import { BattleInfo, TweetedRaid } from '@/types/custom';
import { Optional } from './utils';

class RaidBoss {

  private level: Number
  private engName: string
  private jpnName: string
  private searchWithLevel: boolean
  private engRaidName: string
  private jpnRaidName: string

  constructor(level: Number, engName: string, jpnName: string, searchWithLevel: boolean = true) {
    this.level = level;
    this.engName = engName
    this.jpnName = jpnName
    this.searchWithLevel = searchWithLevel
    this.engRaidName = `Lvl ${this.level} ${this.engName}`
    this.jpnRaidName = `Lv${this.level} ${this.jpnName}`
  }

  uniqueName(): string {
    return `${this.level}-${this.engName}-${this.jpnName}`;
  }

  englishName(): string {
    return `Lvl ${this.level} ${this.engName}`
  }

  japaneseName(): string {
    return `Lvl ${this.level} ${this.jpnName}`
  }

  get searchTerm(): string {
    if (this.searchWithLevel) return `"Lvl ${this.level} ${this.engName}" OR "Lv${this.level} ${this.jpnName}"`
    else return `${this.engName} OR ${this.jpnName}`
  }

  /**
   * Checks if given raid name is a match for this boss
   * @param raidName 
   * @return boolean
   */
  is(raidName: string): boolean {
    return raidName === this.engRaidName || raidName === this.jpnRaidName
  }
}

/**
 * Extracts {@link BattleInfo} from the given tweet
 * @param tweet
 */
export function extractRaidDetailsFromTweet(tweet: TweetedRaid): Optional<BattleInfo> {
  let battleIdRegex = /[A-F0-9]{8}/
  const match = tweet.text.match(battleIdRegex)
  if (match) {
    const battleId = match![0]
    const splittedTweet = tweet.text.split('\n')
    const raidName = splittedTweet[splittedTweet.length - 2] // expected to be raid name, hack

    const options: any = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }
    options.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatter = new Intl.DateTimeFormat('en-US', options)
    const raidTime = formatter.format(tweet.tweetDate);

    // get the words until the battleId
    const firstByWords = splittedTweet[0].split(' ');
    const battleIdIdx = firstByWords.indexOf(battleId);
    let battleMessage;
    if (battleIdIdx !== 0) {
      battleMessage = firstByWords.slice(0, firstByWords.indexOf(battleId)).join(' ');
    }
    return Optional.of({
      battleId,
      raidName,
      raidTime,
      battleMessage
    })
  }
  return Optional.empty()
}

function enRaidAnnouncement() {
  return 'I need backup!'
}

function jpnRaidAnnouncement() {
  return '参加者募集！'
}

export { RaidBoss, enRaidAnnouncement, jpnRaidAnnouncement };

