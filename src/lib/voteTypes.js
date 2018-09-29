//@flow
export type CandidateId = string;

export type Vote = { [position: number]: CandidateId };

export type WeightedVote = { weight: number, vote: Vote };

export type VoteSegments = Map<CandidateId, number>;

export type Totals = { [CandidateId]: number };

export type Segments = { [CandidateId]: VoteSegments };

export type Round = {
  segments: Segments,
  totals: Totals,
  validVoteCount: number,
  winners: Array<CandidateId>,
  previousLosers: Array<CandidateId>
};

export type Results = {
  rounds: Array<Round>,
  winners: Array<CandidateId>
};

export type Election = {
  key: string,
  title: string,
  owner: string
};
