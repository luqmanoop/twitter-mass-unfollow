export type Message = {
  type: string;
  payload?: any;
};

export type RunOptions = {
  shouldUnFollowNotFollowingOnly?: boolean;
  isDemo?: boolean;
};

export enum MessageType {
  DEMO = 'DEMO',
  UNFOLLOW_ALL = 'UNFOLLOW_ALL',
  UNFOLLOW_NOT_FOLLOWING = 'UNFOLLOW_NOT_FOLLOWING',
  STOP = 'STOP',
  CHECK_IN_PROGRESS = 'CHECK_IN_PROGRESS',
}
