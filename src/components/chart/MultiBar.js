import React from 'react';
import { withStyles } from 'material-ui/styles';
import { Paper } from 'material-ui';

const styles = {
  multiBar: {
    display: 'flex',
    justifyContent: 'left'
  }
};

const MultiBar = props => {
  const { classes, segments, width } = props;

  const getSegmentStyle = segment => {
    return {
      width: `${segment[1]}%`,
      height: '50px',
      backgroundColor: segment[0]
    };
  };

  return (
    <div style={{ width }} className={classes.multiBar}>
      <Paper
        key={-1}
        elevation={0}
        style={{ width: '1px', height: '50px', backgroundColor: '#fff' }}
        square
      />
      {segments.map((segment, i) => (
        <Paper key={i} elevation={0} style={getSegmentStyle(segment)} square />
      ))}
    </div>
  );
};

export default withStyles(styles)(MultiBar);
