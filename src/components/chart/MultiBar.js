//@flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

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
      width: `${segment[1]}%`,
      height: '5vh',
      backgroundColor: segment[0],
      transition: 'width 3s ease-in-out'
    };
    return style;
  };

  return (
    <div className={classes.multiBar}>
      <Paper
        key={-1}
        elevation={0}
        style={{ width: '1px', height: '5vh', backgroundColor: '#fff' }}
        square
      />
      {segments.map((segment, i) => (
        <Paper key={i} elevation={0} style={getSegmentStyle(segment)} square />
      ))}
    </div>
  );
};

export default withStyles(styles)(MultiBar);
