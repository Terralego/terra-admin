import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

/* eslint-disable import/no-extraneous-dependencies */
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
/* eslint-enable */

import { ColorProvider, useColorSetting } from './blockStyle';
import TypographyBlock from './TypographyBlock';

/**
 * An Accordion block: its header rendered as a Typography block, its children
 * shown or folded on a click. It opens as set, again when the setting changes.
 */
export const AccordionBlock = ({ block, properties, Blocks }) => {
  const translate = useTranslate();
  const [open, setOpen] = React.useState(Boolean(block.expanded));
  const [initial, setInitial] = React.useState(block.expanded);
  const setting = useColorSetting(block);
  if (initial !== block.expanded) {
    setInitial(block.expanded);
    setOpen(Boolean(block.expanded));
  }

  return (
    <div>
      <ButtonBase
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-label={translate(open ? 'block-editor.collapse' : 'block-editor.expand')}
        sx={{ display: 'block', position: 'relative', width: '100%', textAlign: 'inherit', borderRadius: 1 }}
      >
        <TypographyBlock block={block} properties={properties} sx={{ pr: 4 }} />
        <Box
          component="span"
          sx={{
            position: 'absolute',
            right: 4,
            top: '50%',
            display: 'flex',
            transition: 'transform 150ms',
            transform: `translateY(-50%)${open ? ' rotate(180deg)' : ''}`,
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </Box>
      </ButtonBase>
      <Collapse in={open}>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <ColorProvider setting={setting}>
            <Blocks blocks={block.children ?? []} properties={properties} />
          </ColorProvider>
        </Stack>
      </Collapse>
    </div>
  );
};

export default AccordionBlock;
