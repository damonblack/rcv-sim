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
  loser: ?CandidateId,
  previousLosers: Array<CandidateId>
};

export type Results = {
  rounds: Array<Round>,
  winner: ?CandidateId
};

export type Election = {
  key: string,
  title: string,
  owner: string
};
