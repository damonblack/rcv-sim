//@flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Tooltip } from '@material-ui/core';

const Green = require('../../assets/Green.png');
const Gray = require('../../assets/Gray.png');
const Purple = require('../../assets/Purple.png');
const Yellow = require('../../assets/Yellow.png');
const Orange = require('../../assets/Orange.png');
const Blue = require('../../assets/Blue.png');

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
      height: '60px',
      marginTop: '10px',
      marginBottom: '15px',
      backgroundImage: 'url(' + eval(segment.color) + ')',
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
          <div key={i} style={getSegmentStyle(segment)} square />
        </Tooltip>
      ))}
    </div>
  );
};

export default withStyles(styles)(MultiBar);
