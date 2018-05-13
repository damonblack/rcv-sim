//@flow
export type CandidateId = string;

export type Vote = {
  [position: number]: CandidateId
};

export type VoteSegments = Map<CandidateId, number>;

export type Round = {
  [CandidateId]: VoteSegments,
  validVoteCount: number,
  winner: ?CandidateId,
  loser: ?CandidateId
};

export type Election = Array<Round>;
