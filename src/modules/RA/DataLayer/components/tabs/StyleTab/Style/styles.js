const styles = {
  configLine: {
    '& header': {
      borderRadius: '0.5em',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1em',
      backgroundColor: '#eee',
      marginLeft: '-1em',
      '& > label': {
        flex: 1,
      },
    },
    borderRadius: '0.5em',
    marginBottom: '1em',
    paddingLeft: '1em',
    borderLeft: '1px solid #EEE',
    backgroundColor: '#CCCCCC22',
  },
  categoryLine: {
    padding: '0.5em 0',
    display: 'flex',
    zIndex: 3,
    alignItems: 'center',
    '& > div:first-child': {
      marginRight: '1em',
    },
  },
  styleField: {
    position: 'relative',
    padding: '1em 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& .generate-legend': {
      position: 'absolute',
      top: '2em',
      right: 0,
    },
  },
  styleEditor: {
    '& h1': {
      borderBottom: '1px solid #ccc',
      width: '80%',
    },
  },
  graduateConfig: {
    display: 'flex',
    '& .method': {
      width: '20em',
      marginRight: '3em',
    },
    '& .count': {
      flex: '1',
    },
  },
  colorList: {
    display: 'flex',
    '& > *': {
      margin: '5px',
    },
    '& .action': {
      width: '25px',
      height: '25px',
      backgroundColor: 'none',
      border: '1px dotted #ccc',
      padding: '0px',
    },
  },
  piechartLegendSwitch: {
    marginTop: '1em',
  },
  iconSelect: {
    width: '10em',
    marginRight: '2em',
  },
};

export default styles;
