import React from 'react';
import ContentLoader from 'react-content-loader';

export default () => (
  <ContentLoader height={50} width={150} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="0" rx="0" ry="0" width="375" height="120" />
  </ContentLoader>
);
