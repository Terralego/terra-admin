import React from 'react';

const RAGroup = ({ children, ...props }) =>
  React.Children.map(children, child => React.cloneElement(child, props));

export default RAGroup;
