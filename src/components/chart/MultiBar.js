//@flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Tooltip } from '@material-ui/core';

const styles = {
  multiBar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'left'
  }
};

const MultiBar = props => {
  const { classes, segments } = props;

  const getSegmentStyle = segment => {
    const style = {
      width: `${segment.percent}%`,
      height: '5vh',
      marginTop: '3vh',
      marginBottom: '2vh',
      backgroundColor: segment.color,
      transition: 'width 3s ease-in-out'
    };
    return style;
  };

  return (
    <div className={classes.multiBar}>
      {segments.map((segment, i) => (
        <Tooltip
          title={`${+segment.votes.toFixed(2)} votes`}
          placement="top-end"
        >
          <Paper
            key={i}
            elevation={0}
            style={getSegmentStyle(segment)}
            square
          />
        </Tooltip>
      ))}
    </div>
  );
};

export default withStyles(styles)(MultiBar);
