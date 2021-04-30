export enum VoteValue {
  NOT_SATISFIED = 1,
  BLAH = 2,
  SATISFIED = 3,
}

export interface AbcVote {
  value: VoteValue;
}
