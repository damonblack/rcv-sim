//@flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const styles = {
  multiBar: {
    display: 'flex',
    justifyContent: 'left'
  }
};

const MultiBar = props => {
  const { classes, segments, width } = props;

  const segmentWidth = segment => {
    if (width === 0) return 0;
    return segment[1] / 100 * width;
  };

  const getSegmentStyle = segment => {
    const segWidth = segmentWidth(segment);
    const style = {
      width: `${segWidth}%`,
      height: '5vh',
      backgroundColor: segment[0],
      transition: 'width 2s'
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
