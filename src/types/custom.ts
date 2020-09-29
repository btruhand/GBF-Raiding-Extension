export interface PortRef {
  port: chrome.runtime.Port | null
}

/**
 * Raid that has been tweeted
 *
 * @member battleId Battle ID of the raid
 * @member raidName Name of the raid
 * @member raidTime Time when tweet was sent
 * @member battleMessage message accompanying the tweet that user sent
 */
export type BattleInfo = {
  battleId: string,
  raidName: string
  raidTime: string,
  battleMessage?: string
}

/**
 * Tweeted raid basic information
 * 
 * @member id Tweet ID
 * @member text Full tweet text
 * @member tweetDate Date (and time) when tweet was created
 */
export type TweetedRaid = {
  id: string
  text: string,
  tweetDate: Date
}