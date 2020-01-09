import React from 'react';
import ContentLoader from 'react-content-loader';

export default () => (
  <ContentLoader height={180} width={375} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="0" rx="0" ry="0" width="375" height="180" />
  </ContentLoader>
);
