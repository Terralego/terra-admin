import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslate } from 'ra-core';
import WidgetGraphPreview from './WidgetGraphPreview';

function WidgetGraphPreviewAccordion ({ source }) {
  const translate = useTranslate();

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{translate('datalayer.form.embed.preview')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <WidgetGraphPreview source={source} />
      </AccordionDetails>
    </Accordion>
  );
}

export default WidgetGraphPreviewAccordion;
