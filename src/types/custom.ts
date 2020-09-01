export interface PortRef {
  port: chrome.runtime.Port | null
}

/**
 * Raid that has been tweeted, first element will be tweet ID,
 * second element the battle ID and third element will be raid name
 */
export type TweetedRaid = [string, string, string]