//@flow
export type CandidateId = string;

export type Vote = { [position: number]: CandidateId };

export type VoteSegments = Map<CandidateId, number>;

export type Totals = { [CandidateId]: number };

export type Segments = { [CandidateId]: VoteSegments };

export type Round = {
  segments: Segments,
  totals: Totals,
  validVoteCount: number,
  winner: ?CandidateId,
  loser: ?CandidateId
};

export type Results = Array<Round>;
