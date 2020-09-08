export interface PortRef {
  port: chrome.runtime.Port | null
}

/**
 * Raid that has been tweeted, first element will be tweet ID,
 * second element the battle ID and third element will be raid name
 * 
 * @member id Tweet ID
 * @member battleId Battle ID of the raid
 * @member raidName Name of the raid
 */
export type TweetedRaid = {
  id: string,
  battleId: string,
  raidName: string
}