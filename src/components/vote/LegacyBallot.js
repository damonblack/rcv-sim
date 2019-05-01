// @flow
import React from 'react';
import {withStyles} from '@material-ui/core/index';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Typography,
} from '@material-ui/core';
import {
  Done as CheckIcon,
  PanoramaWideAngle as EmptyIcon,
} from '@material-ui/icons';

const styles = {
  voting: {
    width: '100vw',
  },
  cell: {
    padding: '0',
    textAlign: 'center',
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    borderBottom: 'none',
  },
  nameCell: {
    paddingLeft: '1vw',
    textAlign: 'right',
    borderBottom: 'none',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'center',
    margin: '2em',
  },
  headerCell: {
    textAlign: 'center',
    borderLeft: '1px solid rgba(224, 224, 224, 1)',
    padding: '4px 30px',
    borderBottom: '1px solid #000',
  },
  introCell: {
    borderBottom: '1px solid #000',
  },
  button: {
    fontWeight: 800,
    fontSize: 23,
    padding: 15,
    textTransform: 'capitalize',
  },
  buttonNarrow: {
    width: '25%',
  },
};

type Props = {
  candidates: Array<{id: string, name: string}>,
  votes: Object,
  updateVote: (candidateId: string, position: number) => void,
  submitVote: () => void,
  classes: Object,
};

const LegacyBallot = (props: Props) => {
  const {classes, candidates, votes, updateVote, submitVote, preview} = props;
  return (
    <div className={classes.voting}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.introCell} key="introCell">
              <Typography variant="h6">
                Rank candidates in order of choice
              </Typography>
              <Typography variant="p">
                No more than one oval per candidate
              </Typography>
              <Typography variant="p">
                No more than one oval per column
              </Typography>
            </TableCell>
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
                  <IconButton
                    disabled={preview}
                    onClick={(e) => updateVote(candidate.id, i + 1)}
                  >
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
      <div className={classes.actionRow}>
        <Button
          variant="raised"
          color="secondary"
          style={preview ? {display: 'none'} : null}
          onClick={submitVote}
          className={[classes.button, classes.buttonNarrow]}
          fullWidth
          disabled={!Object.keys(votes).length}
        >
          Vote Now
        </Button>
      </div>
    </div>
  );
};

export default withStyles(styles)(LegacyBallot);
