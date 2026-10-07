import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslate } from 'ra-core';
import WidgetGraphPreview, { GRAPH_WIDTH } from './WidgetGraphPreview';

function WidgetGraphPreviewAccordion ({ source }) {
  const translate = useTranslate();

  return (
    <div>
      <Accordion TransitionProps={{ unmountOnExit: true }} style={{ minWidth: GRAPH_WIDTH }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ fontWeight: 'bold' }}>{translate('datalayer.form.embed.preview')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <WidgetGraphPreview source={source} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default WidgetGraphPreviewAccordion;
