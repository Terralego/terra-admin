import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';

import ColorPicker from '../ColorPicker';

const useStyles = makeStyles({
  configLine: {
    display: 'flex',
    alignItems: 'center',
    padding: '1em 0',
    borderBottom: '1px solid #ccc',
    width: '50%',
    '& > .grow': {
      flex: 1,
    },
  },
});

const StyleEditor = ({ styleConfig, setStyleConfig }) => {
  const classes = useStyles();

  const handlePropChange = React.useCallback(
    property => newValue => {
      setStyleConfig(prevValue => ({ ...prevValue, [property]: newValue }));
    },
    [setStyleConfig],
  );

  const handleStyleChange = React.useCallback(
    newValue => {
      setStyleConfig(prevValue => ({ ...prevValue, style: { ...prevValue.style, ...newValue } }));
    },
    [setStyleConfig],
  );

  const handleBackgroundColorChange = React.useCallback(
    newColor => {
      handlePropChange('fill_color')(newColor);
    },
    [handlePropChange],
  );

  const handleBorderColorChange = React.useCallback(
    newColor => {
      handleStyleChange({ stroke_color: newColor });
    },
    [handleStyleChange],
  );

  const handleBackgroundChange = React.useCallback(
    e => {
      handlePropChange('background_enabled')(e.target.checked);
    },
    [handlePropChange],
  );

  const handleBorderChange = React.useCallback(
    e => {
      handlePropChange('border_enabled')(e.target.checked);
    },
    [handlePropChange],
  );

  return (
    <>
      <div className={classes.configLine}>
        <FormLabel style={{ width: '9em' }}>Background</FormLabel>
        <div className="grow">
          <ColorPicker
            disabled={!styleConfig.background_enabled}
            value={styleConfig.fill_color}
            onChange={handleBackgroundColorChange}
          />
        </div>
        <div style={{ float: 'right' }}>
          <Switch
            checked={Boolean(styleConfig.background_enabled)}
            onChange={handleBackgroundChange}
          />
        </div>
      </div>
      <div className={classes.configLine}>
        <FormLabel style={{ width: '9em' }}>Border</FormLabel>
        <div className="grow">
          <ColorPicker
            disabled={!styleConfig.border_enabled}
            value={styleConfig.style.stroke_color}
            onChange={handleBorderColorChange}
          />
        </div>
        <div style={{ float: 'right' }}>
          <Switch
            checked={Boolean(styleConfig.border_enabled)}
            onChange={handleBorderChange}
          />
        </div>
      </div>
    </>
  );
};

export default StyleEditor;
