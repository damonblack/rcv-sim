//@flow
import React from 'react';
import { withStyles } from '@material-ui/core/index';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Paper
} from '@material-ui/core';
import {
  Done as CheckIcon,
  PanoramaWideAngle as EmptyIcon
} from '@material-ui/icons';

const styles = {
  voting: {
    width: '100vw'
  },
  cell: { padding: '0', textAlign: 'left' },
  nameCell: { paddingLeft: '1vw' },
  headerCell: { paddingLeft: '1.37vw', textAlign: 'left' },
  actionRow: { display: 'flex', justifyContent: 'center', margin: '2em' }
};

type Props = {
  candidates: Array<{ id: string, name: string }>,
  votes: Object,
  updateVote: (candidateId: string, position: number) => void,
  submitVote: () => void,
  classes: Object
};

const LegacyBallot = (props: Props) => {
  const { classes, candidates, votes, updateVote, submitVote } = props;

  return (
    <div className={classes.voting}>
      <div className={classes.actionRow}>
        <Button variant="raised" color="secondary" onClick={submitVote}>
          Submit Vote
        </Button>
      </div>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key={0} className={classes.nameCell} />
              {candidates.map((candidate, i) => (
                <TableCell key={i + 1} className={classes.headerCell}>
                  {i + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate, i) => (
              <TableRow key={i}>
                <TableCell key={0} className={classes.nameCell}>
                  {candidate.name}
                </TableCell>
                {candidates.map((c, i) => (
                  <TableCell className={classes.cell} key={i + 1}>
                    <IconButton onClick={e => updateVote(candidate.id, i + 1)}>
                      {votes[i + 1] === candidate.id ? (
                        <CheckIcon />
                      ) : (
                        <EmptyIcon />
                      )}
                    </IconButton>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default withStyles(styles)(LegacyBallot);
