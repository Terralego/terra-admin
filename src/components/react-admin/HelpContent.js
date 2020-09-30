import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
/* eslint-enable */

const HelpContent = ({ translate: t, title, content, children }) => (
  <>
    <Card>
      <CardContent>
        {title && <Typography variant="subtitle1" gutterBottom>{t(title)}</Typography>}
        <Typography color="textSecondary" paragraph>
          {/* eslint-disable-next-line react/no-danger */}
          {children || <span dangerouslySetInnerHTML={{ __html: t(content) }} />}
        </Typography>
      </CardContent>
    </Card>
  </>
);

HelpContent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  children: PropTypes.element,
};

HelpContent.defaultProps = {
  title: '',
  content: '',
  children: undefined,
};

export default translate(HelpContent);
