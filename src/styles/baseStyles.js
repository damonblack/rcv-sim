const styles = {
  bold: {
    fontWeight: 600,
  },
  button: {
    fontWeight: 800,
    fontSize: 23,
    padding: 15,
    textTransform: 'capitalize',
  },
  buttonNarrow: {
    width: '50%',
  },
  buttonTray: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 40,
  },
  formTitle: {
    marginBottom: '0.2em',
    marginTop: '0.2em',
  },
  greyFont: {
    color: '#616161',
  },
  homeBody: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  leftSide: {
    paddingRight: 55,
    paddingTop: 45,
  },
  rightSide: {
    paddingTop: 45,
  },
  sectionText: {
    lineHeight: 1.2,
  },
  sectionTitle: {
    color: '#272361',
    fontWeight: 800,
  },
  subSectionContainer: {
    paddingBottom: 25,
  },
  subtitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 700,
    paddingTop: 10,
    fontSize: 23,
  },
  textField: {
    backgroundColor: '#fff',
    padding: 11,
  },
  thickerButton: {
    border: '4px solid',
    borderRadius: 18,
    fontWeight: 700,
    fontSize: 18,
    padding: '14px 20px',
    '&:hover': {
      border: '4px solid',
    },
  },
  title: {
    flexGrow: 1,
    color: '#272361',
    fontWeight: 800,
  },
  pageContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  '@media (min-width:780px)': {
    // eslint-disable-line no-useless-computed-key
    width: '80%',
  },
};

export default styles;
