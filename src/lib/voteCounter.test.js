import { getResults } from './voteCounter';

const earlyWin = [
  { 1: 'D', 2: 'B', 3: 'C', 4: 'A', 5: 'E' },
  { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'E' },
  { 1: 'D', 2: 'E', 3: 'C', 4: 'A', 5: 'B' },
  { 1: 'C', 2: 'B', 3: 'A', 4: 'D', 5: 'E' },
  { 1: 'E', 2: 'B', 3: 'C', 4: 'D', 5: 'A' },
  { 1: 'A', 2: 'D', 3: 'C', 4: 'B', 5: 'E' },
  { 1: 'D', 2: 'A', 3: 'C', 4: 'E', 5: 'B' }
];

const balanced = [
  { 1: 'B', 2: 'D', 3: 'C', 4: 'A', 5: 'E' },
  { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'E' },
  { 1: 'E', 2: 'A', 3: 'C', 4: 'D', 5: 'B' },
  { 1: 'C', 2: 'B', 3: 'A', 4: 'D', 5: 'E' },
  { 1: 'E', 2: 'B', 3: 'C', 4: 'D', 5: 'A' },
  { 1: 'A', 2: 'D', 3: 'C', 4: 'B', 5: 'E' },
  { 1: 'D', 2: 'A', 3: 'C', 4: 'E', 5: 'B' }
];

const candidates = ['A', 'B', 'C', 'D', 'E'];

it('should run only round 0 and return results', () => {
  const results = getResults(earlyWin, candidates);

  expect(results.length).toEqual(1);
  expect(results[0].winner).toEqual('D');
  expect(results).toMatchSnapshot('early win');
});

it('should run multiple rounds with the winner on the last only', () => {
  const results = getResults(balanced, candidates);
  const firstRound = results[0];
  const secondRound = results[1];
  const lastRound = results[results.length - 1];

  expect(results.length).toEqual(3);
  expect(firstRound.winner).toBeUndefined();
  expect(secondRound.winner).toBeUndefined();
  expect(lastRound.winner).toEqual('D');
  expect(results).toMatchSnapshot('balanced win');
});

it('should provide full segment lists for each candidate', () => {
  const results = getResults(balanced, candidates);
  const firstRound = results[0];
  const secondRound = results[1];
  const lastRound = results[results.length - 1];

  expect(results.length).toEqual(3);
  expect(firstRound.winner).toBeUndefined();
  expect(secondRound.winner).toBeUndefined();
  expect(lastRound.winner).toEqual('D');
  expect(results).toMatchSnapshot('balanced win');
});
