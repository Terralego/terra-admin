import React from 'react';
import { withNamespaces } from 'react-i18next';

const SimpleNav = ({ items, t }) => (
  <ul>
    {items.map(({ label, href }) => (
      <li key={label}>
        <a href={href}>{t(label)}</a>
      </li>
    ))}
  </ul>
);

export default withNamespaces()(SimpleNav);
